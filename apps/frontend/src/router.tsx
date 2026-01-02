import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import type { User } from "./utils/auth";

// ==========================================
// 🔐 Router Context 型定義
// ==========================================
// 認証状態とQueryClientをグローバルに管理するためのContext
export interface RouterContext {
  auth: {
    user: User | null;
  };
  queryClient: QueryClient;
}

export function getRouter() {
  // ✅ QueryClientを作成（SSR対応のためRouterごとに作成）
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5分間キャッシュを新鮮とみなす
        retry: 1, // リトライ回数
      },
    },
  });

  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    // ✅ グローバルなRouter Contextを設定
    // 初期値は未認証状態 + QueryClient
    context: {
      auth: {
        user: null,
      },
      queryClient,
    } satisfies RouterContext,
    // ✅ QueryClientProviderでラップ
    Wrap: ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
  });

  return router;
}

// ✅ 型推論のためのRouter型をエクスポート
declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
