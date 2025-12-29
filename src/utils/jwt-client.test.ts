import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { decodeTokenPayload, getToken, isTokenExpired, removeToken, setToken } from "./jwt-client";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: () => {
      store = {};
    },
  };
})();

// Setup global window with localStorage mock and stub localStorage directly
vi.stubGlobal("window", { localStorage: localStorageMock });
vi.stubGlobal("localStorage", localStorageMock);

describe("JWT Client Utilities", () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorageMock.clear();
  });

  describe("setToken", () => {
    it("should store token in localStorage", () => {
      setToken("test-token-123");
      expect(localStorageMock.setItem).toHaveBeenCalledWith("jwt_token", "test-token-123");
    });
  });

  describe("getToken", () => {
    it("should retrieve token from localStorage", () => {
      localStorageMock.setItem("jwt_token", "stored-token");
      const token = getToken();
      expect(token).toBe("stored-token");
    });

    it("should return null when no token exists", () => {
      const token = getToken();
      expect(token).toBeNull();
    });
  });

  describe("removeToken", () => {
    it("should remove token from localStorage", () => {
      localStorageMock.setItem("jwt_token", "token-to-remove");
      removeToken();
      expect(localStorageMock.removeItem).toHaveBeenCalledWith("jwt_token");
    });
  });

  describe("decodeTokenPayload", () => {
    // Helper to create a base64url-encoded JWT-like structure
    const createMockToken = (payload: object) => {
      const header = { alg: "HS256", typ: "JWT" };
      const base64UrlEncode = (obj: object) => {
        return btoa(JSON.stringify(obj)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
      };
      const headerPart = base64UrlEncode(header);
      const payloadPart = base64UrlEncode(payload);
      return `${headerPart}.${payloadPart}.signature`;
    };

    it("should decode a valid token payload", () => {
      const payload = {
        sub: "user-123",
        name: "Test User",
        email: "test@example.com",
        exp: Math.floor(Date.now() / 1000) + 3600,
      };
      const token = createMockToken(payload);
      const decoded = decodeTokenPayload(token);

      expect(decoded).not.toBeNull();
      expect(decoded?.sub).toBe("user-123");
      expect(decoded?.name).toBe("Test User");
      expect(decoded?.email).toBe("test@example.com");
    });

    it("should return null for invalid token format", () => {
      const decoded = decodeTokenPayload("invalid-token");
      expect(decoded).toBeNull();
    });

    it("should return null for token with only two parts", () => {
      const decoded = decodeTokenPayload("header.payload");
      expect(decoded).toBeNull();
    });

    it("should return null for empty string", () => {
      const decoded = decodeTokenPayload("");
      expect(decoded).toBeNull();
    });
  });

  describe("isTokenExpired", () => {
    const createMockToken = (payload: object) => {
      const header = { alg: "HS256", typ: "JWT" };
      const base64UrlEncode = (obj: object) => {
        return btoa(JSON.stringify(obj)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
      };
      const headerPart = base64UrlEncode(header);
      const payloadPart = base64UrlEncode(payload);
      return `${headerPart}.${payloadPart}.signature`;
    };

    it("should return true for null token", () => {
      expect(isTokenExpired(null)).toBe(true);
    });

    it("should return true for invalid token", () => {
      expect(isTokenExpired("invalid-token")).toBe(true);
    });

    it("should return true for expired token", () => {
      const expiredPayload = {
        sub: "user-123",
        exp: Math.floor(Date.now() / 1000) - 3600, // Expired 1 hour ago
      };
      const token = createMockToken(expiredPayload);
      expect(isTokenExpired(token)).toBe(true);
    });

    it("should return false for valid (non-expired) token", () => {
      const validPayload = {
        sub: "user-123",
        exp: Math.floor(Date.now() / 1000) + 3600, // Expires in 1 hour
      };
      const token = createMockToken(validPayload);
      expect(isTokenExpired(token)).toBe(false);
    });
  });
});
