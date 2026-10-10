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
      "ai-kaitou-maikai-chigau",
      "hallucination-toha",
      "generative-ai-toha",
    ],
  },
  {
    title: "安全に使うためのルール",
    lead: "入力してよい情報・いけない情報の線引きと、組織でのルールづくりです。",
    slugs: ["shadow-ai-taisaku", "ai-file-screenshot-hari-mae", "shadow-ai-toha", "ai-governance-toha", "deepfake-koe-honnin-kakunin"],
  },
  {
    title: "AIの仕組みとリスク",
    lead: "AIが資料を踏まえて答える仕組み(RAG)と、AIに悪意ある指示を紛れ込ませる攻撃のしくみです。",
    slugs: ["rag-toha", "prompt-injection-toha", "context-window-toha", "token-toha"],
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
      "excel-moji-suuji-henkan",
      "excel-beginner-tsumazuki",
      "api-renkei-tsunagaranai-kakunin",
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
