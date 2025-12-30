// ==========================================
// 📝 投稿データ（実際はDBから取得）
// ==========================================

export type Post = {
  id: string;
  title: string;
  author: string;
  createdAt: string;
};

export type PostDetail = Post & {
  content: string;
};

// 投稿一覧用のダミーデータ
export const DUMMY_POSTS: Post[] = [
  {
    id: "1",
    title: "TanStack Routerの型安全性について",
    author: "田中太郎",
    createdAt: "2025-12-20",
  },
  {
    id: "2",
    title: "Search Paramsをステート管理として使う",
    author: "佐藤花子",
    createdAt: "2025-12-21",
  },
  { id: "3", title: "Server Functionsの基本", author: "鈴木一郎", createdAt: "2025-12-22" },
  { id: "4", title: "Valibotでバリデーション", author: "高橋美咲", createdAt: "2025-12-23" },
  { id: "5", title: "認証パターンの実装", author: "山田健太", createdAt: "2025-12-24" },
  { id: "6", title: "TanStack QueryとRouterの連携", author: "伊藤さくら", createdAt: "2025-12-25" },
  { id: "7", title: "ファイルベースルーティング入門", author: "渡辺翔", createdAt: "2025-12-26" },
  { id: "8", title: "SSRとストリーミング", author: "中村優子", createdAt: "2025-12-27" },
];

// 投稿詳細用のダミーデータ
export const POSTS_DETAIL: Record<string, PostDetail> = {
  "1": {
    id: "1",
    title: "TanStack Routerの型安全性について",
    content: `
TanStack Routerは、TypeScriptとの統合が非常に優れています。

## 主な特徴

1. **パラメータの型推論**: \`useParams()\` で取得するパラメータは自動で型が付きます
2. **Search Paramsの型安全**: バリデーションスキーマから型が推論されます
3. **Loaderデータの型推論**: \`useLoaderData()\` の戻り値も完全に型安全です
4. **Linkコンポーネントの型チェック**: 存在しないルートへのリンクはコンパイルエラーになります

これにより、ランタイムエラーを大幅に減らすことができます。
    `.trim(),
    author: "田中太郎",
    createdAt: "2025-12-20",
  },
  "2": {
    id: "2",
    title: "Search Paramsをステート管理として使う",
    content: `
TanStack Routerでは、URL Search ParamsをReactのstateのように扱えます。

## なぜURL Search Paramsが良いのか？

1. **状態の共有**: URLを共有すれば、同じ状態を再現できる
2. **ブラウザ履歴**: 戻る/進むボタンで状態を復元できる
3. **ブックマーク可能**: 特定の状態をブックマークできる
4. **SSR対応**: サーバーサイドでも状態を把握できる

\`validateSearch\` と \`loaderDeps\` を組み合わせることで、
Search Paramsの変更に応じてデータを再取得できます。
    `.trim(),
    author: "佐藤花子",
    createdAt: "2025-12-21",
  },
  "3": {
    id: "3",
    title: "Server Functionsの基本",
    content: `
TanStack Startでは、\`createServerFn\` を使って型安全なRPCを実現できます。

## Server Functionsとは？

クライアントから呼び出せるサーバーサイドの関数です。
Next.jsのServer Actionsに似ていますが、より明示的な設計になっています。

\`\`\`typescript
const getUser = createServerFn({ method: 'GET' })
  .inputValidator((id: string) => id)
  .handler(async ({ data }) => {
    return await db.users.findById(data)
  })
\`\`\`

クライアントからは普通の関数のように呼び出せます。
    `.trim(),
    author: "鈴木一郎",
    createdAt: "2025-12-22",
  },
  "4": {
    id: "4",
    title: "Valibotでバリデーション",
    content: `
TanStack RouterはValibotとの統合をサポートしています。

## Valibotの特徴

1. **軽量**: Zodよりも小さいバンドルサイズ
2. **高速**: 実行時のパフォーマンスが優れている
3. **型推論**: TypeScriptとの相性が良い

\`\`\`typescript
import * as v from "valibot"
import { valibotValidator } from "@tanstack/valibot-adapter"

const schema = v.object({
  page: v.fallback(v.number(), 1),
  q: v.fallback(v.string(), ""),
})

validateSearch: valibotValidator(schema)
\`\`\`
    `.trim(),
    author: "高橋美咲",
    createdAt: "2025-12-23",
  },
  "5": {
    id: "5",
    title: "認証パターンの実装",
    content: `
TanStack Routerでは、\`beforeLoad\` を使って認証チェックを行います。

## パスレスレイアウト

\`_authenticated.tsx\` のようなアンダースコア始まりのファイルは、
URLに影響を与えない「パスレスレイアウト」として機能します。

\`\`\`typescript
// _authenticated.tsx
beforeLoad: async ({ location }) => {
  const user = await getCurrentUser()
  if (!user) {
    throw redirect({
      to: '/login',
      search: { redirect: location.href }
    })
  }
  return { user }
}
\`\`\`

子ルートは自動的に認証チェックが適用されます。
    `.trim(),
    author: "山田健太",
    createdAt: "2025-12-24",
  },
  "6": {
    id: "6",
    title: "TanStack QueryとRouterの連携",
    content: `
TanStack RouterとTanStack Queryは非常に相性が良いです。

## 統合のメリット

1. **プリフェッチ**: ルート遷移前にデータを先読み
2. **キャッシュ共有**: Router loaderとQueryでキャッシュを共有
3. **楽観的更新**: Mutationと組み合わせて即座にUIを更新

\`\`\`typescript
loader: ({ context }) =>
  context.queryClient.ensureQueryData(postsQueryOptions())
\`\`\`
    `.trim(),
    author: "伊藤さくら",
    createdAt: "2025-12-25",
  },
  "7": {
    id: "7",
    title: "ファイルベースルーティング入門",
    content: `
TanStack Routerはファイル構造からルートを自動生成します。

## ファイル命名規則

- \`index.tsx\` → \`/\`
- \`posts.tsx\` → \`/posts\` (レイアウト)
- \`posts.index.tsx\` → \`/posts\` (インデックス)
- \`posts.$postId.tsx\` → \`/posts/:postId\`
- \`_layout.tsx\` → パスレスレイアウト

型定義は \`routeTree.gen.ts\` に自動生成されます。
    `.trim(),
    author: "渡辺翔",
    createdAt: "2025-12-26",
  },
  "8": {
    id: "8",
    title: "SSRとストリーミング",
    content: `
TanStack Startは、SSRとストリーミングをサポートしています。

## 特徴

1. **フルドキュメントSSR**: ページ全体をサーバーでレンダリング
2. **ストリーミング**: 部分的にコンテンツを送信
3. **選択的SSR**: ルートごとにSSRの有効/無効を設定可能

\`\`\`typescript
export const Route = createFileRoute('/canvas')({
  ssr: false, // クライアントのみでレンダリング
})
\`\`\`
    `.trim(),
    author: "中村優子",
    createdAt: "2025-12-27",
  },
};

// 投稿IDから詳細を取得
export function getPostById(postId: string): PostDetail | null {
  return POSTS_DETAIL[postId] ?? null;
}
