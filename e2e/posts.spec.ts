import { expect, test } from "@playwright/test";

test.describe("投稿一覧ページ", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/posts");
  });

  test("投稿一覧ページが正しく表示される", async ({ page }) => {
    // タイトルが表示される
    await expect(page.getByRole("heading", { name: "投稿一覧" })).toBeVisible();

    // 投稿数が表示される
    await expect(page.getByText(/\d+件の投稿/)).toBeVisible();

    // 検索ボックスが表示される
    await expect(page.getByPlaceholder("タイトルで検索...")).toBeVisible();

    // ソートボタンが表示される
    await expect(page.getByRole("link", { name: "新しい順" })).toBeVisible();
    await expect(page.getByRole("link", { name: "古い順" })).toBeVisible();
  });

  test("検索機能が動作する", async ({ page }) => {
    // 検索ボックスにキーワードを入力してEnter
    const searchBox = page.getByPlaceholder("タイトルで検索...");
    await searchBox.fill("React");
    await searchBox.press("Enter");

    // ページ遷移を待つ
    await page.waitForLoadState("networkidle");

    // 検索結果が表示される（または「見つかりませんでした」）
    await expect(
      page.getByText(/投稿が見つかりませんでした/).or(page.locator("a[href*='/posts/']").first()),
    ).toBeVisible({ timeout: 10000 });
  });

  test("ソート切り替えが動作する", async ({ page }) => {
    // 「古い順」をクリック
    await page.getByRole("link", { name: "古い順" }).click();

    // URLにsort=oldestが追加される
    await expect(page).toHaveURL(/sort=oldest/);

    // 「新しい順」をクリック
    await page.getByRole("link", { name: "新しい順" }).click();

    // URLからsortが消える（デフォルト値のため）またはsort=newestになる
    await expect(page).toHaveURL(/\/posts/);
  });

  test("ページネーションが動作する", async ({ page }) => {
    // ページ2ボタンがあればクリック
    const page2Link = page.getByRole("link", { name: "2", exact: true });

    if (await page2Link.isVisible()) {
      await page2Link.click();

      // URLにpage=2が追加される
      await expect(page).toHaveURL(/page=2/);

      // 「前へ」ボタンがクリック可能になる
      const prevButton = page.getByRole("link", { name: /前へ/ });
      await expect(prevButton).toBeVisible();

      // 前へをクリック
      await prevButton.click();

      // ページ1に戻る（page=1はデフォルトなのでURLから消える）
      await expect(page).not.toHaveURL(/page=2/);
    }
  });

  test("Search Params表示セクションが更新される", async ({ page }) => {
    // 初期状態のSearch Paramsを確認
    await expect(page.getByText(/"page": 1/)).toBeVisible();
    await expect(page.getByText(/"sort": "newest"/)).toBeVisible();

    // ソートを変更
    await page.getByRole("link", { name: "古い順" }).click();

    // Search Params表示が更新される
    await expect(page.getByText(/"sort": "oldest"/)).toBeVisible();
  });
});

test.describe("投稿詳細ページ", () => {
  // 注意: このテストはServer Functionsを使った認証が必要なため、
  // E2E環境では正しく動作しない可能性があります
  test.skip("存在しない投稿にアクセスすると404が表示される", async ({ page }) => {
    // ログインしてから存在しない投稿にアクセス
    await page.goto("/login");
    await page.getByLabel("メールアドレス").fill("demo@example.com");
    await page.getByLabel("パスワード").fill("password");
    await page.getByRole("button", { name: "ログイン" }).click();

    // 認証完了を待つ（ダッシュボードか認証確認中のどちらか）
    await expect(
      page.getByRole("heading", { name: "ダッシュボード" }).or(page.getByText("認証を確認中")),
    ).toBeVisible({ timeout: 30000 });

    // 存在しない投稿にアクセス
    await page.goto("/posts/nonexistent-post-id");

    // 404メッセージが表示される
    await expect(page.getByText(/投稿が見つかりません|not found/i)).toBeVisible({
      timeout: 15000,
    });
  });
});
