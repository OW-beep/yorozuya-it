import Link from "next/link";
import SubmissionCheckTool from "@/components/SubmissionCheckTool";

export const metadata = {
  title: "提出前ファイル診断(Excel) - そのファイル、そのまま送って大丈夫?",
  description:
    "Excelファイルに残っている非表示シート・作成者情報・個人情報らしき文字列・外部リンクなどを、送信前にブラウザ上で無料チェックできます。ファイルはサーバーに送信されません。",
};

export default function TeishutsuCheckPage() {
  return (
    <main className="max-w-[820px] mx-auto px-[6vw] py-16">
      <Link href="/" className="text-xs text-ink-soft font-mono">
        ← よろずやIT
      </Link>

      <div className="mt-6 mb-10 text-center">
        <p className="text-xs font-mono text-yamabuki-deep mb-2">
          無料ツール(β)
        </p>
        <h1 className="font-serif text-2xl md:text-3xl font-bold mb-3">
          そのファイル、そのまま送って大丈夫?
        </h1>
        <p className="text-sm text-ink-soft leading-relaxed">
          Excelファイルの中には、画面上は見えなくても「非表示シート」「作成者の名前」「コメント」「個人情報らしき文字列」などが残っていることがあります。
          <br />
          社外・取引先・自治体などへ提出する前に、ブラウザ上で無料チェックできます。
        </p>
      </div>

      <SubmissionCheckTool />

      <div className="mt-16 pt-8 border-t border-ink/10 text-xs text-ink-soft leading-relaxed space-y-3">
        <h2 className="font-serif text-sm font-bold text-ink">
          このツールについて
        </h2>
        <p>
          現在は試験提供中(β版)で、対応形式はExcel(.xlsx)のみです。Word・PowerPoint・PDFなど他形式への対応は今後追加予定です。
        </p>
        <p>
          検査項目は、Microsoft社の「ドキュメント検査」機能などで案内されている項目を参考に、提出・共有という利用場面に合わせて整理したものです。マイクロソフト公式のドキュメント検査機能については、
          <a
            href="https://support.microsoft.com/ja-jp/office/%E3%83%89%E3%82%AD%E3%83%A5%E3%83%A1%E3%83%B3%E3%83%88-%E3%83%97%E3%83%AC%E3%82%BC%E3%83%B3%E3%83%86%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3-%E3%81%BE%E3%81%9F%E3%81%AF%E3%83%96%E3%83%83%E3%82%AF-%E3%83%AF%E3%83%BC%E3%82%AF%E3%81%AE%E9%9D%9E%E8%A1%A8%E7%A4%BA%E3%83%87%E3%83%BC%E3%82%BF%E3%82%84%E5%80%8B%E4%BA%BA%E6%83%85%E5%A0%B1%E3%82%92%E5%89%8A%E9%99%A4%E3%81%99%E3%82%8B-356b7b5d-77af-44fe-a07f-9aa4d085966f"
            target="_blank"
            rel="noopener noreferrer"
            className="text-yamabuki-deep underline"
          >
            公式サポートページ
          </a>
          もあわせてご確認ください。
        </p>
        <p>
          このツールは機械的な検査を行うものであり、検出結果は目安です。「個人情報の可能性がある文字列」も断定ではなく候補の提示にとどまります。最終的な確認・判断は、必ずご自身で行ってください。ファイル内容やアップロード履歴をサーバー側に保存することは一切ありません。
        </p>
      </div>
    </main>
  );
}
