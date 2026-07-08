import Link from "next/link";
import { PostMeta } from "@/lib/posts";
import { getCategoryByLabel } from "@/lib/categories";

export default function PostCard({
  post,
  variant = "default",
}: {
  post: PostMeta;
  variant?: "default" | "featured";
}) {
  const category = getCategoryByLabel(post.category);

  return (
    <Link
      href={`/posts/${post.slug}`}
      className={`block bg-washi border p-6 hover:bg-washi-warm transition-colors ${
        variant === "featured"
          ? "border-yamabuki/50 border-2"
          : "border-ink/10"
      }`}
    >
      <div className="flex items-center gap-2 mb-3">
        {variant === "featured" && (
          <span className="text-[10px] bg-yamabuki text-indigo-deep font-bold px-2 py-0.5 rounded-sm">
            おすすめ
          </span>
        )}
        {category && (
          <span className="text-xs text-yamabuki-deep font-mono">
            {category.label}
          </span>
        )}
      </div>
      <h3 className="font-serif text-lg leading-snug mb-2">{post.title}</h3>
      <p className="text-sm text-ink-soft leading-relaxed line-clamp-2">
        {post.excerpt}
      </p>
    </Link>
  );
}
