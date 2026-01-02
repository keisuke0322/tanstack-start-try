// ==========================================
// posts/ のロジックテスト
// ==========================================
// 注意: posts のロジックテストは以下のファイルに移動しました:
// - src/utils/posts.test.ts (filterPosts, sortPosts, paginatePosts, loadPosts)
// - src/data/posts.ts (getPostById)
//
// このファイルは E2E テストで posts ページの統合テストを
// 行う場合に使用してください。
//
// ロジックの単体テストを実行するには:
// bun test src/utils/posts.test.ts

import { describe, it, expect } from "vitest";

describe("posts", () => {
  it("hello world", () => {
    expect(1 + 1).toBe(2);
  });
});
