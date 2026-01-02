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
  // サーバーサイド（SSR）の場合
  if (typeof window === "undefined") {
    // Vercel環境: VERCEL_URL を使用（Vercelが自動設定）
    const vercelUrl = process.env.VERCEL_URL;
    if (vercelUrl) {
      return `https://${vercelUrl}/api`;
    }
    // 明示的に設定された API_BASE_URL があれば使用
    if (process.env.API_BASE_URL) {
      return process.env.API_BASE_URL;
    }
    // ローカル開発環境
    return "http://localhost:3001/api";
  }
  // クライアントサイドの場合は相対URLを使用（Viteのproxyが転送）
  return "/api";
};

export const API_BASE_URL = getApiBaseUrl();
