import Link from "next/link";

export const metadata = {
  title: "ページが見つかりません",
};

export default function NotFound() {
  return (
    <main className="max-w-[600px] mx-auto px-[6vw] py-24 text-center">
      <p className="text-xs text-yamabuki-deep font-mono mb-4">404</p>
      <h1 className="font-serif text-2xl font-bold mb-4">
        お探しのページが見つかりませんでした
      </h1>
      <p className="text-sm text-ink-soft leading-loose mb-8">
        URLが変更・削除されたか、入力ミスの可能性があります。
        <br />
        以下からお探しください。
      </p>
      <div className="flex gap-3 justify-center">
        <Link
          href="/"
          className="bg-yamabuki text-indigo-deep font-bold px-6 py-3 rounded text-sm"
        >
          トップへ戻る
        </Link>
        <Link
          href="/posts"
          className="border border-ink/20 px-6 py-3 rounded text-sm text-ink-soft hover:bg-washi-warm"
        >
          記事一覧を見る
        </Link>
      </div>
    </main>
  );
}
