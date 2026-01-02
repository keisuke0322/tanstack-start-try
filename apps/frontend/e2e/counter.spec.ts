import { expect, test } from "@playwright/test";

test.describe("カウンターページ", () => {
  // カウンターはサーバー状態を共有するため、シリアル実行
  test.describe.configure({ mode: "serial" });

  test.beforeEach(async ({ page }) => {
    await page.goto("/counter");
    // ページ読み込み完了を待つ
    await page.waitForLoadState("networkidle");
  });

  test("カウンターページが正しく表示される", async ({ page }) => {
    // タイトルが表示される
    await expect(page.getByRole("heading", { name: /Server Functions デモ/ })).toBeVisible();

    // 説明文が表示される
    await expect(page.getByText("サーバーサイドでファイルに保存されるカウンター")).toBeVisible();

    // count.txt に保存されていることが表示される
    await expect(page.getByText("count.txt")).toBeVisible();
  });

  test("リセット→+1でカウントが1になる", async ({ page }) => {
    const countDisplay = page.locator(".text-8xl");

    // リセットボタンをクリック
    await page.getByRole("button", { name: /リセット/ }).click();
    // UIが更新されるまで待つ
    await expect(countDisplay).toHaveText("0", { timeout: 15000 });

    // +1 ボタンをクリック
    await page.getByRole("button", { name: "+1" }).click();

    // カウントが1になることを確認
    await expect(countDisplay).toHaveText("1", { timeout: 15000 });
  });

  test("-1 ボタンでカウントが減少する", async ({ page }) => {
    const countDisplay = page.locator(".text-8xl");

    // 現在の値を取得
    await expect(countDisplay).toBeVisible();
    const initialText = await countDisplay.textContent();
    const initialCount = Number.parseInt(initialText || "0", 10);

    // -1 ボタンをクリック
    await page.getByRole("button", { name: "-1" }).click();

    // カウントが1減少していることを確認
    await expect(countDisplay).toHaveText(String(initialCount - 1), { timeout: 15000 });
  });

  test("+5 ボタンでカウントが5増加する", async ({ page }) => {
    const countDisplay = page.locator(".text-8xl");

    // 現在の値を取得
    await expect(countDisplay).toBeVisible();
    const initialText = await countDisplay.textContent();
    const initialCount = Number.parseInt(initialText || "0", 10);

    // +5 ボタンをクリック
    await page.getByRole("button", { name: "+5" }).click();

    // カウントが5増加していることを確認
    await expect(countDisplay).toHaveText(String(initialCount + 5), { timeout: 15000 });
  });

  test("-5 ボタンでカウントが5減少する", async ({ page }) => {
    const countDisplay = page.locator(".text-8xl");

    // 現在の値を取得
    await expect(countDisplay).toBeVisible();
    const initialText = await countDisplay.textContent();
    const initialCount = Number.parseInt(initialText || "0", 10);

    // -5 ボタンをクリック
    await page.getByRole("button", { name: "-5" }).click();

    // カウントが5減少していることを確認
    await expect(countDisplay).toHaveText(String(initialCount - 5), { timeout: 15000 });
  });

  test("リセットボタンでカウントが0になる", async ({ page }) => {
    const countDisplay = page.locator(".text-8xl");

    // リセットボタンをクリック
    await page.getByRole("button", { name: /リセット/ }).click();

    // カウントが0になっていることを確認
    await expect(countDisplay).toHaveText("0", { timeout: 15000 });
  });
});
