import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { POSTS_DETAIL } from "../../data/posts";
import { useAuth } from "../../utils/useAuth";

// ==========================================
// 🚀 ルート定義
// ==========================================
export const Route = createFileRoute("/posts/$postId")({
  // ⚠️ beforeLoadの認証チェックは削除（SSRではlocalStorageにアクセスできないため）
  // 認証チェックはコンポーネント内のuseEffectで行う

  // ✅ loader でデータ取得（サーバーサイド）
  loader: ({ params }) => {
    // ✅ params.postId は自動で string 型に推論される
    const post = POSTS_DETAIL[params.postId];

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
