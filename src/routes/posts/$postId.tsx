import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { useAuth } from "../../utils/useAuth";

// ==========================================
// 📝 ダミーデータ（実際はDBから取得）
// ==========================================
const postsData: Record<
  string,
  { id: string; title: string; content: string; author: string; createdAt: string }
> = {
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

// ==========================================
// 🚀 ルート定義
// ==========================================
export const Route = createFileRoute("/posts/$postId")({
  // ⚠️ beforeLoadの認証チェックは削除（SSRではlocalStorageにアクセスできないため）
  // 認証チェックはコンポーネント内のuseEffectで行う

  // ✅ loader でデータ取得（サーバーサイド）
  loader: ({ params }) => {
    // ✅ params.postId は自動で string 型に推論される
    const post = postsData[params.postId];

    if (!post) {
      // ✅ notFound() で404を返す
      throw notFound();
    }

    return post;
  },

  // ✅ 404時のコンポーネント
  notFoundComponent: () => (
    <div className="py-12 text-center">
      <h1 className="text-2xl font-bold text-gray-900">投稿が見つかりません</h1>
      <p className="mt-2 text-gray-600">指定されたIDの投稿は存在しません。</p>
      <Link
        to="/posts"
        search={{ page: 1, q: "", sort: "newest" }}
        className="mt-4 inline-block rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        一覧に戻る
      </Link>
    </div>
  ),

  component: PostDetail,
});

// ==========================================
// 🎨 コンポーネント
// ==========================================
function PostDetail() {
  // ✅ params も完全に型安全
  const { postId } = Route.useParams();
  // 型: { postId: string }

  // ✅ loaderData も完全に型推論される
  const post = Route.useLoaderData();
  // 型: { id: string; title: string; content: string; author: string; createdAt: string }

  // ✅ useAuth フックで認証チェック（認証必須）
  const { user, isLoading } = useAuth({
    required: true,
    redirectTo: `/posts/${postId}`,
  });

  // ローディング中
  if (isLoading) {
    return (
      <div className="py-12 text-center">
        <p className="text-lg text-gray-600">認証を確認中...</p>
      </div>
    );
  }

  // 未認証（リダイレクト中）
  if (!user) {
    return null;
  }

  return (
    <article className="rounded-lg bg-white p-8 shadow-sm">
      {/* メタ情報 */}
      <div className="mb-6 flex items-center gap-4 text-sm text-gray-500">
        <span className="rounded-full bg-gray-100 px-3 py-1">ID: {postId}</span>
        <span>{post.author}</span>
        <span>{post.createdAt}</span>
      </div>

      {/* タイトル */}
      <h1 className="mb-6 text-3xl font-bold text-gray-900">{post.title}</h1>

      {/* 本文 */}
      <div className="prose prose-gray max-w-none whitespace-pre-wrap">{post.content}</div>

      {/* ナビゲーション */}
      <div className="mt-8 flex gap-4 border-t border-gray-200 pt-8">
        <Link
          to="/posts"
          search={{ page: 1, q: "", sort: "newest" }}
          className="rounded-md bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200"
        >
          ← 一覧に戻る
        </Link>

        {/* 前後の記事へのリンク（型安全なparamsデモ） */}
        {Number(postId) > 1 && (
          <Link
            to="/posts/$postId"
            params={{ postId: String(Number(postId) - 1) }}
            className="rounded-md bg-blue-100 px-4 py-2 text-blue-700 hover:bg-blue-200"
          >
            ← 前の記事
          </Link>
        )}
        {Number(postId) < 8 && (
          <Link
            to="/posts/$postId"
            params={{ postId: String(Number(postId) + 1) }}
            className="rounded-md bg-blue-100 px-4 py-2 text-blue-700 hover:bg-blue-200"
          >
            次の記事 →
          </Link>
        )}
      </div>

      {/* 💡 講座用: 型情報の表示 */}
      <div className="mt-8 rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4">
        <p className="mb-2 text-sm font-medium text-gray-700">📍 useParams() の値:</p>
        <code className="text-sm text-gray-600">{JSON.stringify({ postId }, null, 2)}</code>
        <p className="mt-4 text-xs text-gray-500">
          ✅ TypeScriptが自動で <code>{"{ postId: string }"}</code> と推論しています
        </p>
      </div>
    </article>
  );
}
