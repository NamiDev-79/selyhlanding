import createClient from "openapi-fetch";

import { errorMessages, networkError, statusMessages } from "@/content/errors";

import type { paths } from "./schema";

/**
 * Cliente tipado generado desde openapi.json (`npm run sdk`). Habla con el BFF de Next
 * (/api/backend), que agrega la sesión. Si la API cambia, el compilador avisa.
 */
export const api = createClient<paths>({ baseUrl: "/api/backend" });

type Json<T> = T extends { content: { "application/json": infer J } } ? J : never;
type Ok<R> = R extends { 200: infer A } ? Json<A> : R extends { 201: infer B } ? Json<B> : never;

/** Tipo de la respuesta exitosa de un endpoint: `Res<"/users/me", "get">`. */
export type Res<P extends keyof paths, M extends keyof paths[P]> = paths[P][M] extends { responses: infer R } ? Ok<R> : never;

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string | undefined,
    message: string,
    readonly fields: { path: string; message: string }[] = [],
  ) {
    super(message);
  }
}

type ErrorBody = { message?: string | string[]; code?: string; errors?: { path: string; message: string }[] };

export function toApiError(status: number, body: unknown): ApiError {
  const b = (body ?? {}) as ErrorBody;
  const apiMessage = Array.isArray(b.message) ? b.message.join(". ") : b.message;
  const text = (b.code && errorMessages[b.code]) || (status >= 500 ? statusMessages[500] : apiMessage) || statusMessages[status] || statusMessages[500]!;
  return new ApiError(status, b.code, text, b.errors ?? []);
}

/** Convierte la respuesta de openapi-fetch en datos o en un ApiError con texto listo para mostrar. */
export async function unwrap<T>(call: Promise<{ data?: T; error?: unknown; response: Response }>): Promise<T> {
  let result: { data?: T; error?: unknown; response: Response };
  try {
    result = await call;
  } catch {
    throw new ApiError(0, "NETWORK", networkError);
  }
  if (!result.response.ok) throw toApiError(result.response.status, result.error);
  return result.data as T;
}

/** Llamada a las rutas propias del BFF (/api/auth/*), que no están en el contrato de la API. */
export async function bff<T>(path: string, init: { method?: string; body?: unknown } = {}): Promise<T> {
  let res: Response;
  try {
    res = await fetch(path, {
      method: init.method ?? (init.body ? "POST" : "GET"),
      headers: { "content-type": "application/json" },
      body: init.body === undefined ? undefined : JSON.stringify(init.body),
      cache: "no-store",
    });
  } catch {
    throw new ApiError(0, "NETWORK", networkError);
  }
  const json = await res.json().catch(() => null);
  if (!res.ok) throw toApiError(res.status, json);
  return json as T;
}

export const errorText = (e: unknown) => (e instanceof ApiError ? e.message : networkError);
