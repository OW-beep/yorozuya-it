import { AffiliateItem } from "@/lib/posts";
import { searchRakutenItems } from "@/lib/rakuten";
import AffiliateBannerClient from "@/components/AffiliateBannerClient";

// 記事ごとのアフィリエイトバナー。サーバー側で楽天の実商品(画像・価格)を
// 検索し、取得できればクライアント側でAmazon/楽天を切り替えられるようにする。
// 楽天APIが未設定・失敗した場合は、従来通りAmazon(アイコン表示)のみになる。
export default async function AffiliateBanner({
  item,
}: {
  item: AffiliateItem;
}) {
  if (!item) return null;

  const keyword = item.keyword || item.name;
  const results = await searchRakutenItems(keyword, 1);
  const rakutenItem = results?.[0] ?? null;

  return <AffiliateBannerClient item={item} rakutenItem={rakutenItem} />;
}
