"use client";

import { motion } from "motion/react";
import { useState } from "react";

import { Empty, Loading, Notice } from "@/components/ui/feedback";
import { checkinCopy } from "@/content/panel";
import { errorText } from "@/lib/api/client";
import { useScaleCatalog, useScaleHistory } from "@/features/scales/hooks";

import { useDailyCheckins } from "./hooks";

const RANGES = [30, 90, 180] as const;

/** Promedio diario de check-ins como columnas finas (1 abajo, 5 arriba); los días sin dato quedan vacíos. */
export function CheckinHistory() {
  const [days, setDays] = useState<(typeof RANGES)[number]>(30);
  const q = useDailyCheckins(days);

  return (
    <section className="p-card grid gap-5 p-[clamp(18px,2.6vw,26px)]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="p-h2">Check-ins por día</h2>
        <div role="group" aria-label="Rango" className="flex gap-1 rounded-full bg-[var(--app-card-2)] p-1">
          {RANGES.map((r) => (
            <button key={r} type="button" aria-pressed={days === r} onClick={() => setDays(r)} className="relative h-8 rounded-full px-3.5 text-[13px] tabular-nums text-muted-foreground aria-pressed:font-medium aria-pressed:text-foreground">
              {days === r ? <motion.span layoutId="range-pill" transition={{ type: "spring", stiffness: 420, damping: 34 }} className="absolute inset-0 rounded-full bg-[var(--app-card)] shadow-[var(--app-shadow)] ring-1 ring-[var(--app-edge)]" /> : null}
              <span className="relative">{r} días</span>
            </button>
          ))}
        </div>
      </div>
      {q.isPending ? <Loading /> : null}
      {q.isError ? <Notice tone="attention" title={errorText(q.error)} /> : null}
      {q.data && !q.data.length ? <Empty title="Sin check-ins en este rango">Haz tu primer check-in desde Inicio o desde la extensión del editor.</Empty> : null}
      {q.data?.length ? <DailyBars rows={q.data} days={days} /> : null}
    </section>
  );
}

function DailyBars({ rows, days }: { rows: { date: string; avg: number; count: number }[]; days: number }) {
  const byDate = new Map(rows.map((r) => [r.date, r]));
  const today = new Date();
  const cells = Array.from({ length: days }, (_, i) => {
    const d = new Date(today.getTime() - (days - 1 - i) * 86_400_000);
    const key = d.toLocaleDateString("en-CA"); // YYYY-MM-DD en la zona local
    return { key, row: byDate.get(key) };
  });
  const label = (v: number) => checkinCopy.scale[Math.round(v) - 1]?.label ?? "";
  const avg = rows.reduce((a, r) => a + r.avg, 0) / rows.length;

  return (
    <figure className="grid gap-3">
      <div key={days} className="flex h-40 items-end gap-[2px] border-b border-[var(--app-edge)]" role="img" aria-label={`Promedio diario de check-ins en ${days} días. Promedio del periodo: ${avg.toFixed(1)} (${label(avg)}).`}>
        {cells.map(({ key, row }, i) => (
          <div key={key} className="flex h-full flex-1 items-end" title={row ? `${key}: ${row.avg} (${row.count})` : `${key}: sin dato`}>
            {row ? (
              <motion.div
                className={`w-full origin-bottom rounded-t-full ${row.avg >= 4 ? "bg-[#6363f1]" : "bg-[#a2a2fa]/70"}`}
                style={{ height: `${(row.avg / 5) * 100}%` }}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: Math.min(i * (0.6 / days), 0.6) }}
              />
            ) : null}
          </div>
        ))}
      </div>
      <figcaption className="flex flex-wrap justify-between gap-2 text-[12px] text-muted-foreground">
        <span>hace {days} días</span>
        <span>
          promedio {avg.toFixed(1)} · {label(avg).toLowerCase()}
        </span>
        <span>hoy</span>
      </figcaption>
    </figure>
  );
}

/** Evolución de cada escala: puntaje sobre el máximo, del más antiguo al más reciente. */
export function ScaleEvolution() {
  const catalog = useScaleCatalog();
  const history = useScaleHistory();
  if (history.isPending || catalog.isPending) return <Loading />;
  if (history.isError) return <Notice tone="attention" title={errorText(history.error)} />;
  if (!history.data.length) return <Empty title="Aún no hay escalas respondidas">Responde una escala en la sección Escalas. Verás aquí cómo cambia con las semanas.</Empty>;

  return (
    <dl className="grid">
      {(catalog.data ?? []).map((s) => {
        const rows = history.data.filter((h) => h.instrument === s.code).reverse();
        if (!rows.length) return null;
        return (
          <div key={s.code} className="grid gap-3 border-b border-[var(--app-edge)] py-5 first:pt-0 last:border-0 last:pb-0 sm:grid-cols-[12rem_1fr] sm:gap-8">
            <dt className="grid content-start gap-1">
              <span className="font-medium">{s.name}</span>
              <span className="figures text-xs text-ink-faint">máx. {s.maxScore}</span>
            </dt>
            <dd className="flex flex-wrap items-end gap-3">
              {rows.map((r) => (
                <span key={r.id} className="grid justify-items-center gap-1">
                  <span className="flex h-16 w-7 items-end overflow-hidden rounded-full bg-brand-tint">
                    <span className="w-full rounded-full bg-[#6363f1]" style={{ height: `${(r.totalScore / s.maxScore) * 100}%` }} />
                  </span>
                  <span className="figures text-[11px]">{r.totalScore}</span>
                  <span className="figures text-[10px] text-ink-faint">{new Date(r.completedAt).toLocaleDateString("es-PE", { day: "2-digit", month: "2-digit" })}</span>
                </span>
              ))}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
