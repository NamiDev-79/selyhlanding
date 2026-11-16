import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { AnimatedLogo } from "@/components/brand/animated-logo";
import { Button } from "@/components/shadcn/button";
import { finalCta } from "@/content/landing";

import { Parallax, Reveal, RevealWords } from "./reveal";
import { Bars3D } from "./bars-3d";

/** Cierre sobre índigo: el logo entra con su animación, las barras en 3D a la derecha y una sola acción principal. */
export function FinalCta() {
  return (
    <section data-nav="night" aria-labelledby="cierre-title" className="relative isolate overflow-hidden bg-[#6363f1] text-white">
      {/* Las barras del logo en 3D (three.js): siguen el puntero y la corta respira */}
      <div aria-hidden className="pointer-events-none absolute inset-y-0 right-[2%] -z-10 w-[38%] max-lg:hidden">
        <Parallax from={60} to={-42} className="h-full">
          <Bars3D className="h-full w-full" />
        </Parallax>
      </div>
      {/* Resplandor detrás de las barras */}
      <div aria-hidden className="pointer-events-none absolute right-[8%] top-1/2 -z-20 size-[520px] -translate-y-1/2 rounded-full bg-[#a2a2fa]/40 blur-[110px] max-lg:hidden" />
      <div className="l-wrap l-section grid gap-[var(--s5)]">
        <AnimatedLogo variant="indigo" className="h-[clamp(42px,5vw,68px)] text-white" title="Selyh" />
        <h2 id="cierre-title" className="l-h2 max-w-[16ch]">
          <RevealWords text={finalCta.title} delay={0.2} />
        </h2>
        <Reveal as="p" delay={0.45} className="l-lead text-white/90">
          {finalCta.body}
        </Reveal>
        <Reveal delay={0.6} className="flex flex-wrap gap-3">
          <Button asChild size="lg" variant="inverse">
            <Link href={finalCta.primary.href}>
              {finalCta.primary.label} <ArrowRight aria-hidden />
            </Link>
          </Button>
          <Button asChild size="lg" variant="ghost" className="border border-white/40 text-white hover:bg-white/10">
            <Link href={finalCta.secondary.href}>{finalCta.secondary.label}</Link>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
