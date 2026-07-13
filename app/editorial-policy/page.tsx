import Link from "next/link";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata = {
  title: "編集方針",
  description: "よろずやITの記事制作・ファクトチェックの方針について。",
};

export default function EditorialPolicyPage() {
  return (
    <main className="max-w-[720px] mx-auto px-[6vw] py-16">
      <Link href="/" className="text-xs text-ink-soft font-mono">
        ← よろずやIT
      </Link>

      <h1 className="font-serif text-3xl font-bold mt-6 mb-8">編集方針</h1>

      <div className="space-y-8 text-sm leading-loose text-ink">
        <section>
          <h2 className="font-serif text-lg font-bold mb-2">
            記事の作り方について
          </h2>
          <p>
            当サイトの記事は、AIによる下書き作成を活用しながら、運営者が内容を確認・編集した上で公開しています。専門用語の解説やトラブル対処法については、可能な限り一般的に知られている情報や公式のドキュメント・ヘルプページの内容と照らし合わせながら作成しています。
          </p>
        </section>

        <section>
          <h2 className="font-serif text-lg font-bold mb-2">
            正確性について
          </h2>
          <p>
            細心の注意を払って作成していますが、ソフトウェアの仕様は頻繁に変更されるため、記事作成時点の情報が、閲覧時点では変わっている場合があります。特に操作手順に関する記事は、実際の操作の際に、必ずお使いの機種・バージョンの表示とあわせてご確認ください。
          </p>
        </section>

        <section>
          <h2 className="font-serif text-lg font-bold mb-2">
            誤りを見つけた場合
          </h2>
          <p>
            内容に誤りや古い情報を見つけた場合は、
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-yamabuki-deep underline"
            >
              お問い合わせ
            </a>
            よりご連絡いただけますと幸いです。確認の上、速やかに修正いたします。
          </p>
        </section>

        <section>
          <h2 className="font-serif text-lg font-bold mb-2">
            更新について
          </h2>
          <p>
            記事は公開後も、内容の古くなった部分を見つけ次第、随時見直しを行っています。大きく内容を更新した記事には、本文中に更新日を明記しています。
          </p>
        </section>
      </div>
    </main>
  );
}
