"use client";

import * as Switch from "@radix-ui/react-switch";
import { m } from "motion/react";
import { useState } from "react";

import { privacy } from "@/content/landing";
import { cn } from "@/lib/utils";

import { EASE, Reveal, RevealGroup, RevealItem } from "./reveal";
import { SectionHead } from "./ui";

/** Panel de permisos: cada fuente se activa por separado y se ve exactamente qué número llega. */
function ConsentPanel() {
  const [on, setOn] = useState<Record<string, boolean>>(() => Object.fromEntries(privacy.sources.map((s) => [s.id, s.on])));
  return (
    <div className="l-elev-2 rounded-[16px] border border-hairline bg-surface p-[var(--s4)] sm:p-[var(--s5)]">
      <p className="font-display text-[20px] font-semibold">{privacy.consentTitle}</p>
      <ul className="mt-[var(--s3)] divide-y divide-[var(--hairline)]">
        {privacy.sources.map((s) => (
          <li key={s.id} className="flex items-center justify-between gap-4 py-[var(--s3)]">
            <div className="min-w-0">
              <label htmlFor={`fuente-${s.id}`} className="block font-medium">
                {s.name}
              </label>
              <p className={cn("mt-0.5 truncate text-[14px] tabular-nums transition-colors", on[s.id] ? "text-brand-strong" : "text-muted-foreground")}>
                {on[s.id] ? s.sends : privacy.off}
              </p>
            </div>
            <Switch.Root
              id={`fuente-${s.id}`}
              checked={on[s.id]}
              onCheckedChange={(v) => setOn((o) => ({ ...o, [s.id]: v }))}
              className="relative h-7 w-12 shrink-0 rounded-full bg-[var(--input)] transition-colors duration-200 data-[state=checked]:bg-[#6363f1]"
            >
              <Switch.Thumb className="block size-6 translate-x-0.5 rounded-full bg-white shadow-[0_1px_3px_rgb(15_21_35/0.3)] transition-transform duration-200 data-[state=checked]:translate-x-[22px]" />
            </Switch.Root>
          </li>
        ))}
      </ul>
      <p className="mt-[var(--s2)] text-[14px] text-muted-foreground">{privacy.consentNote}</p>
    </div>
  );
}

export function Privacy() {
  return (
    <section id="privacidad" aria-labelledby="privacidad-title" className="l-section border-y border-hairline bg-surface-raised">
      <div className="l-wrap">
        <div className="l-golden items-start">
          <div className="grid gap-[var(--s5)]">
            <SectionHead id="privacidad-title" title={privacy.title} lead={privacy.lead} />
            <div>
              <p className="text-[15px] font-medium text-muted-foreground">{privacy.neverLabel}</p>
              {/* Cada palabra se tacha sola, una tras otra, al entrar en pantalla */}
              <RevealGroup as="ul" stagger={0.16} delay={0.2} className="mt-[var(--s2)] flex flex-wrap gap-x-[var(--s4)] gap-y-1">
                {privacy.never.map((w) => (
                  <RevealItem as="li" key={w} className="relative font-display text-[clamp(1.75rem,1.3rem+1.6vw,2.625rem)] font-bold tracking-[-0.03em] text-muted-foreground">
                    {w}
                    <m.span
                      aria-hidden
                      className="absolute inset-x-[-4%] top-[54%] h-[4px] origin-left rounded-full bg-[#6363f1]"
                      variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 0.5, ease: EASE, delay: 0.45 } } }}
                    />
                  </RevealItem>
                ))}
              </RevealGroup>
            </div>
          </div>
          <Reveal y={42} delay={0.15} duration={0.82}>
            <ConsentPanel />
          </Reveal>
        </div>

        <RevealGroup as="ul" className="mt-[var(--s6)] grid gap-[var(--s4)] border-t border-hairline pt-[var(--s5)] md:grid-cols-3">
          {privacy.promises.map((p) => (
            <RevealItem as="li" key={p.title} className="grid gap-1.5">
              <h3 className="font-display text-[20px] font-semibold">{p.title}</h3>
              <p className="l-body text-muted-foreground">{p.body}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
