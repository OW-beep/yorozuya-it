import JSZip from "jszip";

export type RiskLevel = "high" | "mid" | "low" | "ok";

export type Finding = {
  level: RiskLevel;
  title: string;
  detail: string;
  guidance?: string;
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
      guidance:
        "Excelで対象シートのタブを右クリック→「再表示」で中身を確認できます。他のシートから参照されている作業用データであれば、削除すると計算結果が崩れる可能性があるため、まず「本当に不要か」を確認してください。不要と判断できた場合のみ、シートごと削除してから保存し直すのが安全です。",
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
      guidance:
        "行番号が飛び飛びになっている箇所が、非表示になっている行です。該当する前後の行番号を選択して右クリック→「再表示」で内容を確認できます。他のセルの数式から参照されていないか確認したうえで、不要であれば行ごと削除、必要な行であれば表示したまま提出するのが安全です。",
    });
  }
  if (hiddenColCount > 0) {
    findings.push({
      level: "mid",
      title: "非表示の列",
      detail: `非表示になっている列が ${hiddenColCount} 件あります。`,
      guidance:
        "列も同様に、列番号(A, B, C…)が飛んでいる箇所が非表示列です。前後の列を選択して右クリック→「再表示」で中身を確認し、他の計算式から参照されていないかを確かめてから、削除するか表示したまま残すかを判断してください。",
    });
  }
  if (hyperlinkCount > 0) {
    findings.push({
      level: "low",
      title: "ハイパーリンク",
      detail: `シート内にハイパーリンクが ${hyperlinkCount} 件設定されています。リンク先が社内限定のフォルダ等になっていないか確認してください。`,
      guidance:
        "気になるセルを右クリック→「ハイパーリンクの削除」でリンクだけを解除できます(文字自体は残ります)。社内共有フォルダやイントラネットのURLが含まれていないか、リンクを一つずつクリックして確認するのがおすすめです。",
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
        guidance:
          "Excelの「検索と選択」(Ctrl+F)で該当しそうな文字列を検索すると、どのセルにあるかすぐ特定できます。テスト用のダミーデータや、提出先には不要な個人情報であれば、該当セルを削除するかマスキング(例:090-****-5678)してください。なお、これは正規表現による機械的な検出のため、実際には個人情報でない数字列(注文番号など)が誤って検出されることもあります。",
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
        guidance:
          "Excelのメニューから「ファイル」→「情報」→「プロパティ」→「詳細プロパティ」を開くと、作成者名を直接書き換えられます。空欄にすることも可能です。個人名を出したくない場合は、部署名など汎用的な表記に変更してから保存し直してください。",
      });
    }
    if (lastModifiedBy && lastModifiedBy !== creator) {
      findings.push({
        level: "low",
        title: "最終更新者情報",
        detail: `最終更新者として「${lastModifiedBy}」が記録されています。`,
        guidance:
          "作成者情報と同じく「ファイル」→「情報」→「プロパティ」から書き換えられます。最終更新者は、直近でそのファイルを保存した人の名前が自動的に記録される項目なので、共有元のパソコンのユーザー名によって意図せず記録されていることもあります。",
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
        guidance:
          "「ファイル」→「情報」→「プロパティ」→「詳細プロパティ」の「概要」タブに会社名の項目があります。社外秘の取引先名などが誤って入っていないか確認し、不要であれば空欄にしてください。",
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
        guidance:
          "「校閲」タブ→「コメントの表示」で内容を一覧確認できます。内部での確認用メモなど、社外に見せる必要のないコメントであれば、対象セルを右クリック→「コメントの削除」で消してください。",
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
      guidance:
        "「データ」タブ→「リンクの編集」から、参照先のファイル名とパスを確認できます。参照先が社内の共有フォルダなど、提出先が開けない・見せたくない場所を指している場合は、「リンクの解除」で数式を値に変換できます(ただし元の数式には戻せなくなる点に注意してください)。",
    });
  }

  // --- マクロ(VBA) ---
  const hasMacro = zip.files["xl/vbaProject.bin"] !== undefined;
  if (hasMacro) {
    findings.push({
      level: "mid",
      title: "マクロ(VBA)",
      detail: "マクロが含まれています。意図しない動作をするコードが残っていないか確認してください。",
      guidance:
        "「開発」タブ→「Visual Basic」を開くと、記述されているコードを確認できます(「開発」タブが表示されていない場合は「ファイル」→「オプション」→「リボンのユーザー設定」から表示できます)。マクロが不要であれば、「名前を付けて保存」の際にファイル形式を「Excelブック(.xlsx)」に変更して保存し直すと、マクロを含まない形式で書き出せます。",
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
        guidance:
          "「数式」タブ→「名前の管理」から、定義されている名前と参照範囲の一覧を確認できます。多くの場合は数式やグラフで使う無害な設定ですが、社内でのみ使う集計範囲名などが含まれていないか、念のため目を通しておくと安心です。",
      });
    }
  }

  return findings;
}
