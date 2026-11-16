"use client";

import { PageHeader } from "@/components/layout/app-shell";
import { DevicesCenter } from "@/features/devices/devices";

export default function DevicesPage() {
  return (
    <>
      <PageHeader title="Dispositivos y sesiones" lead="La extensión, el agente y la app, y dónde tienes la sesión abierta." />
      <DevicesCenter />
    </>
  );
}
