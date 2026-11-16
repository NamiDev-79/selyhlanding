"use client";

import { PageHeader } from "@/components/layout/app-shell";
import { CompanyBilling } from "@/features/company/management";

export default function CompanyPlanPage() {
  return (
    <>
      <PageHeader title="Plan y facturación" lead="Precios referenciales: aún no se cobra." />
      <CompanyBilling />
    </>
  );
}
