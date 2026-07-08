export type Category = {
  slug: string;
  label: string;
  short: string;
  desc: string;
  image: string;
};

export const CATEGORIES: Category[] = [
  {
    slug: "pc",
    label: "PC・スマホ",
    short: "操作",
    desc: "「表示されない」「動かない」を今すぐ解決。",
    image: "/images/category-pc.svg",
  },
  {
    slug: "app",
    label: "アプリ",
    short: "アプリ",
    desc: "ExcelからZoomまで、迷わず使いこなす。",
    image: "/images/category-app.svg",
  },
  {
    slug: "glossary",
    label: "用語辞典",
    short: "用語",
    desc: "聞いたことはあるけど説明できない言葉を。",
    image: "/images/category-glossary.svg",
  },
  {
    slug: "programming",
    label: "プログラミング",
    short: "入門",
    desc: "はじめの一歩を、専門用語なしで。",
    image: "/images/category-programming.svg",
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getCategoryByLabel(label: string): Category | undefined {
  return CATEGORIES.find((c) => c.label === label);
}
