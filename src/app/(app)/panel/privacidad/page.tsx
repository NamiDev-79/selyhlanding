"use client";

import { PageHeader } from "@/components/layout/app-shell";
import { PrivacyCenter } from "@/features/privacy/privacy-center";

export default function PrivacyPage() {
  return (
    <>
      <PageHeader title="Privacidad" lead="Tú decides qué datos entran, y puedes llevártelos o borrarlos cuando quieras." />
      <PrivacyCenter />
    </>
  );
}
