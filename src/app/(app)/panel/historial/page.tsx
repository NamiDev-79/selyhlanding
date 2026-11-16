"use client";

import { PageHeader, Section } from "@/components/layout/app-shell";
import { LoadSummary } from "@/features/analytics/load-summary";
import { CheckinHistory, ScaleEvolution } from "@/features/checkins/history";

export default function HistoryPage() {
  return (
    <>
      <PageHeader title="Historial" lead="Cómo vienes en el tiempo, siempre comparado contigo." />
      <div className="grid gap-5">
        <CheckinHistory />
        <LoadSummary days={90} compact />
        <Section title="Escalas" description="Cada barra es una vez que respondiste. Más alto no siempre es peor: en WHO-5, más alto es más bienestar.">
          <ScaleEvolution />
        </Section>
      </div>
    </>
  );
}
