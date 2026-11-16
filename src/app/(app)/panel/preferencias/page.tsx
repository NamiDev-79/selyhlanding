"use client";

import { PageHeader } from "@/components/layout/app-shell";
import { PreferencesForm } from "@/features/preferences/preferences-form";

export default function PreferencesPage() {
  return (
    <>
      <PageHeader title="Preferencias" lead="Cuándo y cuánto aparece Selyh en tu día." />
      <PreferencesForm />
    </>
  );
}
