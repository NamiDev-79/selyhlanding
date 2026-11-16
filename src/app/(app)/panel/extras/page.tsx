"use client";

import { PageHeader } from "@/components/layout/app-shell";
import { ExtrasCenter } from "@/features/billing/extras";

export default function ExtrasPage() {
  return (
    <>
      <PageHeader title="Wearables y programas" lead="Funciones de Personal Plus. Lo esencial nunca depende de ellas." />
      <ExtrasCenter />
    </>
  );
}
