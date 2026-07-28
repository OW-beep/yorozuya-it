import Link from "next/link";
import { TAGS, type TagKey } from "@/lib/articleTags";

const articles: {
  title: string;
  href: string;
  emoji: string;
  desc: string;
  tag: TagKey;
  fresh?: boolean;
}[] = [
  {
    title: "人口ランキングTOP50",
    href: "/articles/population-top50",
    emoji: "👥",
    desc: "全国の人口が多い自治体をランキング形式で紹介。",
    tag: "population",
  },
  {
    title: "出生率ランキング分析",
    href: "/articles/birth-rate",
    emoji: "👶",
    desc: "鹿児島・沖縄の島しょ部が上位に来る理由を解説。",
    tag: "child",
  },
  {
    title: "高齢化率TOP50",
    href: "/articles/aging-top50",
    emoji: "🧓",
    desc: "高齢化率が高い自治体の特徴を比較。",
    tag: "aging",
  },
  {
    title: "少子高齢化ギャップ分析",
    href: "/articles/aging-gap",
    emoji: "📉",
    desc: "高齢化率が子ども割合を最大62.9pt上回る自治体。",
    tag: "aging",
  },
  {
    title: "財政力指数と高齢化率の関係",
    href: "/articles/aging-finance",
    emoji: "💰",
    desc: "相関係数-0.71。それでも財政が強い例外自治体。",
    tag: "finance",
  },
  {
    title: "社会増減率ランキング分析",
    href: "/articles/decline",
    emoji: "📊",
    desc: "転入超過・転出超過が際立つ自治体を解説。",
    tag: "migration",
  },
  {
    title: "医師数ランキング分析",
    href: "/articles/doctors-analysis",
    emoji: "🩺",
    desc: "医科大学の城下町が独占。医師ゼロの29町村も。",
    tag: "medical",
  },
  {
    title: "完全失業率ランキング分析",
    href: "/articles/unemployment-analysis",
    emoji: "💼",
    desc: "福岡県筑豊地方の旧産炭地がなぜ上位に並ぶのか。",
    tag: "labor",
  },
  {
    title: "産業構造分析",
    href: "/articles/industry-structure",
    emoji: "🏭",
    desc: "農業の町・ものづくりの町・サービス業の町を比較。",
    tag: "industry",
    fresh: true,
  },
  {
    title: "単独世帯割合とU字の関係",
    href: "/articles/household-aging-ushape",
    emoji: "🏠",
    desc: "相関係数はほぼ0なのに現れるU字型の謎。",
    tag: "household",
  },
];

export default function ArticlesSection() {
  return (
    <section
      style={{
        marginBottom: 40,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 8,
          marginBottom: 16,
        }}
      >
        <h2
          style={{
            fontSize: 24,
            fontWeight: 800,
            margin: 0,
          }}
        >
          📖 おすすめ記事
        </h2>

        <Link
          href="/articles"
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: "#2563eb",
            textDecoration: "none",
          }}
        >
          すべての記事を見る →
        </Link>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(260px,1fr))",
          gap: 16,
        }}
      >
        {articles.map((article) => {
          const t = TAGS[article.tag];
          return (
            <Link
              key={article.href}
              href={article.href}
              style={{
                textDecoration: "none",
                color: "#111827",
              }}
            >
              <div
                style={{
                  background: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: 14,
                  padding: 18,
                  height: "100%",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 10,
                  }}
                >
                  <div style={{ fontSize: 24 }}>
                    {article.emoji}
                  </div>

                  <div style={{ display: "flex", gap: 6 }}>
                    {article.fresh && (
                      <span
                        style={{
                          background: "#fef2f2",
                          color: "#dc2626",
                          padding: "3px 8px",
                          borderRadius: 999,
                          fontSize: 11,
                          fontWeight: 700,
                        }}
                      >
                        NEW
                      </span>
                    )}
                    <span
                      style={{
                        background: t.bg,
                        color: t.fg,
                        padding: "3px 8px",
                        borderRadius: 999,
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                    >
                      {t.label}
                    </span>
                  </div>
                </div>

                <h3
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    marginBottom: 6,
                  }}
                >
                  {article.title}
                </h3>

                <p
                  style={{
                    color: "#6b7280",
                    lineHeight: 1.6,
                    fontSize: 13,
                    margin: 0,
                  }}
                >
                  {article.desc}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
