"use client";

import { useMemo, useState } from "react";
import { checkPaste, PasteLevel } from "@/lib/aiPasteChecker";

const LEVEL_META: Record<
  PasteLevel | "ok",
  { badge: string; color: string; bg: string; label: string }
> = {
  high: { badge: "🔴", color: "text-red-700", bg: "bg-red-50 border-red-200", label: "貼る前に要対処" },
  mid: { badge: "🟠", color: "text-amber-700", bg: "bg-amber-50 border-amber-200", label: "確認推奨" },
  low: { badge: "🟡", color: "text-yellow-700", bg: "bg-yellow-50 border-yellow-200", label: "注意" },
  ok: { badge: "🟢", color: "text-green-700", bg: "bg-green-50 border-green-200", label: "検出なし" },
};

export default function AiPasteCheckTool() {
  const [text, setText] = useState("");
  const [termsRaw, setTermsRaw] = useState("");
  const [checked, setChecked] = useState(false);
  const [copied, setCopied] = useState(false);

  const terms = useMemo(
    () => termsRaw.split(/\n|、|,/).map((t) => t.trim()).filter(Boolean),
    [termsRaw]
  );
  const result = useMemo(
    () => (checked ? checkPaste(text, terms) : null),
    [checked, text, terms]
  );

  const overall: PasteLevel | "ok" = !result
    ? "ok"
    : result.findings.some((f) => f.level === "high")
    ? "high"
    : result.findings.some((f) => f.level === "mid")
    ? "mid"
    : result.findings.length > 0
    ? "low"
    : "ok";

  const copyMasked = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.masked);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <label className="block text-sm font-bold text-ink mb-2" htmlFor="paste-text">
        AIに貼る予定の文章を入れてください
      </label>
      <textarea
        id="paste-text"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setChecked(false);
        }}
        rows={9}
        placeholder="例:メール文、議事録、エラーログ、設定ファイルなど"
        className="w-full rounded-lg border border-ink/20 bg-washi p-3 text-sm leading-relaxed focus:outline-none focus:border-indigo"
      />

      <details className="mt-3">
        <summary className="text-xs text-indigo cursor-pointer">
          社名・案件名など、伏せたいワードを追加する(任意)
        </summary>
        <textarea
          value={termsRaw}
          onChange={(e) => {
            setTermsRaw(e.target.value);
            setChecked(false);
          }}
          rows={3}
          placeholder={"1行に1つ(読点・カンマ区切りも可)\n例:株式会社〇〇\nプロジェクトX"}
          className="mt-2 w-full rounded-lg border border-ink/20 bg-washi p-3 text-xs focus:outline-none focus:border-indigo"
        />
      </details>

      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={() => setChecked(true)}
          disabled={text.trim().length === 0}
          className="text-sm px-5 py-2 rounded bg-indigo text-washi disabled:opacity-40"
        >
          チェックする
        </button>
        <button
          onClick={() => {
            setText("");
            setChecked(false);
          }}
          className="text-xs text-indigo underline hover:no-underline"
        >
          クリア
        </button>
      </div>

      <p className="text-xs text-ink-soft mt-3">
        🔒 入力した文章はサーバーへ送信されません。このページ内(お使いのブラウザ上)だけで処理します。
      </p>

      {result && (
        <div className="mt-8">
          <div className={`rounded-xl border p-5 mb-5 ${LEVEL_META[overall].bg}`}>
            <p className={`text-lg font-bold ${LEVEL_META[overall].color}`}>
              {LEVEL_META[overall].badge} 判定:{LEVEL_META[overall].label}
            </p>
            <p className="text-sm text-ink-soft mt-1">
              {result.findings.length > 0
                ? `${result.findings.length}種類の項目を検出しました(${result.length.toLocaleString()}文字を確認)`
                : "機微情報らしき文字列は検出されませんでした。ただし機械的なチェックには限界があります。"}
            </p>
          </div>

          <div className="space-y-3">
            {result.findings.map((f) => (
              <div key={f.id} className={`rounded-lg border p-4 ${LEVEL_META[f.level].bg}`}>
                <p className={`text-sm font-bold ${LEVEL_META[f.level].color}`}>
                  {LEVEL_META[f.level].badge} {f.label}
                  <span className="ml-2 font-normal text-xs text-ink-soft">{f.count}件</span>
                </p>
                {f.samples.length > 0 && (
                  <p className="text-xs font-mono text-ink-soft mt-1">
                    検出例:{f.samples.join(" / ")}
                  </p>
                )}
                <p className="text-xs text-ink mt-2 leading-relaxed">{f.guidance}</p>
              </div>
            ))}
          </div>

          {result.findings.some((f) => f.id !== "confidential") && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-bold text-ink">伏せ字にした文章(貼り直し用)</p>
                <button onClick={copyMasked} className="text-xs text-indigo underline hover:no-underline">
                  {copied ? "コピーしました" : "コピーする"}
                </button>
              </div>
              <textarea
                readOnly
                value={result.masked}
                rows={8}
                className="w-full rounded-lg border border-ink/20 bg-washi-warm p-3 text-sm leading-relaxed"
              />
              <p className="text-xs text-ink-soft mt-2">
                検出できた項目だけを自動で置き換えています。置き換え後も、内容を目で確認してから貼ってください。
              </p>
            </div>
          )}
        </div>
      )}

      <p className="text-xs text-ink-soft mt-8 leading-relaxed">
        ※ このツールは文字列のパターンを機械的に調べるもので、機密情報や個人情報の有無を保証するものではありません。氏名・社名・案件内容のように、パターンでは見分けられない情報は検出できないことがあります。AIサービスに入力してよい情報の範囲は、所属組織のルールを必ず優先してください。
      </p>
    </div>
  );
}
