// lib/bookRanking.ts
//
// 「IT関連書籍トップ10」のデータ取得ロジック。
//
// ⚠️ 2026年、楽天ウェブサービスは仕様変更を重ねている。以前はIchibaItem
// Ranking API(ジャンル別ランキング)で実装していたが、ジャンルIDの特定が
// 難しく、レスポンス構造も不安定だったため、動作実績のある
// IchibaItem/Search API(キーワード検索)方式に切り替えた。
//
// 実際に動作確認が取れている仕様(2026-07-01版、他プロジェクトでの実績あり):
// - エンドポイント: https://openapi.rakuten.co.jp/ichibams/api/IchibaItem/Search/20260701
//   (旧 app.rakuten.co.jp/services/api/... は完全停止済み)
// - applicationIdに加えてaccessKeyが必須(クエリパラメータで送る)
// - formatVersion=2を指定しても、レスポンスのキー名は"Items"(大文字)のままで、
//   配列の各要素はフラットな商品情報オブジェクト({Item: {...}}のような
//   ネストはない)。ドキュメントより実レスポンスを信用してこの形で解析する
// - Referer/Originヘッダーは、アプリ登録時の「Allowed websites」と
//   一致させる必要がある
//
// 【環境変数(Vercelのプロジェクト設定で追加してください)】
// RAKUTEN_APP_ID       … 楽天ウェブサービスのアプリID
// RAKUTEN_ACCESS_KEY   … 楽天ウェブサービスのアクセスキー(必須)
// RAKUTEN_AFFILIATE_ID … 楽天アフィリエイトのアフィリエイトID(任意、
//                          設定するとaffiliateUrlが返るようになる)

import { SITE_URL } from "@/lib/site";

export type RankedBook = {
  title: string;
  price: string;
  imageUrl?: string;
  amazonUrl: string;
  rakutenUrl: string;
};

const ENDPOINT =
  "https://openapi.rakuten.co.jp/ichibams/api/IchibaItem/Search/20260701";

// IT関連書籍を狙うための検索キーワード。
const SEARCH_KEYWORD = "IT 書籍";

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

interface RawItem {
  itemName: string;
  itemPrice: number;
  itemUrl: string;
  affiliateUrl?: string;
  mediumImageUrls?: { imageUrl: string }[] | string[];
}

interface RakutenSearchResponse {
  Items?: RawItem[];
  error?: string;
  error_description?: string;
}

function extractImage(item: RawItem): string | undefined {
  const first = item.mediumImageUrls?.[0] as
    | { imageUrl: string }
    | string
    | undefined;
  const url = typeof first === "string" ? first : first?.imageUrl;
  return url ? url.replace(/\?.*$/, "") : undefined;
}

async function fetchFromRakuten(): Promise<RankedBook[]> {
  const applicationId = process.env.RAKUTEN_APP_ID;
  const accessKey = process.env.RAKUTEN_ACCESS_KEY;

  if (!applicationId || !accessKey) {
    console.warn(
      "[bookRanking] RAKUTEN_APP_ID または RAKUTEN_ACCESS_KEY が未設定のため、固定リストを表示します"
    );
    return getFallback();
  }

  const paramsObj: Record<string, string> = {
    format: "json",
    formatVersion: "2",
    keyword: SEARCH_KEYWORD,
    applicationId,
    accessKey,
    hits: "10",
    sort: "-reviewCount", // レビュー数の多い順=人気の目安
  };
  const affiliateId = process.env.RAKUTEN_AFFILIATE_ID;
  if (affiliateId) paramsObj.affiliateId = affiliateId;

  // URLSearchParamsはスペースを"+"にエンコードし、楽天側で0件になることがあるため
  // encodeURIComponent(%20)で明示的に組み立てる
  const query = Object.entries(paramsObj)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join("&");

  try {
    const res = await fetch(`${ENDPOINT}?${query}`, {
      headers: { Referer: SITE_URL, Origin: SITE_URL },
      next: { revalidate: 60 * 60 * 24 }, // 1日キャッシュ
    });

    const rawText = await res.text();
    let data: RakutenSearchResponse = {};
    try {
      data = JSON.parse(rawText);
    } catch {
      console.warn(
        `[bookRanking] レスポンスがJSONとして解釈できませんでした。body=${rawText.slice(0, 300)}`
      );
      return getFallback();
    }

    if (!res.ok || data.error) {
      console.warn(
        `[bookRanking] 検索が失敗しました。status=${res.status} error=${data.error} description=${data.error_description}`
      );
      return getFallback();
    }

    if (!data.Items || data.Items.length === 0) {
      console.warn(
        `[bookRanking] 検索結果が0件でした。rawBody=${rawText.slice(0, 500)}`
      );
      return getFallback();
    }

    const books: RankedBook[] = data.Items.map((item) => ({
      title: item.itemName,
      price: item.itemPrice
        ? `¥${Number(item.itemPrice).toLocaleString()}`
        : "",
      imageUrl: extractImage(item),
      amazonUrl: amazonSearchUrl(item.itemName),
      rakutenUrl: item.affiliateUrl || item.itemUrl,
    }));

    return books;
  } catch (err) {
    console.warn("[bookRanking] 検索中に例外が発生しました:", err);
    return getFallback();
  }
}

// ビルド時、234ページ分すべてがこの関数を呼ぶと、同じ内容の楽天APIリクエストが
// 同時発生する可能性がある。ただしfetchの`next.revalidate`によるキャッシュは
// Next.jsのData Cacheとして機能するため、実際の重複はある程度抑えられる。
// (unstable_cacheでの追加ラップは動作が不安定だったため取り除いた)
export const getBookRanking = fetchFromRakuten;
