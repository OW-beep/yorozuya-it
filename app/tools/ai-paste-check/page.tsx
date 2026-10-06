import Link from "next/link";
import AiPasteCheckTool from "@/components/AiPasteCheckTool";
import { SITE_URL } from "@/lib/site";

export const metadata = {
  title: "AIに貼る前チェック|個人情報・機密を検出して伏せ字にする無料ツール",
  description:
    "ChatGPTやClaudeなどのAIに文章を貼る前に、メールアドレス・電話番号・住所・APIキー・社外秘の記載などをブラウザ上で無料チェック。伏せ字済みの文章も作れます。入力内容は送信されません。",
  alternates: { canonical: `${SITE_URL}/tools/ai-paste-check` },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "AIに貼る前チェック",
  url: `${SITE_URL}/tools/ai-paste-check`,
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
  description:
    "AIチャットに貼り付ける前に、個人情報・機密情報らしき文字列をブラウザ内で検出し、伏せ字にできる無料ツール。",
};

export default function AiPasteCheckPage() {
  return (
    <main className="max-w-[820px] mx-auto px-[6vw] py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Link href="/" className="text-xs text-ink-soft font-mono">
        ← よろずやIT
      </Link>

      <div className="mt-6 mb-10 text-center">
        <p className="text-xs font-mono text-yamabuki-deep mb-2">無料ツール(β)</p>
        <h1 className="font-serif text-2xl md:text-3xl font-bold mb-3">
          その文章、AIにそのまま貼って大丈夫?
        </h1>
        <p className="text-sm text-ink-soft leading-relaxed">
          メール・議事録・エラーログには、気づかないうちに個人情報や社内情報が混ざっています。
          <br />
          AIに貼る前に、ブラウザ上で無料チェックできます。
        </p>
      </div>

      <AiPasteCheckTool />

      <div className="mt-16 pt-8 border-t border-ink/10 text-xs text-ink-soft leading-relaxed space-y-3">
        <h2 className="font-serif text-sm font-bold text-ink">
          検出する項目と、検出できないもの
        </h2>
        <p>
          検出するのは、APIキー・パスワードの記載・カード番号らしき数字・口座番号・12桁の数字・メールアドレス・電話番号・住所・生年月日・IPアドレス・社内URL・氏名らしき記載・「社外秘」などの機密表示です。あなたが指定した社名・案件名も検出できます。
        </p>
        <p>
          一方で、文脈でしか分からない情報(未公開の事業計画、顧客の事情、個人が特定できる出来事の描写など)は、機械的には見つけられません。最終的には、貼る前にご自身の目で読み返すことが一番の対策です。
        </p>

        <h2 className="font-serif text-sm font-bold text-ink pt-4">
          あわせて読みたい
        </h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <Link href="/posts/shadow-ai-toha" className="text-yamabuki-deep underline">
              シャドーAIとは?
            </Link>
          </li>
          <li>
            <Link href="/posts/ai-governance-toha" className="text-yamabuki-deep underline">
              AIガバナンスとは?
            </Link>
          </li>
          <li>
            <Link href="/posts/prompt-engineering-toha" className="text-yamabuki-deep underline">
              プロンプトエンジニアリングとは?
            </Link>
          </li>
          <li>
            <Link href="/tools/teishutsu-check" className="text-yamabuki-deep underline">
              提出前ファイル診断(Excel)
            </Link>
          </li>
        </ul>
      </div>
    </main>
  );
}
