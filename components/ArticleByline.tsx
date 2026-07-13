import Link from "next/link";

export default function ArticleByline() {
  return (
    <div className="flex items-center gap-3 text-xs text-ink-soft border-t border-b border-ink/10 py-3 my-8">
      <span>
        執筆・監修:
        <Link href="/about" className="text-yamabuki-deep hover:underline ml-1">
          よろずやIT編集部
        </Link>
      </span>
      <span className="text-ink/20">|</span>
      <Link href="/editorial-policy" className="text-yamabuki-deep hover:underline">
        編集方針を見る
      </Link>
    </div>
  );
}
