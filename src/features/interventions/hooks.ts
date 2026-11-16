"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api, unwrap } from "@/lib/api/client";

export function useLibrary() {
  return useQuery({ queryKey: ["interventions", "library"], queryFn: () => unwrap(api.GET("/interventions")), staleTime: 10 * 60_000 });
}

export function useSuggestionHistory() {
  return useQuery({ queryKey: ["interventions", "history"], queryFn: () => unwrap(api.GET("/interventions/suggestions")) });
}

export function useNextSuggestion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => unwrap(api.POST("/interventions/suggestions/next", { params: { query: { manual: "true", region: "PE" } } })),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["interventions", "history"] }),
  });
}

export function useRespond() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, response }: { id: string; response: "ACCEPTED" | "POSTPONED" | "DISMISSED" }) =>
      unwrap(api.POST("/interventions/suggestions/{id}/respond", { params: { path: { id } }, body: { response } })),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["interventions", "history"] }),
  });
}

export function useFeedback() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, feedback }: { id: string; feedback: "HELPFUL" | "NOT_HELPFUL" }) =>
      unwrap(api.POST("/interventions/suggestions/{id}/feedback", { params: { path: { id } }, body: { feedback } })),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["interventions", "history"] }),
  });
}
