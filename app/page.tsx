import Link from "next/link";
import { getSortedPostsData } from "@/lib/posts";

const categories = [
  {
    index: "01",
    title: "PC・スマホの\n操作とエラー",
    desc: "「表示されない」「動かない」を今すぐ解決。",
  },
  {
    index: "02",
    title: "アプリ・ソフトの\n使い方",
    desc: "ExcelからZoomまで、迷わず使いこなす。",
  },
  {
    index: "03",
    title: "IT用語辞典",
    desc: "聞いたことはあるけど説明できない言葉を。",
  },
  {
    index: "04",
    title: "プログラミング\n入門",
    desc: "はじめの一歩を、専門用語なしで。",
  },
];

export default function Home() {
  const posts = getSortedPostsData();
  const latest = posts[0];

  return (
    <main>
      {/* HERO */}
      <section className="bg-gradient-to-b from-indigo to-indigo-deep text-washi px-[6vw] pt-7 overflow-hidden">
        <div className="flex justify-between items-center mb-14">
          <div className="text-xl font-bold tracking-wide font-serif">
            よろずや<span className="text-yamabuki font-mono ml-0.5">IT</span>
          </div>
          <div className="text-xs text-washi/55 font-mono">yorozuya-it.jp</div>
        </div>

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
                お店を覗く
              </Link>
              <span className="text-xs text-washi/70">毎日新入荷 →</span>
            </div>
          </div>

          <div
            className="flex justify-center md:justify-end items-end h-36 md:h-[300px] gap-1.5 pr-1"
            aria-hidden="true"
          >
            {["操作", "IT", "用語", "入門"].map((char, i) => (
              <div
                key={char}
                className={`w-[62px] h-28 md:h-60 border-l border-r flex items-center justify-center animate-sway ${
                  i === 1
                    ? "bg-yamabuki/10 border-yamabuki/30"
                    : "bg-washi/[0.06] border-washi/20"
                }`}
                style={{ animationDelay: `${i * 0.3}s` }}
              >
                <span
                  className={`[writing-mode:vertical-rl] font-serif text-xl tracking-widest ${
                    i === 1 ? "text-yamabuki font-mono text-lg" : "text-washi/50"
                  }`}
                >
                  {char}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="px-[6vw] py-16 max-w-[1180px] mx-auto">
        <div className="flex justify-between items-baseline mb-8 border-b border-ink/10 pb-4">
          <h2 className="font-serif text-2xl font-bold">4つの暖簾</h2>
          <span className="text-xs text-ink-soft font-mono">04 STALLS</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-ink/10 border border-ink/10">
          {categories.map((cat) => (
            <div
              key={cat.index}
              className="bg-washi hover:bg-washi-warm transition-colors px-5 py-7"
            >
              <span className="text-xs text-yamabuki-deep mb-3.5 block font-mono">
                {cat.index}
              </span>
              <h3 className="font-serif text-lg mb-2 leading-snug whitespace-pre-line">
                {cat.title}
              </h3>
              <p className="text-sm text-ink-soft leading-relaxed">{cat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* LATEST POST */}
      {latest && (
        <section className="bg-washi-warm px-[6vw] py-16">
          <div className="max-w-[1180px] mx-auto">
            <div className="flex justify-between items-baseline mb-6">
              <h2 className="font-serif text-2xl font-bold">本日の入荷</h2>
              <span className="text-xs text-ink-soft font-mono">NEW ARRIVAL</span>
            </div>
            <Link
              href={`/posts/${latest.slug}`}
              className="block bg-washi border border-ink/10 p-9 grid grid-cols-1 md:grid-cols-[100px_1fr] gap-7"
            >
              <div className="text-xs text-ink-soft leading-relaxed">
                <span className="text-2xl text-yamabuki-deep block mb-1">01</span>
                {latest.category}
              </div>
              <div>
                <h3 className="font-serif text-xl mb-2.5 leading-snug">
                  {latest.title}
                </h3>
                <p className="text-sm text-ink-soft leading-loose max-w-[60ch]">
                  {latest.excerpt}
                </p>
                <div className="mt-3.5 text-xs text-yamabuki-deep">
                  3分で読める →
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      <footer className="px-[6vw] py-9 flex justify-between text-xs text-ink-soft border-t border-ink/10">
        <span>© 2026 よろずやIT</span>
        <span className="font-mono">Built with Next.js on Vercel</span>
      </footer>
    </main>
  );
}
