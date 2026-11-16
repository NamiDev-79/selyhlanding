"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api, bff, type Res, unwrap } from "@/lib/api/client";

export type Me = Res<"/users/me", "get">;

export const meKey = ["me"] as const;

export function useMe() {
  return useQuery({ queryKey: meKey, queryFn: () => unwrap(api.GET("/users/me")) });
}

export function useLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => bff("/api/auth/logout", { method: "POST" }),
    onSettled: () => {
      qc.clear();
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- recarga completa: la sesión terminó y se descarta todo el estado en memoria
      window.location.assign("/");
    },
  });
}

export function useResendVerification() {
  return useMutation({ mutationFn: () => unwrap(api.POST("/auth/resend-verification")) });
}

/** Solo rutas internas: evita redirecciones abiertas a otros dominios. */
export function safeNext(next: string | null | undefined): string | null {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/api/")) return null;
  return next;
}
