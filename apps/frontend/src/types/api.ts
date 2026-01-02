// ==========================================
// 📝 型定義は @tanstack-start-try/types から再エクスポート
// ==========================================
export type { Post, User, PostDetail } from "@tanstack-start-try/types";

// ==========================================
// 📡 API Base URL
// ==========================================
// サーバーサイドでは絶対URLが必要（loaderはSSRで実行される）
// クライアントサイドでは相対URLでOK（Viteのproxyが転送）
const getApiBaseUrl = () => {
  // サーバーサイド（SSR）の場合は絶対URLを使用
  if (typeof window === "undefined") {
    return process.env.API_BASE_URL || "http://localhost:3001/api";
  }
  // クライアントサイドの場合は相対URLを使用（Viteのproxyで転送）
  return "/api";
};

export const API_BASE_URL = getApiBaseUrl();
