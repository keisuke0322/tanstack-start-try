import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { valibotValidator } from "@tanstack/valibot-adapter";
import { useState } from "react";
import * as v from "valibot";
import { loginFn } from "../../utils/auth";
import { setToken } from "../../utils/jwt-client";

// ==========================================
// 📋 Search Params スキーマ
// ==========================================
const loginSearchSchema = v.object({
  // リダイレクト先（ログイン後に戻る先）
  redirect: v.fallback(v.string(), "/dashboard"),
});

// ==========================================
// 🚀 ログインルート
// ==========================================
export const Route = createFileRoute("/login/")({
  validateSearch: valibotValidator(loginSearchSchema),
  component: LoginPage,
});

// ==========================================
// 🎨 ログインページ
// ==========================================
function LoginPage() {
  const { redirect: redirectTo } = Route.useSearch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("demo@example.com");
  const [password, setPassword] = useState("password");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await loginFn({ data: { email, password } });

      if (result.success && result.token) {
        // ✅ ログイン成功 → JWTトークンをlocalStorageに保存
        setToken(result.token);
        // ✅ 型安全なリダイレクト
        navigate({ to: redirectTo });
      } else {
        setError(result.error || "ログインに失敗しました");
      }
    } catch {
      setError("エラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-linear-to-br from-indigo-100 to-purple-100">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="mb-6 text-center text-3xl font-bold text-gray-900">ログイン</h1>

        {/* エラーメッセージ */}
        {error && <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-600">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* メールアドレス */}
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
              メールアドレス
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              required
            />
          </div>

          {/* パスワード */}
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
              パスワード
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              required
            />
          </div>

          {/* ログインボタン */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-indigo-600 py-3 font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "ログイン中..." : "ログイン"}
          </button>
        </form>

        {/* デモ用ヒント */}
        <div className="mt-6 rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4">
          <p className="text-sm font-medium text-gray-700">💡 デモ用認証情報:</p>
          <p className="mt-1 text-sm text-gray-600">
            Email: <code className="rounded bg-gray-200 px-1">demo@example.com</code>
          </p>
          <p className="text-sm text-gray-600">
            Password: <code className="rounded bg-gray-200 px-1">password</code>
          </p>
        </div>

        {/* Search Params表示 */}
        <div className="mt-4 rounded-lg border border-dashed border-indigo-300 bg-indigo-50 p-4">
          <p className="text-sm font-medium text-indigo-700">📍 Search Params:</p>
          <code className="text-sm text-indigo-600">{JSON.stringify({ redirect: redirectTo }, null, 2)}</code>
          <p className="mt-2 text-xs text-indigo-500">
            ログイン後、この URL にリダイレクトされます
          </p>
        </div>
      </div>
    </div>
  );
}
