"use client";

import { PageHeader, Section } from "@/components/layout/app-shell";
import { Library, SuggestionHistory, SuggestionNow } from "@/features/interventions/suggestions";

export default function InterventionsPage() {
  return (
    <>
      <PageHeader title="Pausas" accent="a tu medida." lead="Pausas de 1 a 5 minutos. Opcionales, silenciables y con tope diario." />
      <div className="grid gap-5">
        <SuggestionNow />
        <Section title="Tus sugerencias" description="Lo que te propusimos y si te sirvió. Con eso ajustamos lo que viene.">
          <SuggestionHistory />
        </Section>
        <Section title="Biblioteca" description="Todos los ejercicios aprobados por nuestra psicóloga.">
          <Library />
        </Section>
      </div>
    </>
  );
}
