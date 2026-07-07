import Link from "next/link";
import { getSortedPostsData } from "@/lib/posts";

export const metadata = {
  title: "記事一覧 | よろずやIT",
};

export default function PostsPage() {
  const posts = getSortedPostsData();

  return (
    <main className="max-w-[900px] mx-auto px-[6vw] py-16">
      <div className="mb-10">
        <Link href="/" className="text-xs text-ink-soft font-mono">
          ← よろずやIT
        </Link>
        <h1 className="font-serif text-3xl font-bold mt-4">記事一覧</h1>
      </div>

      <div className="flex flex-col divide-y divide-ink/10 border-t border-b border-ink/10">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/posts/${post.slug}`}
            className="py-6 flex flex-col md:flex-row md:items-baseline gap-2 md:gap-6"
          >
            <span className="text-xs text-yamabuki-deep font-mono whitespace-nowrap">
              {post.category}
            </span>
            <div>
              <h2 className="font-serif text-lg mb-1">{post.title}</h2>
              <p className="text-sm text-ink-soft">{post.excerpt}</p>
            </div>
          </Link>
        ))}
        {posts.length === 0 && (
          <p className="py-10 text-sm text-ink-soft">
            まだ記事がありません。content/posts に .md ファイルを追加してください。
          </p>
        )}
      </div>
    </main>
  );
}
