import { describe, it, expect } from "vitest";
import { app } from "./index.js";

describe("API endpoints", () => {
  describe("GET /api/posts", () => {
    it("should return all posts", async () => {
      const res = await app.request("/api/posts");
      expect(res.status).toBe(200);
      const data = (await res.json()) as any[];
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThan(0);
    });
  });

  describe("GET /api/posts/:id", () => {
    it("should return a post by id", async () => {
      const res = await app.request("/api/posts/1");
      expect(res.status).toBe(200);
      const data = (await res.json()) as { id: number };
      expect(data.id).toBe(1);
    });

    it("should return 404 for non-existent post", async () => {
      const res = await app.request("/api/posts/9999");
      expect(res.status).toBe(404);
      const data = (await res.json()) as { error: string };
      expect(data.error).toBe("Post not found");
    });

    it("should return 404 for invalid id", async () => {
      const res = await app.request("/api/posts/invalid");
      expect(res.status).toBe(404);
    });
  });

  describe("GET /api/users/:id", () => {
    it("should return a user by id", async () => {
      const res = await app.request("/api/users/1");
      expect(res.status).toBe(200);
      const data = (await res.json()) as { id: number; name: string };
      expect(data.id).toBe(1);
      expect(data).toHaveProperty("name");
    });

    it("should return 404 for non-existent user", async () => {
      const res = await app.request("/api/users/9999");
      expect(res.status).toBe(404);
      const data = (await res.json()) as { error: string };
      expect(data.error).toBe("User not found");
    });
  });

  describe("GET /api/health", () => {
    it("should return health status", async () => {
      const res = await app.request("/api/health");
      expect(res.status).toBe(200);
      const data = (await res.json()) as { status: string; timestamp: string };
      expect(data.status).toBe("ok");
      expect(data).toHaveProperty("timestamp");
    });
  });
});
