import { ImageResponse } from "next/og";
import { getPostData } from "@/lib/posts";

export const runtime = "edge";
export const alt = "よろずやIT";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: { slug: string } }) {
  let title = "よろずやIT";
  let category = "";

  try {
    const post = await getPostData(params.slug);
    title = post.title;
    category = post.category;
  } catch {
    // フォールバック値をそのまま使用
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "70px",
          background: "linear-gradient(180deg, #1B3550 0%, #12253A 100%)",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 30,
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
                fontSize: 22,
                color: "#D9A441",
                marginTop: 24,
                fontFamily: "monospace",
              }}
            >
              {category}
            </div>
          )}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: title.length > 30 ? 48 : 58,
            fontWeight: 700,
            color: "#F6F1E4",
            lineHeight: 1.5,
          }}
        >
          {title}
        </div>
      </div>
    ),
    { ...size }
  );
}
