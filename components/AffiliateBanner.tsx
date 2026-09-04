import { AffiliateItem } from "@/lib/posts";

const ASSOCIATE_TAG = "yorozuyait-22";

// URLにアソシエイトタグが付いていなければ自動で付与する
function withTag(url: string): string {
  try {
    const u = new URL(url);
    if (!u.searchParams.has("tag")) {
      u.searchParams.set("tag", ASSOCIATE_TAG);
    }
    return u.toString();
  } catch {
    return url;
  }
}

export default function AffiliateBanner({ item }: { item: AffiliateItem }) {
  if (!item) return null;

  return (
    <div className="not-prose my-8 border border-ink/10 bg-washi-warm px-4 py-3 flex items-center gap-3 max-w-md">
      <span className="text-[10px] shrink-0 self-start mt-0.5 text-ink-soft border border-ink/20 px-1 rounded-sm">
        PR
      </span>
      {item.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.image}
          alt={item.name}
          className="w-12 h-12 object-contain shrink-0"
        />
      )}
      <div className="min-w-0 flex-1">
        <p className="text-xs text-ink leading-snug line-clamp-2">
          {item.name}
        </p>
        {item.note && (
          <p className="text-[11px] text-ink-soft mt-0.5">{item.note}</p>
        )}
        <a
          href={withTag(item.url)}
          target="_blank"
          rel="nofollow sponsored noopener"
          className="inline-block text-[11px] text-yamabuki-deep font-bold mt-1 hover:underline"
        >
          Amazonで見る →
        </a>
      </div>
    </div>
  );
}
