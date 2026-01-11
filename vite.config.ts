import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";

// Vercel環境（ビルド時）のみnitroプラグインを使用
const isVercelBuild = process.env.VERCEL === "1";

export default defineConfig({
  root: __dirname,
  plugins: [
    tailwindcss(),
    tanstackStart(),
    ...(isVercelBuild ? [nitro({ preset: "vercel" })] : []),
    react(),
  ],
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
});
