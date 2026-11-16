"use client";

import { Suspense } from "react";

import { PageHeader } from "@/components/layout/app-shell";
import { Loading } from "@/components/ui/feedback";
import { scalesCopy } from "@/content/scales";
import { ScalesView } from "@/features/scales/scale-runner";

export default function ScalesPage() {
  return (
    <>
      <PageHeader title={scalesCopy.title} accent={scalesCopy.accent} lead={scalesCopy.lead} />
      <Suspense fallback={<Loading />}>
        <ScalesView />
      </Suspense>
    </>
  );
}
