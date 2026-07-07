import type { Metadata } from "next";
import { Shippori_Mincho, Zen_Kaku_Gothic_New, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const shippori = Shippori_Mincho({
  weight: ["500", "700"],
  subsets: ["latin"],
  variable: "--font-shippori",
  display: "swap",
});

const zenkaku = Zen_Kaku_Gothic_New({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-zenkaku",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "よろずやIT | ITの困った、ぜんぶここに。",
  description:
    "エラー、アプリの使い方、聞きなれない専門用語まで。何でも屋のように、ITのあらゆる「わからない」を取り揃えています。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body
        className={`${shippori.variable} ${zenkaku.variable} ${jetbrains.variable} font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
