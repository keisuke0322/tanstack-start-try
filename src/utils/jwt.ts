import jwt from "jsonwebtoken";

// ==========================================
// 🔐 JWT 型定義
// ==========================================

export interface JWTHeader {
  alg: "HS256";
  typ: "JWT";
}

export interface JWTPayload {
  sub: string; // Subject（ユーザーID）
  name?: string; // ユーザー名
  email?: string; // メールアドレス
  iat: number; // Issued At（発行時刻）
  exp: number; // Expiration（有効期限）
  [key: string]: unknown;
}

export interface JWTVerifyResult {
  valid: boolean;
  payload?: JWTPayload;
  error?: string;
}

// ==========================================
// 🔑 JWT 生成
// ==========================================

/**
 * JWTを生成
 * @param payload - トークンに含めるデータ（subは必須）
 * @param secret - 署名用の秘密鍵
 * @param expiresIn - 有効期限（秒）デフォルト24時間
 */
export function signJWT(
  payload: { sub: string } & Omit<JWTPayload, "iat" | "exp">,
  secret: string,
  expiresIn: number = 60 * 60 * 24, // 24時間
): string {
  return jwt.sign(payload, secret, {
    algorithm: "HS256",
    expiresIn,
  });
}

// ==========================================
// ✅ JWT 検証
// ==========================================

/**
 * JWTを検証
 * @param token - 検証するJWTトークン
 * @param secret - 署名用の秘密鍵
 */
export function verifyJWT(token: string, secret: string): JWTVerifyResult {
  try {
    const decoded = jwt.verify(token, secret, {
      algorithms: ["HS256"],
    }) as JWTPayload;

    return { valid: true, payload: decoded };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return { valid: false, error: "Token expired" };
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return { valid: false, error: "Invalid signature" };
    }
    return {
      valid: false,
      error: error instanceof Error ? error.message : "Token verification failed",
    };
  }
}

/**
 * JWTからペイロードを取得（署名検証なし）
 * ⚠️ 信頼できないトークンには使用しないでください
 */
export function decodeJWT(token: string): JWTPayload | null {
  try {
    const decoded = jwt.decode(token);
    if (!decoded || typeof decoded === "string") return null;
    return decoded as JWTPayload;
  } catch {
    return null;
  }
}
