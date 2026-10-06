import Link from "next/link";
import type { ServiceKey } from "@/lib/services";

type Props = { slug: string; category: string };

function pickTopic(slug: string, category: string): {
  key: ServiceKey;
  heading: string;
  body: string;
  label: string;
} {
  if (/(^|-)(ai|prompt|generative|governance|agentic|llm|hallucination)(-|$)/.test(slug)) {
    return {
      key: "ai",
      heading: "AIの使い方・社内ルールでお悩みですか?",
      body: "「何を入力してよいか」「回答をどこまで信用してよいか」の線引きから、一緒に整理します。",
      label: "生成AIの活用・ルール整備を相談する",
    };
  }
  if (/excel|vba|rpa|spreadsheet|automation/.test(slug)) {
    return {
      key: "excel",
      heading: "手作業の集計や、属人化したファイルでお困りですか?",
      body: "業務の流れを整理し、誰でも引き継げる形に整えるところから相談できます。",
      label: "Excel・業務の自動化を相談する",
    };
  }
  if (/data|sql|analysis|dashboard|statistic/.test(slug)) {
    return {
      key: "data",
      heading: "データの分析・活用でお悩みですか?",
      body: "目的の整理から、集計・可視化、結果の読み方まで、状況に合わせてご相談に応じます。",
      label: "データ分析・活用を相談する",
    };
  }
  if (
    /(security|phishing|password|backup|ransom|vpn|firewall|account|passkey|2dankai|sagi|oauth|cookie|zero-?trust|update|malware|virus)/.test(
      slug
    ) ||
    category === "トレンド"
  ) {
    return {
      key: "security",
      heading: "自組織のIT環境、確認できていますか?",
      body: "アカウント・バックアップ・更新運用などの現状を洗い出し、優先順位をつけて整理します。",
      label: "IT環境の棚卸しを相談する",
    };
  }
  return {
    key: "other",
    heading: "ITのことで、誰かに相談したいことはありませんか?",
    body: "個人・法人を問わず、状況の整理から一緒に進めます。",
    label: "ITのお困りごとを相談する",
  };
}

export default function ConsultCta({ slug, category }: Props) {
  const t = pickTopic(slug, category);
  return (
    <aside className="mt-14 rounded-xl border border-yamabuki/50 bg-yamabuki/5 p-5">
      <p className="font-serif text-base font-bold mb-1">{t.heading}</p>
      <p className="text-sm text-ink-soft leading-relaxed mb-3">{t.body}</p>
      <Link
        href={`/services?topic=${t.key}#contact`}
        className="inline-block bg-yamabuki text-indigo-deep font-bold px-5 py-2.5 rounded text-sm"
      >
        {t.label}
      </Link>
      <p className="text-xs text-ink-soft mt-3">
        約50の企業・団体を支援してきた経験をもとに対応します。
        <Link href="/services" className="underline ml-1">
          ご相談メニューを見る
        </Link>
      </p>
    </aside>
  );
}
