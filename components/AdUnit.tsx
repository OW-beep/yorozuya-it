"use client";

import { useEffect } from "react";

const ADSENSE_CLIENT = "ca-pub-4630812027939211";

type Props = {
  /** AdSenseの管理画面で作成した「ディスプレイ広告」の広告ユニットID(data-ad-slot)。未指定なら何も表示しない */
  slot?: string;
};

export default function AdUnit({ slot }: Props) {
  useEffect(() => {
    if (!slot) return;
    try {
      const w = window as unknown as { adsbygoogle?: unknown[] };
      (w.adsbygoogle = w.adsbygoogle || []).push({});
    } catch {
      // 広告の読み込み失敗でページ表示は止めない
    }
  }, [slot]);

  if (!slot) return null;

  return (
    <aside className="my-10" aria-label="広告">
      <p className="text-[10px] text-ink-soft mb-1">広告</p>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}
