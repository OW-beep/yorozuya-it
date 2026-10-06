// AIチャットに貼り付ける前の「機微情報らしき文字列」チェッカー。
// すべてブラウザ内の正規表現処理で、入力テキストは外部に送信しません。
// あくまで機械的な目安であり、検出漏れ・誤検出があり得ます。

export type PasteLevel = "high" | "mid" | "low";

export type PasteFinding = {
  id: string;
  level: PasteLevel;
  label: string;
  count: number;
  samples: string[]; // 先頭数文字だけ見せる(伏せ字)
  guidance: string;
};

export type PasteResult = {
  findings: PasteFinding[];
  masked: string;
  length: number;
};

type Rule = {
  id: string;
  level: PasteLevel;
  label: string;
  regex: RegExp;
  mask?: string | ((m: string) => string);
  validate?: (m: string) => boolean;
  guidance: string;
};

function luhn(num: string): boolean {
  const digits = num.replace(/\D/g, "");
  if (digits.length < 13 || digits.length > 16) return false;
  let sum = 0;
  let alt = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = parseInt(digits[i], 10);
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}

const COMMON_TITLE_WORDS =
  /^(ご?担当者|関係者|責任者|管理者|代表者|利用者|参加者|ご?担当|各位|皆|お客)/;

const RULES: Rule[] = [
  {
    id: "apikey",
    level: "high",
    label: "APIキー・アクセストークンらしき文字列",
    regex:
      /\b(?:sk-[A-Za-z0-9_-]{16,}|AKIA[0-9A-Z]{16}|ghp_[A-Za-z0-9]{30,}|xox[abp]-[A-Za-z0-9-]{10,}|AIza[0-9A-Za-z_-]{30,})\b/g,
    mask: "[APIキー]",
    guidance:
      "キーやトークンは貼り付けた時点で第三者に渡ったものと考え、必要なら発行元で無効化(再発行)してください。コードを相談する時は、キー部分をダミーに置き換えてから貼ります。",
  },
  {
    id: "password",
    level: "high",
    label: "パスワード・暗証番号の記載",
    regex: /(?:パスワード|ﾊﾟｽﾜｰﾄﾞ|password|passwd|暗証番号)\s*[:：=は]\s*\S+/gi,
    mask: (m) => m.replace(/([:：=は]\s*)\S+$/, "$1[伏せ字]"),
    guidance:
      "パスワードや暗証番号は、AIに貼らないのが原則です。手順や設定を相談したい場合は、値を伏せて「パスワードを入力する」とだけ書けば十分に伝わります。",
  },
  {
    id: "card",
    level: "high",
    label: "クレジットカード番号らしき数字",
    regex: /\b(?:\d[ -]?){13,16}\b/g,
    validate: luhn,
    mask: "[カード番号]",
    guidance:
      "カード番号は入力しないでください。決済トラブルの相談でも、番号を書かずに状況だけ説明すれば回答は得られます。",
  },
  {
    id: "bank",
    level: "high",
    label: "口座番号らしき記載",
    regex: /口座番号\s*[:：]?\s*\d{6,8}/g,
    mask: "口座番号:[伏せ字]",
    guidance: "口座情報は貼らず、「口座情報(伏せ字)」のように置き換えてください。",
  },
  {
    id: "mynumber",
    level: "high",
    label: "マイナンバーらしき12桁の数字",
    regex: /(?<![\d-])\d{4}[ -]?\d{4}[ -]?\d{4}(?![\d-])/g,
    mask: "[12桁の数字]",
    guidance:
      "12桁の数字がマイナンバーとは限りませんが、該当する場合は絶対に貼らないでください。",
  },
  {
    id: "email",
    level: "mid",
    label: "メールアドレス",
    regex: /[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/g,
    mask: "[メールアドレス]",
    guidance:
      "メール文面の添削を頼む時は、宛先・署名のアドレスを「xxx@example.com」のようなダミーに置き換えるのが無難です。",
  },
  {
    id: "phone",
    level: "mid",
    label: "電話番号らしき文字列",
    regex: /0\d{1,4}[-ー−‐]\d{1,4}[-ー−‐]\d{3,4}|\b0[789]0\d{8}\b/g,
    mask: "[電話番号]",
    guidance: "電話番号は文章の理解にほぼ不要です。「(電話番号)」に置き換えてください。",
  },
  {
    id: "address",
    level: "mid",
    label: "住所らしき記載",
    regex:
      /(?:北海道|東京都|京都府|大阪府|[ぁ-んァ-ヶ一-龠]{2,3}県)[ぁ-んァ-ヶ一-龠ー]{1,12}?[市区町村][ぁ-んァ-ヶ一-龠ー0-9０-９\-丁目番地号の]{0,25}/g,
    mask: "[住所]",
    guidance:
      "住所は市区町村までに丸める、または伏せるのがおすすめです。個人宅や顧客先の住所は特に注意してください。",
  },
  {
    id: "postal",
    level: "low",
    label: "郵便番号らしき文字列",
    regex: /〒\s?\d{3}-?\d{4}|(?<![\d-])\d{3}-\d{4}(?![\d-])/g,
    mask: "[郵便番号]",
    guidance: "単体では影響は小さいですが、住所と組み合わさると個人の特定につながります。",
  },
  {
    id: "birth",
    level: "mid",
    label: "生年月日の記載",
    regex:
      /(?:生年月日|誕生日)\s*[:：]?\s*(?:(?:19|20)\d{2}[\/年.-]\d{1,2}[\/月.-]\d{1,2}日?|[昭平令][和成]?\S{0,6}?\d{1,2}年\d{1,2}月\d{1,2}日)/g,
    mask: "生年月日:[伏せ字]",
    guidance: "生年月日は本人確認にも使われる情報です。年代など粗い表現に置き換えてください。",
  },
  {
    id: "ip",
    level: "mid",
    label: "IPアドレス",
    regex: /\b(?:(?:25[0-5]|2[0-4]\d|1?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|1?\d?\d)\b/g,
    mask: "[IPアドレス]",
    guidance:
      "社内ネットワークの構成が推測される情報です。ログの相談では、IPを「10.x.x.x」などに丸めてから貼ります。",
  },
  {
    id: "internalhost",
    level: "mid",
    label: "社内ホスト名・ローカルURL",
    regex:
      /\b[\w-]+(?:\.[\w-]+)*\.(?:local|internal|corp|lan|intra)\b|https?:\/\/(?:localhost|192\.168\.|10\.|172\.(?:1[6-9]|2\d|3[01])\.)[^\s]*/gi,
    mask: "[社内URL]",
    guidance: "社内システムの名前やURLは、構成を知られる手がかりになります。汎用名に置き換えてください。",
  },
  {
    id: "honorific",
    level: "low",
    label: "氏名らしき記載(〇〇様・〇〇さん等)",
    regex: /[一-龠]{1,4}\s?[一-龠]{1,3}(?:様|殿|さん|氏|先生)/g,
    validate: (m) => !COMMON_TITLE_WORDS.test(m),
    mask: "[氏名]様",
    guidance:
      "実在の人名は「Aさん」「取引先担当者」などに置き換えても、文章の添削や要約にはほとんど影響しません。",
  },
  {
    id: "confidential",
    level: "mid",
    label: "機密を示す語(社外秘・取扱注意など)",
    regex:
      /社外秘|部外秘|極秘|機密|取り?扱い?注意|関係者限り|秘密保持|confidential|internal use only|\bNDA\b/gi,
    guidance:
      "資料に機密表示があるなら、AIに貼ってよいかを社内ルールで確認してください。許可されていない場合は貼らないのが原則です。",
  },
];

function maskSample(s: string): string {
  const t = s.replace(/\s+/g, " ").trim();
  if (t.length <= 3) return "＊＊＊";
  return t.slice(0, 3) + "＊".repeat(Math.min(t.length - 3, 8));
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function checkPaste(text: string, customTerms: string[] = []): PasteResult {
  const findings: PasteFinding[] = [];
  let working = text;

  const apply = (
    id: string,
    level: PasteLevel,
    label: string,
    regex: RegExp,
    guidance: string,
    mask?: string | ((m: string) => string),
    validate?: (m: string) => boolean
  ) => {
    const matches: string[] = [];
    const re = new RegExp(regex.source, regex.flags.includes("g") ? regex.flags : regex.flags + "g");
    working = working.replace(re, (m) => {
      if (validate && !validate(m)) return m;
      matches.push(m);
      if (mask === undefined) return m;
      return typeof mask === "function" ? mask(m) : mask;
    });
    if (matches.length > 0) {
      findings.push({
        id,
        level,
        label,
        count: matches.length,
        samples: Array.from(new Set(matches)).slice(0, 3).map(maskSample),
        guidance,
      });
    }
  };

  // ユーザー指定ワード(社名・案件名など)を最初に処理
  const terms = customTerms.map((t) => t.trim()).filter((t) => t.length >= 2);
  if (terms.length > 0) {
    const re = new RegExp(terms.map(escapeRegex).join("|"), "gi");
    apply(
      "custom",
      "mid",
      "あなたが指定したワード(社名・案件名など)",
      re,
      "指定したワードが含まれています。「A社」「案件X」などの仮名に置き換えて貼り直すと安心です。",
      "[伏せ字]"
    );
  }

  for (const r of RULES) {
    apply(r.id, r.level, r.label, r.regex, r.guidance, r.mask, r.validate);
  }

  const order: Record<PasteLevel, number> = { high: 0, mid: 1, low: 2 };
  findings.sort((a, b) => order[a.level] - order[b.level]);

  return { findings, masked: working, length: text.length };
}
