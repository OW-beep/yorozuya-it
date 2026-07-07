import Link from "next/link";

export const metadata = {
  title: "プライバシーポリシー | よろずやIT",
};

export default function PrivacyPage() {
  return (
    <main className="max-w-[720px] mx-auto px-[6vw] py-16">
      <Link href="/" className="text-xs text-ink-soft font-mono">
        ← よろずやIT
      </Link>

      <h1 className="font-serif text-3xl font-bold mt-6 mb-8">
        プライバシーポリシー
      </h1>

      <div className="space-y-8 text-sm leading-loose text-ink">
        <section>
          <h2 className="font-serif text-lg font-bold mb-2">
            広告の配信について
          </h2>
          <p>
            当サイトは、第三者配信の広告サービス「Google
            AdSense(グーグルアドセンス)」を利用しています。Google
            AdSenseなどの第三者配信事業者は、ユーザーの興味に応じた広告を表示するためにCookie(クッキー)を使用することがあります。Cookieを使用することで、当サイトや他サイトへの過去のアクセス情報に基づいて広告が配信されます。
          </p>
          <p className="mt-3">
            Googleが広告配信に使用するCookieを無効にする、またはパーソナライズ広告を制限する場合は、
            <a
              href="https://policies.google.com/technologies/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="text-yamabuki-deep underline"
            >
              Google広告に関するポリシー
            </a>
            、および
            <a
              href="https://adssettings.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-yamabuki-deep underline"
            >
              広告設定
            </a>
            のページをご確認ください。
          </p>
        </section>

        <section>
          <h2 className="font-serif text-lg font-bold mb-2">
            アクセス解析ツールについて
          </h2>
          <p>
            当サイトは、Googleが提供するアクセス解析ツール等を利用する場合があります。これらのツールはトラフィックデータの収集のためにCookieを使用しています。このデータは匿名で収集されており、個人を特定するものではありません。
          </p>
        </section>

        <section>
          <h2 className="font-serif text-lg font-bold mb-2">
            コメント・お問い合わせについて
          </h2>
          <p>
            当サイトへのお問い合わせの際に得た氏名やメールアドレス等の個人情報は、お問い合わせへの回答以外の目的では利用いたしません。
          </p>
        </section>

        <section>
          <h2 className="font-serif text-lg font-bold mb-2">
            免責事項
          </h2>
          <p>
            当サイトに掲載する情報については、できる限り正確な情報を掲載するよう努めておりますが、誤情報が入り込んだり、情報が古くなっていたりすることもございます。当サイトの情報を用いて行う一切の行為に関して、いかなる責任も負うものではありません。
          </p>
        </section>

        <section>
          <h2 className="font-serif text-lg font-bold mb-2">
            プライバシーポリシーの変更について
          </h2>
          <p>
            当サイトは、個人情報に関して適用される日本の法令を遵守するとともに、本ポリシーの内容を適宜見直しその改善に努めます。修正された最新のプライバシーポリシーは常に本ページにて開示されます。
          </p>
        </section>

        <p className="text-xs text-ink-soft pt-4">制定日:2026年7月</p>
      </div>
    </main>
  );
}
