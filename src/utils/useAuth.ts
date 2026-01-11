import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { type User, verifyAuthFn } from "./auth";
import { getToken, removeToken } from "./jwt-client";

// ==========================================
// 🔐 useAuth カスタムフック
// ==========================================

type UseAuthOptions = {
  required?: boolean;
  redirectTo?: string;
};

type UseAuthResult = {
  user: User | null;
  isLoading: boolean;
  logout: () => void;
};

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
          navigate({ to: "/login", search: { redirect: redirectTo } });
        }
        setIsLoading(false);
        return;
      }

      try {
        const result = await verifyAuthFn({ data: { token } });

        if (!result.user) {
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
