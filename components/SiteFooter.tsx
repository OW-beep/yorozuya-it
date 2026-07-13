import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="px-[6vw] py-9 flex flex-col md:flex-row justify-between gap-3 text-xs text-ink-soft border-t border-ink/10 bg-washi">
      <span>© 2026 よろずやIT</span>
      <div className="flex gap-5 flex-wrap">
        <Link href="/posts" className="hover:text-ink">
          記事一覧
        </Link>
        <Link href="/sitemap" className="hover:text-ink">
          サイトマップ
        </Link>
        <Link href="/about" className="hover:text-ink">
          運営者情報
        </Link>
        <Link href="/editorial-policy" className="hover:text-ink">
          編集方針
        </Link>
        <Link href="/privacy" className="hover:text-ink">
          プライバシーポリシー
        </Link>
      </div>
    </footer>
  );
}
