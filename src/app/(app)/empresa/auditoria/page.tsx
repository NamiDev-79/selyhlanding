"use client";

import { PageHeader } from "@/components/layout/app-shell";
import { AuditLog } from "@/features/company/management";

export default function AuditPage() {
  return (
    <>
      <PageHeader title="Auditoría" lead="Cada acceso de la administración a información de la empresa. También queda registrado que lo abriste." />
      <AuditLog />
    </>
  );
}
