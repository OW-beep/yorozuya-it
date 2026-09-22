// lib/rakuten.ts
//
// 楽天市場商品検索API(IchibaItem/Search)の薄いラッパー。
// 記事ごとのアフィリエイトバナー、書籍カルーセルなど、サイト内の
// 楽天商品検索が必要な箇所から共通で利用する。
//
// 実績のある仕様(2026-07-01版):
// - エンドポイント: https://openapi.rakuten.co.jp/ichibams/api/IchibaItem/Search/20260701
//   (旧 app.rakuten.co.jp/services/api/... は完全停止済み)
// - applicationIdに加えてaccessKeyが必須(クエリパラメータで送る)
// - formatVersion=2でも、レスポンスのキー名は"Items"(大文字)のままで、
//   配列の各要素はフラットな商品情報オブジェクト({Item: {...}}のような
//   ネストはない)
// - Referer/Originヘッダーは、アプリ登録時の「Allowed websites」と
//   一致させる必要がある
//
// - RAKUTEN_APP_ID / RAKUTEN_ACCESS_KEYが未設定の場合は何もせずnullを返す
//   (キー未登録でもビルド・他ページが壊れないようにするため)
// - サーバー側(Server Component)専用。キーをブラウザに渡さないよう、
//   このモジュールをクライアントコンポーネントから直接importしないこと

import { SITE_URL } from "@/lib/site";

export interface RakutenItem {
  name: string;
  price: number;
  url: string; // affiliateId設定時はアフィリエイトリンク、未設定時は通常の商品URL
  imageUrl: string | null;
}

interface RakutenSearchResponse {
  Items?: RawItem[];
  error?: string;
  error_description?: string;
}

interface RawItem {
  itemName: string;
  itemPrice: number;
  itemUrl: string;
  affiliateUrl?: string;
  mediumImageUrls?: string[];
}

const ENDPOINT =
  "https://openapi.rakuten.co.jp/ichibams/api/IchibaItem/Search/20260701";

export async function searchRakutenItems(
  keyword: string,
  hits = 1,
  genreId?: string
): Promise<RakutenItem[] | null> {
  const applicationId = process.env.RAKUTEN_APP_ID;
  const accessKey = process.env.RAKUTEN_ACCESS_KEY;
  if (!applicationId || !accessKey) {
    return null;
  }

  const paramsObj: Record<string, string> = {
    format: "json",
    formatVersion: "2",
    keyword,
    applicationId,
    accessKey,
    hits: String(hits),
    sort: "standard",
  };
  if (genreId) paramsObj.genreId = genreId;
  const affiliateId = process.env.RAKUTEN_AFFILIATE_ID;
  if (affiliateId) paramsObj.affiliateId = affiliateId;

  // URLSearchParamsはスペースを"+"にエンコードし、楽天側で0件になることが
  // あるため、encodeURIComponent(%20)で明示的に組み立てる
  const query = Object.entries(paramsObj)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join("&");

  try {
    const res = await fetch(`${ENDPOINT}?${query}`, {
      headers: { Referer: SITE_URL, Origin: SITE_URL },
      // 同じキーワードの結果は1日キャッシュし、呼び出し回数を抑える
      next: { revalidate: 60 * 60 * 24 },
    });

    const rawText = await res.text();
    let data: RakutenSearchResponse = {};
    try {
      data = JSON.parse(rawText);
    } catch {
      console.warn(
        `[rakuten] 「${keyword}」のレスポンスがJSONとして解釈できませんでした。body=${rawText.slice(0, 300)}`
      );
      return null;
    }

    if (!res.ok || data.error) {
      console.warn(
        `[rakuten] 「${keyword}」の検索が失敗しました。status=${res.status} error=${data.error} description=${data.error_description}`
      );
      return null;
    }
    if (!data.Items || data.Items.length === 0) {
      return null;
    }

    return data.Items.map((item) => ({
      name: item.itemName,
      price: item.itemPrice,
      url: item.affiliateUrl || item.itemUrl,
      imageUrl: item.mediumImageUrls?.[0] ?? null,
    }));
  } catch (err) {
    console.warn(`[rakuten] 「${keyword}」の検索中に例外が発生しました:`, err);
    return null;
  }
}
