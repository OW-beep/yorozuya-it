import JSZip from "jszip";
import {
  Finding,
  PII_PATTERNS,
  analyzeXlsx,
  countMatches,
  getText,
} from "@/lib/excelAnalyzer";

export type OfficeKind = "xlsx" | "docx" | "pptx";

export function detectKind(fileName: string): OfficeKind | null {
  const m = fileName.toLowerCase().match(/\.(xlsx|docx|pptx)$/);
  return m ? (m[1] as OfficeKind) : null;
}

export const KIND_LABELS: Record<OfficeKind, string> = {
  xlsx: "Excel",
  docx: "Word",
  pptx: "PowerPoint",
};

// ---------- 共通ヘルパー ----------

function unique(arr: string[]): string[] {
  return Array.from(new Set(arr.filter((a) => a && a.trim().length > 0)));
}

function xmlUnescape(s: string): string {
  return s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");
}

// <a:t> / <w:t> のテキストを連結して返す
function extractText(xml: string, tag: "a:t" | "w:t"): string {
  const re = new RegExp(`<${tag}(?:\\s[^>]*)?>([^<]*)</${tag}>`, "g");
  const out: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml)) !== null) out.push(xmlUnescape(m[1]));
  return out.join(" ");
}

function piiFindings(text: string): Finding[] {
  const findings: Finding[] = [];
  for (const pattern of PII_PATTERNS) {
    const count = countMatches(pattern.regex, text);
    if (count > 0) {
      findings.push({
        level: "high",
        title: `個人情報の可能性がある文字列(${pattern.label})`,
        detail: `${pattern.label}に一致する文字列を ${count} 件検出しました。内容を確認してください。`,
        guidance:
          "Ctrl+F(Macは⌘+F)で該当しそうな文字列を検索すると、どこにあるかすぐ特定できます。提出先に不要な個人情報であれば削除するか、マスキング(例:090-****-5678)してください。正規表現による機械的な検出のため、個人情報でない数字列(注文番号など)が候補に挙がることもあります。",
      });
    }
  }
  return findings;
}

async function metaFindings(zip: JSZip, app: "Word" | "PowerPoint"): Promise<Finding[]> {
  const findings: Finding[] = [];
  const inspect = `「ファイル」→「情報」→「問題のチェック」→「ドキュメント検査」を実行すると、${app}の公式機能で作成者情報などをまとめて削除できます。`;

  const coreXml = await zip.file("docProps/core.xml")?.async("string");
  if (coreXml) {
    const creator = getText(coreXml, "dc:creator");
    const lastModifiedBy = getText(coreXml, "cp:lastModifiedBy");
    if (creator) {
      findings.push({
        level: "low",
        title: "作成者情報",
        detail: `作成者として「${creator}」が記録されています。`,
        guidance: `個人名を出したくない場合は、部署名など汎用的な表記に変更してから保存し直してください。${inspect}`,
      });
    }
    if (lastModifiedBy && lastModifiedBy !== creator) {
      findings.push({
        level: "low",
        title: "最終更新者情報",
        detail: `最終更新者として「${lastModifiedBy}」が記録されています。`,
        guidance: `最終更新者は、直近でファイルを保存した人の名前が自動的に記録される項目です。${inspect}`,
      });
    }
  }

  const appXml = await zip.file("docProps/app.xml")?.async("string");
  if (appXml) {
    const company = getText(appXml, "Company");
    if (company && company.trim().length > 0) {
      findings.push({
        level: "low",
        title: "会社名の記録",
        detail: `文書のプロパティに会社名「${company}」が記録されています。`,
        guidance: `社外秘の取引先名などが誤って入っていないか確認してください。${inspect}`,
      });
    }
  }
  return findings;
}

