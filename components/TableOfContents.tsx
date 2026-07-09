import { TocItem } from "@/lib/posts";

export default function TableOfContents({ items }: { items: TocItem[] }) {
  if (items.length < 2) return null;

  return (
    <nav
      aria-label="目次"
      className="mb-10 bg-washi-warm border border-ink/10 px-6 py-5"
    >
      <p className="font-serif font-bold text-sm mb-3">目次</p>
      <ol className="space-y-1.5">
        {items.map((item, i) => (
          <li key={item.id} className="text-sm">
            <a
              href={`#${item.id}`}
              className="text-ink-soft hover:text-yamabuki-deep"
            >
              <span className="font-mono text-xs text-yamabuki-deep mr-1.5">
                {String(i + 1).padStart(2, "0")}
              </span>
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
