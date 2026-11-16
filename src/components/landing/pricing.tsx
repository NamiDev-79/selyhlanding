"use client";

import { Check } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/shadcn/button";
import { pricing } from "@/content/landing";
import { plans, plansIntro } from "@/content/plans";
import { cn } from "@/lib/utils";

import { RevealGroup, RevealItem } from "./reveal";
import { SectionHead } from "./ui";

const money = (n: number) => n.toLocaleString("es-PE", { maximumFractionDigits: 0 });

/** Calculadora del plan corporativo: precio por puesto × puestos (mínimo 5). */
function SeatCalculator({ price }: { price: number }) {
  const s = pricing.seats;
  const [seats, setSeats] = useState<number>(s.default);
  const fill = ((seats - s.min) / (s.max - s.min)) * 100;
  return (
    <div className="rounded-[10px] bg-surface-raised p-[var(--s3)]">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor="puestos" className="text-[14px] font-medium">
          {s.label}
        </label>
        <output htmlFor="puestos" className="font-display text-[20px] font-semibold tabular-nums">
          {seats}
        </output>
      </div>
      <input
        id="puestos"
        type="range"
        min={s.min}
        max={s.max}
        value={seats}
        onChange={(e) => setSeats(Number(e.target.value))}
        className="l-seats mt-1"
        style={{ ["--fill" as string]: `${fill}%` }}
      />
      <p className="mt-1 flex items-baseline justify-between text-[14px] text-muted-foreground">
        {s.total}
        <span className="font-display text-[20px] font-semibold tabular-nums text-foreground">
          ${money(seats * price)} <span className="text-[13px] font-normal text-muted-foreground">{pricing.currency}</span>
        </span>
      </p>
    </div>
  );
}

export function Pricing() {
  return (
    <section id="planes" aria-labelledby="planes-title" className="l-section">
      <div className="l-wrap">
        <SectionHead id="planes-title" title={pricing.title} lead={pricing.lead} />
        <RevealGroup as="ul" stagger={0.12} className="mt-[var(--s6)] grid gap-[var(--s3)] lg:grid-cols-3 lg:items-stretch">
          {plans.map((p) => (
            <RevealItem
              as="li"
              key={p.id}
              className={cn(
                "relative flex flex-col gap-[var(--s4)] rounded-[16px] border p-[var(--s4)] sm:p-[var(--s5)]",
                p.featured ? "l-elev-2 border-[#6363f1] bg-surface ring-1 ring-[#6363f1]" : "border-hairline bg-surface",
              )}
            >
              {p.featured ? (
                <span className="absolute -top-3 left-[var(--s5)] rounded-full bg-[#6363f1] px-3 py-1 text-[13px] font-medium text-white">{pricing.featured}</span>
              ) : null}
              <div>
                <h3 className="font-display text-[22px] font-semibold tracking-[-0.01em]">{p.name}</h3>
                <p className="mt-1 text-muted-foreground">{p.audience}</p>
              </div>
              <p className="flex items-baseline gap-2">
                <span className="font-display text-[68px] font-bold leading-none tracking-[-0.04em] tabular-nums">${p.price}</span>
                <span className="text-[15px] text-muted-foreground">{p.unit}</span>
              </p>
              {p.id === "CORPORATE" ? <SeatCalculator price={Number(p.price)} /> : null}
              <ul className="grid gap-2.5">
                {p.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2.5 text-[15px]">
                    <Check className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />
                    {h}
                  </li>
                ))}
              </ul>
              <Button asChild size="lg" variant={p.featured ? "default" : "outline"} className="mt-auto">
                <Link href={p.cta.href}>{p.cta.label}</Link>
              </Button>
            </RevealItem>
          ))}
        </RevealGroup>
        <p className="mt-[var(--s4)] text-center text-[14px] text-muted-foreground">{plansIntro.referential}</p>
      </div>
    </section>
  );
}
