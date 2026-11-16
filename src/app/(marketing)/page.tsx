import type { Metadata } from "next";

import { Contact } from "@/components/landing/contact";
import { Faq } from "@/components/landing/faq";
import { FinalCta } from "@/components/landing/final-cta";
import { Hero } from "@/components/landing/hero";
import { How } from "@/components/landing/how";
import { Platforms } from "@/components/landing/platforms";
import { Pricing } from "@/components/landing/pricing";
import { Privacy } from "@/components/landing/privacy";
import { Science } from "@/components/landing/science";
import { Teams } from "@/components/landing/teams";
import { Workday } from "@/components/landing/workday";
import { site } from "@/content/site";
import { LandingJsonLd } from "@/lib/seo/json-ld";

export const metadata: Metadata = {
  title: { absolute: `${site.seoTitle} · ${site.name}` },
  description: site.description,
  alternates: { canonical: "/" },
};

/**
 * Portada. Recorrido: qué es y pruébalo (portada) → dónde vive → cuándo aparece (un día cualquiera)
 * → cómo ayuda → privacidad → equipos → ciencia → planes → preguntas → demo → cierre.
 */
export default function LandingPage() {
  return (
    <>
      <LandingJsonLd />
      <Hero />
      <Platforms />
      <Workday />
      <How />
      <Privacy />
      <Teams />
      <Science />
      <Pricing />
      <Faq />
      <Contact />
      <FinalCta />
    </>
  );
}
