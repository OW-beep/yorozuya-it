import Link from "next/link";
import { getSortedPostsData, getFeaturedPosts } from "@/lib/posts";
import { CATEGORIES } from "@/lib/categories";
import PostCard from "@/components/PostCard";

export default function Home() {
  const posts = getSortedPostsData();
  const latest = posts.slice(0, 3);
  const featured = getFeaturedPosts(4);

  return (
    <main>
      {/* HERO */}
      <section className="bg-gradient-to-b from-indigo to-indigo-deep text-washi px-[6vw] pt-10 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-5 items-end">
          <div className="pb-14">
            <span className="inline-block text-xs text-yamabuki tracking-widest mb-5 border-b border-yamabuki/40 pb-1.5 font-mono">
              ANY_IT_TROUBLE / WELCOME
            </span>
            <h1 className="text-[32px] md:text-[52px] leading-[1.4] font-bold mb-5 font-serif">
              ITの困った、
              <br />
              <span className="text-yamabuki">ぜんぶここに。</span>
            </h1>
            <p className="text-base leading-loose text-washi/80 max-w-[42ch] mb-7">
              エラー、アプリの使い方、聞きなれない専門用語まで。何でも屋のように、ITのあらゆる「わからない」を取り揃えています。
            </p>
            <div className="flex gap-3 items-center">
              <Link
                href="/posts"
                className="bg-yamabuki text-indigo-deep font-bold px-6 py-3 rounded text-sm tracking-wide"
              >
                記事一覧を覗く
              </Link>
              <a href="#latest" className="text-xs text-washi/70 hover:text-washi">
                新着記事へ →
              </a>
            </div>
          </div>

          <div className="flex justify-center md:justify-end items-end h-36 md:h-[300px] gap-1 md:gap-1.5 pr-1">
            {CATEGORIES.map((cat, i) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                aria-label={`${cat.label}の記事一覧へ`}
                className={`w-[52px] md:w-[62px] h-28 md:h-60 border-l border-r flex items-center justify-center animate-sway hover:opacity-80 transition-opacity ${
                  i === 1
                    ? "bg-yamabuki/10 border-yamabuki/30"
                    : "bg-washi/[0.06] border-washi/20"
                }`}
                style={{ animationDelay: `${i * 0.3}s` }}
              >
                <span
                  className={`[writing-mode:vertical-rl] font-serif text-lg md:text-xl tracking-widest ${
                    i === 1 ? "text-yamabuki font-mono text-base md:text-lg" : "text-washi/50"
                  }`}
                >
                  {cat.short}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="px-[6vw] pt-14 pb-2 max-w-[1180px] mx-auto">
        <p className="text-sm leading-loose text-ink-soft max-w-[68ch]">
          「よろずやIT」は、パソコン・スマホの操作やエラー、アプリの使い方、聞きなれないIT用語、プログラミングの基礎を、専門用語を使わずに解説するサイトです。困ったときに、いつでも気軽に立ち寄ってください。
        </p>
      </section>

      {/* CATEGORIES */}
      <section className="px-[6vw] py-14 max-w-[1180px] mx-auto">
        <div className="flex justify-between items-baseline mb-8 border-b border-ink/10 pb-4">
          <h2 className="font-serif text-2xl font-bold">5つのジャンル</h2>
          <span className="text-xs text-ink-soft font-mono">05 CATEGORIES</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-px bg-ink/10 border border-ink/10">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="bg-washi hover:bg-washi-warm transition-colors px-5 py-7"
            >
              <span className="text-xs text-yamabuki-deep mb-3.5 block font-mono">
                {cat.label}
              </span>
              <h3 className="font-serif text-lg mb-2 leading-snug">
                {cat.desc}
              </h3>
              <span className="text-xs text-yamabuki-deep">一覧を見る →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* LATEST POSTS */}
      {latest.length > 0 && (
        <section id="latest" className="bg-washi-warm px-[6vw] py-14 scroll-mt-6">
          <div className="max-w-[1180px] mx-auto">
            <div className="flex justify-between items-baseline mb-6">
              <h2 className="font-serif text-2xl font-bold">新着記事</h2>
              <Link href="/posts" className="text-xs text-ink-soft font-mono hover:text-ink">
                すべて見る →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {latest.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FEATURED POSTS */}
      {featured.length > 0 && (
        <section className="px-[6vw] py-14 max-w-[1180px] mx-auto">
          <div className="flex justify-between items-baseline mb-6">
            <h2 className="font-serif text-2xl font-bold">おすすめ記事</h2>
            <span className="text-xs text-ink-soft font-mono">EDITOR&apos;S PICK</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featured.map((post) => (
              <PostCard key={post.slug} post={post} variant="featured" />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
