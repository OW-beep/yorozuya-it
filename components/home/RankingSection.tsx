import Link from "next/link";

const rankings = [
  { href: "/ranking/population", emoji: "👥", title: "人口" },
  { href: "/ranking/birth-rate", emoji: "👶", title: "出生率" },
  { href: "/ranking/child", emoji: "🧒", title: "子ども人口" },
  { href: "/ranking/aging", emoji: "🧓", title: "高齢化率" },
  { href: "/ranking/density", emoji: "🏙️", title: "人口密度" },
  { href: "/ranking/area", emoji: "🗺️", title: "面積" },
  { href: "/ranking/finance", emoji: "💰", title: "財政力指数" },
  { href: "/ranking/decline", emoji: "📊", title: "社会増減率" },
  { href: "/ranking/household", emoji: "🏠", title: "単独世帯割合" },
  { href: "/ranking/household-size", emoji: "👨‍👩‍👧‍👦", title: "平均世帯人員" },
  { href: "/ranking/doctors", emoji: "🩺", title: "医師数" },
  { href: "/ranking/unemployment", emoji: "💼", title: "完全失業率" },
  { href: "/ranking/manufacturing", emoji: "🏭", title: "製造業就業者比率" },
];

export default function RankingSection() {
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
          📊 ランキングから探す
        </h2>

        <Link
          href="/ranking"
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: "#2563eb",
            textDecoration: "none",
          }}
        >
          すべてのランキングを見る →
        </Link>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fill,minmax(150px,1fr))",
          gap: 12,
        }}
      >
        {rankings.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            style={{
              textDecoration: "none",
              color: "#111827",
            }}
          >
            <div
              style={{
                background: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: 12,
                padding: "16px 14px",
                textAlign: "center",
                height: "100%",
              }}
            >
              <div style={{ fontSize: 26, marginBottom: 8 }}>
                {item.emoji}
              </div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                {item.title}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
