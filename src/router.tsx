import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import type { User } from "./utils/auth";

// ==========================================
// 🔐 Router Context 型定義
// ==========================================
// 認証状態をグローバルに管理するためのContext
export interface RouterContext {
  auth: {
    user: User | null;
  };
}

export function getRouter() {
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    // ✅ グローバルなRouter Contextを設定
    // 初期値は未認証状態
    context: {
      auth: {
        user: null,
      },
    } satisfies RouterContext,
  });

  return router;
}

// ✅ 型推論のためのRouter型をエクスポート
declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
