"use client";

import { motion } from "motion/react";

import { Loading, Notice } from "@/components/ui/feedback";
import { TrendChart } from "@/components/ui/trend-chart";
import { loadCopy } from "@/content/panel";
import { errorText } from "@/lib/api/client";
import { useAnalytics } from "@/features/checkins/hooks";

/** Rellena los días sin estimado con null para que la línea se corte en vez de inventar valores. */
function fillDays(series: { date: string; zScoreAvg: number }[], days: number): (number | null)[] {
  if (!series.length) return [];
  const byDate = new Map(series.map((s) => [s.date, s.zScoreAvg]));
  const end = new Date(`${series[series.length - 1]!.date}T00:00:00Z`);
  const out: (number | null)[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(end.getTime() - i * 86_400_000).toISOString().slice(0, 10);
    out.push(byDate.get(d) ?? null);
  }
  return out;
}

const cardClass = "p-card grid gap-4 p-[clamp(18px,2.6vw,26px)]";

/** Calibración o estimado de carga + tendencia, con el aviso de que no es un diagnóstico. Se dibuja como tarjeta. */
export function LoadSummary({ days = 30, compact = false }: { days?: number; compact?: boolean }) {
  const q = useAnalytics(days);
  const c = loadCopy;
  if (q.isPending)
    return (
      <div className={cardClass}>
        <Loading />
      </div>
    );
  if (q.isError) return <Notice tone="attention" title={errorText(q.error)} />;

  const { calibration, latest, series, disclaimer } = q.data;

  if (!calibration.calibrated) {
    const pct = Math.min(100, Math.round((calibration.daysWithData / calibration.required) * 100));
    return (
      <section aria-labelledby="carga" className={cardClass}>
        <div className="flex items-center justify-between gap-4">
          <h2 id="carga" className="p-h2">
            {c.title}
          </h2>
          <span className="rounded-full bg-brand-tint px-3 py-1 text-[13px] font-medium text-brand-strong">{c.calibrating}</span>
        </div>
        <p className="font-display text-[clamp(2.5rem,2rem+2vw,3.5rem)] font-bold leading-none tracking-[-0.04em] tabular-nums">
          {calibration.daysWithData}
          <span className="text-[0.45em] font-semibold text-muted-foreground"> / {calibration.required} días</span>
        </p>
        <div className="h-2.5 overflow-hidden rounded-full bg-brand-tint" role="progressbar" aria-valuemin={0} aria-valuemax={calibration.required} aria-valuenow={calibration.daysWithData} aria-label="Días de calibración">
          <motion.div className="h-full rounded-full bg-[#6363f1]" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }} />
        </div>
        <p className="max-w-[52ch] text-[15px] text-muted-foreground">{c.calibratingBody(calibration.daysWithData, calibration.required)}</p>
      </section>
    );
  }

  const stable = latest?.trendLabel === "STABLE";
  return (
    <section aria-labelledby="carga" className={cardClass}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="carga" className="p-h2">
          {c.title}
          {days > 30 ? <span className="font-normal text-muted-foreground"> · últimos {days} días</span> : null}
        </h2>
        {latest ? (
          <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[13px] font-medium ${stable ? "bg-brand-tint text-brand-strong" : "bg-[#6363f1] text-white"}`}>
            <span aria-hidden className={`size-1.5 rounded-full ${stable ? "bg-[#6363f1]" : "bg-white"}`} />
            {c.trend[latest.trendLabel]}
          </span>
        ) : null}
      </div>
      {latest ? (
        <p className="max-w-[30ch] font-display text-[clamp(1.375rem,1.1rem+0.9vw,1.75rem)] font-semibold leading-snug tracking-[-0.02em]">{latest.message}.</p>
      ) : (
        <p className="text-muted-foreground">{c.noToday}</p>
      )}
      {series.length > 1 ? (
        <TrendChart
          values={fillDays(series, Math.min(days, 30))}
          bandLabel="tu rango habitual"
          labels={[`hace ${Math.min(days, 30)} días`, "hoy"]}
          ariaLabel={`Tendencia de tu carga en los últimos ${Math.min(days, 30)} días respecto a tu línea base.`}
          height={compact ? 180 : 220}
        />
      ) : null}
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-t border-[var(--app-edge)] pt-3 text-[12px] text-muted-foreground">
        <p className="max-w-[60ch]">{disclaimer}</p>
        {latest ? (
          <p className="tabular-nums">
            {c.confidence}: {Math.round(latest.confidenceLevel * 100)}% · z {latest.zScoreAvg.toFixed(2)}
          </p>
        ) : null}
      </div>
    </section>
  );
}
