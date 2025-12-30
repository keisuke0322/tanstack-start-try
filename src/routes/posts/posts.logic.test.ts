import { describe, expect, it } from "vitest";
import { DUMMY_POSTS, getPostById } from "../../data/posts";
import { DEFAULT_PAGE_SIZE, filterPosts, loadPosts, paginatePosts, sortPosts } from "./posts.logic";

describe("posts utility functions", () => {
  describe("filterPosts", () => {
    it("should return all posts when query is empty", () => {
      const result = filterPosts(DUMMY_POSTS, "");
      expect(result).toHaveLength(8);
    });

    it("should filter posts by title (case insensitive)", () => {
      const result = filterPosts(DUMMY_POSTS, "tanstack");
      expect(result).toHaveLength(2);
      expect(result.every((p) => p.title.toLowerCase().includes("tanstack"))).toBe(true);
    });

    it("should return empty when no posts match", () => {
      const result = filterPosts(DUMMY_POSTS, "存在しない検索語");
      expect(result).toHaveLength(0);
    });

    it("should filter by partial match", () => {
      const result = filterPosts(DUMMY_POSTS, "SSR");
      expect(result).toHaveLength(1);
      expect(result[0]?.title).toBe("SSRとストリーミング");
    });
  });

  describe("sortPosts", () => {
    it("should sort by newest first", () => {
      const result = sortPosts(DUMMY_POSTS, "newest");
      expect(result[0]?.createdAt).toBe("2025-12-27");
      expect(result[1]?.createdAt).toBe("2025-12-26");
      expect(result[2]?.createdAt).toBe("2025-12-25");
    });

    it("should sort by oldest first", () => {
      const result = sortPosts(DUMMY_POSTS, "oldest");
      expect(result[0]?.createdAt).toBe("2025-12-20");
      expect(result[1]?.createdAt).toBe("2025-12-21");
      expect(result[2]?.createdAt).toBe("2025-12-22");
    });

    it("should not mutate original array", () => {
      const original = [...DUMMY_POSTS];
      sortPosts(DUMMY_POSTS, "newest");
      expect(DUMMY_POSTS).toEqual(original);
    });
  });

  describe("paginatePosts", () => {
    it("should return correct number of posts per page", () => {
      const result = paginatePosts(DUMMY_POSTS, 1);
      expect(result.posts).toHaveLength(DEFAULT_PAGE_SIZE);
    });

    it("should calculate total pages correctly", () => {
      const result = paginatePosts(DUMMY_POSTS, 1);
      // 8 posts / 3 per page = 3 pages (ceiling)
      expect(result.totalPages).toBe(3);
    });

    it("should return correct posts for page 2", () => {
      const sorted = sortPosts(DUMMY_POSTS, "oldest");
      const page1 = paginatePosts(sorted, 1);
      const page2 = paginatePosts(sorted, 2);

      // Page 1: posts 1, 2, 3
      // Page 2: posts 4, 5, 6
      expect(page1.posts[0]?.id).toBe("1");
      expect(page2.posts[0]?.id).toBe("4");
    });

    it("should return remaining posts on last page", () => {
      const sorted = sortPosts(DUMMY_POSTS, "oldest");
      const result = paginatePosts(sorted, 3);
      // 8 posts total, page 3 should have 2 posts (7, 8)
      expect(result.posts).toHaveLength(2);
    });

    it("should return empty for page beyond total", () => {
      const result = paginatePosts(DUMMY_POSTS, 10);
      expect(result.posts).toHaveLength(0);
    });

    it("should support custom page size", () => {
      const result = paginatePosts(DUMMY_POSTS, 1, 5);
      expect(result.posts).toHaveLength(5);
      expect(result.totalPages).toBe(2);
    });
  });

  describe("loadPosts", () => {
    it("should combine filtering, sorting, and pagination", () => {
      const result = loadPosts(DUMMY_POSTS, { page: 1, q: "", sort: "newest" });

      expect(result.totalCount).toBe(8);
      expect(result.totalPages).toBe(3);
      expect(result.currentPage).toBe(1);
      expect(result.posts).toHaveLength(DEFAULT_PAGE_SIZE);
      expect(result.posts[0]?.createdAt).toBe("2025-12-27");
    });

    it("should paginate filtered results", () => {
      // "Router" で検索 -> 2件マッチ (型安全性, TanStack Query)
      const result = loadPosts(DUMMY_POSTS, { page: 1, q: "Router", sort: "newest" });
      expect(result.totalCount).toBe(2);
      expect(result.totalPages).toBe(1);
    });

    it("should track current page correctly", () => {
      const result = loadPosts(DUMMY_POSTS, { page: 2, q: "", sort: "newest" });
      expect(result.currentPage).toBe(2);
    });
  });
});

describe("getPostById", () => {
  it("should return post when it exists", () => {
    const post = getPostById("1");
    expect(post).not.toBeNull();
    expect(post?.title).toBe("TanStack Routerの型安全性について");
  });

  it("should return null for non-existent post", () => {
    const post = getPostById("999");
    expect(post).toBeNull();
  });

  it("should return correct author", () => {
    const post = getPostById("2");
    expect(post?.author).toBe("佐藤花子");
  });

  it("should return content field", () => {
    const post = getPostById("1");
    expect(post?.content).toContain("TanStack Routerは、TypeScriptとの統合が非常に優れています");
  });
});
