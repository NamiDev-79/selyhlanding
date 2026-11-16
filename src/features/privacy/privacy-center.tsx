"use client";

import { useState } from "react";

import { Section } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Loading, Notice } from "@/components/ui/feedback";
import { Input } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { consentCopy } from "@/content/panel";
import { api, errorText, unwrap } from "@/lib/api/client";

import { type Source, useConsent, useSetConsent } from "./hooks";

export function ConsentList() {
  const consent = useConsent();
  const set = useSetConsent();
  if (consent.isPending) return <Loading />;
  if (consent.isError) return <Notice tone="attention" title={errorText(consent.error)} />;

  return (
    <div className="grid gap-0 border-t border-line">
      {consent.data.map((row) => {
        const copy = consentCopy[row.dataSource];
        return (
          <div key={row.dataSource} className="grid gap-1 border-b border-line py-4">
            <Switch
              label={copy?.label ?? row.dataSource}
              description={copy?.body}
              checked={row.granted}
              disabled={set.isPending && set.variables?.source === row.dataSource}
              onCheckedChange={(granted) => set.mutate({ source: row.dataSource as Source, granted })}
            />
            {row.granted && row.grantedAt ? (
              <p className="figures text-[11px] text-ink-faint">activo desde {new Date(row.grantedAt).toLocaleDateString("es-PE")}</p>
            ) : null}
          </div>
        );
      })}
      {set.isError ? <Notice tone="attention" title={errorText(set.error)} /> : null}
    </div>
  );
}

export function ExportData() {
  const [state, setState] = useState<"idle" | "working" | "error">("idle");
  const download = async () => {
    setState("working");
    try {
      const data = await unwrap(api.GET("/users/me/export"));
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `selyh-mis-datos-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setState("idle");
    } catch {
      setState("error");
    }
  };
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="secondary" pending={state === "working"} onClick={download}>
        Descargar mis datos (JSON)
      </Button>
      {state === "error" ? <span role="alert" className="text-step--1 text-warm-ink">No pudimos preparar la descarga. Inténtalo de nuevo.</span> : null}
    </div>
  );
}

/** Borrado definitivo: se escribe la contraseña y una confirmación explícita, sin modales. */
export function DeleteAccount() {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const remove = async () => {
    setPending(true);
    setError(null);
    try {
      await unwrap(api.DELETE("/users/me", { body: { password } }));
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- recarga completa: la sesión terminó y se descarta todo el estado en memoria
      window.location.assign("/?cuenta=borrada");
    } catch (e) {
      setError(errorText(e));
      setPending(false);
    }
  };

  if (!open) {
    return (
      <div>
        <Button variant="secondary" onClick={() => setOpen(true)}>
          Borrar mi cuenta…
        </Button>
      </div>
    );
  }
  return (
    <div className="grid max-w-md gap-4 border-l-2 border-warm pl-5">
      <p>Se borrarán tu cuenta, tus check-ins, escalas, permisos y dispositivos. No se puede deshacer. Si quieres conservarlos, descárgalos antes.</p>
      <Input label="Tu contraseña" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <Input label='Escribe "BORRAR" para confirmar' value={confirm} onChange={(e) => setConfirm(e.target.value)} />
      {error ? <Notice tone="attention" role="alert" title={error} /> : null}
      <div className="flex flex-wrap gap-2">
        <Button disabled={!password || confirm.trim().toUpperCase() !== "BORRAR"} pending={pending} onClick={remove}>
          Borrar definitivamente
        </Button>
        <Button variant="ghost" onClick={() => setOpen(false)}>
          Cancelar
        </Button>
      </div>
    </div>
  );
}

export function PrivacyCenter() {
  return (
    <div className="grid gap-16">
      <Section title="Permisos por fuente" description="Cada fuente se activa por separado. Si revocas una, deja de usarse en el siguiente cálculo de tu carga.">
        <ConsentList />
      </Section>
      <Section title="Exportar mis datos" description="Todo lo que guardamos sobre ti, en un archivo que puedes llevarte (Ley 29733).">
        <ExportData />
      </Section>
      <Section title="Borrar mi cuenta" description="Elimina tu cuenta y todos tus datos de forma definitiva.">
        <DeleteAccount />
      </Section>
    </div>
  );
}
