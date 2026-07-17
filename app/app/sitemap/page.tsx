import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";
import { getPostsByCategory } from "@/lib/posts";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata = {
  title: "サイトマップ",
  description: "よろずやITのページ構成一覧です。",
};

export default function SitemapPage() {
  return (
    <main className="max-w-[800px] mx-auto px-[6vw] py-16">
      <Breadcrumbs
        items={[{ label: "よろずやIT", href: "/" }, { label: "サイトマップ" }]}
      />

      <h1 className="font-serif text-3xl font-bold mb-3">サイトマップ</h1>
      <p className="text-sm text-ink-soft mb-10">
        よろずやITのページ構成一覧です。お探しの記事が見つからない場合は、こちらからカテゴリーごとに探してみてください。
      </p>

      <section className="mb-10">
        <h2 className="font-serif text-lg font-bold mb-3 border-b border-ink/10 pb-2">
          サイトについて
        </h2>
        <ul className="text-sm space-y-2">
          <li>
            <Link href="/" className="text-yamabuki-deep hover:underline">
              トップページ
            </Link>
          </li>
          <li>
            <Link href="/posts" className="text-yamabuki-deep hover:underline">
              記事一覧
            </Link>
          </li>
          <li>
            <Link href="/about" className="text-yamabuki-deep hover:underline">
              運営者情報・お問い合わせ
            </Link>
          </li>
          <li>
            <Link href="/editorial-policy" className="text-yamabuki-deep hover:underline">
              編集方針
            </Link>
          </li>
          <li>
            <Link href="/privacy" className="text-yamabuki-deep hover:underline">
              プライバシーポリシー
            </Link>
          </li>
        </ul>
      </section>

      {CATEGORIES.map((cat) => {
        const posts = getPostsByCategory(cat.label);
        return (
          <section key={cat.slug} className="mb-10">
            <h2 className="font-serif text-lg font-bold mb-3 border-b border-ink/10 pb-2">
              <Link href={`/category/${cat.slug}`} className="hover:text-yamabuki-deep">
                {cat.label}
              </Link>
              <span className="text-xs text-ink-soft font-mono ml-2">
                ({posts.length}件)
              </span>
            </h2>
            <ul className="text-sm space-y-2 grid grid-cols-1 md:grid-cols-2 gap-x-6">
              {posts.map((post) => (
                <li key={post.slug}>
                  <Link
                    href={`/posts/${post.slug}`}
                    className="text-ink-soft hover:text-yamabuki-deep"
                  >
                    {post.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </main>
  );
}
