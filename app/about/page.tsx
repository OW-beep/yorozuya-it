import Link from "next/link";

export const metadata = {
  title: "運営者情報",
};

export default function AboutPage() {
  return (
    <main className="max-w-[720px] mx-auto px-[6vw] py-16">
      <Link href="/" className="text-xs text-ink-soft font-mono">
        ← よろずやIT
      </Link>

      <h1 className="font-serif text-3xl font-bold mt-6 mb-8">運営者情報</h1>

      <div className="space-y-8 text-sm leading-loose text-ink">
        <section>
          <h2 className="font-serif text-lg font-bold mb-2">
            サイトについて
          </h2>
          <p>
            「よろずやIT」は、パソコンやスマートフォンの操作、アプリの使い方、聞きなれないIT用語、プログラミングの基礎知識まで、日常のちょっとした「わからない」を解決することを目的に運営しているメディアです。専門用語をできるだけ使わず、初めての方にもわかりやすい説明を心がけています。
          </p>
        </section>

        <section>
          <h2 className="font-serif text-lg font-bold mb-2">運営者</h2>
          <p>
            よろずやIT運営事務局
            <br />
            個人にて運営しております。
          </p>
        </section>

        <section>
          <h2 className="font-serif text-lg font-bold mb-2">
            お問い合わせ
          </h2>
          <p>
            記事内容の誤りのご指摘、ご質問、掲載依頼等は下記メールアドレスまでご連絡ください。
          </p>
          <p className="mt-2 font-mono text-ink-soft">
            yorozuyait.info@gmail.com
          </p>
        </section>

        <section>
          <h2 className="font-serif text-lg font-bold mb-2">
            記事内容について
          </h2>
          <p>
            当サイトの記事は、正確な情報をお届けするよう努めておりますが、内容の正確性・完全性を保証するものではありません。実際の操作や設定は、必ず公式サイト・公式ドキュメントもあわせてご確認ください。
          </p>
        </section>
      </div>
    </main>
  );
}
