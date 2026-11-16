import "server-only";

import type { NextResponse } from "next/server";

type ResponseCookies = NextResponse["cookies"];

/**
 * Sesión en cookies httpOnly. El navegador nunca ve los tokens: Next actúa de
 * intermediario (BFF) y agrega `Authorization: Bearer` al llamar a la API.
 *
 * El refresh token de la API es de UN solo uso y reutilizarlo revoca toda la
 * familia de sesiones. Por eso las rotaciones se deduplican en memoria: si dos
 * peticiones llegan con el mismo refresh token, ambas reciben el mismo par nuevo.
 */
export const ACCESS_COOKIE = "selyh_at";
export const REFRESH_COOKIE = "selyh_rt";

export const API_URL = (process.env.API_URL ?? "http://localhost:3000").replace(/\/$/, "");

export type Tokens = { accessToken: string; refreshToken: string };

const secure = process.env.NODE_ENV === "production";
const REFRESH_MAX_AGE = 60 * 60 * 24 * 30; // igual que JWT_REFRESH_TTL del backend (30d)

/** Segundos hasta que vence el JWT de acceso (sin verificar firma: solo para fijar la cookie). */
function secondsLeft(jwt: string): number {
  try {
    const payload = JSON.parse(Buffer.from(jwt.split(".")[1]!, "base64url").toString("utf8")) as { exp?: number };
    if (!payload.exp) return 60 * 25;
    return Math.max(0, payload.exp - Math.floor(Date.now() / 1000) - 30); // 30 s de margen
  } catch {
    return 60 * 25;
  }
}

export function writeTokens(jar: ResponseCookies, t: Tokens) {
  jar.set(ACCESS_COOKIE, t.accessToken, { httpOnly: true, secure, sameSite: "lax", path: "/", maxAge: secondsLeft(t.accessToken) });
  jar.set(REFRESH_COOKIE, t.refreshToken, { httpOnly: true, secure, sameSite: "lax", path: "/", maxAge: REFRESH_MAX_AGE });
}

export function clearTokens(jar: ResponseCookies) {
  jar.set(ACCESS_COOKIE, "", { path: "/", maxAge: 0 });
  jar.set(REFRESH_COOKIE, "", { path: "/", maxAge: 0 });
}

const inflight = new Map<string, { at: number; result: Promise<Tokens | null> }>();
const KEEP_MS = 30_000;

export function rotate(refreshToken: string, userAgent?: string | null): Promise<Tokens | null> {
  const now = Date.now();
  for (const [k, v] of inflight) if (now - v.at > KEEP_MS) inflight.delete(k);
  const hit = inflight.get(refreshToken);
  if (hit) return hit.result;

  const result = fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    headers: { "content-type": "application/json", ...(userAgent ? { "user-agent": userAgent } : {}) },
    body: JSON.stringify({ refreshToken }),
    cache: "no-store",
  })
    .then(async (r) => (r.ok ? ((await r.json()) as Tokens) : null))
    .catch(() => null);
  inflight.set(refreshToken, { at: now, result });
  return result;
}

type ForwardInit = { method: string; path: string; search?: string; body?: string; headers?: Headers };

/** Llama a la API con el access token de la cookie; si venció, rota una vez y reintenta. */
export async function callApi(
  init: ForwardInit,
  tokens: { access?: string; refresh?: string },
): Promise<{ res: Response; rotated: Tokens | null; expired: boolean }> {
  const userAgent = init.headers?.get("user-agent");
  const send = (access?: string) => {
    const headers = new Headers();
    headers.set("accept", "application/json");
    if (init.body !== undefined) headers.set("content-type", init.headers?.get("content-type") ?? "application/json");
    if (userAgent) headers.set("user-agent", userAgent);
    const fwd = init.headers?.get("x-forwarded-for");
    if (fwd) headers.set("x-forwarded-for", fwd);
    if (access) headers.set("authorization", `Bearer ${access}`);
    return fetch(`${API_URL}${init.path}${init.search ?? ""}`, { method: init.method, headers, body: init.body, cache: "no-store", redirect: "manual" });
  };

  let access = tokens.access;
  let rotated: Tokens | null = null;
  let expired = false;

  if (!access && tokens.refresh) {
    rotated = await rotate(tokens.refresh, userAgent);
    if (rotated) access = rotated.accessToken;
    else expired = true;
  }

  let res = await send(access);
  if (res.status === 401 && tokens.refresh && !rotated && !expired) {
    rotated = await rotate(tokens.refresh, userAgent);
    if (rotated) res = await send(rotated.accessToken);
    else expired = true;
  }
  return { res, rotated, expired };
}
