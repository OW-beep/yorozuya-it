import Link from "next/link";
import { getSortedPostsData } from "@/lib/posts";
import { AI_PRACTICE_PATH, AI_PRACTICE_SLUGS, isInAiPractice } from "@/lib/series";

export default function SeriesBox({ slug }: { slug: string }) {
  if (!isInAiPractice(slug)) return null;
  const all = getSortedPostsData();
  const others = AI_PRACTICE_SLUGS.filter((s) => s !== slug)
    .map((s) => all.find((p) => p.slug === s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .slice(0, 5);

  return (
    <aside className="mt-14 rounded-xl border border-ink/15 bg-washi-warm p-5">
      <p className="text-xs font-mono text-yamabuki-deep mb-1">シリーズ</p>
      <p className="font-serif text-base font-bold mb-3">AI・プログラミング実務ガイド</p>
      <ul className="space-y-1.5 text-sm">
        {others.map((p) => (
          <li key={p.slug}>
            <Link href={`/posts/${p.slug}`} className="text-yamabuki-deep underline hover:no-underline">
              {p.title}
            </Link>
          </li>
        ))}
      </ul>
      <Link href={AI_PRACTICE_PATH} className="inline-block mt-3 text-xs text-ink-soft underline">
        シリーズの一覧を見る →
      </Link>
    </aside>
  );
}
