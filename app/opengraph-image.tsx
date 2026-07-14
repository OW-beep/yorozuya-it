import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "よろずやIT | ITの困った、ぜんぶここに。";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(180deg, #1B3550 0%, #12253A 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 40,
            fontWeight: 700,
            color: "#F6F1E4",
            marginBottom: 40,
          }}
        >
          よろずや
          <span style={{ color: "#D9A441", marginLeft: 4 }}>IT</span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 68,
            fontWeight: 700,
            color: "#F6F1E4",
            lineHeight: 1.4,
          }}
        >
          <div>ITの困った、</div>
          <div style={{ color: "#D9A441" }}>ぜんぶここに。</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
