"use client";

import { Check, NotebookPen, PersonStanding, Wind } from "lucide-react";
import { m, useInView } from "motion/react";
import { useRef, useState } from "react";

import { how } from "@/content/landing";
import { sampleTrend, sampleTrendExerciseAt, sampleTrendRisingAt } from "@/content/sample-data";
import { cn } from "@/lib/utils";

import { SampleNote } from "./ui";

/** Check-in del 1 al 5 y los 14 días de calibración, que se llenan al entrar en pantalla. */
export function CalibrationVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [picked, setPicked] = useState(3);
  const n = how.notice;

  return (
    <div ref={ref} className="l-elev-2 grid gap-[var(--s4)] rounded-[16px] border border-hairline bg-surface p-[var(--s4)] sm:p-[var(--s5)]">
      <fieldset>
        <legend className="font-display text-[26px] font-semibold tracking-[-0.02em]">{n.scaleLabel}</legend>
        <div className="mt-[var(--s3)] grid grid-cols-5 gap-2">
          {n.scale.map((label, i) => (
            <button
              key={label}
              type="button"
              aria-pressed={picked === i + 1}
              onClick={() => setPicked(i + 1)}
              className={cn(
                "grid min-h-[68px] place-items-center gap-1 rounded-[10px] border px-1 py-2 transition-[background-color,border-color,color] duration-200",
                picked === i + 1 ? "border-[#6363f1] bg-[#6363f1] text-white" : "border-hairline hover:border-[#a2a2fa]",
              )}
            >
              <span className="font-display text-[22px] font-bold tabular-nums leading-none">{i + 1}</span>
              <span className={cn("text-center text-[12px] leading-tight", picked === i + 1 ? "text-white/85" : "text-muted-foreground")}>{label}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <div className="border-t border-hairline pt-[var(--s4)]">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-[15px] font-medium">{n.calibrating}</p>
          <p className="text-[13px] tabular-nums text-muted-foreground">
            {inView ? 9 : 0} de {n.days} días
          </p>
        </div>
        <div className="mt-[var(--s2)] grid grid-cols-7 gap-1.5 sm:grid-cols-14" aria-hidden>
          {Array.from({ length: n.days }, (_, i) => (
            <span
              key={i}
              className={cn("h-7 rounded-[6px] transition-colors duration-[620ms]", inView && i < 9 ? (i === 8 ? "bg-[#a2a2fa]" : "bg-[#6363f1]") : "bg-surface-raised")}
              style={{ transitionDelay: `${i * 62}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/** Tu carga (línea) frente a tu rango habitual (banda), con el momento en que subió y en que volvió. */
export function LoadChart() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const u = how.understand;
  const W = 560;
  const H = 260;
  const pad = 26;
  const x = (i: number) => pad + (i / (sampleTrend.length - 1)) * (W - pad * 2);
  const y = (z: number) => H / 2 + 20 - z * 92;
  const pts = sampleTrend.map((z, i) => `${x(i).toFixed(1)},${y(z).toFixed(1)}`).join(" ");
  const peak = sampleTrend.indexOf(Math.max(...sampleTrend));

  return (
    <div ref={ref} className="l-elev-2 rounded-[16px] border border-hairline bg-surface p-[var(--s4)] sm:p-[var(--s5)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-display text-[20px] font-semibold tracking-[-0.01em]">{u.chartTitle}</p>
        <SampleNote>{u.note}</SampleNote>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="mt-[var(--s3)] block w-full" role="img" aria-label="Gráfico de ejemplo: la carga se mantiene en el rango habitual, sube durante unos días y vuelve al rango después de hacer pausas.">
        <rect x={pad} y={y(0.5)} width={W - pad * 2} height={y(-0.5) - y(0.5)} rx="6" fill="#a2a2fa" opacity="0.2" />
        <text x={pad + 10} y={y(-0.5) - 10} className="fill-[var(--muted-foreground)] text-[13px]">
          {u.band}
        </text>
        <line x1={x(sampleTrendRisingAt)} x2={x(sampleTrendRisingAt)} y1={pad} y2={H - pad} stroke="var(--hairline)" strokeDasharray="4 6" />
        <line x1={x(sampleTrendExerciseAt)} x2={x(sampleTrendExerciseAt)} y1={pad} y2={H - pad} stroke="var(--hairline)" strokeDasharray="4 6" />
        <polyline pathLength={1} data-on={inView} className="l-draw" points={pts} fill="none" stroke="#6363f1" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={x(peak)} cy={y(sampleTrend[peak])} r="6" fill="#6363f1" className={cn("transition-opacity duration-[620ms] delay-1000", inView ? "opacity-100" : "opacity-0")} />
        <circle cx={x(sampleTrend.length - 1)} cy={y(sampleTrend[sampleTrend.length - 1])} r="6" fill="var(--surface)" stroke="#6363f1" strokeWidth="3" className={cn("transition-opacity duration-[620ms] delay-1000", inView ? "opacity-100" : "opacity-0")} />
      </svg>

      <div className="mt-[var(--s2)] grid gap-2 text-[14px] sm:grid-cols-2">
        <p className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-[#6363f1]" aria-hidden /> {u.callout}
        </p>
        <p className="flex items-center gap-2 text-muted-foreground sm:justify-end">
          <span className="size-2.5 rounded-full border-2 border-[#6363f1]" aria-hidden /> {u.afterPause}
        </p>
      </div>
    </div>
  );
}

const kindIcon = { breathe: Wind, move: PersonStanding, think: NotebookPen } as const;

/**
 * Qué es una pausa de Selyh, en concreto: tres tipos de ejercicio con su duración y lo que haces,
 * y las reglas que la hacen respetuosa (tope diario, silencio, nunca en reuniones).
 */
export function PauseKinds() {
  const p = how.pause;
  return (
    <div className="grid gap-[var(--s3)]">
      <ul className="grid gap-[var(--s2)]">
        {p.kinds.map((k, i) => {
          const Icon = kindIcon[k.id];
          return (
            <m.li
              key={k.id}
              initial={{ opacity: 0, x: 26 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.12 }}
              whileHover={{ x: 4 }}
              className="l-elev-1 flex items-start gap-[var(--s3)] rounded-[16px] border border-hairline bg-surface p-[var(--s3)] sm:p-[var(--s4)]"
            >
              <span className="grid size-12 shrink-0 place-items-center rounded-[12px] bg-brand-tint text-brand">
                <Icon className="size-6" aria-hidden />
              </span>
              <div className="grid min-w-0 flex-1 gap-1">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                  <p className="font-display text-[20px] font-semibold tracking-[-0.01em]">{k.name}</p>
                  <span className="rounded-full bg-brand-tint px-2.5 py-0.5 text-[13px] font-medium tabular-nums text-brand-strong">{k.minutes} min</span>
                </div>
                <p className="text-[15px] leading-relaxed text-muted-foreground">{k.body}</p>
              </div>
            </m.li>
          );
        })}
      </ul>
      <ul className="flex flex-wrap gap-2" aria-label="Cómo te respeta">
        {p.rules.map((r) => (
          <li key={r} className="inline-flex items-center gap-1.5 rounded-full border border-hairline px-3 py-1.5 text-[14px] text-muted-foreground">
            <Check className="size-3.5 text-brand" aria-hidden /> {r}
          </li>
        ))}
      </ul>
    </div>
  );
}
