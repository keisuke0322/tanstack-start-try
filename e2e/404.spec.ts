import { expect, test } from "@playwright/test";

test.describe("404ページ", () => {
  test("存在しないURLにアクセスすると404ページが表示される", async ({ page }) => {
    await page.goto("/this-page-does-not-exist");

    // 404メッセージが表示される
    await expect(page.getByRole("heading", { name: "404" })).toBeVisible();
  });

  test("存在しないネストされたURLでも404が表示される", async ({ page }) => {
    await page.goto("/some/deeply/nested/nonexistent/path");

    // 404メッセージが表示される
    await expect(page.getByRole("heading", { name: "404" })).toBeVisible();
  });
});
