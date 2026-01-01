import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";

// Vercel環境（ビルド時）のみnitroプラグインを使用
const isVercelBuild = process.env.VERCEL === "1";

export default defineConfig({
  plugins: [
    tailwindcss(),
    tanstackStart(),
    // Vercelビルド時のみnitroプラグインを有効化
    ...(isVercelBuild ? [nitro({ preset: "vercel" })] : []),
    // react's vite plugin must come after start's vite plugin
    react(),
  ],
  resolve: {
    tsconfigPaths: true,
  },
});
