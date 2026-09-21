// lib/bookRanking.ts
//
// 「IT関連書籍トップ10」のデータ取得ロジック。
//
// 楽天側は「Rakuten Ichiba Item Ranking API」(無料・アプリID登録のみで利用可)を使い、
// 指定ジャンルの実際の売れ筋ランキングをその都度取得する。
//
// ⚠️ 2026年8月18日付でRakutenウェブサービスの旧バージョンAPI(20220601等)が
// 廃止され、新バージョン(20260701)への移行が必要になった。あわせてエンドポイントの
// ドメイン自体も app.rakuten.co.jp/services/api/... から
// openapi.rakuten.co.jp/ichibaranking/api/... に変更されている。
// 参考: https://webservice.rakuten.co.jp/documentation/ichiba-item-ranking
//
// Amazon側はPA-API(商品API)がAmazonアソシエイトの実績(過去30日で10件、2025年11月改定)
// がないと申請できないため、楽天APIで取得した「本のタイトル」をそのままAmazon内検索の
// キーワードとして使う方式にしている。これなら同じ10冊をどちらのショップでも
// 案内でき、Amazonアソシエイトの実績が貯まり次第、こちらもAPI(Creators API)に
// 置き換え可能。
//
// 【環境変数(Vercelのプロジェクト設定で追加してください)】
// RAKUTEN_APP_ID       … 楽天ウェブサービスのアプリID。無料・即時発行。
// RAKUTEN_AFFILIATE_ID … 楽天アフィリエイトのアフィリエイトID(XXXXXXX.XXXXXXXX形式)。
// RAKUTEN_ACCESS_KEY   … 楽天ウェブサービスのアクセスキー。新バージョンAPIのアプリ
//                          登録時にApplication IDとあわせて発行される。ランキングAPI
//                          自体は必須ではない可能性もあるが、指定されていれば送る
//                          安全な実装にしてある。
// RAKUTEN_BOOK_GENRE_ID … 書籍の「コンピュータ・IT」に相当するジャンルID。未設定時は
//                          「PC・システム開発」ジャンル(101287)を使用。環境変数で
//                          上書きも可能。

export type RankedBook = {
  title: string;
  price: string;
  imageUrl?: string;
  amazonUrl: string;
  rakutenUrl: string;
};

const RAKUTEN_APP_ID = process.env.RAKUTEN_APP_ID;
const RAKUTEN_AFFILIATE_ID = process.env.RAKUTEN_AFFILIATE_ID;
const RAKUTEN_ACCESS_KEY = process.env.RAKUTEN_ACCESS_KEY;
// 「本・雑誌・コミック > PC・システム開発」ジャンルのID。
// https://ranking.rakuten.co.jp/daily/101287/ で実際にIT関連書籍が
// 並んでいることを確認済み。
const RAKUTEN_BOOK_GENRE_ID = process.env.RAKUTEN_BOOK_GENRE_ID ?? "101287";

// 新バージョン(2026-07-01)のエンドポイント。旧版(app.rakuten.co.jp/services/api/...
// の20220601)は2026年8月18日付で廃止されている。
const RAKUTEN_RANKING_ENDPOINT =
  "https://openapi.rakuten.co.jp/ichibaranking/api/IchibaItem/Ranking/20260701";

function amazonSearchUrl(title: string): string {
  return `https://www.amazon.co.jp/s?k=${encodeURIComponent(title)}&tag=yorozuyait-22`;
}

function rakutenFallbackSearchUrl(title: string): string {
  return `https://books.rakuten.co.jp/search/nfsearch/${encodeURIComponent(
    title
  )}/`;
}

// APIが使えない場合、または取得に失敗した場合のフォールバック(2026年8月時点の
// Amazon IT書籍売れ筋ランキングを元にした手動リスト)。
const FALLBACK_TITLES = [
  "17の激変:いかがわしい者たちが主役の「インターネット産業」30年史",
  "Microsoft 365 Copilot活用大全",
  "Claude仕事術 仕事時間は1/100に成果は200%になる",
  "2億円を売り上げたプロが教える note×AI 最強の副業",
  "光電融合 AI×半導体の技術革命",
  "エンジニアのための自己管理入門",
  "シリコンバレーによろしく",
  "徹底攻略Biz 生成AIパスポート 教科書&問題集",
  "外資系コンサルの仕事の進め方",
  "Claude活用大全 AIと共に学び働き遊ぶ実践ガイド",
];

function getFallback(): RankedBook[] {
  return FALLBACK_TITLES.map((title) => ({
    title,
    price: "",
    amazonUrl: amazonSearchUrl(title),
    rakutenUrl: rakutenFallbackSearchUrl(title),
  }));
}

// レスポンス構造がバージョンによって異なる可能性があるため、複数の形に対応する。
// 旧形式: { Items: [ { Item: {...} }, ... ] }
// formatVersion=2 等での想定形式: { Items: [ {...}, ... ] }(Itemラッパーなし)
function extractItems(data: any): any[] {
  const raw = data?.Items ?? data?.items ?? [];
  if (!Array.isArray(raw)) return [];
  return raw.map((entry: any) => entry?.Item ?? entry).filter(Boolean);
}

function extractTitle(item: any): string | undefined {
  return item.itemName ?? item.name ?? item.title;
}

function extractPrice(item: any): string {
  const p = item.itemPrice ?? item.price;
  return p ? `¥${Number(p).toLocaleString()}` : "";
}

function extractImage(item: any): string | undefined {
  const fromArray =
    item.mediumImageUrls?.[0]?.imageUrl ?? item.mediumImageUrls?.[0];
  const url = fromArray ?? item.imageUrl;
  return typeof url === "string" ? url.replace(/\?.*$/, "") : undefined;
}

function extractRakutenUrl(item: any, title: string): string {
  return item.affiliateUrl ?? item.itemUrl ?? rakutenFallbackSearchUrl(title);
}

export async function getBookRanking(): Promise<RankedBook[]> {
  if (!RAKUTEN_APP_ID) {
    return getFallback();
  }

  try {
    const params = new URLSearchParams({
      format: "json",
      applicationId: RAKUTEN_APP_ID,
      genreId: RAKUTEN_BOOK_GENRE_ID,
    });
    if (RAKUTEN_AFFILIATE_ID) params.set("affiliateId", RAKUTEN_AFFILIATE_ID);
    if (RAKUTEN_ACCESS_KEY) params.set("accessKey", RAKUTEN_ACCESS_KEY);

    const res = await fetch(
      `${RAKUTEN_RANKING_ENDPOINT}?${params.toString()}`,
      { next: { revalidate: 3600 } } // 1時間キャッシュ
    );

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`Rakuten API error: ${res.status} ${body.slice(0, 200)}`);
    }

    const data = await res.json();
    const items = extractItems(data).slice(0, 10);

    if (items.length === 0) throw new Error("Rakuten API returned no items");

    const books: RankedBook[] = items
      .map((item): RankedBook | null => {
        const title = extractTitle(item);
        if (!title) return null;
        return {
          title,
          price: extractPrice(item),
          imageUrl: extractImage(item),
          amazonUrl: amazonSearchUrl(title),
          rakutenUrl: extractRakutenUrl(item, title),
        };
      })
      .filter((b): b is RankedBook => b !== null);

    if (books.length === 0) throw new Error("Rakuten API items had no parsable title");

    return books;
  } catch (err) {
    console.error("[bookRanking] falling back to static list:", err);
    return getFallback();
  }
}
