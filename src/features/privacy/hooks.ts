"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api, unwrap } from "@/lib/api/client";

export type Source = "CHECKIN" | "CALENDAR" | "IDE_GIT" | "WEARABLE" | "BIOMETRIC" | "DESKTOP" | "SLEEP";

export function useConsent() {
  return useQuery({ queryKey: ["consent"], queryFn: () => unwrap(api.GET("/consent")) });
}

export function useSetConsent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ source, granted }: { source: Source; granted: boolean }) => unwrap(api.PUT("/consent/{source}", { params: { path: { source } }, body: { granted } })),
    onSuccess: (data) => {
      qc.setQueryData(["consent"], data);
      // Revocar o conceder cambia lo que entra al cálculo de la carga.
      qc.invalidateQueries({ queryKey: ["analytics"] });
    },
  });
}
