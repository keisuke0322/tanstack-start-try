import type { Page } from "@playwright/test";
import type { Post, User } from "../../src/data/posts";

// ==========================================
// 📦 モックデータ
// ==========================================

export const MOCK_POSTS: Post[] = [
  { userId: 1, id: 1, title: "テスト投稿1", body: "テスト投稿1の本文です。" },
  { userId: 1, id: 2, title: "テスト投稿2", body: "テスト投稿2の本文です。" },
  { userId: 2, id: 3, title: "テスト投稿3", body: "テスト投稿3の本文です。" },
  { userId: 2, id: 4, title: "検索テスト投稿", body: "検索用のテスト投稿です。" },
  { userId: 3, id: 5, title: "別のテスト投稿", body: "別のテスト投稿の本文です。" },
  { userId: 3, id: 6, title: "React入門", body: "Reactの基本について解説します。" },
  { userId: 1, id: 7, title: "TypeScript入門", body: "TypeScriptの基本について解説します。" },
  {
    userId: 2,
    id: 8,
    title: "TanStack Router入門",
    body: "TanStack Routerの基本について解説します。",
  },
];

export const MOCK_USERS: User[] = [
  { id: 1, name: "テストユーザー1", username: "user1", email: "user1@example.com" },
  { id: 2, name: "テストユーザー2", username: "user2", email: "user2@example.com" },
  { id: 3, name: "テストユーザー3", username: "user3", email: "user3@example.com" },
  { id: 4, name: "テストユーザー4", username: "user4", email: "user4@example.com" },
  { id: 5, name: "テストユーザー5", username: "user5", email: "user5@example.com" },
  { id: 6, name: "テストユーザー6", username: "user6", email: "user6@example.com" },
  { id: 7, name: "テストユーザー7", username: "user7", email: "user7@example.com" },
  { id: 8, name: "テストユーザー8", username: "user8", email: "user8@example.com" },
  { id: 9, name: "テストユーザー9", username: "user9", email: "user9@example.com" },
  { id: 10, name: "テストユーザー10", username: "user10", email: "user10@example.com" },
];

// ==========================================
// 🔧 APIモック関数
// ==========================================

/**
 * JSONPlaceholder APIをモックする
 * page.route() を使用してAPIリクエストをインターセプト
 */
export async function mockJsonPlaceholderApi(page: Page) {
  // 全てのjsonplaceholder APIリクエストをインターセプト（より柔軟なパターン）
  await page.route(/jsonplaceholder\.typicode\.com/, (route) => {
    const url = route.request().url();

    // 個別投稿API: /posts/{id}
    const postIdMatch = url.match(/\/posts\/(\d+)$/);
    if (postIdMatch) {
      const postId = Number(postIdMatch[1]);
      const post = MOCK_POSTS.find((p) => p.id === postId);
      if (post) {
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(post),
        });
      }
      return route.fulfill({
        status: 404,
        contentType: "application/json",
        body: JSON.stringify({ error: "Not found" }),
      });
    }

    // 投稿一覧API: /posts
    if (url.match(/\/posts$/)) {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_POSTS),
      });
    }

    // 個別ユーザーAPI: /users/{id}
    const userIdMatch = url.match(/\/users\/(\d+)$/);
    if (userIdMatch) {
      const userId = Number(userIdMatch[1]);
      const user = MOCK_USERS.find((u) => u.id === userId);
      if (user) {
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(user),
        });
      }
      return route.fulfill({
        status: 404,
        contentType: "application/json",
        body: JSON.stringify({ error: "Not found" }),
      });
    }

    // ユーザー一覧API: /users
    if (url.match(/\/users$/)) {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_USERS),
      });
    }

    // マッチしないリクエストはそのまま通す
    return route.continue();
  });
}

/**
 * APIエラーをシミュレートする
 */
export async function mockApiError(page: Page, statusCode: number = 500) {
  await page.route("**/jsonplaceholder.typicode.com/**", (route) => {
    route.fulfill({
      status: statusCode,
      contentType: "application/json",
      body: JSON.stringify({ error: "Internal Server Error" }),
    });
  });
}

/**
 * API遅延をシミュレートする
 */
export async function mockApiWithDelay(page: Page, delayMs: number = 2000) {
  await page.route("**/jsonplaceholder.typicode.com/posts", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(MOCK_POSTS),
    });
  });

  await page.route("**/jsonplaceholder.typicode.com/users/*", async (route) => {
    const url = route.request().url();
    const userIdMatch = url.match(/\/users\/(\d+)/);
    const userId = userIdMatch ? Number(userIdMatch[1]) : null;
    const user = MOCK_USERS.find((u) => u.id === userId);

    await new Promise((resolve) => setTimeout(resolve, delayMs));
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(user),
    });
  });
}
