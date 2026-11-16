"use client";

import { Lock, RefreshCw, ShieldCheck, UserPlus, Users } from "lucide-react";
import { motion, type Variants } from "motion/react";
import Link from "next/link";
import { type ReactNode, useState } from "react";

import { LinkButton } from "@/components/ui/button";
import { Loading, Notice } from "@/components/ui/feedback";
import { TrendChart } from "@/components/ui/trend-chart";
import { companyCopy, metricCopy } from "@/content/company";
import { api, errorText, type Res, unwrap } from "@/lib/api/client";
import { cn } from "@/lib/utils";

import { useCompany, useCompanyMutation, useSeats, useTeamMetrics, useTeams } from "./hooks";

type Metric = Res<"/companies/{companyId}/teams/{teamId}/metrics", "get">[number];
const MIN_K = 5;
const EASE = [0.22, 1, 0.36, 1] as const;
const list: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item: Variants = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } } };

function latestBy(rows: Metric[]) {
  const out = new Map<string, Metric>();
  for (const r of rows) if (!out.has(r.metricKey)) out.set(r.metricKey, r); // vienen del más reciente al más antiguo
  return out;
}

/** Cifra grande del resumen. */
function Stat({ label, value, sub, icon }: { label: string; value: ReactNode; sub?: ReactNode; icon: ReactNode }) {
  return (
    <motion.div variants={item} className="p-card grid content-between gap-3 p-[clamp(12px,2.2vw,22px)]">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[13px] leading-tight text-muted-foreground sm:text-[14px]">{label}</p>
        <span className="grid size-8 place-items-center rounded-full bg-brand-tint text-brand max-sm:hidden">{icon}</span>
      </div>
      <p className="font-display text-[clamp(1.625rem,1.3rem+1.4vw,2.625rem)] font-bold leading-none tracking-[-0.04em] tabular-nums">{value}</p>
      {sub ? <p className="text-[13px] text-muted-foreground max-sm:hidden">{sub}</p> : null}
    </motion.div>
  );
}

function TeamCard({ team, k }: { team: { id: string; name: string }; k: number }) {
  const { companyId } = useCompany();
  const metrics = useTeamMetrics(companyId, team.id);
  const [skipped, setSkipped] = useState<string | null>(null);
  const refresh = useCompanyMutation(companyId, () =>
    unwrap(api.POST("/companies/{companyId}/teams/{teamId}/aggregate", { params: { path: { companyId, teamId: team.id } } })),
  );

  const rows = metrics.data ?? [];
  const latest = latestBy(rows);
  const stress = rows.filter((r) => r.metricKey === "stress_zscore").reverse();
  const z = latest.get("stress_zscore");
  const status = z ? metricCopy.stress_zscore!.describe(z.value) : null;
  const calm = status === "Estable" || status === "Por debajo de lo habitual";
  const n = z?.sampleSize;

  return (
    <motion.article variants={item} className="p-card grid content-start gap-5 p-[clamp(18px,2.6vw,26px)]">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="grid gap-0.5">
          <h2 className="p-h2">{team.name}</h2>
          {n ? <p className="text-[13px] text-muted-foreground">{n} personas en el último cálculo</p> : null}
        </div>
        <div className="flex items-center gap-2">
          {status ? (
            <span className={cn("inline-flex items-center gap-2 rounded-full px-3 py-1 text-[13px] font-medium", calm ? "bg-brand-tint text-brand-strong" : "bg-[#6363f1] text-white")}>
              <span aria-hidden className={cn("size-1.5 rounded-full", calm ? "bg-[#6363f1]" : "bg-white")} />
              {status}
            </span>
          ) : null}
          <button
            type="button"
            disabled={refresh.isPending}
            onClick={() => refresh.mutate(undefined, { onSuccess: (r) => setSkipped(r.written ? null : (r.skippedReason ?? companyCopy.noData(k))) })}
            aria-label={`Recalcular ${team.name}`}
            title="Recalcular con los datos de hoy"
            className="grid size-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-brand-tint hover:text-brand-strong disabled:opacity-60"
          >
            <RefreshCw className={cn("size-4", refresh.isPending && "animate-spin")} aria-hidden />
          </button>
        </div>
      </header>

      {metrics.isPending ? <Loading /> : null}
      {metrics.isError ? <Notice tone="attention" title={errorText(metrics.error)} /> : null}
      {skipped ? <Notice tone="neutral" title={`Sin publicar: ${skipped}.`}>Por privacidad no mostramos nada por debajo del mínimo.</Notice> : null}
      {refresh.isError ? <Notice tone="attention" title={errorText(refresh.error)} /> : null}

      {metrics.data && !rows.length ? (
        <div className="grid justify-items-center gap-3 rounded-[10px] border border-dashed border-[var(--line-strong)] px-6 py-8 text-center">
          <span className="grid size-11 place-items-center rounded-full bg-brand-tint text-brand">
            <Lock className="size-5" aria-hidden />
          </span>
          <p className="max-w-[40ch] text-[15px] text-muted-foreground">{companyCopy.noData(k)}</p>
        </div>
      ) : null}

      {latest.size ? (
        <dl className="grid gap-2 sm:grid-cols-3">
          {["stress_zscore", "checkin_score", "high_load_share"].map((key) => {
            const m = latest.get(key);
            const copy = metricCopy[key]!;
            return (
              <div key={key} className="grid content-start gap-1 rounded-[10px] bg-[var(--app-card-2)] p-3">
                <dt className="text-[13px] leading-snug text-muted-foreground">{copy.label}</dt>
                <dd className="font-display text-[18px] font-semibold leading-tight">{m ? copy.describe(m.value) : "—"}</dd>
                {m ? (
                  <dd className="text-[12px] tabular-nums text-muted-foreground">
                    {key === "high_load_share" ? `${Math.round(m.value * 100)}%` : m.value.toFixed(2)} · n={m.sampleSize}
                  </dd>
                ) : null}
              </div>
            );
          })}
        </dl>
      ) : null}

      {stress.length > 1 ? (
        <TrendChart values={stress.map((s) => s.value)} labels={["primer periodo", "último"]} bandLabel="rango habitual del equipo" ariaLabel={`Tendencia agregada de carga del equipo ${team.name}.`} height={180} />
      ) : null}
    </motion.article>
  );
}

