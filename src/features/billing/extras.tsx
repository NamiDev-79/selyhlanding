"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Section } from "@/components/layout/app-shell";
import { Button, LinkButton } from "@/components/ui/button";
import { Empty, Loading, Notice } from "@/components/ui/feedback";
import { errorMessages } from "@/content/errors";
import { api, ApiError, errorText, unwrap } from "@/lib/api/client";
import { useEntitlements } from "@/features/onboarding/hooks";
import { useConsent, useSetConsent } from "@/features/privacy/hooks";

/** Explicación clara de por qué algo no está disponible (PLAN_REQUIRED), sin bloquear el resto. */
function Locked({ what }: { what: string }) {
  return (
    <div className="grid gap-4 border-l-2 border-line-strong pl-5">
      <p>
        <span className="font-medium">{what}:</span> {errorMessages.PLAN_REQUIRED} Tu plan actual no lo incluye, pero todo lo esencial sigue funcionando igual.
      </p>
      <div>
        <LinkButton href="/panel/plan" variant="secondary">
          Ver planes
        </LinkButton>
      </div>
    </div>
  );
}

function Wearables() {
  const qc = useQueryClient();
  const consent = useConsent();
  const setConsent = useSetConsent();
  const granted = consent.data?.find((c) => c.dataSource === "WEARABLE")?.granted ?? false;
  const metrics = useQuery({ queryKey: ["wearables", "metrics"], queryFn: () => unwrap(api.GET("/wearables/metrics", { params: { query: { days: 30 } } })), enabled: granted, retry: false });
  const connect = useMutation({
    mutationFn: (provider: "APPLE_HEALTH" | "HEALTH_CONNECT") => unwrap(api.POST("/wearables/connection", { body: { provider } })),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["wearables"] }),
  });
  const disconnect = useMutation({
    mutationFn: () => unwrap(api.DELETE("/wearables/connection")),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["wearables"] }),
  });

  if (consent.isPending) return <Loading />;
  if (!granted) {
    return (
      <Notice tone="neutral" title="Primero activa el permiso de wearables">
        <p>Solo usamos variabilidad cardíaca, pulso en reposo y sueño, y solo para tu propia línea base.</p>
        <Button size="sm" className="mt-3" pending={setConsent.isPending} onClick={() => setConsent.mutate({ source: "WEARABLE", granted: true })}>
          Activar permiso
        </Button>
      </Notice>
    );
  }

  return (
    <div className="grid gap-6">
      <p className="text-ink-soft">La conexión se completa desde la app móvil: allí autorizas Apple Salud o Health Connect y los datos se sincronizan solos.</p>
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" pending={connect.isPending && connect.variables === "APPLE_HEALTH"} onClick={() => connect.mutate("APPLE_HEALTH")}>
          Conectar Apple Salud
        </Button>
        <Button variant="secondary" pending={connect.isPending && connect.variables === "HEALTH_CONNECT"} onClick={() => connect.mutate("HEALTH_CONNECT")}>
          Conectar Health Connect
        </Button>
        <Button variant="ghost" pending={disconnect.isPending} onClick={() => disconnect.mutate()}>
          Desconectar
        </Button>
      </div>
      {connect.isSuccess ? <Notice tone="calm" role="status" title="Conexión registrada. Abre la app móvil para autorizar la lectura." /> : null}
      {connect.isError || disconnect.isError ? <Notice tone="attention" title={errorText(connect.error ?? disconnect.error)} /> : null}
      {metrics.data?.length ? (
        <table className="w-full text-left text-sm">
          <caption className="eyebrow pb-2 text-left">Últimos días</caption>
          <thead className="text-ink-faint">
            <tr className="border-b border-line">
              <th className="py-2 font-normal">Fecha</th>
              <th className="py-2 font-normal">HRV</th>
              <th className="py-2 font-normal">Pulso en reposo</th>
              <th className="py-2 font-normal">Sueño</th>
            </tr>
          </thead>
          <tbody className="figures">
            {metrics.data.slice(0, 10).map((m) => (
              <tr key={m.id} className="border-b border-line">
                <td className="py-2">{m.date}</td>
                <td className="py-2">{m.hrv ?? "—"}</td>
                <td className="py-2">{m.restingHr ?? "—"}</td>
                <td className="py-2">{m.sleepMinutes != null ? `${Math.floor(m.sleepMinutes / 60)} h ${m.sleepMinutes % 60} min` : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : metrics.isError && !(metrics.error instanceof ApiError && metrics.error.code === "PLAN_REQUIRED") ? (
        <Notice tone="attention" title={errorText(metrics.error)} />
      ) : (
        <Empty title="Aún no llegan datos">Aparecerán aquí cuando la app móvil sincronice tu primer día.</Empty>
      )}
    </div>
  );
}

export function ExtrasCenter() {
  const ent = useEntitlements();
  if (ent.isPending) return <Loading />;
  if (ent.isError) return <Notice tone="attention" title={errorText(ent.error)} />;
  const f = ent.data.features;

  return (
    <div className="grid gap-16">
      <Section title="Wearables" description="Suma sueño y ritmo cardíaco a tu línea base para entender mejor tu carga.">
        {f.wearables ? <Wearables /> : <Locked what="La conexión con wearables" />}
      </Section>
      <Section title="Programas guiados" description="Recorridos de 2 a 4 semanas con ejercicios breves, diseñados con nuestra psicóloga.">
        {f.guided_programs ? (
          <Empty title="Primer programa en preparación">Estamos terminando “Semanas de guardia” con revisión clínica. Te avisaremos cuando esté listo.</Empty>
        ) : (
          <Locked what="Los programas guiados" />
        )}
      </Section>
    </div>
  );
}
