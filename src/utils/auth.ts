import { createServerFn } from "@tanstack/react-start";
import { signJWT, verifyJWT } from "./jwt";

// ==========================================
// 🔐 JWT認証の設定
// ==========================================

// 環境変数から秘密鍵を取得（本番環境では必ず設定）
const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-key-change-in-production";

// ユーザー型の定義
export type User = { id: string; name: string; email: string };

// ==========================================
// 🔐 認証 Server Functions
// ==========================================

/**
 * ログイン処理
 * 成功時はJWTトークンを返却
 */
export const loginFn = createServerFn({ method: "POST" })
  .inputValidator((data: { email: string; password: string }) => data)
  .handler(async ({ data }) => {
    // デモ用: 実際はDBでパスワード検証（bcrypt等でハッシュ比較）
    if (data.email === "demo@example.com" && data.password === "password") {
      const user: User = {
        id: "1",
        name: "デモユーザー",
        email: data.email,
      };

      // JWTトークンを生成
      const token = signJWT(
        {
          sub: user.id,
          name: user.name,
          email: user.email,
        },
        JWT_SECRET,
      );

      return { success: true, user, token };
    }
    return { success: false, error: "メールアドレスまたはパスワードが正しくありません" };
  });

/**
 * トークン検証処理
 * クライアントから送信されたトークンを検証してユーザー情報を返却
 */
export const verifyAuthFn = createServerFn({ method: "POST" })
  .inputValidator((data: { token: string }) => data)
  .handler(async ({ data }) => {
    const result = verifyJWT(data.token, JWT_SECRET);

    if (!result.valid || !result.payload) {
      return { user: null, error: result.error };
    }

    const user: User = {
      id: result.payload.sub,
      name: result.payload.name || "",
      email: result.payload.email || "",
    };

    return { user };
  });
