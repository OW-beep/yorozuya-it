import Link from "next/link";
import template from "@/lib/aiRuleTemplate.json";
import { SITE_URL } from "@/lib/site";

export const metadata = {
  title: "生成AI利用ルールのひな形【無料・Word】|入力禁止情報と運用チェックリスト",
  description:
    "社内で使える生成AI利用ルールのひな形を無料で公開。入力禁止情報の線引き、AIの回答をそのまま使えない業務、誤入力時の手順、運用開始前チェックリストまで。Word版をダウンロードして自組織向けに編集できます。",
  alternates: { canonical: `${SITE_URL}/resources/ai-usage-rule` },
};

type Table = { columns: string[]; rows: string[][] };
type Section = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
  numbered?: string[];
  table?: Table;
};

function DataTable({ table }: { table: Table }) {
  return (
    <div className="overflow-x-auto my-4">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr>
            {table.columns.map((c) => (
              <th key={c} className="border border-ink/15 bg-washi-warm px-3 py-2 text-left font-bold">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((r, i) => (
            <tr key={i}>
              {r.map((c, j) => (
                <td key={j} className="border border-ink/15 px-3 py-2 align-top leading-relaxed">
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function AiUsageRulePage() {
  const sections = template.sections as Section[];
  return (
    <main className="max-w-[760px] mx-auto px-[6vw] py-16">
      <Link href="/" className="text-xs text-ink-soft font-mono">
        ← よろずやIT
      </Link>

      <header className="mt-6 mb-8">
        <p className="text-xs font-mono text-yamabuki-deep mb-2">無料テンプレート</p>
        <h1 className="font-serif text-2xl md:text-3xl font-bold leading-snug mb-4">
          生成AI利用ルールのひな形|入力禁止情報の線引きから始める
        </h1>
        <p className="text-sm text-ink-soft leading-loose">
          生成AIのルールづくりで、現場でよく見るのは「使うな」とは書いてあるのに「何ならいいか」が決まっていない状態です。その結果、禁止されたはずのAIを、個人のアカウントで使ってしまう「シャドーAI」が生まれます。
          最初に決めるべきなのは、<strong>「入力してはいけない情報」</strong>と<strong>「AIの回答をそのまま使ってはいけない業務」</strong>の2つの線引きです。この2つを土台にしたひな形を、そのまま編集できるWord形式で無料公開します。
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <a
            href="/downloads/ai-usage-rule-template.docx"
            download
            className="bg-yamabuki text-indigo-deep font-bold px-6 py-3 rounded text-sm"
          >
            Word版をダウンロード(無料)
          </a>
          <span className="text-xs text-ink-soft">
            A4・4ページ程度。[ ]の部分を自組織向けに書き換えてお使いください
          </span>
        </div>
      </header>

      <div className="space-y-2 text-sm text-ink leading-loose">
        {template.intro.map((t) => (
          <p key={t}>{t}</p>
        ))}
      </div>

      <article className="mt-10 space-y-10">
        {sections.map((s) => (
          <section key={s.heading}>
            <h2 className="font-serif text-lg font-bold mb-3 border-l-4 border-yamabuki pl-3">{s.heading}</h2>
            {s.paragraphs?.map((p) => (
              <p key={p} className="text-sm leading-loose mb-2">
                {p}
              </p>
            ))}
            {s.bullets && (
              <ul className="list-disc pl-5 space-y-1.5 text-sm leading-relaxed">
                {s.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            )}
            {s.numbered && (
              <ol className="list-decimal pl-5 space-y-1.5 text-sm leading-relaxed">
                {s.numbered.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ol>
            )}
            {s.table && <DataTable table={s.table} />}
          </section>
        ))}

        <section>
          <h2 className="font-serif text-lg font-bold mb-3 border-l-4 border-yamabuki pl-3">
            {template.checklistTitle}
          </h2>
          <ul className="space-y-1.5 text-sm leading-relaxed">
            {template.checklist.map((c) => (
              <li key={c}>☐ {c}</li>
            ))}
          </ul>
        </section>
      </article>

      <section className="mt-12 rounded-xl border border-ink/10 bg-washi-warm p-5 text-xs text-ink-soft leading-relaxed space-y-2">
        <h2 className="font-serif text-sm font-bold text-ink">ご利用にあたって</h2>
        {template.disclaimer.map((d) => (
          <p key={d}>{d}</p>
        ))}
      </section>

      <section className="mt-12">
        <h2 className="font-serif text-lg font-bold mb-3">ルールと一緒に使えるもの</h2>
        <ul className="list-disc pl-5 space-y-1.5 text-sm">
          <li>
            <Link href="/tools/ai-paste-check" className="text-yamabuki-deep underline">
              AIに貼る前チェック
            </Link>
            :貼る前に、個人情報や社外秘の記載を機械的に検出します
          </li>
          <li>
            <Link href="/posts/shadow-ai-toha" className="text-yamabuki-deep underline">
              シャドーAIとは
            </Link>
            :なぜルールが必要になるのか
          </li>
          <li>
            <Link href="/posts/ai-governance-toha" className="text-yamabuki-deep underline">
              AIガバナンスとは
            </Link>
          </li>
          <li>
            <Link href="/posts/prompt-engineering-toha" className="text-yamabuki-deep underline">
              プロンプトエンジニアリングとは
            </Link>
          </li>
        </ul>
      </section>

      <aside className="mt-12 rounded-xl border border-yamabuki/50 bg-yamabuki/5 p-5">
        <p className="font-serif text-base font-bold mb-1">自組織の状況に合わせて整えたい方へ</p>
        <p className="text-sm text-ink-soft leading-relaxed mb-3">
          ひな形のままでは使いにくい業務や、現場に定着させる進め方について、個別にご相談に応じます。約50の企業・団体を支援してきた経験をもとに、現実的に守れるルールに整えます。
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
