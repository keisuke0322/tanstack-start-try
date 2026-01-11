import { describe, expect, it } from "vitest";
import { type Post } from "@tanstack-start-try/types";
import {
  DEFAULT_PAGE_SIZE,
  filterPosts,
  getPageWindow,
  loadPosts,
  paginatePosts,
  sortPosts,
} from "./posts.logic";

// テスト用のモックデータ（JSONPlaceholder互換）
const MOCK_POSTS: Post[] = [
  { userId: 1, id: 1, title: "TanStack Routerの型安全性について", body: "本文1" },
  { userId: 1, id: 2, title: "Search Paramsをステート管理として使う", body: "本文2" },
  { userId: 2, id: 3, title: "Server Functionsの基本", body: "本文3" },
  { userId: 2, id: 4, title: "Valibotでバリデーション", body: "本文4" },
  { userId: 3, id: 5, title: "認証パターンの実装", body: "本文5" },
  { userId: 3, id: 6, title: "TanStack QueryとRouterの連携", body: "本文6" },
  { userId: 1, id: 7, title: "ファイルベースルーティング入門", body: "本文7" },
  { userId: 2, id: 8, title: "SSRとストリーミング", body: "本文8" },
];

describe("posts utility functions", () => {
  describe("filterPosts", () => {
    it("should return all posts when query is empty", () => {
      const result = filterPosts(MOCK_POSTS, "");
      expect(result).toHaveLength(8);
    });

    it("should filter posts by title (case insensitive)", () => {
      const result = filterPosts(MOCK_POSTS, "tanstack");
      expect(result).toHaveLength(2);
      expect(result.every((p) => p.title.toLowerCase().includes("tanstack"))).toBe(true);
    });

    it("should return empty when no posts match", () => {
      const result = filterPosts(MOCK_POSTS, "存在しない検索語");
      expect(result).toHaveLength(0);
    });

    it("should filter by partial match", () => {
      const result = filterPosts(MOCK_POSTS, "SSR");
      expect(result).toHaveLength(1);
      expect(result[0]?.title).toBe("SSRとストリーミング");
    });
  });

  describe("sortPosts", () => {
    it("should sort by newest first (higher id)", () => {
      const result = sortPosts(MOCK_POSTS, "newest");
      expect(result[0]?.id).toBe(8);
      expect(result[1]?.id).toBe(7);
      expect(result[2]?.id).toBe(6);
    });

    it("should sort by oldest first (lower id)", () => {
      const result = sortPosts(MOCK_POSTS, "oldest");
      expect(result[0]?.id).toBe(1);
      expect(result[1]?.id).toBe(2);
      expect(result[2]?.id).toBe(3);
    });

    it("should not mutate original array", () => {
      const original = [...MOCK_POSTS];
      sortPosts(MOCK_POSTS, "newest");
      expect(MOCK_POSTS).toEqual(original);
    });
  });

  describe("paginatePosts", () => {
    it("should return correct number of posts per page", () => {
      const result = paginatePosts(MOCK_POSTS, 1);
      expect(result.posts).toHaveLength(DEFAULT_PAGE_SIZE);
    });

    it("should calculate total pages correctly", () => {
      const result = paginatePosts(MOCK_POSTS, 1);
      // 8 posts / 3 per page = 3 pages (ceiling)
      expect(result.totalPages).toBe(3);
    });

    it("should return correct posts for page 2", () => {
      const sorted = sortPosts(MOCK_POSTS, "oldest");
      const page1 = paginatePosts(sorted, 1);
      const page2 = paginatePosts(sorted, 2);

      // Page 1: posts 1, 2, 3
      // Page 2: posts 4, 5, 6
      expect(page1.posts[0]?.id).toBe(1);
      expect(page2.posts[0]?.id).toBe(4);
    });

    it("should return remaining posts on last page", () => {
      const sorted = sortPosts(MOCK_POSTS, "oldest");
      const result = paginatePosts(sorted, 3);
      // 8 posts total, page 3 should have 2 posts (7, 8)
      expect(result.posts).toHaveLength(2);
    });

    it("should return empty for page beyond total", () => {
      const result = paginatePosts(MOCK_POSTS, 10);
      expect(result.posts).toHaveLength(0);
    });

    it("should support custom page size", () => {
      const result = paginatePosts(MOCK_POSTS, 1, 5);
      expect(result.posts).toHaveLength(5);
      expect(result.totalPages).toBe(2);
    });
  });

  describe("loadPosts", () => {
    it("should combine filtering, sorting, and pagination", () => {
      const result = loadPosts(MOCK_POSTS, { page: 1, q: "", sort: "newest" });

      expect(result.totalCount).toBe(8);
      expect(result.totalPages).toBe(3);
      expect(result.currentPage).toBe(1);
      expect(result.posts).toHaveLength(DEFAULT_PAGE_SIZE);
      expect(result.posts[0]?.id).toBe(8);
    });

    it("should paginate filtered results", () => {
      // "Router" で検索 -> 2件マッチ (型安全性, TanStack Query)
      const result = loadPosts(MOCK_POSTS, { page: 1, q: "Router", sort: "newest" });
      expect(result.totalCount).toBe(2);
      expect(result.totalPages).toBe(1);
    });

    it("should track current page correctly", () => {
      const result = loadPosts(MOCK_POSTS, { page: 2, q: "", sort: "newest" });
      expect(result.currentPage).toBe(2);
    });
  });

  describe("getPageWindow", () => {
    it("should return all pages when totalPages <= windowSize", () => {
      const result = getPageWindow(2, 3, 5);
      expect(result).toEqual([1, 2, 3]);
    });

    it("should return 5 pages when totalPages > 5", () => {
      const result = getPageWindow(5, 20, 5);
      expect(result).toHaveLength(5);
    });

    it("should center current page in the middle", () => {
      const result = getPageWindow(10, 20, 5);
      expect(result).toEqual([8, 9, 10, 11, 12]);
    });

    it("should handle first page (start boundary)", () => {
      const result = getPageWindow(1, 20, 5);
      expect(result).toEqual([1, 2, 3, 4, 5]);
    });

    it("should handle second page (near start)", () => {
      const result = getPageWindow(2, 20, 5);
      expect(result).toEqual([1, 2, 3, 4, 5]);
    });

    it("should handle last page (end boundary)", () => {
      const result = getPageWindow(20, 20, 5);
      expect(result).toEqual([16, 17, 18, 19, 20]);
    });

    it("should handle second to last page (near end)", () => {
      const result = getPageWindow(19, 20, 5);
      expect(result).toEqual([16, 17, 18, 19, 20]);
    });

    it("should use default windowSize of 5", () => {
      const result = getPageWindow(10, 20);
      expect(result).toHaveLength(5);
      expect(result).toEqual([8, 9, 10, 11, 12]);
    });

    it("should handle custom windowSize", () => {
      const result = getPageWindow(5, 10, 3);
      expect(result).toEqual([4, 5, 6]);
    });
  });
});
