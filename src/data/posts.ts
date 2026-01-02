// ==========================================
// 📝 投稿データ型定義（JSONPlaceholder API互換）
// ==========================================

// JSONPlaceholder /posts API のレスポンス型
export type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

// JSONPlaceholder /users API のレスポンス型
export type User = {
  id: number;
  name: string;
  username: string;
  email: string;
};

// 後方互換性のためのエイリアス（bodyをcontentとして扱う）
export type PostDetail = Post;

// ==========================================
// 📡 API Base URL
// ==========================================
export const API_BASE_URL = "https://jsonplaceholder.typicode.com";
