import { cn } from "@/lib/utils";

import { LOGO_LETTERS, LOGO_SHORT, LOGO_TALL, LOGO_VIEWBOX } from "./logo-geometry";

type LogoVariant = "color" | "indigo" | "mono";

/**
 * Logotipo de Selyh en trazos. Las letras usan `currentColor` (tinta sobre claro, blanco sobre oscuro),
 * así el mismo componente sirve como versión principal y negativa.
 * - color: barra alta #6363F1, corta #A2A2FA.
 * - indigo: para fondos índigo, barra alta blanca y corta #A2A2FA.
 * - mono: todo en una tinta (currentColor).
 */
export function Logo({ variant = "color", className, title = "Selyh" }: { variant?: LogoVariant; className?: string; title?: string }) {
  const tall = variant === "color" ? "#6363F1" : variant === "indigo" ? "#FFFFFF" : "currentColor";
  const short = variant === "mono" ? "currentColor" : "#A2A2FA";
  return (
    <svg viewBox={LOGO_VIEWBOX} role="img" aria-label={title} className={cn("h-7 w-auto", className)}>
      <g fill="currentColor" transform="scale(1 -1)">
        {LOGO_LETTERS.map(([x, d]) => (
          <path key={x} transform={`translate(${x} 0)`} d={d} />
        ))}
      </g>
      <rect x={LOGO_TALL[0]} y={-LOGO_TALL[1]} width={LOGO_TALL[2]} height={LOGO_TALL[1]} rx={LOGO_TALL[2] / 2} fill={tall} />
      <rect x={LOGO_SHORT[0]} y={-LOGO_SHORT[1]} width={LOGO_SHORT[2]} height={LOGO_SHORT[1]} rx={LOGO_SHORT[2] / 2} fill={short} />
    </svg>
  );
}

/** Las dos barras de pausa solas (sin contenedor). Alta = 1, corta = 1/φ, separación = ancho × 0,382. */
export function PauseBars({ className, tall = "#6363F1", short = "#A2A2FA" }: { className?: string; tall?: string; short?: string }) {
  return (
    <svg viewBox="0 0 333 715" aria-hidden className={className}>
      <rect x="0" y="0" width="140" height="715" rx="70" fill={tall} />
      <rect x="193" y="273" width="140" height="442" rx="70" fill={short} />
    </svg>
  );
}

/** Isotipo: las barras en un contenedor de 64 con radio 16 sobre azul tinta. */
export function Isotipo({ className, title }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 64 64" role={title ? "img" : undefined} aria-label={title} aria-hidden={title ? undefined : true} className={className}>
      <rect width="64" height="64" rx="16" fill="#0F1523" />
      <rect x="17" y="11" width="13" height="42" rx="6.5" fill="#6363F1" />
      <rect x="35" y="27" width="13" height="26" rx="6.5" fill="#A2A2FA" />
    </svg>
  );
}
