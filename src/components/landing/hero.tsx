import { ArrowRight, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/shadcn/button";
import { hero } from "@/content/landing";

import { Parallax } from "./reveal";

/**
 * Portada sobre azul tinta: el tagline de la marca a gran escala y, a la derecha, las barras del logo
 * convertidas en esculturas monumentales (imagen de campaña). La imagen se funde con el fondo por la izquierda y arriba.
 */
export function Hero() {
  return (
    <section data-nav="night" aria-labelledby="hero-title" className="l-night relative isolate overflow-hidden">
      {/* Imagen de campaña: a sangre por la derecha en escritorio */}
      <div
        aria-hidden
        className="l-hero-art pointer-events-none absolute inset-y-0 right-0 -z-10 w-[54%] max-lg:hidden [mask-composite:intersect] [mask-image:linear-gradient(to_right,transparent,#000_30%),linear-gradient(to_bottom,transparent,#000_14%,#000_86%,transparent)]"
      >
        {/* Al bajar, la imagen se queda un poco atrás: profundidad sin distraer */}
        <Parallax from={0} to={110} className="relative h-full w-full">
          <Image src={hero.art.src} alt="" fill priority sizes="54vw" className="object-cover object-[50%_70%]" />
        </Parallax>
      </div>

      <div className="l-wrap pb-[clamp(68px,9vw,110px)] pt-[clamp(120px,14vw,168px)] lg:min-h-[min(100svh,960px)] lg:pt-[clamp(96px,13svh,168px)]">
        <div className="grid gap-[var(--s4)] lg:max-w-[54%]">
          <h1 id="hero-title" className="l-display l-hero-title l-in" style={{ ["--i" as string]: 0 }}>
            {hero.title.lead} <span className="l-accent text-brand-soft">{hero.title.accent}</span>
          </h1>
          <p className="l-lead l-in mt-[var(--s2)] max-w-[34ch] text-[#c3c8d1] lg:max-w-[42ch]" style={{ ["--i" as string]: 1 }}>
            {hero.lead}
          </p>
          <div className="l-in flex flex-wrap gap-3" style={{ ["--i" as string]: 2 }}>
            <Button asChild size="lg">
              <Link href={hero.primary.href}>
                {hero.primary.label} <ArrowRight aria-hidden />
              </Link>
            </Button>
            <Button asChild size="lg" variant="ghost" className="border border-white/20 text-white hover:bg-white/10">
              <Link href={hero.secondary.href}>{hero.secondary.label}</Link>
            </Button>
          </div>
          <ul className="l-in mt-[var(--s2)] flex flex-wrap gap-x-6 gap-y-2 text-[15px] text-[#9ca3af]" style={{ ["--i" as string]: 3 }}>
            {hero.trust.map((t) => (
              <li key={t} className="flex items-center gap-2.5">
                <Check className="size-4 text-brand-soft" aria-hidden />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* En móvil y tableta, la imagen va debajo del texto y se funde por arriba */}
      <div aria-hidden className="l-hero-art relative -mt-[clamp(110px,20vw,180px)] aspect-[4/5] max-h-[720px] w-full lg:hidden [mask-image:linear-gradient(to_bottom,transparent,#000_26%,#000_86%,transparent)]">
        <Image src={hero.art.src} alt="" fill sizes="100vw" className="object-cover object-[50%_80%]" />
      </div>
    </section>
  );
}
