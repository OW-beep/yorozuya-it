import { notFound } from "next/navigation";
import { getPostsByCategory } from "@/lib/posts";
import { CATEGORIES, getCategoryBySlug } from "@/lib/categories";
import PostCard from "@/components/PostCard";
import Breadcrumbs from "@/components/Breadcrumbs";

export async function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { category: string };
}) {
  const category = getCategoryBySlug(params.category);
  if (!category) return { title: "カテゴリーが見つかりません | よろずやIT" };
  return { title: `${category.label}の記事一覧 | よろずやIT` };
}

export default function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const category = getCategoryBySlug(params.category);
  if (!category) notFound();

  const posts = getPostsByCategory(category!.label);

  return (
    <main className="max-w-[1000px] mx-auto px-[6vw] py-16">
      <Breadcrumbs
        items={[
          { label: "よろずやIT", href: "/" },
          { label: "記事一覧", href: "/posts" },
          { label: category!.label },
        ]}
      />

      <div className="flex items-center gap-4 mb-2">
        <img src={category!.image} alt="" className="w-16 h-16 object-contain" />
        <div>
          <h1 className="font-serif text-3xl font-bold">{category!.label}</h1>
          <p className="text-sm text-ink-soft mt-1">{category!.desc}</p>
        </div>
      </div>

      <p className="text-xs text-ink-soft font-mono mb-10 mt-6">
        {posts.length}件の記事
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
        {posts.length === 0 && (
          <p className="py-10 text-sm text-ink-soft">
            このカテゴリーの記事はまだありません。
          </p>
        )}
      </div>
    </main>
  );
}
