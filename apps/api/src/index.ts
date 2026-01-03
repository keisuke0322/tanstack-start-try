import { Hono } from "hono";
import { cors } from "hono/cors";
import { posts, users } from "./data.js";

const app = new Hono().basePath("/api");

// Enable CORS for local development
app.use(
  "*",
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  }),
);

// GET /api/posts - Get all posts
app.get("/posts", (c) => {
  return c.json(posts);
});

// GET /api/posts/:id - Get a single post by ID
app.get("/posts/:id", (c) => {
  const id = parseInt(c.req.param("id"), 10);
  const post = posts.find((p) => p.id === id);

  if (!post) {
    return c.json({ error: "Post not found" }, 404);
  }

  return c.json(post);
});

// GET /api/users/:id - Get a single user by ID
app.get("/users/:id", (c) => {
  const id = parseInt(c.req.param("id"), 10);
  const user = users.find((u) => u.id === id);

  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }

  return c.json(user);
});

// Health check endpoint
app.get("/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

export { app };
