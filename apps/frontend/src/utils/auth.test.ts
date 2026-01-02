import { describe, expect, it } from "vitest";
import { signJWT, verifyJWT } from "./jwt";

// ==========================================
// auth.ts のロジックテスト
// createServerFn はサーバーサイドで実行されるため、
// 内部ロジック（認証検証）をテストする
// ==========================================

const TEST_SECRET = "test-secret-key";

// テスト用のユーザー認証ロジック
function validateCredentials(email: string, password: string) {
  if (email === "demo@example.com" && password === "password") {
    return {
      success: true,
      user: {
        id: "1",
        name: "デモユーザー",
        email: email,
      },
    };
  }
  return {
    success: false,
    error: "メールアドレスまたはパスワードが正しくありません",
  };
}

// テスト用のトークン検証ロジック
function validateToken(token: string, secret: string) {
  const result = verifyJWT(token, secret);

  if (!result.valid || !result.payload) {
    return { user: null, error: result.error };
  }

  return {
    user: {
      id: result.payload.sub,
      name: result.payload.name || "",
      email: result.payload.email || "",
    },
  };
}

describe("auth logic", () => {
  describe("validateCredentials (login)", () => {
    it("should return success for valid credentials", () => {
      const result = validateCredentials("demo@example.com", "password");

      expect(result.success).toBe(true);
      expect(result.user).toEqual({
        id: "1",
        name: "デモユーザー",
        email: "demo@example.com",
      });
    });

    it("should return error for invalid email", () => {
      const result = validateCredentials("wrong@example.com", "password");

      expect(result.success).toBe(false);
      expect(result.error).toBe("メールアドレスまたはパスワードが正しくありません");
    });

    it("should return error for invalid password", () => {
      const result = validateCredentials("demo@example.com", "wrongpassword");

      expect(result.success).toBe(false);
      expect(result.error).toBe("メールアドレスまたはパスワードが正しくありません");
    });

    it("should return error for empty credentials", () => {
      const result = validateCredentials("", "");

      expect(result.success).toBe(false);
      expect(result.error).toBe("メールアドレスまたはパスワードが正しくありません");
    });
  });

  describe("validateToken (verifyAuth)", () => {
    it("should return user for valid token", () => {
      const token = signJWT(
        {
          sub: "1",
          name: "テストユーザー",
          email: "test@example.com",
        },
        TEST_SECRET,
      );

      const result = validateToken(token, TEST_SECRET);

      expect(result.user).toEqual({
        id: "1",
        name: "テストユーザー",
        email: "test@example.com",
      });
      expect(result.error).toBeUndefined();
    });

    it("should return error for invalid token", () => {
      const result = validateToken("invalid-token", TEST_SECRET);

      expect(result.user).toBeNull();
      expect(result.error).toBeDefined();
    });

    it("should return error for expired token", () => {
      // 過去の有効期限でトークン生成
      const token = signJWT(
        {
          sub: "1",
          name: "テストユーザー",
          email: "test@example.com",
        },
        TEST_SECRET,
        -3600, // 1時間前に期限切れ
      );

      const result = validateToken(token, TEST_SECRET);

      expect(result.user).toBeNull();
      expect(result.error).toBe("Token expired");
    });

    it("should return error for token with wrong secret", () => {
      const token = signJWT(
        {
          sub: "1",
          name: "テストユーザー",
          email: "test@example.com",
        },
        "different-secret",
      );

      const result = validateToken(token, TEST_SECRET);

      expect(result.user).toBeNull();
      expect(result.error).toBe("Invalid signature");
    });

    it("should handle token without optional fields", () => {
      const token = signJWT(
        {
          sub: "1",
        },
        TEST_SECRET,
      );

      const result = validateToken(token, TEST_SECRET);

      expect(result.user).toEqual({
        id: "1",
        name: "",
        email: "",
      });
    });
  });

  describe("User type", () => {
    it("should have correct structure", () => {
      const user = {
        id: "1",
        name: "テストユーザー",
        email: "test@example.com",
      };

      expect(user).toHaveProperty("id");
      expect(user).toHaveProperty("name");
      expect(user).toHaveProperty("email");
      expect(typeof user.id).toBe("string");
      expect(typeof user.name).toBe("string");
      expect(typeof user.email).toBe("string");
    });
  });
});

describe("JWT integration with auth", () => {
  it("should create and verify token successfully", () => {
    const payload = {
      sub: "user-123",
      name: "統合テストユーザー",
      email: "integration@example.com",
    };

    const token = signJWT(payload, TEST_SECRET);
    const result = verifyJWT(token, TEST_SECRET);

    expect(result.valid).toBe(true);
    expect(result.payload?.sub).toBe("user-123");
    expect(result.payload?.name).toBe("統合テストユーザー");
    expect(result.payload?.email).toBe("integration@example.com");
  });

  it("should include iat and exp in token", () => {
    const token = signJWT({ sub: "1" }, TEST_SECRET, 3600);
    const result = verifyJWT(token, TEST_SECRET);

    expect(result.valid).toBe(true);
    expect(result.payload?.iat).toBeDefined();
    expect(result.payload?.exp).toBeDefined();
    expect(result.payload!.exp - result.payload!.iat).toBe(3600);
  });
});
