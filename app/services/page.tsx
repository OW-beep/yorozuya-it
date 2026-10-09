import Link from "next/link";
import ContactForm from "@/components/ContactForm";
import { CONTACT_EMAIL, SITE_URL } from "@/lib/site";
import { SERVICES, getServiceByKey } from "@/lib/services";

export const metadata = {
  title: "ITのご相談メニュー|生成AI活用・IT棚卸し・Excel自動化・データ分析",
  description:
    "約50の企業・団体を支援してきたITコンサルタントが、生成AIの利用ルール整備、IT環境の棚卸し、Excel・業務の自動化、データ分析、小規模な開発まで、個人・法人を問わずご相談に応じます。",
  alternates: { canonical: `${SITE_URL}/services` },
};

export default function ServicesPage({
  searchParams,
}: {
  searchParams: { topic?: string };
}) {
  const selected = getServiceByKey(searchParams?.topic);

  return (
    <main className="max-w-[820px] mx-auto px-[6vw] py-16">
      <Link href="/" className="text-xs text-ink-soft font-mono">
        ← よろずやIT
      </Link>

      <header className="mt-6 mb-10">
        <p className="text-xs font-mono text-yamabuki-deep mb-2">ご相談メニュー</p>
        <h1 className="font-serif text-2xl md:text-3xl font-bold mb-4 leading-snug">
          ITの「どこから手をつければいいか」を、一緒に整理します
        </h1>
        <p className="text-sm text-ink-soft leading-loose">
          公務員として勤務した後、ITコンサルタントとして独立し、これまでおおよそ50の企業・団体の業務支援に携わってきました(守秘義務の関係上、具体的な企業名は伏せています)。データ分析・データ活用を専門分野としています。
          現場で一番多いのは、ツールの問題ではなく「確認していない前提」や「仕組みではなく感覚で使っていること」から起きるトラブルです。サイトの記事で書いてきたのと同じ視点で、状況の整理から一緒に進めます。
        </p>
        <p className="text-xs text-ink-soft mt-3">
          個人・法人は問いません。ご相談内容は、守秘義務を前提に取り扱います。
        </p>
      </header>

      <section className="space-y-5">
        {SERVICES.map((s) => (
          <article
            key={s.key}
            className={`rounded-xl border p-5 ${
              selected?.key === s.key ? "border-yamabuki bg-yamabuki/5" : "border-ink/15 bg-washi"
            }`}
          >
            <h2 className="font-serif text-lg font-bold mb-1">{s.title}</h2>
            <p className="text-sm text-ink-soft mb-3">{s.lead}</p>
            <div className="grid md:grid-cols-2 gap-4 text-xs leading-relaxed">
              <div>
                <p className="font-bold text-ink mb-1">こんな時に</p>
                <ul className="list-disc pl-4 space-y-1 text-ink-soft">
                  {s.cases.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-bold text-ink mb-1">ご相談で扱う内容</p>
                <ul className="list-disc pl-4 space-y-1 text-ink-soft">
                  {s.deliverables.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </div>
            </div>
            <Link
              href={`/services?topic=${s.key}#contact`}
              className="inline-block mt-4 text-xs text-yamabuki-deep font-bold underline hover:no-underline"
            >
              このテーマで相談する →
            </Link>
          </article>
        ))}
      </section>

      <section className="mt-14">
        <h2 className="font-serif text-lg font-bold mb-3">進め方</h2>
        <ol className="list-decimal pl-5 space-y-2 text-sm text-ink leading-relaxed">
          <li>下のフォームまたはメールで、状況をお知らせください</li>
          <li>内容を確認のうえ、メールでご連絡します</li>
          <li>状況を伺い、進め方・範囲・費用をご提案します</li>
          <li>ご納得いただけた場合に、実施します</li>
        </ol>
        <p className="text-xs text-ink-soft mt-3">
          費用はご相談内容や期間によって異なるため、個別にお見積りします。
        </p>
      </section>

      <section className="mt-12">
        <h2 className="font-serif text-lg font-bold mb-3">相談前に、この3つだけ整理しておくとスムーズです</h2>
        <p className="text-sm text-ink-soft leading-relaxed mb-3">
          トラブルの相談を受ける時、最初に確認しているのは次の3点です。書ける範囲で構いません。
        </p>
        <ul className="list-disc pl-5 space-y-1 text-sm text-ink">
          <li>いつから起きているか</li>
          <li>何をした直後か</li>
          <li>今どんな状態か(エラーメッセージがあれば、そのまま)</li>
        </ul>
      </section>

      <section className="mt-12 rounded-xl border border-ink/10 bg-washi-warm p-5">
        <h2 className="font-serif text-base font-bold mb-2">まずは無料で試せるもの</h2>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          <li>
            <Link href="/resources/ai-usage-rule" className="text-yamabuki-deep underline">
              生成AI利用ルールのひな形(Word)
            </Link>
          </li>
          <li>
            <Link href="/tools/ai-paste-check" className="text-yamabuki-deep underline">
              AIに貼る前チェック
            </Link>
          </li>
          <li>
            <Link href="/posts/shihyou-teigisho-tsukurikata" className="text-yamabuki-deep underline">
              指標の定義書テンプレート(Excel)
            </Link>
          </li>
          <li>
            <Link href="/tools/teishutsu-check" className="text-yamabuki-deep underline">
              提出前ファイル診断(Excel・Word・PowerPoint)
            </Link>
          </li>
        </ul>
      </section>

      <section id="contact" className="mt-14 scroll-mt-6">
        <h2 className="font-serif text-lg font-bold mb-2">ご相談・お問い合わせ</h2>
        <p className="text-sm text-ink-soft mb-5">
          個人情報や機密情報は、この段階では書かなくて構いません。概要だけお知らせください。
        </p>
        <ContactForm defaultType={selected?.inquiryType ?? ""} />
        <p className="mt-4 text-xs text-ink-soft">
          メールでのご連絡はこちら:
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-yamabuki-deep underline ml-1">
            {CONTACT_EMAIL}
          </a>
        </p>
      </section>
    </main>
  );
}
