import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { decodeTokenPayload, getToken, isTokenExpired, removeToken, setToken } from "./jwt-client";

// 定数
const ONE_HOUR_IN_SECONDS = 3600;

// 共通ヘルパー関数: オブジェクトをBase64URLエンコード
const base64UrlEncode = (obj: object): string => {
  const str = JSON.stringify(obj);
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

// 共通ヘルパー関数: テスト用のJWTトークンを作成
const createTestToken = (payload: object): string => {
  const header = { alg: "HS256", typ: "JWT" };
  const encodedHeader = base64UrlEncode(header);
  const encodedPayload = base64UrlEncode(payload);
  return `${encodedHeader}.${encodedPayload}.fake-signature`;
};

describe("jwt-client", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("setToken", () => {
    it("should save token to localStorage", () => {
      setToken("test-token");
      expect(localStorage.getItem("jwt_token")).toBe("test-token");
    });
  });

  describe("getToken", () => {
    it("should get token from localStorage", () => {
      localStorage.setItem("jwt_token", "stored-token");
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
      localStorage.setItem("jwt_token", "some-token");
      removeToken();
      expect(localStorage.getItem("jwt_token")).toBeNull();
    });
  });

  describe("decodeTokenPayload", () => {
    it("should decode a valid JWT payload", () => {
      const payload = {
        sub: "user123",
        name: "Test User",
        email: "test@example.com",
        exp: 1735500000,
      };
      const token = createTestToken(payload);

      const result = decodeTokenPayload(token);
      expect(result).toEqual(payload);
    });

    it("should return null for invalid token format", () => {
      expect(decodeTokenPayload("invalid-token")).toBeNull();
      expect(decodeTokenPayload("only.two")).toBeNull(); // 2パーツなので null
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
      const token = createTestToken(payload);

      const result = decodeTokenPayload(token);
      expect(result?.sub).toBe("123");
      expect(result?.exp).toBe(9999999999);
    });
  });

  describe("isTokenExpired", () => {
    it("should return true for null token", () => {
      expect(isTokenExpired(null)).toBe(true);
    });

    it("should return true for expired token", () => {
      // 過去の時刻（1時間前）
      const expiredTime = Math.floor(Date.now() / 1000) - ONE_HOUR_IN_SECONDS;
      const token = createTestToken({ sub: "user123", exp: expiredTime });
      expect(isTokenExpired(token)).toBe(true);
    });

    it("should return false for valid token", () => {
      // 未来の時刻（1時間後）
      const futureTime = Math.floor(Date.now() / 1000) + ONE_HOUR_IN_SECONDS;
      const token = createTestToken({ sub: "user123", exp: futureTime });
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
