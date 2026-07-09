import { getSortedPostsData } from "@/lib/posts";
import { CATEGORIES } from "@/lib/categories";
import Breadcrumbs from "@/components/Breadcrumbs";
import PostSearch from "@/components/PostSearch";
import Link from "next/link";

export const metadata = {
  title: "記事一覧",
};

export default function PostsPage() {
  const posts = getSortedPostsData();

  return (
    <main className="max-w-[1000px] mx-auto px-[6vw] py-16">
      <Breadcrumbs items={[{ label: "よろずやIT", href: "/" }, { label: "記事一覧" }]} />

      <h1 className="font-serif text-3xl font-bold mb-6">記事一覧</h1>

      <div className="flex flex-wrap gap-2 mb-8">
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

      <PostSearch posts={posts} />
    </main>
  );
}
