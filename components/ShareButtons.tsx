import { SITE_URL, SITE_NAME } from "@/lib/site";

export default function ShareButtons({
  slug,
  title,
}: {
  slug: string;
  title: string;
}) {
  const url = `${SITE_URL}/posts/${slug}`;
  const text = `${title} | ${SITE_NAME}`;

  const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    text
  )}&url=${encodeURIComponent(url)}`;
  const lineUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(
    url
  )}`;
  const hatenaUrl = `https://b.hatena.ne.jp/entry/panel/?url=${encodeURIComponent(
    url
  )}`;

  return (
    <div className="flex items-center gap-3 mt-8">
      <span className="text-xs text-ink-soft font-mono">SHARE</span>
      <a
        href={xUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Xでシェア"
        className="text-xs border border-ink/15 px-3 py-1.5 hover:bg-washi-warm transition-colors"
      >
        X
      </a>
      <a
        href={lineUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="LINEでシェア"
        className="text-xs border border-ink/15 px-3 py-1.5 hover:bg-washi-warm transition-colors"
      >
        LINE
      </a>
      <a
        href={hatenaUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="はてなブックマークに追加"
        className="text-xs border border-ink/15 px-3 py-1.5 hover:bg-washi-warm transition-colors"
      >
        はてブ
      </a>
    </div>
  );
}
