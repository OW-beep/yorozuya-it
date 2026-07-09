"use client";

import { useMemo, useState } from "react";
import { PostMeta } from "@/lib/posts";
import PostCard from "@/components/PostCard";

export default function PostSearch({ posts }: { posts: PostMeta[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }, [query, posts]);

  return (
    <div>
      <div className="mb-8">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="記事を検索(例:Wi-Fi、クラウド、Gitなど)"
          aria-label="記事を検索"
          className="w-full border border-ink/15 bg-washi px-4 py-3 text-sm focus:outline-none focus:border-yamabuki-deep"
        />
        <p className="text-xs text-ink-soft mt-2 font-mono">
          {query ? `${filtered.length}件ヒット` : `全${posts.length}件`}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
        {filtered.length === 0 && (
          <p className="py-10 text-sm text-ink-soft">
            該当する記事が見つかりませんでした。別のキーワードで試してみてください。
          </p>
        )}
      </div>
    </div>
  );
}
