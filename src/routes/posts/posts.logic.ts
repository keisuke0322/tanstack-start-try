import { queryOptions } from "@tanstack/react-query";
import { type Post, type User } from "@tanstack-start-try/types";

// Helper: resolve API URL depending on runtime (client vs server)
function apiUrl(path: string) {
  if (typeof window === "undefined") {
    // SSR/runtime: use API_ORIGIN env if provided, otherwise default to localhost:3001
    const origin = process.env.API_ORIGIN ?? "http://localhost:3001";
    return `${origin}${path}`;
  }
  // client: use relative path so Vite proxy can handle it
  return path;
}

// ==========================================
// 📚 投稿リスト操作の純粋関数
// ==========================================

export type SortOrder = "newest" | "oldest";

export const DEFAULT_PAGE_SIZE = 3;

export type LoadPostsParams = {
  page: number;
  q: string;
  sort: SortOrder;
};

export type LoadPostsResult = {
  posts: Post[];
  totalPages: number;
  currentPage: number;
  totalCount: number;
};

// ==========================================
// 📡 TanStack Query Options
// ==========================================

/**
 * 全投稿を取得するQueryOptions
 */
export const postsQueryOptions = queryOptions({
  queryKey: ["posts"],
  queryFn: async () => {
    // APIサーバーから投稿データを取得
    const res = await fetch(apiUrl("/api/posts"));
    if (!res.ok) throw new Error("投稿データの取得に失敗しました");
    const posts = (await res.json()) as Post[];
    return posts;
  },
  staleTime: 1000 * 60 * 5, // 5分
});

/**
 * 個別投稿を取得するQueryOptions
 */
export const postQueryOptions = (postId: number) =>
  queryOptions({
    queryKey: ["posts", postId],
    queryFn: async () => {
      // APIサーバーから個別投稿を取得
      const res = await fetch(apiUrl(`/api/posts/${postId}`));
      if (!res.ok) throw new Error("投稿が見つかりません");
      const post = (await res.json()) as Post;
      return post;
    },
    staleTime: 1000 * 60 * 5, // 5分
  });

/**
 * 個別ユーザーを取得するQueryOptions
 */
export const userQueryOptions = (userId: number) =>
  queryOptions({
    queryKey: ["users", userId],
    queryFn: async () => {
      // APIからユーザー情報を取得
      const res = await fetch(apiUrl(`/api/users/${userId}`));
      // 404（ユーザー未登録）の場合はエラーにせず、表示用のフォールバックユーザーを返す
      if (res.status === 404) {
        return {
          id: userId,
          name: "不明なユーザー",
          username: "unknown",
          email: "",
        } as User;
      }

      if (!res.ok) throw new Error("ユーザー情報の取得に失敗しました");

      const user = (await res.json()) as User;
      return user;
    },
    staleTime: 1000 * 60 * 10, // 10分（ユーザー情報は変わりにくい）
  });

// ==========================================
// 📚 投稿リスト操作の純粋関数
// ==========================================

/**
 * タイトルで投稿をフィルタリング（大文字小文字を無視）
 */
export function filterPosts(posts: Post[], query: string): Post[] {
  if (!query) {
    return posts;
  }
  const lowerQuery = query.toLowerCase();
  return posts.filter((post) => post.title.toLowerCase().includes(lowerQuery));
}

/**
 * 投稿をIDでソート（JSONPlaceholderにはcreatedAtがないため）
 * newest: IDが大きい順（新しい投稿）
 * oldest: IDが小さい順（古い投稿）
 */
export function sortPosts(posts: Post[], order: SortOrder): Post[] {
  return posts.toSorted((a: Post, b: Post) => {
    if (order === "newest") {
      return b.id - a.id;
    }
    return a.id - b.id;
  });
}

/**
 * 投稿をページネーション
 */
export function paginatePosts(
  posts: Post[],
  page: number,
  pageSize: number = DEFAULT_PAGE_SIZE,
): { posts: Post[]; totalPages: number } {
  const totalPages = Math.ceil(posts.length / pageSize);
  const start = (page - 1) * pageSize;
  const paginatedPosts = posts.slice(start, start + pageSize);

  return {
    posts: paginatedPosts,
    totalPages,
  };
}

/**
 * ページネーションのウィンドウを計算
 * 現在のページを中央に配置し、windowSize個のページ番号を返す
 */
export function getPageWindow(
  currentPage: number,
  totalPages: number,
  windowSize: number = 5,
): number[] {
  if (totalPages <= windowSize) {
    // 総ページ数がウィンドウサイズ以下なら全て表示
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // 中央に配置するための計算
  const half = Math.floor(windowSize / 2);
  let start = currentPage - half;
  let end = currentPage + half;

  // 開始位置が1未満の場合は調整
  if (start < 1) {
    start = 1;
    end = windowSize;
  }

  // 終了位置が総ページ数を超える場合は調整
  if (end > totalPages) {
    end = totalPages;
    start = totalPages - windowSize + 1;
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

/**
 * 投稿一覧を取得（フィルタリング + ソート + ページネーション）
 */
export function loadPosts(
  allPosts: Post[],
  params: LoadPostsParams,
  pageSize: number = DEFAULT_PAGE_SIZE,
): LoadPostsResult {
  // 1. フィルタリング
  const filtered = filterPosts(allPosts, params.q);

  // 2. ソート
  const sorted = sortPosts(filtered, params.sort);

  // 3. ページネーション
  const { posts, totalPages } = paginatePosts(sorted, params.page, pageSize);

  return {
    posts,
    totalPages,
    currentPage: params.page,
    totalCount: filtered.length,
  };
}
