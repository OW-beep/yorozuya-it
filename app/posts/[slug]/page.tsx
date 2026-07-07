import Link from "next/link";
import { getAllPostSlugs, getPostData } from "@/lib/posts";
import { notFound } from "next/navigation";

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

  return (
    <main className="max-w-[720px] mx-auto px-[6vw] py-16">
      <Link href="/posts" className="text-xs text-ink-soft font-mono">
        ← 記事一覧
      </Link>

      <div className="mt-6 mb-10">
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
    </main>
  );
}
