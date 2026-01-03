import { describe, it, expect } from "vitest";
import { posts, users } from "./data";

describe("data module", () => {
  describe("posts", () => {
    it("should have at least one post", () => {
      expect(posts.length).toBeGreaterThan(0);
    });

    it("each post should have required fields", () => {
      posts.forEach((post) => {
        expect(post).toHaveProperty("id");
        expect(post).toHaveProperty("userId");
        expect(post).toHaveProperty("title");
        expect(post).toHaveProperty("body");
      });
    });

    it("should have unique post ids", () => {
      const ids = posts.map((p) => p.id);
      expect(new Set(ids).size).toBe(ids.length);
    });
  });

  describe("users", () => {
    it("should have at least one user", () => {
      expect(users.length).toBeGreaterThan(0);
    });

    it("each user should have required fields", () => {
      users.forEach((user) => {
        expect(user).toHaveProperty("id");
        expect(user).toHaveProperty("name");
        expect(user).toHaveProperty("username");
        expect(user).toHaveProperty("email");
      });
    });

    it("should have unique user ids", () => {
      const ids = users.map((u) => u.id);
      expect(new Set(ids).size).toBe(ids.length);
    });
  });
});
