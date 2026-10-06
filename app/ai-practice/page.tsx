import Link from "next/link";
import { getSortedPostsData } from "@/lib/posts";
import { AI_PRACTICE_GROUPS } from "@/lib/series";
import { SITE_URL } from "@/lib/site";

export const metadata = {
  title: "AI・プログラミング実務ガイド|非エンジニアが仕事で安全に使うために",
  description:
    "約50の企業・団体の支援で見てきた失敗談をもとに、生成AIの使い方、AIの嘘の見抜き方、ExcelやコードをAIに任せる時の確認手順、独学や技術選定の考え方をまとめた実務ガイドです。",
  alternates: { canonical: `${SITE_URL}/ai-practice` },
};

export default function AiPracticePage() {
  const all = getSortedPostsData();
  const find = (slug: string) => all.find((p) => p.slug === slug);

  return (
    <main className="max-w-[820px] mx-auto px-[6vw] py-16">
      <Link href="/" className="text-xs text-ink-soft font-mono">
        ← よろずやIT
      </Link>

      <header className="mt-6 mb-10">
        <p className="text-xs font-mono text-yamabuki-deep mb-2">シリーズ</p>
        <h1 className="font-serif text-2xl md:text-3xl font-bold leading-snug mb-4">
          AI・プログラミング実務ガイド
        </h1>
        <p className="text-sm text-ink-soft leading-loose">
          AIを「便利な魔法」ではなく、「考え始めるまでの時間を短くする道具」として使うための、実務の手引きです。公務員を経て、ITコンサルタントとして約50の企業・団体を支援する中で見てきた「よくある失敗」をもとに、
          <strong>使い方・確認のしかた・ルール・学び方</strong>を、順番にまとめています。
        </p>
        <div className="mt-5 flex flex-wrap gap-3 text-xs">
          <Link href="/tools/ai-paste-check" className="border border-yamabuki text-yamabuki-deep px-3 py-1.5 rounded font-bold">
            AIに貼る前チェック
          </Link>
          <Link href="/resources/ai-usage-rule" className="border border-yamabuki text-yamabuki-deep px-3 py-1.5 rounded font-bold">
            生成AI利用ルールのひな形(無料)
          </Link>
        </div>
      </header>

      <div className="space-y-12">
        {AI_PRACTICE_GROUPS.map((g, i) => (
          <section key={g.title}>
            <h2 className="font-serif text-lg font-bold mb-1">
              <span className="text-yamabuki-deep font-mono text-sm mr-2">{String(i + 1).padStart(2, "0")}</span>
              {g.title}
            </h2>
            <p className="text-sm text-ink-soft mb-4">{g.lead}</p>
            <ul className="space-y-3">
              {g.slugs.map((slug) => {
                const p = find(slug);
                if (!p) return null;
                return (
                  <li key={slug} className="rounded-lg border border-ink/10 bg-washi p-4">
                    <Link href={`/posts/${p.slug}`} className="font-bold text-sm text-ink hover:text-yamabuki-deep">
                      {p.title}
                    </Link>
                    <p className="text-xs text-ink-soft mt-1 leading-relaxed">{p.excerpt}</p>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>

      <aside className="mt-14 rounded-xl border border-yamabuki/50 bg-yamabuki/5 p-5">
        <p className="font-serif text-base font-bold mb-1">自組織への取り入れ方を相談したい方へ</p>
        <p className="text-sm text-ink-soft leading-relaxed mb-3">
          AIの活用範囲やルールの決め方、業務への取り入れ方について、個別にご相談に応じます。
        </p>
        <Link
          href="/services?topic=ai#contact"
          className="inline-block bg-yamabuki text-indigo-deep font-bold px-5 py-2.5 rounded text-sm"
        >
          生成AIの活用・ルール整備を相談する
        </Link>
      </aside>
    </main>
  );
}
