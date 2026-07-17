"use client";

import { useState } from "react";
import { CONTACT_EMAIL, FORMSPREE_FORM_ID } from "@/lib/site";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  if (!FORMSPREE_FORM_ID) {
    // フォームIDが未設定の間は、メールでの案内のみ表示する
    return (
      <div className="border border-ink/10 bg-washi-warm p-6 text-sm text-ink-soft leading-relaxed">
        <p>
          現在フォームを準備中です。お手数ですが、下記メールアドレスまで直接ご連絡ください。
        </p>
        <p className="mt-2 font-mono">{CONTACT_EMAIL}</p>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_FORM_ID}`, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        setStatus("sent");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="border border-yamabuki/50 border-2 bg-washi p-6 text-sm">
        送信しました。内容を確認の上、担当者よりご連絡いたします。
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-xs text-ink-soft mb-1.5">
          お名前
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="w-full border border-ink/15 bg-washi px-3 py-2.5 text-sm focus:outline-none focus:border-yamabuki-deep"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-xs text-ink-soft mb-1.5">
          メールアドレス
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full border border-ink/15 bg-washi px-3 py-2.5 text-sm focus:outline-none focus:border-yamabuki-deep"
        />
      </div>
      <div>
        <label
          htmlFor="message"
          className="block text-xs text-ink-soft mb-1.5"
        >
          お問い合わせ内容
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="w-full border border-ink/15 bg-washi px-3 py-2.5 text-sm focus:outline-none focus:border-yamabuki-deep"
        />
      </div>
      <button
        type="submit"
        disabled={status === "sending"}
        className="bg-yamabuki text-indigo-deep font-bold px-6 py-3 rounded text-sm disabled:opacity-50"
      >
        {status === "sending" ? "送信中..." : "送信する"}
      </button>
      {status === "error" && (
        <p className="text-xs text-red-700">
          送信に失敗しました。お手数ですが、{CONTACT_EMAIL}
          までメールでご連絡ください。
        </p>
      )}
    </form>
  );
}
