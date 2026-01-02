import { Link, Outlet, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "../../utils/useAuth";

export const Route = createFileRoute("/posts")({
  // ⚠️ beforeLoadは削除（SSRではlocalStorageにアクセスできないため）
  component: PostsLayout,
});

function PostsLayout() {
  const navigate = useNavigate();
  // ✅ useAuth フックで認証チェック（認証任意）
  const { user, isLoading, logout } = useAuth({ required: false });

  const handleLogout = () => {
    logout();
    navigate({ to: "/posts", search: { page: 1, q: "", sort: "newest" } });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-4xl px-4 py-4">
          <nav className="flex items-center justify-between">
            {/* 左側: ナビゲーション */}
            <div className="flex items-center gap-6">
              <Link to="/" className="text-gray-600 transition-colors hover:text-gray-900">
                ← ホーム
              </Link>
              <Link
                to="/posts"
                search={{ page: 1, q: "", sort: "newest" }}
                activeOptions={{ exact: true }}
                className="font-semibold text-blue-600 [&.active]:underline"
              >
                投稿一覧
              </Link>
            </div>

            {/* 右側: ユーザー情報 or ログインリンク */}
            <div className="flex items-center gap-4">
              {isLoading ? (
                <span className="text-sm text-gray-400">読み込み中...</span>
              ) : user ? (
                <>
                  <span className="text-sm text-gray-600">👤 {user.name}</span>
                  <button
                    onClick={handleLogout}
                    className="rounded-md bg-red-100 px-3 py-1 text-sm text-red-600 hover:bg-red-200"
                  >
                    ログアウト
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  search={{ redirect: "/posts" }}
                  className="rounded-md bg-blue-100 px-3 py-1 text-sm text-blue-600 hover:bg-blue-200"
                >
                  ログイン
                </Link>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* コンテンツエリア */}
      <main className="mx-auto max-w-4xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
