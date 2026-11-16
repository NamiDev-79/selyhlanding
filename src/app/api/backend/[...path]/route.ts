import { type NextRequest, NextResponse } from "next/server";

import { ACCESS_COOKIE, REFRESH_COOKIE, callApi, clearTokens, type Tokens, writeTokens } from "@/lib/auth/session";

/**
 * Intermediario genérico: /api/backend/<ruta> → API/<ruta>, con la sesión de las cookies.
 * Las rutas que emiten tokens van por /api/auth/* para que nunca lleguen al navegador.
 */
const BLOCKED = new Set(["auth/login", "auth/register", "auth/refresh", "auth/logout", "auth/device/start", "auth/device/token", "openapi.json"]);
// Respuestas que traen tokens nuevos (p. ej. cambiar contraseña): se guardan en cookies y no se reenvían.
const ISSUES_TOKENS = new Set(["auth/password"]);
// Tras estas operaciones la sesión deja de existir.
const ENDS_SESSION = new Set(["DELETE users/me", "POST auth/logout-all"]);

async function handle(req: NextRequest, ctx: RouteContext<"/api/backend/[...path]">) {
  const { path } = await ctx.params;
  const joined = path.map(encodeURIComponent).join("/");
  if (BLOCKED.has(joined)) return NextResponse.json({ statusCode: 404, message: "No disponible" }, { status: 404 });

  const body = req.method === "GET" || req.method === "HEAD" ? undefined : await req.text();
  const { res, rotated, expired } = await callApi(
    { method: req.method, path: `/${joined}`, search: req.nextUrl.search, body: body || undefined, headers: req.headers },
    { access: req.cookies.get(ACCESS_COOKIE)?.value, refresh: req.cookies.get(REFRESH_COOKIE)?.value },
  );

  let out: NextResponse;
  let issued: Tokens | null = null;
  if (ISSUES_TOKENS.has(joined) && res.ok) {
    issued = (await res.json()) as Tokens;
    out = NextResponse.json({ ok: true });
  } else {
    const headers = new Headers();
    for (const h of ["content-type", "content-disposition"]) {
      const v = res.headers.get(h);
      if (v) headers.set(h, v);
    }
    headers.set("cache-control", "no-store");
    out = new NextResponse(res.status === 204 ? null : res.body, { status: res.status, headers });
  }

  if (issued) writeTokens(out.cookies, issued);
  else if (rotated) writeTokens(out.cookies, rotated);
  if (expired || (res.ok && ENDS_SESSION.has(`${req.method} ${joined}`))) clearTokens(out.cookies);
  return out;
}

export { handle as GET, handle as POST, handle as PUT, handle as PATCH, handle as DELETE };
