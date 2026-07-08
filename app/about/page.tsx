import Link from "next/link";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata = {
  title: "運営者情報",
  description:
    "「よろずやIT」の運営方針、記事の執筆方針、お問い合わせ先についてご案内しています。",
};

export default function AboutPage() {
  return (
    <main className="max-w-[720px] mx-auto px-[6vw] py-16">
      <Link href="/" className="text-xs text-ink-soft font-mono">
        ← よろずやIT
      </Link>

      <h1 className="font-serif text-3xl font-bold mt-6 mb-8">運営者情報</h1>

      <div className="space-y-9 text-sm leading-loose text-ink">
        <section>
          <h2 className="font-serif text-lg font-bold mb-2">
            サイトについて
          </h2>
          <p>
            「よろずやIT」は、パソコンやスマートフォンの操作、アプリの使い方、聞きなれないIT用語、プログラミングの基礎知識まで、日常のちょっとした「わからない」を解決することを目的に運営しているメディアです。専門用語をできるだけ使わず、初めてIT機器に触れる方にもわかりやすい説明を心がけています。
          </p>
        </section>

        <section>
          <h2 className="font-serif text-lg font-bold mb-2">運営者</h2>
          <p>
            よろずやIT運営事務局(個人運営)
            <br />
            日常的にパソコン・スマートフォンを扱う中で感じた「地味に困ったこと」「調べてもわかりにくかったこと」をきっかけに、同じように困っている方の助けになればと当サイトを開設しました。
          </p>
        </section>

        <section>
          <h2 className="font-serif text-lg font-bold mb-2">
            記事の執筆・監修方針
          </h2>
          <p>
            当サイトの記事は、以下の方針に沿って作成しています。
          </p>
          <ul className="list-disc pl-5 mt-3 space-y-1.5">
            <li>
              各サービス・ソフトウェアの公式サイト・公式ヘルプページの情報を確認した上で執筆しています
            </li>
            <li>
              専門用語を使う場合は、必ずその場で意味を補足し、初めて読む方でも理解できることを重視しています
            </li>
            <li>
              操作手順やソフトウェアの仕様は変更されることがあるため、内容に古い情報が含まれていないか定期的に見直しを行っています
            </li>
            <li>
              他サイトの文章をそのまま転載・複製することはせず、すべて当サイト独自の言葉で執筆しています
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-lg font-bold mb-2">
            お問い合わせ
          </h2>
          <p>
            記事内容の誤りのご指摘、ご質問、掲載依頼等は下記メールアドレスまでご連絡ください。内容を確認の上、担当者より返信いたします。
          </p>
          <p className="mt-2 font-mono text-ink-soft">{CONTACT_EMAIL}</p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="inline-block mt-4 bg-yamabuki text-indigo-deep font-bold px-6 py-3 rounded text-sm no-underline"
          >
            メールでお問い合わせ
          </a>
        </section>

        <section>
          <h2 className="font-serif text-lg font-bold mb-2">
            記事内容について
          </h2>
          <p>
            当サイトの記事は、正確な情報をお届けするよう努めておりますが、内容の正確性・完全性を保証するものではありません。実際の操作や設定を行う際は、必ず各サービスの公式サイト・公式ドキュメントもあわせてご確認ください。当サイトの情報を利用したことにより生じたいかなる損害についても、責任を負いかねますのであらかじめご了承ください。
          </p>
        </section>
      </div>
    </main>
  );
}
