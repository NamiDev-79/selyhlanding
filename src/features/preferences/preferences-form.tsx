"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { Section } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Loading, Notice } from "@/components/ui/feedback";
import { Input } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { api, errorText, type Res, unwrap } from "@/lib/api/client";

type Prefs = Res<"/preferences", "get">;

/** Recordatorios, horas de silencio, modo foco y tope de sugerencias. Cada cambio se guarda al momento. */
export function PreferencesForm() {
  const qc = useQueryClient();
  const prefs = useQuery({ queryKey: ["preferences"], queryFn: () => unwrap(api.GET("/preferences")) });
  const save = useMutation({
    mutationFn: (body: Partial<Prefs>) => unwrap(api.PATCH("/preferences", { body })),
    onSuccess: (data) => {
      qc.setQueryData(["preferences"], data);
      qc.invalidateQueries({ queryKey: ["prompts"] });
    },
  });
  const [newTime, setNewTime] = useState("10:00");

  if (prefs.isPending) return <Loading />;
  if (prefs.isError) return <Notice tone="attention" title={errorText(prefs.error)} />;
  const p = prefs.data;

  return (
    <div className="grid gap-16">
      <Section title="Recordatorios">
        <div className="grid gap-6">
          <Switch label="Recordarme hacer check-in" description="Un aviso discreto en la extensión o el agente." checked={p.checkinReminders} onCheckedChange={(v) => save.mutate({ checkinReminders: v })} />
          <div className="grid gap-3">
            <p className="text-sm font-medium">Horas de recordatorio</p>
            <ul className="flex flex-wrap gap-2">
              {p.reminderTimes.map((t) => (
                <li key={t} className="flex items-center gap-1 rounded-full border border-line-strong py-1 pl-3 pr-1 font-mono text-sm">
                  {t}
                  <button aria-label={`Quitar ${t}`} className="grid size-6 place-items-center rounded-full text-ink-faint hover:bg-paper-3 hover:text-ink" onClick={() => save.mutate({ reminderTimes: p.reminderTimes.filter((x) => x !== t) })}>
                    ×
                  </button>
                </li>
              ))}
              {!p.reminderTimes.length ? <li className="text-step--1 text-ink-faint">Sin horas fijas: te sugerimos según tus horarios habituales.</li> : null}
            </ul>
            {p.reminderTimes.length < 6 ? (
              <div className="flex items-end gap-2">
                <Input label="Agregar hora" type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} className="w-36" />
                <Button
                  variant="secondary"
                  disabled={!newTime || p.reminderTimes.includes(newTime)}
                  onClick={() => save.mutate({ reminderTimes: [...p.reminderTimes, newTime].sort() })}
                >
                  Agregar
                </Button>
              </div>
            ) : null}
          </div>
          <Switch label="Resumen semanal" description="Cómo te fue en la semana, sin cifras alarmantes." checked={p.weeklySummary} onCheckedChange={(v) => save.mutate({ weeklySummary: v })} />
        </div>
      </Section>

      <Section title="Horas de silencio" description="En este horario no te mostramos nada: ni check-ins ni sugerencias.">
        <div className="flex flex-wrap items-end gap-3">
          <Input label="Desde" type="time" defaultValue={p.quietHoursStart ?? ""} onBlur={(e) => save.mutate({ quietHoursStart: e.target.value || null })} className="w-36" />
          <Input label="Hasta" type="time" defaultValue={p.quietHoursEnd ?? ""} onBlur={(e) => save.mutate({ quietHoursEnd: e.target.value || null })} className="w-36" />
          {p.quietHoursStart || p.quietHoursEnd ? (
            <Button variant="ghost" onClick={() => save.mutate({ quietHoursStart: null, quietHoursEnd: null })}>
              Quitar
            </Button>
          ) : null}
        </div>
      </Section>

      <Section title="Foco y sugerencias">
        <div className="grid gap-6">
          <Switch label="Modo foco" description="Solo aparecemos en pausas naturales: después de un commit, tras un rato de inactividad o al cerrar la sesión." checked={p.focusMode} onCheckedChange={(v) => save.mutate({ focusMode: v })} />
          <fieldset className="grid gap-2">
            <legend className="mb-2 font-medium">Tope de sugerencias al día</legend>
            <div className="flex gap-2">
              {[0, 1, 2, 3].map((n) => (
                <button
                  key={n}
                  aria-pressed={p.dailySuggestionCap === n}
                  onClick={() => save.mutate({ dailySuggestionCap: n })}
                  className="grid size-11 place-items-center rounded-ui border border-line-strong font-mono transition-colors hover:border-ink aria-pressed:border-accent-strong aria-pressed:bg-accent-strong aria-pressed:text-on-accent"
                >
                  {n}
                </button>
              ))}
            </div>
            <p className="text-step--1 text-ink-faint">0 desactiva las sugerencias automáticas. Siempre puedes pedir un ejercicio.</p>
          </fieldset>
        </div>
      </Section>

      <div aria-live="polite" className="min-h-6 text-step--1">
        {save.isPending ? <span className="text-ink-faint">Guardando…</span> : save.isSuccess ? <span className="text-accent-strong">Guardado.</span> : null}
        {save.isError ? <span className="text-warm-ink">{errorText(save.error)}</span> : null}
      </div>
    </div>
  );
}
