"use client";

import { useState, useCallback, useRef } from "react";
import {
  analyzeXlsx,
  Finding,
  RiskLevel,
  SubmissionPurpose,
  PURPOSE_LABELS,
} from "@/lib/excelAnalyzer";

const LEVEL_META: Record<
  RiskLevel,
  { badge: string; color: string; bg: string; label: string }
> = {
  high: { badge: "🔴", color: "text-red-700", bg: "bg-red-50 border-red-200", label: "要確認" },
  mid: { badge: "🟠", color: "text-amber-700", bg: "bg-amber-50 border-amber-200", label: "確認推奨" },
  low: { badge: "🟡", color: "text-yellow-700", bg: "bg-yellow-50 border-yellow-200", label: "注意" },
  ok: { badge: "🟢", color: "text-green-700", bg: "bg-green-50 border-green-200", label: "問題なし" },
};

export default function SubmissionCheckTool() {
  const [purpose, setPurpose] = useState<SubmissionPurpose | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [findings, setFindings] = useState<Finding[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    setError(null);
    setFindings(null);

    if (!/\.xlsx$/i.test(file.name)) {
      setError(
        "現在は Excel(.xlsx)形式のみに対応しています。古い形式(.xls)は非対応です。"
      );
      return;
    }
    if (file.size > 30 * 1024 * 1024) {
      setError("30MBを超えるファイルには対応していません。");
      return;
    }

    setFileName(file.name);
    setLoading(true);
    try {
      const result = await analyzeXlsx(file);
      setFindings(result);
    } catch (e) {
      setError(
        "ファイルの解析に失敗しました。ファイルが破損しているか、パスワードで保護されている可能性があります。"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const highCount = findings?.filter((f) => f.level === "high").length ?? 0;
  const midCount = findings?.filter((f) => f.level === "mid").length ?? 0;
  const lowCount = findings?.filter((f) => f.level === "low").length ?? 0;
  const totalCount = highCount + midCount + lowCount;

  const overallLevel: RiskLevel =
    highCount > 0 ? "high" : midCount > 0 ? "mid" : lowCount > 0 ? "low" : "ok";

  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  const toggleExpanded = (i: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(i)) {
        next.delete(i);
      } else {
        next.add(i);
      }
      return next;
    });
  };

  const reset = () => {
    setFileName(null);
    setFindings(null);
    setError(null);
    setExpanded(new Set());
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* 提出先の選択 */}
      {!findings && (
        <div className="mb-6">
          <p className="text-sm font-bold text-ink mb-2">どこへ提出しますか?(任意)</p>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(PURPOSE_LABELS) as SubmissionPurpose[]).map((key) => (
              <button
                key={key}
                onClick={() => setPurpose(key)}
                className={`text-xs px-3 py-1.5 rounded-full border transition ${
                  purpose === key
                    ? "bg-indigo text-washi border-indigo"
                    : "bg-washi text-ink-soft border-ink/20 hover:border-indigo"
                }`}
              >
                {PURPOSE_LABELS[key]}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ドロップエリア */}
      {!findings && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={`cursor-pointer rounded-xl border-2 border-dashed p-10 text-center transition ${
            dragOver ? "border-yamabuki bg-yamabuki/5" : "border-ink/20 bg-washi"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
          <p className="text-sm text-ink mb-2">
            Excelファイル(.xlsx)をここにドラッグ&ドロップ
          </p>
          <p className="text-xs text-ink-soft mb-4">または、クリックしてファイルを選択</p>
          <span className="inline-block text-xs px-4 py-2 rounded bg-indigo text-washi">
            ファイルを選択
          </span>
        </div>
      )}

      <p className="text-xs text-ink-soft mt-3 flex items-center gap-1">
        🔒 ファイルはサーバーへ送信されません。このページ内(お使いのブラウザ上)だけで処理します。
      </p>

      {loading && (
        <p className="text-sm text-ink-soft mt-6 text-center">解析しています…</p>
      )}

      {error && (
        <div className="mt-6 border border-red-200 bg-red-50 rounded-lg p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* 結果表示 */}
      {findings && (
        <div className="mt-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-ink-soft">{fileName}</p>
              {purpose && (
                <p className="text-xs text-ink-soft">
                  提出先: {PURPOSE_LABELS[purpose]}
                </p>
              )}
            </div>
            <button
              onClick={reset}
              className="text-xs text-indigo underline hover:no-underline"
            >
              別のファイルを診断する
            </button>
          </div>

          <div
            className={`rounded-xl border p-5 mb-5 ${LEVEL_META[overallLevel].bg}`}
          >
            <p className={`text-lg font-bold ${LEVEL_META[overallLevel].color}`}>
              {LEVEL_META[overallLevel].badge} 判定:{" "}
              {overallLevel === "ok" ? "問題を検出しませんでした" : LEVEL_META[overallLevel].label}
            </p>
            {totalCount > 0 && (
              <p className="text-sm text-ink-soft mt-1">
                {totalCount}項目を検出しました(要確認 {highCount}件 / 確認推奨 {midCount}件 / 注意 {lowCount}件)
              </p>
            )}
          </div>

          {findings.length === 0 && (
            <p className="text-sm text-ink-soft">
              非表示シート・個人情報候補・作成者情報などは検出されませんでした。ただし、これはあくまで機械的なチェックです。送付前には内容そのものもあわせてご確認ください。
            </p>
          )}

          <div className="space-y-3">
            {findings
              .slice()
              .sort((a, b) => {
                const order: Record<RiskLevel, number> = { high: 0, mid: 1, low: 2, ok: 3 };
                return order[a.level] - order[b.level];
              })
              .map((f, i) => (
                <div
                  key={i}
                  className={`rounded-lg border p-4 ${LEVEL_META[f.level].bg}`}
                >
                  <p className={`text-sm font-bold ${LEVEL_META[f.level].color}`}>
                    {LEVEL_META[f.level].badge} {f.title}
                  </p>
                  <p className="text-sm text-ink mt-1">{f.detail}</p>
                  {f.guidance && (
                    <>
                      <button
                        onClick={() => toggleExpanded(i)}
                        className="text-xs text-indigo underline hover:no-underline mt-2 inline-block"
                      >
                        {expanded.has(i) ? "対処法を閉じる ▲" : "どうすればいい? ▼"}
                      </button>
                      {expanded.has(i) && (
                        <p className="text-xs text-ink-soft mt-2 leading-relaxed border-t border-ink/10 pt-2">
                          {f.guidance}
                        </p>
                      )}
                    </>
                  )}
                </div>
              ))}
          </div>

          <p className="text-xs text-ink-soft mt-6">
            ※ このツールはExcelファイルの構造を機械的に検査するもので、内容の安全性を保証するものではありません。最終的な確認は、必ずご自身の目でも行ってください。非表示シートや外部リンクなど、削除によってファイルの計算結果が変わる可能性がある項目は、自動では変更していません。
          </p>
        </div>
      )}
    </div>
  );
}
