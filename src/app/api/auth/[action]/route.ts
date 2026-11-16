import { type NextRequest, NextResponse } from "next/server";

import { ACCESS_COOKIE, API_URL, REFRESH_COOKIE, callApi, clearTokens, type Tokens, writeTokens } from "@/lib/auth/session";

/**
 * Rutas de sesión del BFF:
 *  POST /api/auth/login | register → crea la sesión (cookies) y devuelve solo el usuario.
 *  POST /api/auth/logout           → revoca en la API y borra cookies.
 *  GET  /api/auth/session          → { authenticated, user } para la landing (botón "Ir a mi panel").
 */
type AuthResult = Tokens & { user: Record<string, unknown> };

function forwardHeaders(req: NextRequest) {
  const h: Record<string, string> = { "content-type": "application/json", accept: "application/json" };
  const ua = req.headers.get("user-agent");
  if (ua) h["user-agent"] = ua;
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) h["x-forwarded-for"] = fwd;
  return h;
}

async function createSession(req: NextRequest, endpoint: "login" | "register") {
  const res = await fetch(`${API_URL}/auth/${endpoint}`, { method: "POST", headers: forwardHeaders(req), body: await req.text(), cache: "no-store" });
  const json = (await res.json().catch(() => ({}))) as AuthResult;
  if (!res.ok) return NextResponse.json(json, { status: res.status });
  const out = NextResponse.json({ user: json.user }, { status: res.status });
  writeTokens(out.cookies, json);
  return out;
}

async function logout(req: NextRequest) {
  const refreshToken = req.cookies.get(REFRESH_COOKIE)?.value;
  if (refreshToken) {
    await fetch(`${API_URL}/auth/logout`, { method: "POST", headers: forwardHeaders(req), body: JSON.stringify({ refreshToken }), cache: "no-store" }).catch(() => null);
  }
  const out = NextResponse.json({ ok: true });
  clearTokens(out.cookies);
  return out;
}

export async function POST(req: NextRequest, ctx: RouteContext<"/api/auth/[action]">) {
  const { action } = await ctx.params;
  if (action === "login" || action === "register") return createSession(req, action);
  if (action === "logout") return logout(req);
  return NextResponse.json({ message: "No encontrado" }, { status: 404 });
}

export async function GET(req: NextRequest, ctx: RouteContext<"/api/auth/[action]">) {
  const { action } = await ctx.params;
  if (action !== "session") return NextResponse.json({ message: "No encontrado" }, { status: 404 });

  const access = req.cookies.get(ACCESS_COOKIE)?.value;
  const refresh = req.cookies.get(REFRESH_COOKIE)?.value;
  if (!access && !refresh) return NextResponse.json({ authenticated: false }, { headers: { "cache-control": "no-store" } });

  const { res, rotated, expired } = await callApi({ method: "GET", path: "/users/me", headers: req.headers }, { access, refresh });
  const me = res.ok ? ((await res.json()) as { name: string; role: string; onboardingState: string }) : null;
  const out = NextResponse.json(
    me ? { authenticated: true, user: { name: me.name, role: me.role, onboardingState: me.onboardingState } } : { authenticated: false },
    { headers: { "cache-control": "no-store" } },
  );
  if (rotated) writeTokens(out.cookies, rotated);
  if (expired || res.status === 401) clearTokens(out.cookies);
  return out;
}
