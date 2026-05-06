const ACCESS_TOKEN_STORAGE_KEY = "crm_access_token";

let cachedAccessToken: string | null = null;

function canUseLocalStorage(): boolean {
  return (
    typeof window !== "undefined" && typeof window.localStorage !== "undefined"
  );
}

export function setAccessToken(token: string | null): void {
  cachedAccessToken = token;

  if (!canUseLocalStorage()) return;

  if (token) {
    window.localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token);
  } else {
    window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
  }
}

export function getAccessToken(): string | null {
  if (cachedAccessToken) return cachedAccessToken;

  if (!canUseLocalStorage()) return null;

  const token = window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
  cachedAccessToken = token;
  return token;
}

export function clearAccessToken(): void {
  setAccessToken(null);
}

type JwtPayload = {
  exp?: number;
  sub?: unknown;
  [key: string]: unknown;
};

function decodeJwtPayload(token: string): JwtPayload | null {
  const parts = token.split(".");
  if (parts.length < 2) return null;

  const base64Url = parts[1] ?? "";
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

  try {
    const json =
      typeof atob === "function"
        ? atob(base64)
        : Buffer.from(base64, "base64").toString("utf8");
    const payload = JSON.parse(json) as unknown;
    if (!payload || typeof payload !== "object") return null;
    return payload as JwtPayload;
  } catch {
    return null;
  }
}

export function isAccessTokenExpired(token: string, skewMs = 30_000): boolean {
  const payload = decodeJwtPayload(token);
  if (!payload || typeof payload.exp !== "number") return false;

  const expiresAtMs = payload.exp * 1000;
  return expiresAtMs <= Date.now() + skewMs;
}

export function getAccessTokenUserId(token: string): string | null {
  const payload = decodeJwtPayload(token);
  if (!payload) return null;

  return typeof payload.sub === "string" ? payload.sub : null;
}
