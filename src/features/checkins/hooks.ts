"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api, unwrap } from "@/lib/api/client";

export type Tag = "meeting" | "bug" | "deadline" | "oncall" | "review" | "other";

export function useDailyCheckins(days: number) {
  return useQuery({ queryKey: ["checkins", "daily", days], queryFn: () => unwrap(api.GET("/checkins/daily", { params: { query: { days } } })) });
}

export function useCreateCheckin() {
  const qc = useQueryClient();
  return useMutation({
    // La API aún no tiene "web" como origen de check-in; el panel web se registra como "desktop".
    mutationFn: (body: { score: number; tag?: Tag }) => unwrap(api.POST("/checkins", { body: { ...body, source: "desktop", clientId: crypto.randomUUID() } })),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["checkins"] });
      qc.invalidateQueries({ queryKey: ["prompts"] });
      // El recálculo del estimado corre en segundo plano en la API; se vuelve a pedir en unos segundos.
      setTimeout(() => qc.invalidateQueries({ queryKey: ["analytics"] }), 6_000);
    },
  });
}

export function useAnalytics(days = 30) {
  return useQuery({ queryKey: ["analytics", days], queryFn: () => unwrap(api.GET("/analytics/me", { params: { query: { days } } })) });
}

export function useNextPrompt() {
  return useQuery({ queryKey: ["prompts", "next"], queryFn: () => unwrap(api.GET("/prompts/next")) });
}
