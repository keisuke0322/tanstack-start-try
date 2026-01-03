import type { VercelRequest, VercelResponse } from "@vercel/node";
import { posts, users } from "./data";

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

  const url = new URL(req.url || "", `http://${req.headers.host}`);
  const path = url.pathname.replace(/^\/api/, "");

  // GET /api/posts
  if (path === "/posts" && req.method === "GET") {
    return res.status(200).json(posts);
  }

  // GET /api/posts/:id
  const postMatch = path.match(/^\/posts\/(\d+)$/);
  if (postMatch && req.method === "GET") {
    const id = parseInt(postMatch[1] || "0", 10);
    const post = posts.find((p) => p.id === id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    return res.status(200).json(post);
  }

  // GET /api/users/:id
  const userMatch = path.match(/^\/users\/(\d+)$/);
  if (userMatch && req.method === "GET") {
    const id = parseInt(userMatch[1] || "0", 10);
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
