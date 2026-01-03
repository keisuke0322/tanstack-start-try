import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_FILE = path.resolve(__dirname, "../../../api/[[...route]].ts");
const DATA_FILE = path.resolve(__dirname, "../src/data.ts");
const TYPES_FILE = path.resolve(__dirname, "../../../packages/types/src/index.ts");
const HANDLER_FILE = path.resolve(__dirname, "../src/vercel-handler.ts");

function extractTypes(): string {
  const typesContent = fs.readFileSync(TYPES_FILE, "utf-8");

  // Remove export keywords and comments for inline use
  const types = typesContent
    .split("\n")
    .filter((line) => !line.startsWith("//") && line.trim() !== "")
    .join("\n")
    .replace(/export /g, "")
    // Remove PostDetail alias as it's not needed in the API
    .replace(/type PostDetail = Post;/g, "")
    .trim();

  return types;
}

function extractHandler(): string {
  const handlerContent = fs.readFileSync(HANDLER_FILE, "utf-8");

  // Extract handler function body (from "export function handler" to the end)
  const handlerMatch = handlerContent.match(
    /\/\/ =+\n\/\/ 🚀 API Handler[\s\S]*?export function handler\(req: VercelRequest, res: VercelResponse\) \{([\s\S]*)\}/,
  );

  if (!handlerMatch) {
    throw new Error("Could not extract handler from vercel-handler.ts");
  }

  return handlerMatch[1];
}

async function build() {
  // Read types from packages/types
  const typeDefs = extractTypes();

  // Read handler from vercel-handler.ts
  const handlerBody = extractHandler();

  // Read data.ts to extract posts and users
  const dataContent = fs.readFileSync(DATA_FILE, "utf-8");

  // Extract posts array (between "export const posts: Post[] = [" and "];")
  const postsMatch = dataContent.match(/export const posts: Post\[\] = (\[[\s\S]*?\]);/);
  const usersMatch = dataContent.match(/export const users: User\[\] = (\[[\s\S]*?\]);/);

  if (!postsMatch || !usersMatch) {
    throw new Error("Could not extract data from data.ts");
  }

  const postsData = postsMatch[1];
  const usersData = usersMatch[1];

  // Generate the final output
  const output = `/* eslint-disable import/no-default-export */
import type { VercelRequest, VercelResponse } from "@vercel/node";

// ==========================================
// 📝 型定義 (generated from packages/types)
// ==========================================
${typeDefs}

// ==========================================
// 📚 ダミーデータ
// ==========================================
const posts: Post[] = ${postsData};

const users: User[] = ${usersData};

// ==========================================
// 🚀 API Handler (generated from vercel-handler.ts)
// ==========================================
export default function handler(req: VercelRequest, res: VercelResponse) {${handlerBody}}
`;

  fs.writeFileSync(OUTPUT_FILE, output, "utf-8");
  console.log("✅ Built api/[[...route]].ts");
}

build().catch((err) => {
  console.error("Build failed:", err);
  process.exit(1);
});
