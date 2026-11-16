import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { science } from "@/content/landing";

import { Reveal, RevealGroup, RevealItem } from "./reveal";

/** Respaldo científico: el origen del nombre como momento de marca, y las escalas que usamos. */
export function Science() {
  const q = science.quote;
  return (
    <section aria-labelledby="ciencia-title" className="l-section">
      <div className="l-wrap">
        <Reveal as="figure" y={42} duration={0.82}>
          <blockquote className="l-accent max-w-[24ch] text-[clamp(2rem,1.2rem+3.2vw,4.25rem)] leading-[1.12] tracking-[-0.02em]">
            {q.lead} <span className="not-italic font-display font-bold tracking-[-0.035em] text-brand-strong">{q.accent}</span>
            {q.tail}
          </blockquote>
          <figcaption className="mt-[var(--s4)]">
            <Link href={science.quoteLink.href} className="inline-flex items-center gap-1.5 text-[15px] font-medium text-brand-strong underline decoration-[#a2a2fa] underline-offset-4 hover:decoration-current">
              {science.quoteLink.label} <ArrowRight className="size-4" aria-hidden />
            </Link>
          </figcaption>
        </Reveal>

        <div className="l-golden mt-[var(--s6)] border-t border-hairline pt-[var(--s5)] lg:grid-cols-[1fr_1.618fr]!">
          <div className="grid content-start gap-[var(--s3)]">
            <h2 id="ciencia-title" className="l-h3 text-[clamp(1.5rem,1.2rem+1vw,2rem)]!">
              {science.title}
            </h2>
            <p className="l-body text-muted-foreground">{science.lead}</p>
          </div>
          <RevealGroup as="dl" stagger={0.08} className="grid gap-x-[var(--s5)] sm:grid-cols-2">
            {science.items.map((i) => (
              <RevealItem key={i.term} className="border-b border-hairline py-[var(--s3)]">
                <dt className="font-display text-[20px] font-semibold">{i.term}</dt>
                <dd className="mt-1 text-muted-foreground">{i.body}</dd>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>

        <Reveal as="aside" aria-label={science.limits.title} className="mt-[var(--s5)] flex flex-col gap-2 rounded-[16px] bg-brand-tint p-[var(--s4)] sm:flex-row sm:items-baseline sm:gap-[var(--s4)]">
          <p className="shrink-0 font-display text-[18px] font-semibold text-brand-strong">{science.limits.title}</p>
          <p className="text-foreground/80">{science.limits.body}</p>
        </Reveal>
      </div>
    </section>
  );
}
