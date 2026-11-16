"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api, unwrap } from "@/lib/api/client";
import type { paths } from "@/lib/api/schema";

export type ScaleCode = paths["/scales/{code}/progress"]["put"]["parameters"]["path"]["code"];

export function useScaleCatalog() {
  return useQuery({ queryKey: ["scales", "catalog"], queryFn: () => unwrap(api.GET("/scales")), staleTime: 10 * 60_000 });
}

export function useScaleProgress() {
  return useQuery({ queryKey: ["scales", "progress"], queryFn: () => unwrap(api.GET("/scales/progress")) });
}

export function useScaleHistory(code?: string) {
  return useQuery({ queryKey: ["scales", "history", code ?? "all"], queryFn: () => unwrap(api.GET("/scales/history", { params: { query: code ? { code } : {} } })) });
}

export function useSaveAnswers(code: ScaleCode) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (answers: { index: number; value: number }[]) => unwrap(api.PUT("/scales/{code}/progress", { params: { path: { code }, query: { region: "PE" } }, body: { answers } })),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["scales", "progress"] });
      qc.invalidateQueries({ queryKey: ["prompts"] });
    },
  });
}

export function useCompleteScale(code: ScaleCode) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => unwrap(api.POST("/scales/{code}/progress/complete", { params: { path: { code }, query: { region: "PE" } }, body: { source: "web" } })),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["scales"] });
      qc.invalidateQueries({ queryKey: ["prompts"] });
      qc.invalidateQueries({ queryKey: ["crisis"] });
    },
  });
}

export function useResetScale(code: ScaleCode) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => unwrap(api.DELETE("/scales/{code}/progress", { params: { path: { code } } })),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["scales", "progress"] }),
  });
}
