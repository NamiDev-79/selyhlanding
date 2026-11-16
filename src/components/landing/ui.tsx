import Image from "next/image";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { Reveal, RevealWords } from "./reveal";

/** Logotipo desde los archivos de la marca (public/brand): color en claro, negativo en oscuro. */
export function BrandLogo({ className, negative = false, priority = false }: { className?: string; negative?: boolean; priority?: boolean }) {
  if (negative) {
    return <Image src="/brand/selyh-logotipo-negativo.svg" alt="Selyh" width={646} height={224} priority={priority} className={cn("h-7 w-auto", className)} unoptimized />;
  }
  return (
    <>
      <Image src="/brand/selyh-logotipo-color.svg" alt="Selyh" width={646} height={224} priority={priority} className={cn("l-logo-light h-7 w-auto", className)} unoptimized />
      <Image src="/brand/selyh-logotipo-negativo.svg" alt="" width={646} height={224} priority={priority} className={cn("l-logo-dark h-7 w-auto", className)} unoptimized />
    </>
  );
}

/**
 * Las dos barras de pausa del logo, a gran escala. Alta = 1, corta = 1/φ, separación = ancho × 0,382.
 * La corta respira en bucle (3,2 s), como en la animación del logo.
 */
export function GiantBars({ className, tall = "#6363F1", short = "#A2A2FA", animate = true }: { className?: string; tall?: string; short?: string; animate?: boolean }) {
  return (
    <svg viewBox="0 0 333 715" aria-hidden className={className} overflow="visible">
      <rect className={animate ? "l-drop" : undefined} x="0" y="0" width="140" height="715" rx="70" fill={tall} />
      <g className={animate ? "l-bars-short" : undefined}>
        <rect className={animate ? "l-grow" : undefined} x="193" y="273" width="140" height="442" rx="70" fill={short} />
      </g>
    </svg>
  );
}

/** Icono pequeño de pausa (barras) para marcar momentos de pausa. */
export function PauseGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 35 66" aria-hidden className={cn("h-3.5 w-auto", className)}>
      <rect x="2" y="2" width="13" height="62" rx="6.5" fill="currentColor" />
      <rect x="20" y="26" width="13" height="38" rx="6.5" fill="currentColor" opacity="0.55" />
    </svg>
  );
}

/** Encabezado de sección: titular y bajada. Sin rótulos encima del titular. */
/** `title` puede llevar un remate en Lora cursiva: `{ lead, accent }`, como el tagline de la marca. */
export function SectionHead({ id, title, lead, center = false, className, children }: { id: string; title: ReactNode | { lead: string; accent: string }; lead?: ReactNode; center?: boolean; className?: string; children?: ReactNode }) {
  return (
    <div className={cn("grid gap-[var(--s4)]", center && "justify-items-center text-center", className)}>
      <h2 id={id} className="l-h2 max-w-[18ch]">
        {typeof title === "string" ? (
          <RevealWords text={title} />
        ) : title && typeof title === "object" && "accent" in title ? (
          <RevealWords text={title.lead} accent={title.accent} accentClassName="l-accent text-brand-strong" />
        ) : (
          title
        )}
      </h2>
      {lead ? (
        <Reveal as="p" delay={0.25} className={cn("l-lead text-muted-foreground", center && "mx-auto")}>
          {lead}
        </Reveal>
      ) : null}
      {children}
    </div>
  );
}

/** Etiqueta discreta para los datos de ejemplo de las demostraciones. */
export function SampleNote({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("rounded-full border border-hairline px-2.5 py-0.5 text-[13px] text-muted-foreground", className)}>{children}</span>;
}
