"use client";

import { PageHeader } from "@/components/layout/app-shell";
import { Loading } from "@/components/ui/feedback";
import { useMe } from "@/features/auth/hooks";
import { PlanCenter } from "@/features/billing/plan-center";

export default function PlanPage() {
  const me = useMe();
  return (
    <>
      <PageHeader title="Plan" lead="Precios referenciales: aún no se cobra." />
      {me.data ? <PlanCenter me={me.data} /> : <Loading />}
    </>
  );
}
