import type { Post } from "../../data/posts";

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
 * 投稿を日付でソート
 */
export function sortPosts(posts: Post[], order: SortOrder): Post[] {
  return posts.toSorted((a, b) => {
    if (order === "newest") {
      return b.createdAt.localeCompare(a.createdAt);
    }
    return a.createdAt.localeCompare(b.createdAt);
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