// リレーションファイルから外部リンクの宛先を集める
async function externalTargets(zip: JSZip, relPathRegex: RegExp): Promise<string[]> {
  const files = Object.keys(zip.files).filter((n) => relPathRegex.test(n));
  const targets: string[] = [];
  for (const f of files) {
    const xml = await zip.file(f)?.async("string");
    if (!xml) continue;
    const re = /<Relationship\b[^>]*>/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(xml)) !== null) {
      const tag = m[0];
      if (!/TargetMode="External"/.test(tag)) continue;
      const t = tag.match(/Target="([^"]*)"/);
      if (t) targets.push(xmlUnescape(t[1]));
    }
  }
  return targets;
}

const INTERNAL_TARGET =
  /^file:|^\\\\|^[A-Za-z]:\\|localhost|\b192\.168\.|\b10\.\d+\.\d+\.\d+|\.(?:local|internal|corp|lan|intra)\b/i;

function linkFindings(targets: string[]): Finding[] {
  const findings: Finding[] = [];
  const internal = targets.filter((t) => INTERNAL_TARGET.test(t));
  const mailto = targets.filter((t) => /^mailto:/i.test(t));
  if (internal.length > 0) {
    findings.push({
      level: "high",
      title: "社内パス・ローカルファイルへのリンク",
      detail: `社内の共有フォルダやローカルファイルを指している可能性のあるリンクが ${internal.length} 件あります。`,
      guidance:
        "リンクを右クリック→「ハイパーリンクの削除」で解除できます(文字は残ります)。提出先が開けないだけでなく、社内のフォルダ構成が分かってしまうことがあります。",
    });
  }
  const others = targets.length - internal.length;
  if (others > 0) {
    findings.push({
      level: "low",
      title: "外部へのリンク",
      detail: `ハイパーリンクなどの外部参照が ${others} 件あります${
        mailto.length > 0 ? `(うちメールアドレスへのリンク ${mailto.length} 件)` : ""
      }。`,
      guidance:
        "リンク先が意図したURLか、社内限定のページや個人のページでないかを一つずつ確認してください。",
    });
  }
  return findings;
}

function authorsFrom(xml: string, attr: string): string[] {
  const re = new RegExp(`${attr}="([^"]*)"`, "g");
  const out: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml)) !== null) out.push(xmlUnescape(m[1]));
  return unique(out);
}

// ---------- Word (.docx) ----------

