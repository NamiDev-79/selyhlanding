"use client";

import { PageHeader } from "@/components/layout/app-shell";
import { CompanyOverview } from "@/features/company/overview";
import { useCompany } from "@/features/company/hooks";

export default function CompanyHome() {
  const company = useCompany();
  return (
    <>
      <PageHeader eyebrow="Panel corporativo" title={company.name ?? "Tu empresa"} lead={<>Tendencias agregadas por equipo. <span className="l-accent text-brand">Nunca por persona.</span></>} />
      <CompanyOverview />
    </>
  );
}
