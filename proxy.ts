import { NextResponse, type NextRequest } from "next/server";
import { AUTH_COOKIE, AUTH_COOKIE_PATH, isTokenExpired } from "@/lib/auth-cookie";

const LOGIN_PATH = "/admin/login";

/**
 * Proteção do painel (Next 16: `proxy` substitui o antigo `middleware`).
 *
 * - /admin sem sessão → /admin/login
 * - /admin/login com sessão → /admin
 *
 * Aqui só conferimos se existe um token não expirado. A assinatura é validada
 * pela API em cada chamada; se ela recusar (401), o painel limpa o cookie e
 * volta para o login.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE)?.value;
  const authenticated = !!token && !isTokenExpired(token);

  if (pathname === LOGIN_PATH) {
    return authenticated
      ? NextResponse.redirect(new URL("/admin", request.url))
      : NextResponse.next();
  }

  if (!authenticated) {
    const response = NextResponse.redirect(new URL(LOGIN_PATH, request.url));
    if (token) response.cookies.set(AUTH_COOKIE, "", { path: AUTH_COOKIE_PATH, maxAge: 0 });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
