import { LinkButton } from "@/components/ui/button";
import { Icon } from "@/components/ui/icons";
import { plans, plansIntro } from "@/content/plans";

import { SectionHead } from "./section-head";

export function Plans({ headingLevel = 2 }: { headingLevel?: 1 | 2 }) {
  return (
    <section id="planes" aria-labelledby="planes-title" className="wrap scroll-mt-24 py-[var(--section)]">
      {headingLevel === 1 ? (
        <div className="grid justify-items-center gap-5 text-center">
          <p className="kicker">{plansIntro.eyebrow}</p>
          <h1 id="planes-title" className="max-w-[18ch] text-step-5">
            {plansIntro.title}
          </h1>
          <p className="max-w-[56ch] text-ink-soft">{plansIntro.body}</p>
        </div>
      ) : (
        <SectionHead id="planes-title" eyebrow={plansIntro.eyebrow} title={plansIntro.title} center>
          <p className="max-w-[56ch] text-ink-soft">{plansIntro.body}</p>
        </SectionHead>
      )}

      <div className="mt-14 grid gap-5 md:grid-cols-3 md:items-stretch">
        {plans.map((p) => (
          <div key={p.id} className="reveal">
            <article
              className={`relative flex h-full flex-col gap-6 rounded-[1.4rem] p-7 ${
                p.featured
                  ? "bg-night text-white shadow-float ring-1 ring-accent/40 md:-my-3 md:py-10"
                  : "card"
              }`}
            >
              {p.featured ? (
                <>
                  <div aria-hidden className="pointer-events-none absolute inset-0 -z-0 overflow-hidden rounded-[1.4rem]">
                    <div className="absolute -right-16 -top-16 size-56 rounded-full bg-[oklch(55%_0.2_277/0.5)] blur-3xl" />
                  </div>
                  <span className="absolute right-6 top-6 rounded-full bg-mint px-2.5 py-0.5 text-xs font-semibold text-night">Más elegido</span>
                </>
              ) : null}
              <header className="relative grid gap-2">
                <h3 className="text-step-2">{p.name}</h3>
                <p className={p.featured ? "text-white/70" : "text-ink-soft"}>{p.audience}</p>
              </header>
              <p className="relative flex items-baseline gap-2">
                <span className="font-display text-step-5 font-semibold leading-none tracking-tight">${p.price}</span>
                <span className={`text-step--1 ${p.featured ? "text-white/60" : "text-ink-faint"}`}>{p.unit}</span>
              </p>
              <ul className="relative grid gap-2.5 text-[0.95rem]">
                {p.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2.5">
                    <Icon name="check" className={`mt-0.5 size-4 shrink-0 ${p.featured ? "text-mint" : "text-accent-strong"}`} />
                    {h}
                  </li>
                ))}
              </ul>
              <div className="relative mt-auto pt-2">
                <LinkButton href={p.cta.href} variant={p.featured ? "primary" : "secondary"} className="w-full">
                  {p.cta.label}
                </LinkButton>
              </div>
            </article>
          </div>
        ))}
      </div>
      <p className="mx-auto mt-10 max-w-[70ch] text-center text-step--1 text-ink-soft">{plansIntro.referential}</p>
    </section>
  );
}
