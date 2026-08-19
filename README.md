# よろずやIT

ITの「わからない」を解決する辞書・QAメディア。Next.js (App Router) + Tailwind CSS + Markdown記事構成。

## ローカルで動かす

```bash
npm install
npm run dev
```

http://localhost:3000 で確認できます。

## 記事の追加方法

`content/posts/` フォルダに `.md` ファイルを1つ追加するだけで、自動的にサイトに反映されます。

例: `content/posts/wifi-tsunagaranai.md`

```markdown
---
title: "Wi-Fiに繋がらない時に確認すべき5つのこと"
category: "PC・スマホ"
date: "2026-07-09"
excerpt: "つながらない原因は意外と単純。まず確認したいポイントをまとめました。"
---

## 本文をここに書く

Markdown記法がそのまま使えます。
```

- `title` : 記事タイトル
- `category` : カテゴリ名(PC・スマホ / アプリ / 用語辞典 / プログラミング など自由に追加可)
- `date` : `YYYY-MM-DD` 形式。新しい日付順にトップ・一覧に並びます
- `excerpt` : 一覧やトップページに表示される要約文

ファイル名がそのままURL(`/posts/ファイル名`)になります。

## Vercelへのデプロイ

### 方法A: GitHub経由(おすすめ)

1. このフォルダの中身をGitHubの新規リポジトリにpush
2. [vercel.com](https://vercel.com) にログイン (GitHubアカウントでOK)
3. 「Add New Project」→ 対象のリポジトリを選択 → 「Deploy」

以降は記事を追加してGitHubにpushするだけで、Vercelが自動的に再デプロイしてくれます。

### 方法B: Vercel CLI

```bash
npm install -g vercel
vercel
```

質問に答えていけばそのままデプロイされます。

## AdSense申請前に必ずやること

- 独自ドメインを取得して接続する(`xxxx.vercel.app` のままだと審査に通りにくいことがあります)
- プライバシーポリシーページを追加する
- 記事を最低10〜20本程度は公開しておく
