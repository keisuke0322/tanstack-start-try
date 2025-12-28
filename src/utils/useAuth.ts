import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { type User, verifyAuthFn } from "./auth";
import { getToken, removeToken } from "./jwt-client";

// ==========================================
// 🔐 useAuth カスタムフック
// ==========================================

type UseAuthOptions = {
  /**
   * 認証が必須かどうか
   * - true: 未認証時にログインページへリダイレクト
   * - false: 未認証でも表示（ユーザー情報は null）
   */
  required?: boolean;
  /**
   * 未認証時のリダイレクト先（required: true の場合に使用）
   * ログイン後にこのパスに戻ってくる
   */
  redirectTo?: string;
};

type UseAuthResult = {
  /** 認証済みユーザー情報（未認証時は null） */
  user: User | null;
  /** 認証チェック中かどうか */
  isLoading: boolean;
  /** ログアウト処理 */
  logout: () => void;
};

/**
 * JWT認証の共通処理を行うカスタムフック
 *
 * @example
 * // 認証必須のページ
 * const { user, isLoading, logout } = useAuth({
 *   required: true,
 *   redirectTo: "/dashboard"
 * });
 *
 * @example
 * // 認証任意のページ（ユーザー情報表示のみ）
 * const { user, isLoading, logout } = useAuth({ required: false });
 */
export function useAuth(options: UseAuthOptions = {}): UseAuthResult {
  const { required = true, redirectTo } = options;
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken();

      if (!token) {
        if (required && redirectTo) {
          // 認証必須かつリダイレクト先が指定されている場合
          navigate({ to: "/login", search: { redirect: redirectTo } });
        }
        setIsLoading(false);
        return;
      }

      try {
        // サーバーでトークンを検証
        const result = await verifyAuthFn({ data: { token } });

        if (!result.user) {
          // トークンが無効な場合は削除
          removeToken();
          if (required && redirectTo) {
            navigate({ to: "/login", search: { redirect: redirectTo } });
          }
        } else {
          setUser(result.user);
        }
      } catch (error) {
        console.error("認証エラー:", error);
        removeToken();
        if (required && redirectTo) {
          navigate({ to: "/login", search: { redirect: redirectTo } });
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate, required, redirectTo]);

  const logout = () => {
    removeToken();
    setUser(null);
  };

  return { user, isLoading, logout };
}
