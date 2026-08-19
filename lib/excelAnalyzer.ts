import JSZip from "jszip";

export type RiskLevel = "high" | "mid" | "low" | "ok";

export type Finding = {
  level: RiskLevel;
  title: string;
  detail: string;
};

export type SubmissionPurpose =
  | "external"
  | "customer"
  | "government"
  | "recruit"
  | "web"
  | "other";

export const PURPOSE_LABELS: Record<SubmissionPurpose, string> = {
  external: "社外・取引先",
  customer: "顧客",
  government: "自治体・公的機関",
  recruit: "採用・応募",
  web: "Web公開",
  other: "その他",
};

const PII_PATTERNS: { label: string; regex: RegExp }[] = [
  { label: "メールアドレス", regex: /[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/g },
  { label: "電話番号らしき文字列", regex: /0\d{1,4}-\d{1,4}-\d{3,4}/g },
  { label: "郵便番号らしき文字列", regex: /〒?\d{3}-\d{4}/g },
  { label: "クレジットカード番号らしき文字列", regex: /\b(?:\d[ -]?){13,16}\b/g },
  { label: "マイナンバーらしき文字列(12桁)", regex: /\b\d{4}\s?\d{4}\s?\d{4}\b/g },
  { label: "IPアドレスらしき文字列", regex: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g },
];

function getText(xml: string, tag: string): string | null {
  const m = xml.match(new RegExp(`<${tag}[^>]*>([^<]*)</${tag}>`));
  return m ? m[1] : null;
}

function countMatches(regex: RegExp, text: string): number {
  const m = text.match(regex);
  return m ? m.length : 0;
}

export async function analyzeXlsx(file: File): Promise<Finding[]> {
  const findings: Finding[] = [];
  const zip = await JSZip.loadAsync(file);

  // --- workbook.xml: シートの表示状態 ---
  const workbookXml = await zip.file("xl/workbook.xml")?.async("string");
  let hiddenSheetCount = 0;
  const hiddenSheetNames: string[] = [];
  if (workbookXml) {
    const sheetRegex = /<sheet[^>]*name="([^"]*)"[^>]*state="(hidden|veryHidden)"[^>]*\/>/g;
    let m: RegExpExecArray | null;
    while ((m = sheetRegex.exec(workbookXml)) !== null) {
      hiddenSheetCount++;
      hiddenSheetNames.push(m[1]);
    }
  }
  if (hiddenSheetCount > 0) {
    findings.push({
      level: "high",
      title: "非表示シート",
      detail: `「${hiddenSheetNames.join("」「")}」が非表示になっています(${hiddenSheetCount}件)。`,
    });
  }

  // --- 各シートXML: 非表示行・非表示列・ハイパーリンク ---
  const sheetFiles = Object.keys(zip.files).filter((n) =>
    /^xl\/worksheets\/sheet\d+\.xml$/.test(n)
  );
  let hiddenRowCount = 0;
  let hiddenColCount = 0;
  let hyperlinkCount = 0;
  let allSheetText = "";

  for (const name of sheetFiles) {
    const xml = await zip.file(name)?.async("string");
    if (!xml) continue;
    hiddenRowCount += countMatches(/<row[^>]*hidden="1"[^>]*>/g, xml);
    hiddenColCount += countMatches(/<col[^>]*hidden="1"[^>]*\/>/g, xml);
    hyperlinkCount += countMatches(/<hyperlink[^>]*>/g, xml);
    // インラインストリング(t="inlineStr")のテキストも回収
    const inlineTexts = xml.match(/<t[^>]*>([^<]*)<\/t>/g) || [];
    allSheetText += inlineTexts.join(" ") + " ";
  }

  if (hiddenRowCount > 0) {
    findings.push({
      level: "mid",
      title: "非表示の行",
      detail: `非表示になっている行が ${hiddenRowCount} 件あります。数式の途中経過や、削除し忘れたデータが含まれていないか確認してください。`,
    });
  }
  if (hiddenColCount > 0) {
    findings.push({
      level: "mid",
      title: "非表示の列",
      detail: `非表示になっている列が ${hiddenColCount} 件あります。`,
    });
  }
  if (hyperlinkCount > 0) {
    findings.push({
      level: "low",
      title: "ハイパーリンク",
      detail: `シート内にハイパーリンクが ${hyperlinkCount} 件設定されています。リンク先が社内限定のフォルダ等になっていないか確認してください。`,
    });
  }

  // --- 共有文字列(sharedStrings.xml): セルの表示文字列 ---
  const sharedStringsXml = await zip.file("xl/sharedStrings.xml")?.async("string");
  if (sharedStringsXml) {
    const texts = sharedStringsXml.match(/<t[^>]*>([^<]*)<\/t>/g) || [];
    allSheetText += texts.join(" ");
  }

  // --- 個人情報候補の検出 ---
  for (const pattern of PII_PATTERNS) {
    const count = countMatches(pattern.regex, allSheetText);
    if (count > 0) {
      findings.push({
        level: "high",
        title: `個人情報の可能性がある文字列(${pattern.label})`,
        detail: `${pattern.label}に一致する文字列を ${count} 件検出しました。内容を確認してください。`,
      });
    }
  }

  // --- docProps/core.xml: 作成者・最終更新者 ---
  const coreXml = await zip.file("docProps/core.xml")?.async("string");
  if (coreXml) {
    const creator = getText(coreXml, "dc:creator");
    const lastModifiedBy = getText(coreXml, "cp:lastModifiedBy");
    if (creator) {
      findings.push({
        level: "low",
        title: "作成者情報",
        detail: `作成者として「${creator}」が記録されています。`,
      });
    }
    if (lastModifiedBy && lastModifiedBy !== creator) {
      findings.push({
        level: "low",
        title: "最終更新者情報",
        detail: `最終更新者として「${lastModifiedBy}」が記録されています。`,
      });
    }
  }

  // --- docProps/app.xml: 会社名 ---
  const appXml = await zip.file("docProps/app.xml")?.async("string");
  if (appXml) {
    const company = getText(appXml, "Company");
    if (company && company.trim().length > 0) {
      findings.push({
        level: "low",
        title: "会社名の記録",
        detail: `文書のプロパティに会社名「${company}」が記録されています。`,
      });
    }
  }

  // --- コメント ---
  const commentFiles = Object.keys(zip.files).filter((n) =>
    /^xl\/comments\d*\.xml$/.test(n)
  );
  if (commentFiles.length > 0) {
    let commentCount = 0;
    for (const name of commentFiles) {
      const xml = await zip.file(name)?.async("string");
      if (xml) commentCount += countMatches(/<comment[^>]*>/g, xml);
    }
    if (commentCount > 0) {
      findings.push({
        level: "low",
        title: "コメント",
        detail: `セルに ${commentCount} 件のコメントが残っています。`,
      });
    }
  }

  // --- 外部リンク ---
  const externalLinkFiles = Object.keys(zip.files).filter((n) =>
    /^xl\/externalLinks\/externalLink\d+\.xml$/.test(n)
  );
  if (externalLinkFiles.length > 0) {
    findings.push({
      level: "mid",
      title: "外部ファイルへの参照",
      detail: `他のExcelファイルへの参照が ${externalLinkFiles.length} 件あります。リンク削除は計算結果に影響する可能性があるため、Excel本体でリンク先を確認してください。`,
    });
  }

  // --- マクロ(VBA) ---
  const hasMacro = zip.files["xl/vbaProject.bin"] !== undefined;
  if (hasMacro) {
    findings.push({
      level: "mid",
      title: "マクロ(VBA)",
      detail: "マクロが含まれています。意図しない動作をするコードが残っていないか確認してください。",
    });
  }

  // --- 定義済み名前 ---
  if (workbookXml) {
    const definedNameCount = countMatches(/<definedName[^>]*>/g, workbookXml);
    if (definedNameCount > 0) {
      findings.push({
        level: "low",
        title: "定義済みの名前",
        detail: `セル範囲などに ${definedNameCount} 件の名前が定義されています。`,
      });
    }
  }

  return findings;
}
