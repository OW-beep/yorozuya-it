// lib/bookRanking.ts
//
// 「IT関連書籍トップ10」の元データ。
// 2026年8月時点のAmazon IT書籍売れ筋ランキング(Impress Watch調べ)を
// もとにした手動キュレーションです。
//
// ⚠️ 重要:
// Amazon商品API(PA-API)は、Amazonアソシエイトで実績(180日間に3件の紹介実績)が
// ないと利用申請ができないため、現時点では自動更新の仕組みにはなっていません。
// このファイルの中身を、月1回程度を目安に手動で更新してください。
//
// 楽天側は、楽天ブックス書籍検索APIというアプリID登録だけで使える無料APIが
// あるため、今後はそちらを使った自動化も可能です。詳しくはREADMEを参照してください。

export type BookItem = {
  title: string;
  price: string;
  amazonUrl: string;
  rakutenUrl: string;
};

// 検索リンク方式(特定の商品ページではなく、書籍名でのAmazon内検索)を採用。
// 理由:ASIN(商品ID)は改版・絶版で変わることがあり、誤った商品へのリンクを
// 避けるため。タイトルの完全一致に近い検索結果の1件目がほぼ確実に該当書籍になります。
function amazonSearchUrl(title: string): string {
  const q = encodeURIComponent(title);
  return `https://www.amazon.co.jp/s?k=${q}&tag=yorozuyait-22`;
}

// 楽天側も同様に検索リンク方式。
// ⚠️ 楽天アフィリエイトIDが未設定のため、現状は素の検索リンクです。
// 楽天アフィリエイト(https://affiliate.rakuten.co.jp/)に登録し、
// 発行されたアフィリエイトIDを RAKUTEN_AFFILIATE_ID に設定すると、
// 成果報酬の対象になります。
const RAKUTEN_AFFILIATE_ID = ""; // 例: "1234567.abcdefgh"

function rakutenSearchUrl(title: string): string {
  const q = encodeURIComponent(title);
  const base = `https://search.rakuten.co.jp/search/mall/${q}/`;
  return RAKUTEN_AFFILIATE_ID
    ? `https://hb.afl.rakuten.co.jp/hgc/${RAKUTEN_AFFILIATE_ID}/?pc=${encodeURIComponent(
        base
      )}`
    : base;
}

const RAW_TITLES: { title: string; price: string }[] = [
  { title: "17の激変:いかがわしい者たちが主役の「インターネット産業」30年史", price: "¥1,980" },
  { title: "Microsoft 365 Copilot活用大全", price: "¥2,750" },
  { title: "Claude仕事術 仕事時間は1/100に成果は200%になる", price: "¥2,090" },
  { title: "2億円を売り上げたプロが教える note×AI 最強の副業", price: "¥1,870" },
  { title: "光電融合 AI×半導体の技術革命", price: "¥3,300" },
  { title: "エンジニアのための自己管理入門", price: "¥2,948" },
  { title: "シリコンバレーによろしく", price: "¥2,090" },
  { title: "徹底攻略Biz 生成AIパスポート 教科書&問題集", price: "¥2,090" },
  { title: "外資系コンサルの仕事の進め方", price: "¥2,200" },
  { title: "Claude活用大全 AIと共に学び働き遊ぶ実践ガイド", price: "¥2,860" },
];

export const bookRanking: BookItem[] = RAW_TITLES.map(({ title, price }) => ({
  title,
  price,
  amazonUrl: amazonSearchUrl(title),
  rakutenUrl: rakutenSearchUrl(title),
}));
