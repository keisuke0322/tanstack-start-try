import { describe, expect, it } from "vitest";
import { decodeJWT, signJWT, verifyJWT } from "./jwt";

describe("JWT Utilities", () => {
  const secret = "test-secret-key";

  describe("signJWT", () => {
    it("should generate a valid JWT token", () => {
      const payload = { sub: "user-123", name: "Test User", email: "test@example.com" };
      const token = signJWT(payload, secret);

      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
      expect(token.split(".")).toHaveLength(3);
    });

    it("should include the payload data in the token", () => {
      const payload = { sub: "user-456", name: "Another User", email: "another@example.com" };
      const token = signJWT(payload, secret);
      const decoded = decodeJWT(token);

      expect(decoded).not.toBeNull();
      expect(decoded?.sub).toBe("user-456");
      expect(decoded?.name).toBe("Another User");
      expect(decoded?.email).toBe("another@example.com");
    });

    it("should add iat and exp claims", () => {
      const payload = { sub: "user-789" };
      const token = signJWT(payload, secret);
      const decoded = decodeJWT(token);

      expect(decoded?.iat).toBeDefined();
      expect(decoded?.exp).toBeDefined();
      expect(typeof decoded?.iat).toBe("number");
      expect(typeof decoded?.exp).toBe("number");
    });

    it("should use custom expiration time", () => {
      const payload = { sub: "user-111" };
      const expiresIn = 3600; // 1 hour
      const token = signJWT(payload, secret, expiresIn);
      const decoded = decodeJWT(token);

      expect(decoded?.exp).toBeDefined();
      expect(decoded?.iat).toBeDefined();
      if (decoded?.exp && decoded?.iat) {
        expect(decoded.exp - decoded.iat).toBe(expiresIn);
      }
    });
  });

  describe("verifyJWT", () => {
    it("should verify a valid token", () => {
      const payload = { sub: "user-123", name: "Test User" };
      const token = signJWT(payload, secret);
      const result = verifyJWT(token, secret);

      expect(result.valid).toBe(true);
      expect(result.payload).toBeDefined();
      expect(result.payload?.sub).toBe("user-123");
      expect(result.payload?.name).toBe("Test User");
    });

    it("should reject a token with invalid signature", () => {
      const payload = { sub: "user-123" };
      const token = signJWT(payload, secret);
      const result = verifyJWT(token, "wrong-secret");

      expect(result.valid).toBe(false);
      expect(result.error).toBe("Invalid signature");
    });

    it("should reject a token with invalid format", () => {
      const result = verifyJWT("invalid-token", secret);

      expect(result.valid).toBe(false);
      expect(result.error).toBe("Invalid token format");
    });

    it("should reject an expired token", () => {
      const payload = { sub: "user-123" };
      // Create a token that expired 1 second ago
      const token = signJWT(payload, secret, -1);
      const result = verifyJWT(token, secret);

      expect(result.valid).toBe(false);
      expect(result.error).toBe("Token expired");
    });

    it("should reject a token with empty parts", () => {
      const result = verifyJWT("..", secret);

      expect(result.valid).toBe(false);
      expect(result.error).toBe("Invalid token format");
    });
  });

  describe("decodeJWT", () => {
    it("should decode a valid token without verification", () => {
      const payload = { sub: "user-123", name: "Test User" };
      const token = signJWT(payload, secret);
      const decoded = decodeJWT(token);

      expect(decoded).not.toBeNull();
      expect(decoded?.sub).toBe("user-123");
      expect(decoded?.name).toBe("Test User");
    });

    it("should return null for invalid token format", () => {
      const decoded = decodeJWT("invalid-token");
      expect(decoded).toBeNull();
    });

    it("should return null for token with only two parts", () => {
      const decoded = decodeJWT("header.payload");
      expect(decoded).toBeNull();
    });

    it("should return null for empty string", () => {
      const decoded = decodeJWT("");
      expect(decoded).toBeNull();
    });
  });
});
