import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "../../utils/useAuth";

// ==========================================
// 🚀 ルート定義
// ==========================================
export const Route = createFileRoute("/dashboard/")({
  // ⚠️ beforeLoadは削除（SSRではlocalStorageにアクセスできないため）
  component: DashboardPage,
});

// ==========================================
// 🎨 ダッシュボードページ
// ==========================================
function DashboardPage() {
  const navigate = useNavigate();
  // ✅ useAuth フックで認証チェック（認証必須）
  const { user, isLoading, logout } = useAuth({
    required: true,
    redirectTo: "/dashboard",
  });

  // ローディング中
  if (isLoading) {
    return (
      <div className="grid min-h-screen place-items-center bg-linear-to-br from-indigo-50 to-purple-100">
        <div className="text-center">
          <p className="text-lg text-gray-600">認証を確認中...</p>
        </div>
      </div>
    );
  }

  // 未認証（リダイレクト中）
  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    // ホームにリダイレクト
    navigate({ to: "/" });
  };

  return (
    <div className="grid min-h-screen place-items-center bg-linear-to-br from-indigo-50 to-purple-100">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="mb-2 text-center text-3xl font-bold text-gray-900">ダッシュボード</h1>
        <p className="mb-8 text-center text-gray-600">認証が必要なページ</p>

        {/* ユーザー情報 */}
        <div className="mb-8 rounded-lg bg-indigo-50 p-6">
          <p className="mb-2 text-sm font-medium text-indigo-700">👤 ログイン中のユーザー:</p>
          <div className="space-y-2 text-indigo-900">
            <p>
              <span className="font-medium">名前:</span> {user.name}
            </p>
            <p>
              <span className="font-medium">メール:</span> {user.email}
            </p>
            <p>
              <span className="font-medium">ID:</span> {user.id}
            </p>
          </div>
        </div>

        {/* アクション */}
        <div className="flex flex-col gap-4">
          <button
            onClick={handleLogout}
            className="w-full rounded-lg bg-red-100 px-6 py-3 font-bold text-red-600 transition-colors hover:bg-red-200"
          >
            ログアウト
          </button>
        </div>

        {/* 講座用: 認証の説明 */}
        <div className="mt-8 space-y-4 rounded-lg border border-dashed border-indigo-300 bg-indigo-50 p-4">
          <div>
            <p className="text-sm font-medium text-indigo-700">🔐 JWT認証の実装方法:</p>
            <ul className="mt-2 space-y-1 text-sm text-indigo-600">
              <li>✅ ログイン時にJWTトークンをlocalStorageに保存</li>
              <li>
                ✅ <code>useEffect</code> でトークン検証（SSR後のハイドレーション時）
              </li>
              <li>✅ 未認証時は自動で /login にリダイレクト</li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-medium text-indigo-700">💡 テスト用アカウント:</p>
            <ul className="mt-2 space-y-1 text-sm text-indigo-600">
              <li>
                メール: <code>demo@example.com</code>
              </li>
              <li>
                パスワード: <code>password</code>
              </li>
            </ul>
          </div>
        </div>

        {/* 戻るリンク */}
        <div className="mt-8 text-center">
          <Link to="/" className="text-indigo-600 hover:underline">
            ← ホームに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
