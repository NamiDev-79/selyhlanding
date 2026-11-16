"use client";

import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";

import { ApiError } from "./client";

/* eslint-disable @next/next/no-location-assign-relative-destination -- fuera de React: recarga completa a propósito */
/** Reacciones globales: sesión vencida → login; cuenta corporativa pendiente → su pantalla de plan. */
function onGlobalError(error: unknown) {
  if (!(error instanceof ApiError) || typeof window === "undefined") return;
  const here = window.location.pathname + window.location.search;
  if (error.status === 401 && !here.startsWith("/login")) {
    window.location.assign(`/login?next=${encodeURIComponent(here)}`);
  } else if (error.code === "CORPORATE_PLAN_REQUIRED" && !here.startsWith("/plan-corporativo")) {
    window.location.assign("/plan-corporativo");
  }
}

/* eslint-enable @next/next/no-location-assign-relative-destination */

export function QueryProvider({ children }: { children: ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({ onError: onGlobalError }),
        mutationCache: new MutationCache({ onError: onGlobalError }),
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            refetchOnWindowFocus: false,
            retry: (count, error) => !(error instanceof ApiError && error.status > 0 && error.status < 500) && count < 2,
          },
        },
      }),
  );
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
