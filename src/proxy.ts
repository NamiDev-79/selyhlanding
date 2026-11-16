import { type NextRequest, NextResponse } from "next/server";

/**
 * Comprobación optimista: sin cookie de sesión no se entra al panel ni al onboarding.
 * La verificación real (token válido, estado de onboarding) la hace la API en cada petición
 * y el guard del panel en el cliente.
 */
export function proxy(req: NextRequest) {
  const hasSession = req.cookies.has("selyh_rt") || req.cookies.has("selyh_at");
  if (hasSession) return NextResponse.next();
  const login = new URL("/login", req.url);
  login.searchParams.set("next", req.nextUrl.pathname + req.nextUrl.search);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ["/panel/:path*", "/empresa/:path*", "/planes", "/plan-corporativo", "/device"],
};