export async function analyzeDocx(zip: JSZip): Promise<Finding[]> {
  const findings: Finding[] = [];

  const docXml = (await zip.file("word/document.xml")?.async("string")) ?? "";
  const partFiles = Object.keys(zip.files).filter((n) =>
    /^word\/(?:document|header\d*|footer\d*|footnotes|endnotes)\.xml$/.test(n)
  );

  let allText = "";
  let insCount = 0;
  let delCount = 0;
  let vanishCount = 0;
  let revisionAuthors: string[] = [];
  for (const f of partFiles) {
    const xml = (await zip.file(f)?.async("string")) ?? "";
    allText += extractText(xml, "w:t") + " ";
    // <w:ins ...> / <w:del ...>(w:delText や w:insideH は含まない)
    insCount += countMatches(/<w:ins\s[^>]*>/g, xml);
    delCount += countMatches(/<w:del\s[^>]*>/g, xml);
    vanishCount += countMatches(/<w:vanish(?![^>]*w:val="(?:0|false)")[^>]*\/?>/g, xml);
    const revTags = xml.match(/<w:(?:ins|del)\s[^>]*>/g) || [];
    revisionAuthors = revisionAuthors.concat(authorsFrom(revTags.join(" "), "w:author"));
  }
  revisionAuthors = unique(revisionAuthors);

  if (insCount + delCount > 0) {
    findings.push({
      level: "high",
      title: "変更履歴(修正の記録)が残っています",
      detail: `追加 ${insCount} 件・削除 ${delCount} 件の変更履歴があります${
        revisionAuthors.length > 0 ? `(記録されている修正者:${revisionAuthors.join("、")})` : ""
      }。削除したはずの文章が、履歴として残っている可能性があります。`,
      guidance:
        "Wordの「校閲」タブで内容を確認し、「承諾」→「すべての変更を反映」(または「元に戻す」から拒否)で確定してください。確定したら「変更履歴の記録」をオフにして保存し直します。",
    });
  }

  const commentsXml = await zip.file("word/comments.xml")?.async("string");
  if (commentsXml) {
    const n = countMatches(/<w:comment\s[^>]*>/g, commentsXml);
    if (n > 0) {
      const authors = authorsFrom(commentsXml, "w:author");
      findings.push({
        level: "mid",
        title: "コメント",
        detail: `${n} 件のコメントが残っています${
          authors.length > 0 ? `(投稿者:${authors.join("、")})` : ""
        }。社内のやり取りや確認メモが含まれていないか確認してください。`,
        guidance:
          "「校閲」タブでコメントを一覧確認し、不要なら「削除」→「ドキュメント内のすべてのコメントを削除」で消せます。",
      });
    }
    allText += extractText(commentsXml, "w:t") + " ";
  }

  if (vanishCount > 0) {
    findings.push({
      level: "mid",
      title: "隠し文字(非表示にした文字)",
      detail: `非表示に設定された文字が ${vanishCount} か所あります。画面や印刷では見えなくても、ファイルには残っています。`,
      guidance:
        "「ファイル」→「オプション」→「表示」で「隠し文字」にチェックを入れると表示されます。不要な文章なら削除してください。",
    });
  }

  const embeds = Object.keys(zip.files).filter(
    (n) => /^word\/embeddings\//.test(n) && !zip.files[n].dir
  );
  if (embeds.length > 0) {
    findings.push({
      level: "mid",
      title: "埋め込まれたファイル・オブジェクト",
      detail: `文書内に別ファイル(Excelの表など)が ${embeds.length} 件埋め込まれています。見えている部分以外のデータが一緒に入っている可能性があります。`,
      guidance:
        "埋め込みオブジェクトをダブルクリックすると元データを開けます。見せる必要があるのが表示部分だけなら、図として貼り付け直すと元データを残さずに済みます。",
    });
  }

  if (zip.files["word/vbaProject.bin"]) {
    findings.push({
      level: "mid",
      title: "マクロ(VBA)",
      detail: "マクロが含まれています。意図しないコードが残っていないか確認してください。",
    });
  }

  findings.push(
    ...linkFindings(await externalTargets(zip, /^word\/_rels\/(?:document|header\d*|footer\d*)\.xml\.rels$/))
  );
  findings.push(...piiFindings(allText));
  findings.push(...(await metaFindings(zip, "Word")));
  return findings;
}

// ---------- PowerPoint (.pptx) ----------

