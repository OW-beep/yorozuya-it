import Link from "next/link";
import { getSortedPostsData } from "@/lib/posts";
import { CATEGORIES } from "@/lib/categories";
import PostCard from "@/components/PostCard";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata = {
  title: "記事一覧",
};

export default function PostsPage() {
  const posts = getSortedPostsData();

  return (
    <main className="max-w-[1000px] mx-auto px-[6vw] py-16">
      <Breadcrumbs items={[{ label: "よろずやIT", href: "/" }, { label: "記事一覧" }]} />

      <h1 className="font-serif text-3xl font-bold mb-6">記事一覧</h1>

      <div className="flex flex-wrap gap-2 mb-10">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.slug}
            href={`/category/${cat.slug}`}
            className="text-xs font-mono border border-ink/15 px-3 py-1.5 hover:bg-washi-warm transition-colors"
          >
            {cat.label}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
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
