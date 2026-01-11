// ==========================================
// 🔐 クライアント側のJWTトークン管理
// ==========================================

const TOKEN_KEY = "jwt_token";

/**
 * トークンを保存
 */
export function setToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

/**
 * トークンを取得
 */
export function getToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
}

/**
 * トークンを削除
 */
export function removeToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
  }
}

/**
 * トークンからペイロードをデコード（署名検証なし）
 * ⚠️ クライアント側での簡易チェック用。認証判定はサーバーで行うこと
 */
export function decodeTokenPayload(token: string): {
  sub: string;
  name?: string;
  email?: string;
  exp: number;
} | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payloadPart = parts[1];
    if (!payloadPart) return null;

    // Base64URLデコード
    let base64 = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const padding = base64.length % 4;
    if (padding) {
      base64 += "=".repeat(4 - padding);
    }

    const payload = JSON.parse(atob(base64));
    return payload;
  } catch {
    return null;
  }
}

/**
 * トークンの有効期限をチェック（クライアント側での簡易チェック）
 * ⚠️ 正確な検証はサーバー側で行うこと
 */
export function isTokenExpired(token: string | null): boolean {
  if (!token) return true;

  const payload = decodeTokenPayload(token);
  if (!payload) return true;

  // 有効期限をチェック（秒→ミリ秒）
  return payload.exp * 1000 < Date.now();
}