export async function analyzePptx(zip: JSZip): Promise<Finding[]> {
  const findings: Finding[] = [];

  const slideFiles = Object.keys(zip.files).filter((n) => /^ppt\/slides\/slide\d+\.xml$/.test(n));
  let allText = "";
  const hiddenSlides: number[] = [];
  for (const f of slideFiles) {
    const xml = (await zip.file(f)?.async("string")) ?? "";
    allText += extractText(xml, "a:t") + " ";
    if (/<p:sld\b[^>]*\sshow="(?:0|false)"/.test(xml)) {
      const num = f.match(/slide(\d+)\.xml/);
      if (num) hiddenSlides.push(parseInt(num[1], 10));
    }
  }
  if (hiddenSlides.length > 0) {
    hiddenSlides.sort((a, b) => a - b);
    findings.push({
      level: "high",
      title: "非表示スライド",
      detail: `非表示に設定されたスライドが ${hiddenSlides.length} 枚あります(ファイル内の番号:${hiddenSlides.join("、")})。発表では出ませんが、ファイルを渡すと誰でも見られます。`,
      guidance:
        "スライド一覧で番号に斜線が入っているスライドが該当します。「スライドショー」タブの「非表示スライドに設定」で切り替えるか、不要なら削除してください。",
    });
  }

  // 発表者ノート(スライド番号のフィールドは除外して判定)
  const noteFiles = Object.keys(zip.files).filter((n) =>
    /^ppt\/notesSlides\/notesSlide\d+\.xml$/.test(n)
  );
  let noteSlides = 0;
  let noteChars = 0;
  for (const f of noteFiles) {
    const xml = (await zip.file(f)?.async("string")) ?? "";
    const stripped = xml.replace(/<a:fld\b[\s\S]*?<\/a:fld>/g, "");
    const text = extractText(stripped, "a:t").trim();
    if (text.length > 0) {
      noteSlides++;
      noteChars += text.length;
      allText += text + " ";
    }
  }
  if (noteSlides > 0) {
    findings.push({
      level: "high",
      title: "発表者ノート",
      detail: `${noteSlides} 枚のスライドに発表者ノートが入っています(合計 約${noteChars}文字)。話す内容のメモや社内向けの注意書きが、そのまま渡ってしまうことがあります。`,
      guidance:
        "「表示」→「ノート」で内容を確認してください。「ファイル」→「情報」→「問題のチェック」→「ドキュメント検査」の「プレゼンテーションノート」から一括削除もできます。",
    });
  }

  // コメント(従来型・モダン型)
  const commentFiles = Object.keys(zip.files).filter((n) =>
    /^ppt\/comments\/[^/]+\.xml$/.test(n)
  );
  let commentCount = 0;
  for (const f of commentFiles) {
    const xml = (await zip.file(f)?.async("string")) ?? "";
    commentCount += countMatches(/<(?:p|p188):cm\s[^>]*>/g, xml);
    allText += extractText(xml, "a:t") + " ";
  }
  if (commentCount > 0) {
    let names: string[] = [];
    const legacy = await zip.file("ppt/commentAuthors.xml")?.async("string");
    if (legacy) names = names.concat(authorsFrom(legacy, "name"));
    const modern = await zip.file("ppt/authors.xml")?.async("string");
    if (modern) names = names.concat(authorsFrom(modern, "name"));
    names = unique(names);
    findings.push({
      level: "mid",
      title: "コメント",
      detail: `${commentCount} 件のコメントが残っています${
        names.length > 0 ? `(投稿者:${names.join("、")})` : ""
      }。`,
      guidance: "「校閲」タブでコメントを一覧確認し、不要なものは「削除」で消してください。",
    });
  }

  // 埋め込み(グラフの元データなど)
  const embeds = Object.keys(zip.files).filter(
    (n) => /^ppt\/embeddings\//.test(n) && !zip.files[n].dir
  );
  if (embeds.length > 0) {
    findings.push({
      level: "mid",
      title: "グラフの元データ・埋め込みファイル",
      detail: `スライド内に Excel などのデータが ${embeds.length} 件埋め込まれています。グラフの場合、画面に出ていない行や列の数値も一緒に入っていることがあります。`,
      guidance:
        "グラフを右クリック→「データの編集」で元データを確認できます。元データを渡したくない場合は、グラフをコピーして「貼り付けのオプション」から「図」として貼り直してください(以降は数値の編集ができなくなります)。",
    });
  }

  if (zip.files["ppt/vbaProject.bin"]) {
    findings.push({
      level: "mid",
      title: "マクロ(VBA)",
      detail: "マクロが含まれています。意図しないコードが残っていないか確認してください。",
    });
  }

  findings.push(
    ...linkFindings(await externalTargets(zip, /^ppt\/(?:slides|slideMasters|slideLayouts|notesSlides)\/_rels\/[^/]+\.rels$/))
  );
  findings.push(...piiFindings(allText));
  findings.push(...(await metaFindings(zip, "PowerPoint")));
  return findings;
}

// ---------- 入口 ----------

export async function analyzeZip(zip: JSZip, kind: OfficeKind): Promise<Finding[]> {
  if (kind === "docx") return analyzeDocx(zip);
  if (kind === "pptx") return analyzePptx(zip);
  throw new Error("xlsx は analyzeXlsx を使用してください");
}

export async function analyzeOffice(file: File): Promise<Finding[]> {
  const kind = detectKind(file.name);
  if (kind === "xlsx") return analyzeXlsx(file);
  if (kind === "docx" || kind === "pptx") {
    const zip = await JSZip.loadAsync(file);
    return analyzeZip(zip, kind);
  }
  throw new Error("unsupported");
}
