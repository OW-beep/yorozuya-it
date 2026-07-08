import { getAllPostSlugs, getPostData, getRelatedPosts } from "@/lib/posts";
import { getCategoryByLabel } from "@/lib/categories";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import PostCard from "@/components/PostCard";

export async function generateStaticParams() {
  return getAllPostSlugs();
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  try {
    const post = await getPostData(params.slug);
    return { title: `${post.title} | よろずやIT` };
  } catch {
    return { title: "記事が見つかりません | よろずやIT" };
  }
}

export default async function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  let post;
  try {
    post = await getPostData(params.slug);
  } catch {
    notFound();
  }

  const category = getCategoryByLabel(post!.category);
  const related = getRelatedPosts(post!.category, post!.slug, 3);

  return (
    <main className="max-w-[720px] mx-auto px-[6vw] py-16">
      <Breadcrumbs
        items={[
          { label: "よろずやIT", href: "/" },
          { label: "記事一覧", href: "/posts" },
          ...(category
            ? [{ label: category.label, href: `/category/${category.slug}` }]
            : []),
          { label: post!.title },
        ]}
      />

      <div className="mb-10">
        <span className="text-xs text-yamabuki-deep font-mono">
          {post!.category}
        </span>
        <h1 className="font-serif text-3xl font-bold mt-3 leading-snug">
          {post!.title}
        </h1>
        <time className="text-xs text-ink-soft mt-3 block">{post!.date}</time>
      </div>

      <article
        className="prose max-w-none prose-headings:font-serif prose-headings:font-bold prose-p:text-ink prose-p:leading-loose prose-li:text-ink"
        dangerouslySetInnerHTML={{ __html: post!.contentHtml }}
      />

      {related.length > 0 && (
        <section className="mt-16 pt-10 border-t border-ink/10">
          <h2 className="font-serif text-xl font-bold mb-5">関連記事</h2>
          <div className="grid grid-cols-1 gap-3">
            {related.map((r) => (
              <PostCard key={r.slug} post={r} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