export function CompanyOverview() {
  const company = useCompany();
  const teams = useTeams(company.companyId);
  const seats = useSeats(company.companyId);
  const k = Math.max(MIN_K, company.minAggregationSize ?? MIN_K);

  return (
    <motion.div variants={list} initial="hidden" animate="show" className="grid gap-[clamp(16px,2vw,20px)]">
      <div className="grid grid-cols-3 gap-[clamp(8px,2vw,20px)]">
        <Stat label="Equipos" value={teams.data?.length ?? "—"} sub={<Link href="/empresa/equipos" className="text-brand-strong hover:underline">Gestionar equipos</Link>} icon={<Users className="size-4" aria-hidden />} />
        <Stat
          label="Puestos en uso"
          value={
            seats.data ? (
              <>
                {seats.data.used}
                <span className="text-[0.5em] font-semibold text-muted-foreground"> / {seats.data.seats ?? "—"}</span>
              </>
            ) : (
              "—"
            )
          }
          sub={<Link href="/empresa/miembros" className="text-brand-strong hover:underline">Invitar personas</Link>}
          icon={<UserPlus className="size-4" aria-hidden />}
        />
        <Stat label="Mínimo por métrica" value={`${k}`} sub="personas para mostrar una tendencia" icon={<ShieldCheck className="size-4" aria-hidden />} />
      </div>

      <motion.p variants={item} className="flex items-start gap-3 rounded-[16px] bg-brand-tint px-5 py-4 text-[15px] leading-relaxed text-foreground/85">
        <ShieldCheck className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden />
        {companyCopy.privacyNote(k)}
      </motion.p>

      {teams.isPending ? <Loading /> : null}
      {teams.isError ? <Notice tone="attention" title={errorText(teams.error)} /> : null}
      {teams.data && !teams.data.length ? (
        <motion.div variants={item} className="p-card grid justify-items-start gap-3 p-[clamp(20px,3vw,32px)]">
          <h2 className="p-h2">Aún no hay equipos</h2>
          <p className="text-muted-foreground">Crea tus equipos y asigna a las personas para empezar a ver tendencias.</p>
          <LinkButton href="/empresa/equipos">Crear el primer equipo</LinkButton>
        </motion.div>
      ) : null}

      {teams.data?.length ? (
        <div className="grid gap-[clamp(16px,2vw,20px)]">
          {teams.data.map((t) => (
            <TeamCard key={t.id} team={t} k={k} />
          ))}
        </div>
      ) : null}

      {teams.data?.length ? (
        <motion.p variants={item} className="max-w-[60ch] font-quote text-[clamp(1.125rem,1rem+0.4vw,1.375rem)] italic leading-snug text-muted-foreground">
          {companyCopy.causes}
        </motion.p>
      ) : null}
    </motion.div>
  );
}
