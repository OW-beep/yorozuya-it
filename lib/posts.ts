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

// セル内の簡単な強調(**太字**)だけ変換する
function inlineMarkdown(text: string): string {
  return text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}

function parseTableRow(line: string): string[] {
  let trimmed = line.trim();
  if (trimmed.startsWith("|")) trimmed = trimmed.slice(1);
  if (trimmed.endsWith("|")) trimmed = trimmed.slice(0, -1);
  return trimmed.split("|").map((cell) => cell.trim());
}

const TABLE_SEPARATOR = /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/;

// remark(remark-gfm未使用)では表が変換されないため、
// Markdownの表記法を、事前にプレースホルダーへ置き換えておき、
// remark処理後に実際のテーブルHTMLへ差し替える(remarkの生HTML設定に依存しない確実な方式)
function extractMarkdownTables(markdown: string): {
  markdown: string;
  tables: Map<string, string>;
} {
  const lines = markdown.split("\n");
  const output: string[] = [];
  const tables = new Map<string, string>();
  let tableIndex = 0;
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const nextLine = lines[i + 1];

    if (
      line.includes("|") &&
      nextLine !== undefined &&
      TABLE_SEPARATOR.test(nextLine)
    ) {
      const headerCells = parseTableRow(line);
      const bodyRows: string[][] = [];
      let j = i + 2;
      while (
        j < lines.length &&
        lines[j].includes("|") &&
        lines[j].trim() !== ""
      ) {
        bodyRows.push(parseTableRow(lines[j]));
        j++;
      }

      let tableHtml = '<table>\n<thead>\n<tr>\n';
      headerCells.forEach((cell) => {
        tableHtml += `<th>${inlineMarkdown(cell)}</th>\n`;
      });
      tableHtml += "</tr>\n</thead>\n<tbody>\n";
      bodyRows.forEach((row) => {
        tableHtml += "<tr>\n";
        row.forEach((cell) => {
          tableHtml += `<td>${inlineMarkdown(cell)}</td>\n`;
        });
        tableHtml += "</tr>\n";
      });
      tableHtml += "</tbody>\n</table>";

      const placeholder = `TABLEPLACEHOLDER${tableIndex}`;
      tables.set(placeholder, tableHtml);
      tableIndex += 1;

      output.push("");
      output.push(placeholder);
      output.push("");
      i = j;
    } else {
      output.push(line);
      i++;
    }
  }

  return { markdown: output.join("\n"), tables };
}

// remark-html後のHTML中のプレースホルダーを、実際のテーブルHTMLに差し替える
function restoreMarkdownTables(
  html: string,
  tables: Map<string, string>
): string {
  let result = html;
  tables.forEach((tableHtml, placeholder) => {
    result = result
      .replace(`<p>${placeholder}</p>`, tableHtml)
      .replace(placeholder, tableHtml);
  });
  return result;
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

  const { markdown: preprocessed, tables } = extractMarkdownTables(
    matterResult.content
  );

  const processedContent = await remark()
    .use(html)
    .process(preprocessed);
  const rawHtmlWithPlaceholders = processedContent.toString();
  const rawHtml = restoreMarkdownTables(rawHtmlWithPlaceholders, tables);
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
