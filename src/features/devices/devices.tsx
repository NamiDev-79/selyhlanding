"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { Section } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Empty, Loading, Notice } from "@/components/ui/feedback";
import { Input } from "@/components/ui/field";
import { deviceCopy } from "@/content/panel";
import { api, errorText, type Res, unwrap } from "@/lib/api/client";

const fmt = (iso: string | null) => (iso ? new Date(iso).toLocaleString("es-PE", { dateStyle: "medium", timeStyle: "short" }) : "nunca");

/** Vincular el agente o la extensión con el código XXXX-XXXX que muestran (flujo de dispositivo). */
export function LinkDevice({ initialCode = "" }: { initialCode?: string }) {
  const qc = useQueryClient();
  const [code, setCode] = useState(initialCode);
  const [found, setFound] = useState<Res<"/auth/device/lookup/{userCode}", "get"> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const normalized = code.trim().toUpperCase();

  const lookup = async () => {
    setError(null);
    setPending(true);
    try {
      setFound(await unwrap(api.GET("/auth/device/lookup/{userCode}", { params: { path: { userCode: normalized } } })));
    } catch (e) {
      setFound(null);
      setError(errorText(e));
    } finally {
      setPending(false);
    }
  };

  const decide = useMutation({
    mutationFn: (approve: boolean) => unwrap(api.POST("/auth/device/approve", { body: { userCode: normalized, approve } })),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["devices"] });
      qc.invalidateQueries({ queryKey: ["sessions"] });
    },
  });

  if (decide.isSuccess) {
    return (
      <Notice tone="calm" role="status" title={decide.data.status === "APPROVED" ? "Dispositivo vinculado" : "Vinculación rechazada"}>
        {decide.data.status === "APPROVED" ? "Vuelve a la extensión o al agente: ya puede usar tu cuenta." : "El dispositivo no tendrá acceso a tu cuenta."}
      </Notice>
    );
  }

  return (
    <div className="grid gap-4">
      <form
        className="flex flex-wrap items-end gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (normalized.length >= 8) lookup();
        }}
      >
        <Input label="Código" value={code} onChange={(e) => setCode(e.target.value)} placeholder="ABCD-1234" autoComplete="off" className="w-48 [&_input]:font-mono [&_input]:uppercase" />
        <Button type="submit" variant="secondary" pending={pending} disabled={normalized.length < 8}>
          Buscar
        </Button>
      </form>
      {error ? <Notice tone="attention" title={error} /> : null}
      {found ? (
        found.status !== "PENDING" ? (
          <Notice tone="neutral" title="Este código ya se usó o venció. Genera uno nuevo en el dispositivo." />
        ) : (
          <div className="grid gap-3 border-l-2 border-accent pl-4">
            <p>
              <span className="font-medium">{deviceCopy.platforms[found.platform] ?? found.platform}</span>
              {found.deviceName ? ` · ${found.deviceName}` : ""} quiere acceder a tu cuenta.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button pending={decide.isPending && decide.variables} onClick={() => decide.mutate(true)}>
                Aprobar
              </Button>
              <Button variant="ghost" pending={decide.isPending && !decide.variables} onClick={() => decide.mutate(false)}>
                Rechazar
              </Button>
            </div>
            {decide.isError ? <span role="alert" className="text-step--1 text-warm-ink">{errorText(decide.error)}</span> : null}
          </div>
        )
      ) : null}
    </div>
  );
}

function DeviceList() {
  const qc = useQueryClient();
  const devices = useQuery({ queryKey: ["devices"], queryFn: () => unwrap(api.GET("/devices")) });
  const remove = useMutation({
    mutationFn: (id: string) => unwrap(api.DELETE("/devices/{id}", { params: { path: { id } } })),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["devices"] }),
  });
  if (devices.isPending) return <Loading />;
  if (devices.isError) return <Notice tone="attention" title={errorText(devices.error)} />;
  if (!devices.data.length) return <Empty title="Ningún dispositivo vinculado">Instala la extensión de VS Code o el agente de escritorio y vincúlalo con un código.</Empty>;
  return (
    <ul className="grid border-t border-line">
      {devices.data.map((d) => (
        <li key={d.id} className="flex flex-wrap items-center justify-between gap-4 border-b border-line py-4">
          <div className="grid gap-0.5">
            <span className="font-medium">{d.name ?? deviceCopy.platforms[d.platform] ?? d.platform}</span>
            <span className="figures text-xs text-ink-faint">
              {deviceCopy.platforms[d.platform] ?? d.platform} · última sincronización: {fmt(d.lastSyncAt)}
            </span>
          </div>
          <Button size="sm" variant="ghost" pending={remove.isPending && remove.variables === d.id} onClick={() => remove.mutate(d.id)}>
            Desvincular
          </Button>
        </li>
      ))}
    </ul>
  );
}

function Sessions() {
  const sessions = useQuery({ queryKey: ["sessions"], queryFn: () => unwrap(api.GET("/auth/sessions")) });
  const all = useMutation({
    mutationFn: () => unwrap(api.POST("/auth/logout-all")),
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- la sesión terminó: recarga completa
    onSuccess: () => window.location.assign("/login"),
  });
  if (sessions.isPending) return <Loading />;
  if (sessions.isError) return <Notice tone="attention" title={errorText(sessions.error)} />;
  return (
    <div className="grid gap-5">
      <ul className="grid border-t border-line">
        {sessions.data.map((s) => (
          <li key={s.id} className="grid gap-0.5 border-b border-line py-3">
            <span className="text-[0.95rem]">{s.deviceId ? "Dispositivo vinculado" : summarizeAgent(s.userAgent)}</span>
            <span className="figures text-xs text-ink-faint">
              desde {fmt(s.createdAt)} · vence {fmt(s.expiresAt)}
            </span>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="secondary" pending={all.isPending} onClick={() => all.mutate()}>
          Cerrar todas las sesiones
        </Button>
        <span className="text-step--1 text-ink-faint">Incluida esta. Tendrás que volver a entrar en cada dispositivo.</span>
      </div>
    </div>
  );
}

function summarizeAgent(ua: string | null) {
  if (!ua) return "Sesión";
  const browser = /Firefox/.test(ua) ? "Firefox" : /Edg\//.test(ua) ? "Edge" : /Chrome/.test(ua) ? "Chrome" : /Safari/.test(ua) ? "Safari" : "Navegador";
  const os = /Windows/.test(ua) ? "Windows" : /Mac OS/.test(ua) ? "macOS" : /Android/.test(ua) ? "Android" : /iPhone|iPad/.test(ua) ? "iOS" : /Linux/.test(ua) ? "Linux" : "";
  return os ? `${browser} en ${os}` : browser;
}

export function DevicesCenter() {
  return (
    <div className="grid gap-16">
      <Section title={deviceCopy.linkTitle} description={deviceCopy.linkBody}>
        <LinkDevice />
      </Section>
      <Section title="Dispositivos">
        <DeviceList />
      </Section>
      <Section title="Sesiones abiertas" description="Cada inicio de sesión en un navegador o dispositivo.">
        <Sessions />
      </Section>
    </div>
  );
}
