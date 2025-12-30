/* eslint-disable import/no-default-export */
import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright E2Eテスト設定
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // テストファイルのディレクトリ
  testDir: "./e2e",

  // 各テストファイルを並列実行
  fullyParallel: true,

  // CI環境ではリトライしない、ローカルでは1回リトライ
  retries: process.env.CI ? 0 : 1,

  // CI環境では並列数を制限
  workers: process.env.CI ? 1 : undefined,

  // レポーター設定
  reporter: process.env.CI ? "github" : "html",

  // グローバル設定
  use: {
    // テスト対象のベースURL
    baseURL: "http://localhost:3000",

    // 失敗時のみトレースを収集
    trace: "on-first-retry",

    // スクリーンショット設定
    screenshot: "only-on-failure",
  },

  // ブラウザ設定（Chromiumのみ）
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  // 開発サーバーの設定
  webServer: {
    command: "bun run dev --port 3000",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 180 * 1000,
    stdout: "pipe",
    stderr: "pipe",
  },
});
