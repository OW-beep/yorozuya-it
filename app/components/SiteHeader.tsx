import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";

export default function SiteHeader() {
  return (
    <header className="bg-indigo-deep text-washi px-[6vw] py-4 flex items-center justify-between flex-wrap gap-3">
      <Link href="/" className="text-lg font-bold font-serif tracking-wide">
        よろずや<span className="text-yamabuki font-mono ml-0.5">IT</span>
      </Link>
      <nav className="flex items-center gap-5 text-xs font-mono flex-wrap">
        <Link href="/posts" className="text-washi/75 hover:text-washi">
          記事一覧
        </Link>
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.slug}
            href={`/category/${cat.slug}`}
            className="text-washi/75 hover:text-washi"
          >
            {cat.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
