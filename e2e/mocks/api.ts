import type { Page } from "@playwright/test";
import type { Post, User } from "@tanstack-start-try/types";

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
  { id: 1, name: "Leanne Graham", username: "Bret", email: "Sincere@april.biz" },
  { id: 2, name: "Ervin Howell", username: "Antonette", email: "Shanna@melissa.tv" },
  { id: 3, name: "Clementine Bauch", username: "Samantha", email: "Nathan@yesenia.net" },
  { id: 4, name: "Patricia Lebsack", username: "Karianne", email: "Julianne.OConner@kory.org" },
  { id: 5, name: "Chelsey Dietrich", username: "Kamren", email: "Lucio_Hettinger@annie.ca" },
  {
    id: 6,
    name: "Mrs. Dennis Schulist",
    username: "Leopoldo_Corkery",
    email: "Karley_Dach@jasper.info",
  },
  { id: 7, name: "Kurtis Weissnat", username: "Elwyn.Skiles", email: "Telly.Hoeger@billy.biz" },
  {
    id: 8,
    name: "Nicholas Runolfsdottir V",
    username: "Maxime_Nienow",
    email: "Sherwood@rosamond.me",
  },
  { id: 9, name: "Glenna Reichert", username: "Delphine", email: "Chaim_McDermott@dana.io" },
  {
    id: 10,
    name: "Clementina DuBuque",
    username: "Moriah.Stanton",
    email: "Rey.Padberg@karina.biz",
  },
];

// ==========================================
// 🔧 APIモック関数
// ==========================================

export async function mockJsonPlaceholderApi(page: Page) {
  await page.route("**/api/**", (route) => {
    const url = route.request().url();

    const postIdMatch = url.match(/\/api\/posts\/(\d+)$/);
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

    if (url.match(/\/api\/posts$/)) {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_POSTS),
      });
    }

    const userIdMatch = url.match(/\/api\/users\/(\d+)$/);
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

    if (url.match(/\/api\/users$/)) {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_USERS),
      });
    }

    return route.continue();
  });
}

export async function mockApiError(page: Page, statusCode: number = 500) {
  await page.route("**/api/**", (route) => {
    route.fulfill({
      status: statusCode,
      contentType: "application/json",
      body: JSON.stringify({ error: "Internal Server Error" }),
    });
  });
}

export async function mockApiWithDelay(page: Page, delayMs: number = 2000) {
  await page.route("**/api/posts", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(MOCK_POSTS),
    });
  });

  await page.route("**/api/users/*", async (route) => {
    const url = route.request().url();
    const userIdMatch = url.match(/\/users\/(\d+)/);
    const userId = userIdMatch ? Number(userIdMatch[1]) : null;
    const user = MOCK_USERS.find((u) => u.id === userId);

    await new Promise((resolve) => setTimeout(resolve, delayMs));
    route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(user) });
  });
}
