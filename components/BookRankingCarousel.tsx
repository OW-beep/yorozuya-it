"use client";

import { useState } from "react";
import { bookRanking } from "@/lib/bookRanking";

type Shop = "amazon" | "rakuten";

export default function BookRankingCarousel() {
  const [shop, setShop] = useState<Shop>("amazon");

  return (
    <section className="bg-washi-warm border-t border-b border-ink/10 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-lg font-bold text-ink">
            最新のIT関連書籍 トップ10
          </h2>

          <div className="inline-flex border border-ink/20 rounded-full overflow-hidden text-xs">
            <button
              onClick={() => setShop("amazon")}
              className={`px-3 py-1 transition-colors ${
                shop === "amazon"
                  ? "bg-indigo-deep text-white"
                  : "bg-transparent text-ink-soft"
              }`}
            >
              Amazon
            </button>
            <button
              onClick={() => setShop("rakuten")}
              className={`px-3 py-1 transition-colors ${
                shop === "rakuten"
                  ? "bg-indigo-deep text-white"
                  : "bg-transparent text-ink-soft"
              }`}
            >
              楽天
            </button>
          </div>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-thin">
          {bookRanking.map((book, i) => (
            <a
              key={book.title}
              href={shop === "amazon" ? book.amazonUrl : book.rakutenUrl}
              target="_blank"
              rel="nofollow sponsored noopener"
              className="shrink-0 w-36 bg-white border border-ink/10 rounded-lg p-3 hover:shadow-md transition-shadow"
            >
              <div className="w-full aspect-[3/4] bg-washi flex items-center justify-center rounded mb-2 relative">
                <span className="absolute top-1 left-1 text-[10px] font-bold bg-yamabuki-deep text-white rounded-full w-5 h-5 flex items-center justify-center">
                  {i + 1}
                </span>
                <svg
                  viewBox="0 0 40 52"
                  className="w-12 h-16 text-ink/20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="4" y="2" width="32" height="48" rx="2" />
                  <line x1="10" y1="12" x2="30" y2="12" />
                  <line x1="10" y1="18" x2="30" y2="18" />
                  <line x1="10" y1="24" x2="24" y2="24" />
                </svg>
              </div>
              <p className="text-[11px] text-ink leading-snug line-clamp-3 mb-1">
                {book.title}
              </p>
              <p className="text-[11px] font-bold text-ink-soft">
                {book.price}
              </p>
            </a>
          ))}
        </div>

        <p className="text-[10px] text-ink-soft mt-3">
          PR / 掲載順位は定期的に見直しています。価格は変動する場合があるため、購入前に各ストアでご確認ください。
        </p>
      </div>
    </section>
  );
}
