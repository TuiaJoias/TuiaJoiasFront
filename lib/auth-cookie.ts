/**
 * Sessão do painel: o JWT da API fica em um cookie restrito a /admin.
 *
 * Ele não é httpOnly de propósito: o upload vai do navegador direto para a API
 * (com o token no header Authorization), então o JavaScript do painel precisa
 * lê-lo. O proxy.ts usa o mesmo cookie para redirecionar /admin ⇄ /admin/login.
 */
export const AUTH_COOKIE = "tuia_admin_token";
export const AUTH_COOKIE_PATH = "/admin";

/** Lê o `exp` do JWT sem validar a assinatura (quem valida é a API). */
export function isTokenExpired(token: string, now = Date.now()): boolean {
  try {
    const [, payload] = token.split(".");
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const { exp } = JSON.parse(json) as { exp?: number };
    return typeof exp !== "number" || exp * 1000 <= now;
  } catch {
    return true;
  }
}

// ---- Somente no navegador -------------------------------------------------

export function readAuthToken(): string | null {
  if (typeof document === "undefined") return null;
  const entry = document.cookie.split("; ").find((c) => c.startsWith(`${AUTH_COOKIE}=`));
  const token = entry ? decodeURIComponent(entry.slice(AUTH_COOKIE.length + 1)) : null;
  return token && !isTokenExpired(token) ? token : null;
}

export function saveAuthToken(token: string, expiresAt: string): void {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie =
    `${AUTH_COOKIE}=${encodeURIComponent(token)}; Path=${AUTH_COOKIE_PATH}; ` +
    `Expires=${new Date(expiresAt).toUTCString()}; SameSite=Lax${secure}`;
}

export function clearAuthToken(): void {
  document.cookie = `${AUTH_COOKIE}=; Path=${AUTH_COOKIE_PATH}; Max-Age=0; SameSite=Lax`;
}
