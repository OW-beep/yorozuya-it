import { ImageResponse } from "next/og";
import { getPostFrontmatter } from "@/lib/posts";

export const alt = "よろずやIT";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const CATEGORY_ICON: Record<string, string> = {
  "PC・スマホ": "💻",
  "アプリ": "📱",
  "用語辞典": "📖",
  "プログラミング": "⌨️",
  "トレンド": "📈",
};

const TROUBLE_PATTERN =
  /できない|開かない|映らない|聞こえない|直らない|治らない|重い|エラー|危険|注意|対策|とは何|できません|失敗/;

export default async function Image({ params }: { params: { slug: string } }) {
  const post = getPostFrontmatter(params.slug);
  const title = post?.title ?? "よろずやIT";
  const category = post?.category ?? "";
  const icon = CATEGORY_ICON[category] ?? "📝";
  const isTrouble = TROUBLE_PATTERN.test(title);
  const accent = isTrouble ? "#B23A3A" : "#D9A441";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "linear-gradient(180deg, #1B3550 0%, #12253A 100%)",
        }}
      >
        <div
          style={{
            width: "18px",
            height: "100%",
            display: "flex",
            background: accent,
          }}
        />
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "60px 70px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                display: "flex",
                fontSize: 32,
                fontWeight: 700,
                color: "#F6F1E4",
              }}
            >
              よろずや
              <span style={{ color: "#D9A441", marginLeft: 4 }}>IT</span>
            </div>
            {category && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: 22,
                  color: "#12253A",
                  background: accent,
                  marginLeft: 28,
                  padding: "6px 20px",
                  borderRadius: 999,
                  fontWeight: 700,
                }}
              >
                {category}
              </div>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "flex-end", gap: 24 }}>
            <div style={{ display: "flex", fontSize: 110, lineHeight: 1 }}>
              {icon}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: title.length > 28 ? 46 : 56,
                fontWeight: 700,
                color: "#F6F1E4",
                lineHeight: 1.35,
                flex: 1,
              }}
            >
              {title}
            </div>
          </div>

          {isTrouble && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: 24,
                fontWeight: 700,
                color: "#F6F1E4",
                background: "#B23A3A",
                padding: "8px 24px",
                borderRadius: 8,
                alignSelf: "flex-start",
              }}
            >
              ⚠️ すぐ解決したい人向け
            </div>
          )}
        </div>
      </div>
    ),
    { ...size }
  );
}
