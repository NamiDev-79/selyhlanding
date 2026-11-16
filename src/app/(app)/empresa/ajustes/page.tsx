"use client";

import { PageHeader } from "@/components/layout/app-shell";
import { CompanySettings } from "@/features/company/management";

export default function SettingsPage() {
  return (
    <>
      <PageHeader title="Ajustes" lead="Privacidad de los agregados y puestos contratados." />
      <CompanySettings />
    </>
  );
}
