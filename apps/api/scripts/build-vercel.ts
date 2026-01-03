import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_FILE = path.resolve(__dirname, "../../../api/[[...route]].ts");
const DATA_FILE = path.resolve(__dirname, "../src/data.ts");

async function build() {
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
  const output = `import type { VercelRequest, VercelResponse } from "@vercel/node";

// ==========================================
// 📝 型定義
// ==========================================
type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

type User = {
  id: number;
  name: string;
  username: string;
  email: string;
};

// ==========================================
// 📚 ダミーデータ
// ==========================================
const posts: Post[] = ${postsData};

const users: User[] = ${usersData};

// ==========================================
// 🚀 API Handler (標準Vercel Function形式)
// ==========================================
export function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const url = new URL(req.url || "", \`http://\${req.headers.host}\`);
  const path = url.pathname.replace(/^\\/api/, "");

  // GET /api/posts
  if (path === "/posts" && req.method === "GET") {
    return res.status(200).json(posts);
  }

  // GET /api/posts/:id
  const postMatch = path.match(/^\\/posts\\/(\\d+)$/);
  if (postMatch && req.method === "GET") {
    const id = parseInt(postMatch[1], 10);
    const post = posts.find((p) => p.id === id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    return res.status(200).json(post);
  }

  // GET /api/users/:id
  const userMatch = path.match(/^\\/users\\/(\\d+)$/);
  if (userMatch && req.method === "GET") {
    const id = parseInt(userMatch[1], 10);
    const user = users.find((u) => u.id === id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json(user);
  }

  // GET /api/health
  if (path === "/health" && req.method === "GET") {
    return res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
  }

  // 404
  return res.status(404).json({ error: "Not found" });
}
`;

  fs.writeFileSync(OUTPUT_FILE, output, "utf-8");
  console.log("✅ Built api/[[...route]].ts");
}

build().catch((err) => {
  console.error("Build failed:", err);
  process.exit(1);
});
