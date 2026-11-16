"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api, unwrap } from "@/lib/api/client";
import { meKey } from "@/features/auth/hooks";

export type PlanChoice = { plan: "PERSONAL_BASIC" | "PERSONAL_PLUS" | "CORPORATE"; companyName?: string; seats?: number };

export function usePlans() {
  return useQuery({ queryKey: ["plans"], queryFn: () => unwrap(api.GET("/plans")), staleTime: 5 * 60_000 });
}

export function useEntitlements() {
  return useQuery({ queryKey: ["entitlements"], queryFn: () => unwrap(api.GET("/subscription/me")) });
}

/** Elegir plan (primer ingreso o cambio posterior) y omitir. Ambos refrescan la cuenta y el plan. */
export function useChoosePlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: PlanChoice) => unwrap(api.POST("/onboarding/plan", { body })),
    onSuccess: async () => {
      await Promise.all([qc.invalidateQueries({ queryKey: meKey }), qc.invalidateQueries({ queryKey: ["entitlements"] }), qc.invalidateQueries({ queryKey: ["companies"] })]);
    },
  });
}

export function useSkipPlans() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => unwrap(api.POST("/onboarding/skip")),
    onSuccess: () => qc.invalidateQueries({ queryKey: meKey }),
  });
}
