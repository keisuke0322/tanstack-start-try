# TanStack Start サンプルアプリ

[TanStack Start](https://tanstack.com/start) を使用した React フロントエンドアプリケーションのサンプルです。

## 🚀 デモ機能

| ページ       | 説明                                   |
| ------------ | -------------------------------------- |
| `/`          | ホームページ                           |
| `/counter`   | カウンター（状態管理のサンプル）       |
| `/posts`     | 投稿一覧（データフェッチのサンプル）   |
| `/posts/:id` | 投稿詳細（動的ルーティングのサンプル） |
| `/login`     | ログインページ（認証フローのサンプル） |
| `/dashboard` | ダッシュボード（認証必須ページ）       |

## 🛠️ 技術スタック

| カテゴリ       | 技術                                                                                                  |
| -------------- | ----------------------------------------------------------------------------------------------------- |
| フレームワーク | [TanStack Start](https://tanstack.com/start)                                                          |
| スタイリング   | [Tailwind CSS v4](https://tailwindcss.com/)                                                           |
| 言語           | [TypeScript Native Preview](https://devblogs.microsoft.com/typescript/typescript-native-port/)        |
| ビルド         | [Vite](https://vite.dev/)                                                                             |
| Lint/Format    | [oxlint](https://oxc.rs/docs/guide/usage/linter) / [oxfmt](https://oxc.rs/docs/guide/usage/formatter) |
| テスト         | [Vitest](https://vitest.dev/)（単体）/ [Playwright](https://playwright.dev/)（E2E）                   |
| ランタイム     | [Bun](https://bun.sh/)                                                                                |
| Git Hooks      | [Lefthook](https://github.com/evilmartians/lefthook)                                                  |

## 📦 セットアップ

### 必要なもの

- [Bun](https://bun.sh/)

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/lightsound/tanstack-start-start.git
cd tanstack-start-start

# 依存関係をインストール（Git Hooks も自動で設定されます）
bun install

# 開発サーバーを起動
bun run dev
```

ブラウザで http://localhost:3000 を開いてください。

## 📝 コマンド一覧

### 開発

| コマンド        | 説明                   |
| --------------- | ---------------------- |
| `bun run dev`   | 開発サーバーを起動     |
| `bun run build` | 本番用ビルド           |
| `bun run start` | ビルド結果をプレビュー |

### コード品質

| コマンド        | 説明                     |
| --------------- | ------------------------ |
| `bun run check` | Lint + Format チェック   |
| `bun run fix`   | Lint + Format の自動修正 |
| `bun run lint`  | Lint のみ実行            |
| `bun run fmt`   | Format チェックのみ実行  |

### テスト

| コマンド              | 説明                             |
| --------------------- | -------------------------------- |
| `bun run test`        | 単体テストを実行                 |
| `bun run test:watch`  | 単体テストをウォッチモードで実行 |
| `bun run test:e2e`    | E2E テストを実行                 |
| `bun run test:e2e:ui` | E2E テストを UI モードで実行     |

## 📁 プロジェクト構成

```
src/
├── router.tsx          # ルーター設定
├── routeTree.gen.ts    # 自動生成されるルートツリー（編集不可）
├── styles.css          # グローバルスタイル
├── routes/
│   ├── __root.tsx      # ルートレイアウト
│   ├── index.tsx       # / ページ
│   ├── counter/        # /counter ページ
│   ├── dashboard/      # /dashboard ページ（要認証）
│   ├── login/          # /login ページ
│   └── posts/          # /posts ページ群
└── utils/
    ├── auth.ts         # 認証ユーティリティ
    ├── jwt-client.ts   # JWT 処理（クライアント）
    └── useAuth.ts      # 認証カスタムフック
e2e/
├── home.spec.ts        # ホームページの E2E テスト
├── counter.spec.ts     # カウンターの E2E テスト
├── posts.spec.ts       # 投稿ページの E2E テスト
├── auth.spec.ts        # 認証フローの E2E テスト
└── 404.spec.ts         # 404 ページの E2E テスト
```

## ⚙️ VS Code 設定

### 推奨拡張機能

[oxc 拡張機能](https://marketplace.visualstudio.com/items?itemName=oxc.oxc-vscode) のインストールを推奨します。

### エディタ設定

`.vscode/settings.json` に以下の設定が含まれています：

- **保存時の自動フォーマット**: oxfmt がファイル保存時にコードを自動整形
- **読み取り専用ファイル**: 以下のファイルは編集不可に設定
  - `bun.lock` - 自動生成されるロックファイル
  - `**/routeTree.gen.ts` - TanStack Router が自動生成

## 🔧 Git Hooks

[Lefthook](https://github.com/evilmartians/lefthook) で Git Hooks を管理しています：

- **pre-commit**: ステージされたファイルに対して Lint/Format チェック
- **pre-push**: プッシュ前に全ファイルの Lint/Format チェック

## 🤖 GitHub Actions

`main` ブランチへのプッシュ・プルリクエスト時に自動で CI が実行されます。

| ワークフロー | 内容                                                                       |
| ------------ | -------------------------------------------------------------------------- |
| E2E Tests    | Playwright による E2E テストを実行し、レポートをアーティファクトとして保存 |

ワークフローファイル: [.github/workflows/e2e.yml](.github/workflows/e2e.yml)

## 📄 ライセンス

MIT License - [LICENSE.md](LICENSE.md) を参照してください。
