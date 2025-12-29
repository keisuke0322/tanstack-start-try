import { beforeEach, describe, expect, it, vi } from "vitest";
import { decodeTokenPayload, getToken, isTokenExpired, removeToken, setToken } from "./jwt-client";

// localStorageのモック
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
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(globalThis, "localStorage", {
  value: localStorageMock,
});

describe("jwt-client", () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  describe("setToken", () => {
    it("should save token to localStorage", () => {
      setToken("test-token");
      expect(localStorageMock.setItem).toHaveBeenCalledWith("jwt_token", "test-token");
    });
  });

  describe("getToken", () => {
    it("should get token from localStorage", () => {
      localStorageMock.getItem.mockReturnValueOnce("stored-token");
      const token = getToken();
      expect(localStorageMock.getItem).toHaveBeenCalledWith("jwt_token");
      expect(token).toBe("stored-token");
    });

    it("should return null when no token exists", () => {
      localStorageMock.getItem.mockReturnValueOnce(null);
      const token = getToken();
      expect(token).toBeNull();
    });
  });

  describe("removeToken", () => {
    it("should remove token from localStorage", () => {
      removeToken();
      expect(localStorageMock.removeItem).toHaveBeenCalledWith("jwt_token");
    });
  });

  describe("decodeTokenPayload", () => {
    // 有効なJWTトークンを作成するヘルパー関数
    const createValidToken = (payload: object): string => {
      const header = { alg: "HS256", typ: "JWT" };
      const base64UrlEncode = (obj: object): string => {
        const str = JSON.stringify(obj);
        return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
      };
      const encodedHeader = base64UrlEncode(header);
      const encodedPayload = base64UrlEncode(payload);
      return `${encodedHeader}.${encodedPayload}.fake-signature`;
    };

    it("should decode a valid JWT payload", () => {
      const payload = {
        sub: "user123",
        name: "Test User",
        email: "test@example.com",
        exp: 1735500000,
      };
      const token = createValidToken(payload);

      const result = decodeTokenPayload(token);
      expect(result).toEqual(payload);
    });

    it("should return null for invalid token format", () => {
      expect(decodeTokenPayload("invalid-token")).toBeNull();
      expect(decodeTokenPayload("only.two")).toBeNull(); // 2パーツなのでnull
      expect(decodeTokenPayload("one")).toBeNull();
      expect(decodeTokenPayload("")).toBeNull();
    });

    it("should return null for token with invalid Base64URL payload", () => {
      const result = decodeTokenPayload("header.!!!invalid-base64!!!.signature");
      expect(result).toBeNull();
    });

    it("should handle token with minimal payload", () => {
      const payload = {
        sub: "123",
        exp: 9999999999,
      };
      const token = createValidToken(payload);

      const result = decodeTokenPayload(token);
      expect(result?.sub).toBe("123");
      expect(result?.exp).toBe(9999999999);
    });
  });

  describe("isTokenExpired", () => {
    const createTokenWithExp = (exp: number): string => {
      const payload = { sub: "user123", exp };
      const base64UrlEncode = (obj: object): string => {
        const str = JSON.stringify(obj);
        return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
      };
      const encodedHeader = base64UrlEncode({ alg: "HS256", typ: "JWT" });
      const encodedPayload = base64UrlEncode(payload);
      return `${encodedHeader}.${encodedPayload}.fake-signature`;
    };

    it("should return true for null token", () => {
      expect(isTokenExpired(null)).toBe(true);
    });

    it("should return true for expired token", () => {
      // 過去の時刻（1時間前）
      const expiredTime = Math.floor(Date.now() / 1000) - 3600;
      const token = createTokenWithExp(expiredTime);
      expect(isTokenExpired(token)).toBe(true);
    });

    it("should return false for valid token", () => {
      // 未来の時刻（1時間後）
      const futureTime = Math.floor(Date.now() / 1000) + 3600;
      const token = createTokenWithExp(futureTime);
      expect(isTokenExpired(token)).toBe(false);
    });

    it("should return true for invalid token format", () => {
      expect(isTokenExpired("invalid-token")).toBe(true);
    });

    it("should return true for token with invalid payload", () => {
      expect(isTokenExpired("header.invalid.signature")).toBe(true);
    });
  });
});
