"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { api, errorText, type Res, unwrap } from "@/lib/api/client";

type Resource = Res<"/crisis/resources", "get">[number];

const href = (contact: string) => {
  const url = contact.match(/https?:\/\/\S+/)?.[0];
  if (url) return url;
  const phone = contact.match(/\b\d{3}\b/)?.[0];
  return phone ? `tel:${phone}` : undefined;
};

/**
 * Recursos de ayuda humana. Se muestran ANTES que cualquier otra cosa cuando una respuesta
 * indica posible riesgo. Tono sereno, sin alarmas: lo importante es que la persona sepa a quién llamar.
 */
export function CrisisResources({ resources, title = "No tienes que pasar por esto a solas", lead }: { resources: Resource[]; title?: string; lead?: string }) {
  return (
    <section role="alert" aria-labelledby="crisis-title" className="grid gap-5 rounded-ui border border-accent/40 bg-accent-wash px-6 py-6">
      <div className="grid gap-2">
        <h2 id="crisis-title" className="text-step-3">
          {title}
        </h2>
        <p className="max-w-[56ch] text-ink-soft">
          {lead ??
            "Gracias por responder con honestidad. Hablar hoy con alguien puede ayudar mucho. Estas líneas atienden personas, de forma gratuita. Tu empresa no recibe esta información."}
        </p>
      </div>
      <ul className="grid gap-2">
        {resources.map((r) => {
          const link = href(r.contactInfo);
          return (
            <li key={r.id} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-t border-accent/30 pt-2">
              <span className="font-medium">{r.name}</span>
              {link ? (
                <a href={link} className="link figures text-sm">
                  {r.contactInfo}
                </a>
              ) : (
                <span className="figures text-sm">{r.contactInfo}</span>
              )}
            </li>
          );
        })}
      </ul>
      <p className="text-step--1 text-ink-soft">Si estás en peligro inmediato, llama al 106 o acude a la emergencia más cercana.</p>
    </section>
  );
}

/** Alertas abiertas de la propia persona (solo ella las ve y las cierra). */
export function OpenCrisisFlags() {
  const qc = useQueryClient();
  const flags = useQuery({ queryKey: ["crisis", "flags"], queryFn: () => unwrap(api.GET("/crisis/flags/mine")) });
  const open = flags.data?.filter((f) => f.resolvedAt == null) ?? [];
  const resources = useQuery({
    queryKey: ["crisis", "resources"],
    queryFn: () => unwrap(api.GET("/crisis/resources", { params: { query: { region: "PE" } } })),
    enabled: open.length > 0,
  });
  const resolve = useMutation({
    mutationFn: (id: string) => unwrap(api.PATCH("/crisis/flags/{id}/resolve", { params: { path: { id } }, body: {} })),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["crisis"] }),
  });

  if (!open.length || !resources.data) return null;
  return (
    <div className="grid gap-3">
      <CrisisResources resources={resources.data} title="Estamos pendientes de ti" lead="Hace poco una de tus respuestas mostró que podrías estar pasando un momento difícil. Mientras tanto, no te sugeriremos ejercicios ligeros." />
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="secondary" size="sm" pending={resolve.isPending} onClick={() => open.forEach((f) => resolve.mutate(f.id))}>
          Ya hablé con alguien / estoy mejor
        </Button>
        {resolve.isError ? <span role="alert" className="text-step--1 text-warm-ink">{errorText(resolve.error)}</span> : null}
      </div>
    </div>
  );
}
