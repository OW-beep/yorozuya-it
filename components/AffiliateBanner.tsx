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

// カテゴリごとの簡易アイコン(線画・currentColorでテーマカラーに追従)
const ICONS: Record<string, JSX.Element> = {
  router: (
    <>
      <rect x="3" y="10" width="18" height="7" rx="1.5" />
      <path d="M7 10V7a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v3" />
      <circle cx="8" cy="13.5" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="11" cy="13.5" r="0.8" fill="currentColor" stroke="none" />
    </>
  ),
  battery: (
    <>
      <rect x="2" y="8" width="17" height="8" rx="1.5" />
      <path d="M21 10.5v3" />
      <path d="M6 11l2 -1.2v4.4L6 13" fill="currentColor" stroke="none" />
    </>
  ),
  storage: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M7 9h10M7 13h6" />
      <circle cx="17" cy="16" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  cable: (
    <>
      <path d="M6 4v6a3 3 0 0 0 3 3h6a3 3 0 0 0 3 -3V4" />
      <path d="M12 13v7" />
      <path d="M9 4v3M15 4v3" />
    </>
  ),
  memory: (
    <>
      <rect x="4" y="6" width="16" height="9" rx="1" />
      <path d="M7 15v3M10 15v3M14 15v3M17 15v3" />
      <path d="M7 9h6" />
    </>
  ),
  cooling: (
    <>
      <circle cx="12" cy="12" r="2" />
      <path d="M12 10c0 -3 1.5 -5 4 -5s2 3 0 5" />
      <path d="M14 12c3 0 5 1.5 5 4s-3 2 -5 0" />
      <path d="M12 14c0 3 -1.5 5 -4 5s-2 -3 0 -5" />
      <path d="M10 12c-3 0 -5 -1.5 -5 -4s3 -2 5 0" />
    </>
  ),
  speaker: (
    <>
      <rect x="7" y="3" width="10" height="18" rx="2" />
      <circle cx="12" cy="8" r="1.6" />
      <circle cx="12" cy="15" r="2.6" />
    </>
  ),
  case: (
    <>
      <rect x="6" y="2" width="12" height="20" rx="2.5" />
      <path d="M10 5h4" />
      <circle cx="12" cy="18" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  headset: (
    <>
      <path d="M4 13v-1a8 8 0 0 1 16 0v1" />
      <rect x="3" y="13" width="4" height="6" rx="1.5" />
      <rect x="17" y="13" width="4" height="6" rx="1.5" />
      <path d="M20 19v1a2 2 0 0 1 -2 2h-3" />
    </>
  ),
  hub: (
    <>
      <rect x="4" y="9" width="16" height="6" rx="1.5" />
      <path d="M7 15v2M11 15v2M15 15v2" />
      <path d="M17 12h.01" />
    </>
  ),
  camera: (
    <>
      <rect x="3" y="7" width="14" height="10" rx="2" />
      <path d="M17 10l4 -2v8l-4 -2" />
      <circle cx="9" cy="12" r="2.5" />
    </>
  ),
  sdcard: (
    <>
      <path d="M8 3h9a1 1 0 0 1 1 1v16a1 1 0 0 1 -1 1H7a1 1 0 0 1 -1 -1V7z" />
      <path d="M7 3v3a1 1 0 0 0 1 1h8" />
      <path d="M9 8v3M12 8v3M15 8v3" />
    </>
  ),
  duster: (
    <>
      <path d="M9 4h6l1 5H8z" />
      <path d="M8 9h8l1.5 9a2 2 0 0 1 -2 2.3H8.5A2 2 0 0 1 6.5 18z" />
    </>
  ),
  keyboard: (
    <>
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <path d="M6 10h.01M9 10h.01M12 10h.01M15 10h.01M18 10h.01" />
      <path d="M6 14h12" />
    </>
  ),
  monitor: (
    <>
      <rect x="3" y="4" width="18" height="12" rx="1.5" />
      <path d="M8 20h8M12 16v4" />
    </>
  ),
  book: (
    <>
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <path d="M9 8h6M9 12h6" />
    </>
  ),
};

function ProductIcon({ icon }: { icon?: string }) {
  const shape = (icon && ICONS[icon]) || ICONS.book;
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-7 h-7"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {shape}
    </svg>
  );
}

export default function AffiliateBanner({ item }: { item: AffiliateItem }) {
  if (!item) return null;

  return (
    <a
      href={withTag(item.url)}
      target="_blank"
      rel="nofollow sponsored noopener"
      className="not-prose my-8 flex items-center gap-4 max-w-md border border-ink/15 bg-white rounded-xl px-4 py-4 shadow-sm hover:shadow-md hover:border-yamabuki-deep/50 transition-all group"
    >
      <div className="relative shrink-0">
        <span className="absolute -top-2 -left-2 text-[9px] leading-none text-white bg-ink/70 px-1 py-0.5 rounded-sm">
          PR
        </span>
        {item.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.image}
            alt={item.name}
            className="w-14 h-14 object-contain"
          />
        ) : (
          <div className="w-14 h-14 rounded-full bg-yamabuki-deep/10 text-yamabuki-deep flex items-center justify-center">
            <ProductIcon icon={item.icon} />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm text-ink font-bold leading-snug line-clamp-2">
          {item.name}
        </p>
        {item.note && (
          <p className="text-[11px] text-ink-soft mt-0.5 line-clamp-1">
            {item.note}
          </p>
        )}
        <span className="inline-flex items-center gap-1 text-xs text-white bg-indigo-deep group-hover:bg-yamabuki-deep transition-colors rounded-full px-3 py-1 mt-2 font-bold">
          Amazonで見る
          <span aria-hidden>→</span>
        </span>
      </div>
    </a>
  );
}
