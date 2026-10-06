// 「AI・プログラミング実務」シリーズ。ハブページと各記事の導線で共有する。
export type SeriesGroup = {
  title: string;
  lead: string;
  slugs: string[]; // content/posts のスラッグ
};

export const AI_PRACTICE_PATH = "/ai-practice";

export const AI_PRACTICE_GROUPS: SeriesGroup[] = [
  {
    title: "AIを使い始める",
    lead: "「何を聞けばいいか分からない」から抜け出し、AIの答えを確認して使うための基本です。",
    slugs: [
      "ai-shitsumon-omoitsukanai",
      "ai-uso-minuku-houhou",
      "ai-katsuyou-jissen",
      "prompt-engineering-toha",
      "ai-gijiroku-anzen-seiri",
      "hallucination-toha",
      "generative-ai-toha",
    ],
  },
  {
    title: "安全に使うためのルール",
    lead: "入力してよい情報・いけない情報の線引きと、組織でのルールづくりです。",
    slugs: ["shadow-ai-taisaku", "shadow-ai-toha", "ai-governance-toha", "deepfake-koe-honnin-kakunin"],
  },
  {
    title: "AIの導入と業務の自動化",
    lead: "「入れればすぐ効率化する」という期待とのつきあい方と、任せる範囲の決め方です。",
    slugs: ["ai-donyu-gokai", "ai-agent-rpa-tsukaiwake-jitsumu", "agentic-ai-rpa-chigai"],
  },
  {
    title: "ExcelやコードをAIに任せる時の実務",
    lead: "動くだけで安心せず、確認してから使うための手順をまとめています。",
    slugs: [
      "excel-ai-kansu-kakaseru-kotsu",
      "excel-beginner-tsumazuki",
      "ai-code-sonomama-tsukawanai",
    ],
  },
  {
    title: "プログラミングを学ぶ・技術を選ぶ",
    lead: "独学の進め方と、流行に流されない技術選定の考え方です。",
    slugs: [
      "programming-dokugaku-ai-jidai",
      "dokugaku-hajime",
      "framework-sentaku-nagareta-kara-dame",
      "framework-library-chigai",
    ],
  },
];

export const AI_PRACTICE_SLUGS: string[] = AI_PRACTICE_GROUPS.flatMap((g) => g.slugs);

export function isInAiPractice(slug: string): boolean {
  return AI_PRACTICE_SLUGS.includes(slug);
}
