import { defineConfig } from "vitest/config";

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.ts", "src/**/*.test.tsx", "src/**/*.vitest.ts"],
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
      ],
      reporter: ["text", "html"],
    },
  },
});
