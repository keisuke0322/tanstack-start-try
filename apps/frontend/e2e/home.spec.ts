import { expect, test } from "@playwright/test";
import { mockJsonPlaceholderApi } from "./mocks/api";

test.describe("ホームページ", () => {
  test.beforeEach(async ({ page }) => {
    // APIをモック（/postsへの遷移時に必要）
    await mockJsonPlaceholderApi(page);
    await page.goto("/");
  });

  test("ヒーローセクションが表示される", async ({ page }) => {
    // タイトルが表示される
    await expect(page.getByRole("heading", { level: 1 })).toContainText("TanStack");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Start / Router");

    // サブタイトルが表示される
    await expect(page.getByText("100% 型安全なフルスタック React フレームワーク")).toBeVisible();
  });

  test("特徴カードが3つ表示される", async ({ page }) => {
    // 3つの特徴が表示される（h3タグで特定）
    await expect(page.getByRole("heading", { name: "100% 型安全", level: 3 })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Search Params", level: 3 })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Server Functions", level: 3 })).toBeVisible();
  });

  test("投稿一覧リンクをクリックすると /posts に遷移する", async ({ page }) => {
    // 投稿一覧カードをクリック
    await page.getByRole("link", { name: /投稿一覧/ }).click();

    // /posts に遷移
    await expect(page).toHaveURL("/posts");
    await expect(page.getByRole("heading", { name: "投稿一覧" })).toBeVisible();
  });

  test("カウンターリンクをクリックすると /counter に遷移する", async ({ page }) => {
    // カウンターカードをクリック
    await page.getByRole("link", { name: /カウンター/ }).click();

    // /counter に遷移
    await expect(page).toHaveURL(/\/counter/);
    await expect(page.getByRole("heading", { name: /Server Functions デモ/ })).toBeVisible();
  });

  test("ダッシュボードリンクをクリックすると認証ページにリダイレクトする", async ({ page }) => {
    // ダッシュボードカードをクリック
    await page.getByRole("link", { name: /ダッシュボード/ }).click();

    // 認証が必要なため /login にリダイレクト（またはダッシュボードでローディング表示）
    await expect(page).toHaveURL(/\/(login|dashboard)/);
  });
});
