import { createHmac, timingSafeEqual } from "node:crypto";

// ==========================================
// 🔧 Base64URL エンコード/デコード
// ==========================================

/**
 * 文字列をBase64URLエンコード
 */
function base64UrlEncode(str: string): string {
  return Buffer.from(str, "utf-8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/**
 * Base64URLをデコード
 */
function base64UrlDecode(str: string): string {
  // パディングを追加
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const padding = base64.length % 4;
  if (padding) {
    base64 += "=".repeat(4 - padding);
  }
  return Buffer.from(base64, "base64").toString("utf-8");
}

/**
 * バイナリデータをBase64URLエンコード
 */
function base64UrlEncodeBuffer(buffer: Buffer): string {
  return buffer.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

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
 * HMAC-SHA256署名を生成
 */
function createSignature(data: string, secret: string): string {
  const hmac = createHmac("sha256", secret);
  hmac.update(data);
  return base64UrlEncodeBuffer(hmac.digest());
}

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
  // ヘッダー
  const header: JWTHeader = {
    alg: "HS256",
    typ: "JWT",
  };

  // 現在時刻（秒）
  const now = Math.floor(Date.now() / 1000);

  // ペイロード（iat, expを追加）
  const fullPayload: JWTPayload = {
    ...payload,
    iat: now,
    exp: now + expiresIn,
  };

  // ヘッダーとペイロードをBase64URLエンコード
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload));

  // 署名対象のデータ
  const signatureInput = `${encodedHeader}.${encodedPayload}`;

  // HMAC-SHA256で署名
  const signature = createSignature(signatureInput, secret);

  // JWTを組み立て（header.payload.signature）
  return `${signatureInput}.${signature}`;
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
    // トークンを分割
    const parts = token.split(".");
    if (parts.length !== 3) {
      return { valid: false, error: "Invalid token format" };
    }

    const encodedHeader = parts[0];
    const encodedPayload = parts[1];
    const signature = parts[2];

    // undefinedチェック
    if (!encodedHeader || !encodedPayload || !signature) {
      return { valid: false, error: "Invalid token format" };
    }

    // ヘッダーを検証
    const header = JSON.parse(base64UrlDecode(encodedHeader)) as JWTHeader;
    if (header.alg !== "HS256" || header.typ !== "JWT") {
      return { valid: false, error: "Unsupported algorithm or type" };
    }

    // 署名を再計算して比較（タイミング攻撃対策）
    const signatureInput = `${encodedHeader}.${encodedPayload}`;
    const expectedSignature = createSignature(signatureInput, secret);

    // タイミングセーフな比較
    const signatureBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);

    if (signatureBuffer.length !== expectedBuffer.length) {
      return { valid: false, error: "Invalid signature" };
    }

    if (!timingSafeEqual(signatureBuffer, expectedBuffer)) {
      return { valid: false, error: "Invalid signature" };
    }

    // ペイロードをデコード
    const payload = JSON.parse(base64UrlDecode(encodedPayload)) as JWTPayload;

    // 有効期限を検証
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return { valid: false, error: "Token expired" };
    }

    // iatの検証（未来の発行時刻は無効）
    if (payload.iat && payload.iat > now + 60) {
      return { valid: false, error: "Token issued in the future" };
    }

    return { valid: true, payload };
  } catch (error) {
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
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = parts[1];
    if (!payload) return null;
    return JSON.parse(base64UrlDecode(payload)) as JWTPayload;
  } catch {
    return null;
  }
}
