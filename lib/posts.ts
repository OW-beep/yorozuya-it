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
  excerpt: string;
};

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
      excerpt: matterResult.data.excerpt as string,
    };
  });

  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
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

export async function getPostData(slug: string) {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const matterResult = matter(fileContents);

  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  return {
    slug,
    contentHtml,
    title: matterResult.data.title as string,
    category: matterResult.data.category as string,
    date: matterResult.data.date as string,
    excerpt: matterResult.data.excerpt as string,
  };
}
