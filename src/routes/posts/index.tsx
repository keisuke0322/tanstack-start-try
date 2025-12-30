import { Link, createFileRoute, stripSearchParams, useNavigate } from "@tanstack/react-router";
import { valibotValidator } from "@tanstack/valibot-adapter";
import * as v from "valibot";
import { DUMMY_POSTS } from "../../data/posts";
import { DEFAULT_PAGE_SIZE, loadPosts } from "./posts.logic";

// ==========================================
// 📚 Search Params のスキーマ定義（Valibot）
// ==========================================

// ✅ デフォルト値を定義（stripSearchParamsで使用）
const defaultSearchValues = {
  page: 1,
  q: "",
  sort: "newest" as const,
};

const postsSearchSchema = v.object({
  // ページ番号（デフォルト: 1）
  page: v.fallback(v.pipe(v.number(), v.minValue(1)), defaultSearchValues.page),
  // 検索キーワード（デフォルト: 空文字）
  q: v.fallback(v.string(), defaultSearchValues.q),
  // ソート順（デフォルト: "newest"）
  sort: v.fallback(v.picklist(["newest", "oldest"]), defaultSearchValues.sort),
});

// ==========================================
// 🚀 ルート定義
// ==========================================
export const Route = createFileRoute("/posts/")({
  // ✅ Valibotでsearch paramsをバリデーション
  validateSearch: valibotValidator(postsSearchSchema),

  // ✅ stripSearchParams: デフォルト値と一致するパラメータはURLから削除
  // 例: /posts?page=1&q=&sort=newest → /posts（クリーンなURL！）
  search: {
    middlewares: [stripSearchParams(defaultSearchValues)],
  },

  // ✅ Search Paramsが変わったらloaderを再実行
  loaderDeps: ({ search }) => ({
    page: search.page,
    q: search.q,
    sort: search.sort,
  }),

  // ✅ データ取得（サーバーサイドで実行）
  loader: ({ deps }) => {
    return loadPosts(DUMMY_POSTS, deps, DEFAULT_PAGE_SIZE);
  },

  component: PostsIndex,
});

// ==========================================
// 🎨 コンポーネント
// ==========================================
function PostsIndex() {
  // ✅ 完全に型安全！ PostsSearch 型が自動推論される
  const { page, q, sort } = Route.useSearch();

  // ✅ loaderの戻り値も型推論される
  const { posts, totalPages, currentPage, totalCount } = Route.useLoaderData();

  // ✅ 型安全なナビゲーション用
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">投稿一覧</h1>
        <span className="text-sm text-gray-500">{totalCount}件の投稿</span>
      </div>

      {/* 🔍 検索・フィルター */}
      <div className="flex flex-wrap gap-4 rounded-lg bg-white p-4 shadow-sm">
        {/* 検索ボックス */}
        <div className="flex-1">
          <label htmlFor="search" className="mb-1 block text-sm font-medium text-gray-700">
            キーワード検索
          </label>
          <input
            id="search"
            type="text"
            defaultValue={q}
            placeholder="タイトルで検索..."
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const value = e.currentTarget.value;
                // ✅ 検索時はページを1に戻す（型安全なナビゲーション）
                navigate({
                  to: "/posts",
                  search: { q: value, page: 1, sort },
                });
              }
            }}
          />
        </div>

        {/* ソート */}
        <div>
          <label htmlFor="sort" className="mb-1 block text-sm font-medium text-gray-700">
            並び順
          </label>
          <div className="flex gap-2">
            <Link
              to="/posts"
              search={{ page: 1, q, sort: "newest" }}
              className={`rounded-md px-3 py-2 text-sm ${
                sort === "newest"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              新しい順
            </Link>
            <Link
              to="/posts"
              search={{ page: 1, q, sort: "oldest" }}
              className={`rounded-md px-3 py-2 text-sm ${
                sort === "oldest"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              古い順
            </Link>
          </div>
        </div>
      </div>

      {/* 📄 投稿リスト */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <p className="py-8 text-center text-gray-500">投稿が見つかりませんでした</p>
        ) : (
          posts.map((post) => (
            <Link
              key={post.id}
              // ✅ 型安全: 存在しないパラメータはエラーになる
              to="/posts/$postId"
              params={{ postId: post.id }}
              className="block rounded-lg bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <h2 className="text-xl font-semibold text-gray-900">{post.title}</h2>
              <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                <span>{post.author}</span>
                <span>{post.createdAt}</span>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* 📑 ページネーション */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {/* 前へ */}
          {currentPage > 1 ? (
            <Link
              to="/posts"
              search={{ page: currentPage - 1, q, sort }}
              className="rounded-md bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200"
            >
              ← 前へ
            </Link>
          ) : (
            <span className="cursor-not-allowed rounded-md bg-gray-50 px-4 py-2 text-gray-400">
              ← 前へ
            </span>
          )}

          {/* ページ番号 */}
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <Link
                key={pageNum}
                to="/posts"
                search={{ page: pageNum, q, sort }}
                className={`rounded-md px-4 py-2 ${
                  pageNum === currentPage
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {pageNum}
              </Link>
            ))}
          </div>

          {/* 次へ */}
          {currentPage < totalPages ? (
            <Link
              to="/posts"
              search={{ page: currentPage + 1, q, sort }}
              className="rounded-md bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200"
            >
              次へ →
            </Link>
          ) : (
            <span className="cursor-not-allowed rounded-md bg-gray-50 px-4 py-2 text-gray-400">
              次へ →
            </span>
          )}
        </div>
      )}

      {/* 💡 講座用: 現在のSearch Params表示 */}
      <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4">
        <p className="mb-2 text-sm font-medium text-gray-700">📍 現在のSearch Params:</p>
        <code className="text-sm text-gray-600">{JSON.stringify({ page, q, sort }, null, 2)}</code>
        <p className="mt-3 text-xs text-gray-500">
          💡 <strong>stripSearchParams</strong>: デフォルト値（page=1, q="",
          sort="newest"）はURLから自動削除されます
        </p>
      </div>
    </div>
  );
}
