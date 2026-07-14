import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const postsDirectory = path.join(process.cwd(), "content/posts");

export type PostMeta = {
  slug: string;
  title: string;
  category: string;
  date: string;
  updated?: string;
  excerpt: string;
  featured: boolean;
};

export type TocItem = {
  id: string;
  text: string;
};

export type FaqItem = {
  q: string;
  a: string;
};

function slugifyHeading(text: string, usedIds: Set<string>): string {
  const base = text
    .toLowerCase()
    .replace(/[^\w\u3040-\u30ff\u3400-\u9fff]+/g, "-")
    .replace(/^-+|-+$/g, "") || "section";
  let id = base;
  let i = 2;
  while (usedIds.has(id)) {
    id = `${base}-${i}`;
    i += 1;
  }
  usedIds.add(id);
  return id;
}

// h2見出しにIDを埋め込みつつ、目次データを作る
function injectHeadingIdsAndBuildToc(html: string): {
  html: string;
  toc: TocItem[];
} {
  const usedIds = new Set<string>();
  const toc: TocItem[] = [];

  const newHtml = html.replace(
    /<h2>(.*?)<\/h2>/g,
    (_match, inner: string) => {
      const text = inner.replace(/<[^>]+>/g, "");
      const id = slugifyHeading(text, usedIds);
      toc.push({ id, text });
      return `<h2 id="${id}">${inner}</h2>`;
    }
  );

  return { html: newHtml, toc };
}

export type HowToStep = {
  name: string;
};

// 丸数字(①②③...)で始まる見出しを「手順」として検出する
const CIRCLED_NUMBER = /^[①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮]\s*/;

function extractHowToSteps(toc: TocItem[]): HowToStep[] {
  return toc
    .filter((item) => CIRCLED_NUMBER.test(item.text))
    .map((item) => ({ name: item.text.replace(CIRCLED_NUMBER, "") }));
}

export function getSortedPostsData(): PostMeta[] {
  if (!fs.existsSync(postsDirectory)) return [];

  const fileNames = fs.readdirSync(postsDirectory).filter((f) =>
    f.endsWith(".md")
  );

  const allPostsData = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.md$/, "");
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const matterResult = matter(fileContents);

    return {
      slug,
      title: matterResult.data.title as string,
      category: matterResult.data.category as string,
      date: matterResult.data.date as string,
      updated: matterResult.data.updated as string | undefined,
      excerpt: matterResult.data.excerpt as string,
      featured: Boolean(matterResult.data.featured),
    };
  });

  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostsByCategory(categoryLabel: string): PostMeta[] {
  return getSortedPostsData().filter((p) => p.category === categoryLabel);
}

export function getFeaturedPosts(limit?: number): PostMeta[] {
  const featured = getSortedPostsData().filter((p) => p.featured);
  return limit ? featured.slice(0, limit) : featured;
}

export function getRelatedPosts(
  categoryLabel: string,
  excludeSlug: string,
  limit = 3
): PostMeta[] {
  return getSortedPostsData()
    .filter((p) => p.category === categoryLabel && p.slug !== excludeSlug)
    .slice(0, limit);
}

export function getAllPostSlugs() {
  if (!fs.existsSync(postsDirectory)) return [];
  const fileNames = fs.readdirSync(postsDirectory).filter((f) =>
    f.endsWith(".md")
  );
  return fileNames.map((fileName) => ({
    slug: fileName.replace(/\.md$/, ""),
  }));
}

export function getPostFrontmatter(
  slug: string
): { title: string; category: string } | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const matterResult = matter(fileContents);
    return {
      title: matterResult.data.title as string,
      category: matterResult.data.category as string,
    };
  } catch {
    return null;
  }
}

export async function getPostData(slug: string) {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const matterResult = matter(fileContents);

  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const rawHtml = processedContent.toString();
  const { html: contentHtml, toc } = injectHeadingIdsAndBuildToc(rawHtml);

  const faq = (matterResult.data.faq as FaqItem[] | undefined) ?? [];
  const howToSteps = extractHowToSteps(toc);

  return {
    slug,
    contentHtml,
    toc,
    faq,
    howToSteps,
    title: matterResult.data.title as string,
    category: matterResult.data.category as string,
    date: matterResult.data.date as string,
    updated: matterResult.data.updated as string | undefined,
    excerpt: matterResult.data.excerpt as string,
    featured: Boolean(matterResult.data.featured),
  };
}
