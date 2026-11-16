"use client";

import { PageHeader } from "@/components/layout/app-shell";
import { MembersManager } from "@/features/company/management";

export default function MembersPage() {
  return (
    <>
      <PageHeader title="Miembros" lead="Invita por correo y mira quién ya ocupa un puesto. Aquí nunca hay datos de bienestar." />
      <MembersManager />
    </>
  );
}
