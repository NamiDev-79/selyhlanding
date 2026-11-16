"use client";

import { ArrowRight, Check, Lock } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/shadcn/button";
import { type DemoTeam, teams } from "@/content/landing";
import { cn } from "@/lib/utils";

import { Reveal, RevealGroup, RevealItem, RevealWords } from "./reveal";
import { SampleNote } from "./ui";

const dash = teams.dashboard;
const list = dash.teams as DemoTeam[];

/** Panel corporativo de ejemplo. Un equipo de menos de 5 personas no muestra datos. */
function TeamDashboard() {
  const [id, setId] = useState(list[0].id);
  const team = list.find((t) => t.id === id)!;
  const locked = team.people < dash.minPeople;
  const max = 1;

  return (
    <div className="l-elev-2 overflow-hidden rounded-[16px] border border-white/10 bg-[#141a29]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.07] px-[var(--s4)] py-[var(--s3)]">
        <div role="tablist" aria-label="Equipo" className="flex gap-1 rounded-full bg-white/[0.06] p-1">
          {list.map((t) => (
            <button
              key={t.id}
              role="tab"
              type="button"
              id={`equipo-${t.id}`}
              aria-selected={t.id === id}
              aria-controls="equipo-panel"
              onClick={() => setId(t.id)}
              className={cn("h-9 rounded-full px-4 text-[14px] transition-colors", t.id === id ? "bg-white font-medium text-[#0f1523]" : "text-[#c3c8d1] hover:text-white")}
            >
              {t.name}
            </button>
          ))}
        </div>
        <SampleNote>{dash.note}</SampleNote>
      </div>

      <div id="equipo-panel" role="tabpanel" aria-labelledby={`equipo-${id}`} className="p-[var(--s4)] sm:p-[var(--s5)]">
        <div className="flex items-baseline justify-between gap-3">
          <p className="font-display text-[20px] font-semibold">{dash.title}</p>
          <p className="text-[14px] tabular-nums text-[#9ca3af]">{team.people} personas</p>
        </div>

        {locked ? (
          <div key={id} className="l-pop mt-[var(--s4)] grid h-[216px] place-items-center rounded-[10px] border border-dashed border-white/15 px-6 text-center">
            <div className="grid justify-items-center gap-3">
              <span className="grid size-11 place-items-center rounded-full bg-white/[0.06]">
                <Lock className="size-5 text-[#a2a2fa]" aria-hidden />
              </span>
              <p className="max-w-[36ch] text-[15px] text-[#c3c8d1]">{dash.locked(team.people)}</p>
            </div>
          </div>
        ) : (
          <div key={id} className="mt-[var(--s4)]">
            <div className="relative h-[216px]" role="img" aria-label={`Carga media semanal del equipo ${team.name}, datos de ejemplo.`}>
              {/* Rango habitual */}
              <div className="absolute inset-x-0 bottom-0 h-[38%] rounded-[6px] bg-[#a2a2fa]/[0.12]" aria-hidden />
              <span className="absolute bottom-[38%] left-2 translate-y-[-6px] text-[12px] text-[#9ca3af]" aria-hidden>
                {dash.baseline}
              </span>
              <div className="relative flex h-full items-end gap-[clamp(6px,1.6vw,16px)] px-2" aria-hidden>
                {team.weeks.map((v, i) => {
                  const high = v > 0.38;
                  return (
                    <span
                      key={i}
                      className={cn("l-pop flex-1 origin-bottom rounded-full", high ? "bg-[#6363f1]" : "bg-[#a2a2fa]/55")}
                      style={{ height: `${Math.max(0.1, (v + 0.15) / (max + 0.15)) * 100}%`, animationDelay: `${i * 38}ms` }}
                    />
                  );
                })}
              </div>
            </div>
            <div className="mt-[var(--s3)] flex flex-wrap items-center gap-x-3 gap-y-2 text-[14px]">
              <span className="text-[#9ca3af]">{dash.contextLabel}:</span>
              {team.context.map((c) => (
                <span key={c} className="rounded-full bg-white/[0.06] px-3 py-1 text-[#e5e7eb]">
                  {c}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function Teams() {
  return (
    <section id="equipos" data-nav="night" aria-labelledby="equipos-title" className="l-night l-section relative overflow-hidden">
      <div className="l-wrap">
        <div className="l-golden items-center lg:grid-cols-[1fr_1.618fr]!">
          <div className="grid gap-[var(--s4)]">
            <h2 id="equipos-title" className="l-h2 text-[clamp(2.125rem,1.3rem+2.6vw,3.75rem)]">
              <RevealWords text={teams.title.lead} accent={teams.title.accent} accentClassName="l-accent text-brand-soft" />
            </h2>
            <Reveal as="p" delay={0.3} className="l-lead text-[#c3c8d1]">
              {teams.lead}
            </Reveal>
            <RevealGroup as="ul" stagger={0.08} delay={0.4} className="grid gap-2.5">
              {teams.points.map((p) => (
                <RevealItem as="li" key={p} className="flex items-start gap-2.5 text-[#e5e7eb]">
                  <Check className="mt-1 size-4 shrink-0 text-brand-soft" aria-hidden />
                  {p}
                </RevealItem>
              ))}
            </RevealGroup>
            <Reveal delay={0.6} className="mt-2 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href={teams.primary.href}>
                  {teams.primary.label} <ArrowRight aria-hidden />
                </Link>
              </Button>
              <Button asChild size="lg" variant="ghost" className="border border-white/20 text-white hover:bg-white/10">
                <Link href={teams.secondary.href}>{teams.secondary.label}</Link>
              </Button>
            </Reveal>
          </div>
          <Reveal y={68} scale={0.94} duration={1} delay={0.15}>
            <TeamDashboard />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
