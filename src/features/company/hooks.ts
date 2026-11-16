"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, use } from "react";

import { api, unwrap } from "@/lib/api/client";

export type CompanyInfo = { companyId: string; name?: string; minAggregationSize?: number };

export const CompanyContext = createContext<CompanyInfo | null>(null);

export function useCompany(): CompanyInfo {
  const c = use(CompanyContext);
  if (!c) throw new Error("useCompany fuera del panel corporativo");
  return c;
}

/** Empresa que administra la persona (la primera con rol ADMIN). */
export function useAdminCompany() {
  return useQuery({
    queryKey: ["companies", "mine"],
    queryFn: async () => (await unwrap(api.GET("/companies/mine"))).find((m) => m.role === "ADMIN") ?? null,
  });
}

const p = (companyId: string) => ({ params: { path: { companyId } } });

export function useTeams(companyId: string) {
  return useQuery({ queryKey: ["companies", companyId, "teams"], queryFn: () => unwrap(api.GET("/companies/{companyId}/teams", p(companyId))) });
}

export function useMembers(companyId: string) {
  return useQuery({ queryKey: ["companies", companyId, "members"], queryFn: () => unwrap(api.GET("/companies/{companyId}/members", p(companyId))) });
}

export function useInvites(companyId: string) {
  return useQuery({ queryKey: ["companies", companyId, "invites"], queryFn: () => unwrap(api.GET("/companies/{companyId}/invites", p(companyId))) });
}

export function useSeats(companyId: string) {
  return useQuery({ queryKey: ["companies", companyId, "subscription"], queryFn: () => unwrap(api.GET("/companies/{companyId}/subscription", p(companyId))) });
}

export function useAudit(companyId: string) {
  return useQuery({ queryKey: ["companies", companyId, "audit"], queryFn: () => unwrap(api.GET("/companies/{companyId}/audit-log", p(companyId))) });
}

export function useTeamMetrics(companyId: string, teamId: string) {
  return useQuery({
    queryKey: ["companies", companyId, "metrics", teamId],
    queryFn: () => unwrap(api.GET("/companies/{companyId}/teams/{teamId}/metrics", { params: { path: { companyId, teamId }, query: {} } })),
  });
}

/** Invalida todo lo de la empresa (incluido el registro de auditoría, que crece con cada acceso). */
export function useCompanyMutation<TArgs, TResult>(companyId: string, fn: (args: TArgs) => Promise<TResult>) {
  const qc = useQueryClient();
  return useMutation({ mutationFn: fn, onSuccess: () => qc.invalidateQueries({ queryKey: ["companies", companyId] }) });
}
