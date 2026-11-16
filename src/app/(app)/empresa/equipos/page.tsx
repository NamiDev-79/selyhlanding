"use client";

import { PageHeader } from "@/components/layout/app-shell";
import { TeamsManager } from "@/features/company/management";

export default function TeamsPage() {
  return (
    <>
      <PageHeader title="Equipos" lead="Crea equipos y asigna personas. Las tendencias aparecen cuando un equipo alcanza el mínimo." />
      <TeamsManager />
    </>
  );
}
