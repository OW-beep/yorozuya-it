import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";
import { getPopularPosts } from "@/lib/posts";

export default function PostFooterNav() {
  const popular = getPopularPosts(4);

  return (
    <section className="mt-16 pt-10 border-t border-ink/10">
      <div className="bg-washi-warm border border-ink/10 p-6 md:p-8">
        <h2 className="font-serif text-lg font-bold mb-4">
          困ったことを、カテゴリから探す
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-8">
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              className="block bg-washi border border-ink/10 px-3 py-3 text-center hover:bg-yamabuki/10 hover:border-yamabuki/50 transition-colors"
            >
              <span className="block text-sm font-bold text-indigo-deep">
                {c.label}
              </span>
              <span className="block text-[11px] text-ink-soft mt-1">
                {c.short}
              </span>
            </Link>
          ))}
        </div>

        {popular.length > 0 && (
          <>
            <h2 className="font-serif text-lg font-bold mb-4">
              あわせて読まれている記事
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {popular.map((p) => (
                <Link
                  key={p.slug}
                  href={`/posts/${p.slug}`}
                  className="block bg-washi border border-ink/10 px-4 py-3 hover:bg-yamabuki/10 hover:border-yamabuki/50 transition-colors"
                >
                  <span className="text-sm leading-snug">{p.title}</span>
                </Link>
              ))}
            </div>
          </>
        )}

        <div className="mt-8 text-center">
          <Link
            href="/posts"
            className="inline-block bg-indigo-deep text-washi text-sm font-bold px-6 py-3 hover:bg-indigo-deep/90 transition-colors"
          >
            記事一覧をすべて見る
          </Link>
        </div>
      </div>
    </section>
  );
}
