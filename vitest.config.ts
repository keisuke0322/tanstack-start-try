import { defineConfig } from "vitest/config";

// Root Vitest configuration: run unit tests only in the repository root `src`
// and explicitly exclude the backup and Playwright e2e folders so vitest
// doesn't try to run Playwright tests or the old copied sources.
export default defineConfig({
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.ts", "src/**/*.test.tsx", "src/**/*.vitest.ts"],
    exclude: ["apps/**/e2e/**"],
    setupFiles: ["./src/test-setup.ts"],
    globals: true,
    coverage: {
      provider: "v8",
      include: ["src/**/*.ts", "src/**/*.tsx"],
      exclude: [
        "src/**/*.test.ts",
        "src/**/*.test.tsx",
        "src/**/*.vitest.ts",
        "src/test-setup.ts",
        "src/test-setup-bun.ts",
        "src/routeTree.gen.ts",
        "apps/**",
      ],
      reporter: ["text", "html"],
    },
  },
});
