"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { Wordmark } from "@/components/layout/wordmark";
import { LinkButton } from "@/components/ui/button";
import { deviceCopy } from "@/content/panel";
import { LinkDevice } from "@/features/devices/devices";

/** Página que abre el dispositivo (verificationUri): /device?code=XXXX-XXXX. */
function DeviceApproval() {
  const code = useSearchParams().get("code") ?? "";
  return <LinkDevice initialCode={code} />;
}

export default function DevicePage() {
  return (
    <main id="contenido" className="wrap grid max-w-xl gap-8 py-16">
      <Wordmark />
      <header className="grid gap-2">
        <h1 className="text-step-4">{deviceCopy.linkTitle}</h1>
        <p className="text-ink-soft">Confirma que el código coincide con el que ves en tu dispositivo.</p>
      </header>
      <Suspense>
        <DeviceApproval />
      </Suspense>
      <div>
        <LinkButton href="/panel/dispositivos" variant="quiet">
          Ir a mis dispositivos
        </LinkButton>
      </div>
    </main>
  );
}
