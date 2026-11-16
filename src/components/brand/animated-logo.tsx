"use client";

import { m, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";

import { cn } from "@/lib/utils";

import { Logo } from "./logo";
import { LOGO_LETTERS, LOGO_SHORT, LOGO_TALL, LOGO_VIEWBOX } from "./logo-geometry";

/*
 * Animación del logo según el manual (página 10). La pausa llega primero:
 *   Barra alta   0 s    0,9 s   cubic-bezier(.3,0,.25,1)   −150 % → anticipa −168 % → estira 1,22 → aplasta 0,78 → rebota 1,06 → reposo
 *   Halo         0,55 s 1,6 s   ease-out                   escala 0,4 → 1,4 · opacidad 0 → 0,35 → 0
 *   Barra corta  0,62 s 0,62 s  cubic-bezier(.34,1.3,.5,1) altura 0 → 116 % → 95 % → 100 %
 *   «e» «y»      0,95 s 0,62 s  cubic-bezier(.22,1,.36,1)  salen de detrás de las barras (±0,3 em, arco −0,06 em)
 *   «s» «h»      1,05 s         igual (acción superpuesta)
 *   Respiración  2,4 s  3,2 s   ease-in-out, en bucle      barra corta 100 % → 90 % → 100 % (CSS .l-bars-short)
 * Origen de transformación: centro de la base de cada barra. Con movimiento reducido, el logo aparece quieto.
 */
const TALL_EASE = [0.3, 0, 0.25, 1] as const;
const SHORT_EASE = [0.34, 1.3, 0.5, 1] as const;
const LETTER_EASE = [0.22, 1, 0.36, 1] as const;
const EM = 1000;

const [tallX, tallH, barW] = LOGO_TALL;
const [shortX, shortH] = LOGO_SHORT;
const base = { transformBox: "fill-box", transformOrigin: "50% 100%" } as const;

/** Desplazamiento inicial de cada letra: las de la izquierda salen hacia la izquierda y viceversa. */
const letterMotion = [
  { from: 0.3 * EM, delay: 1.05 }, // s
  { from: 0.3 * EM, delay: 0.95 }, // e
  { from: -0.3 * EM, delay: 0.95 }, // y
  { from: -0.3 * EM, delay: 1.05 }, // h
];

export function AnimatedLogo({
  className,
  title = "Selyh",
  breathe = true,
  variant = "color",
}: {
  className?: string;
  title?: string;
  breathe?: boolean;
  /** color: barra alta índigo. indigo: para fondos índigo, barra alta blanca (versión «sobre índigo»). */
  variant?: "color" | "indigo";
}) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  // La respiración en bucle solo corre mientras el logo está en pantalla (fuera de ella se pausa).
  const visible = useInView(ref);
  const reduce = useReducedMotion();

  if (reduce) return <Logo variant={variant} className={className} title={title} />;

  const play = inView ? "play" : "rest";

  return (
    <m.svg ref={ref} viewBox={LOGO_VIEWBOX} role="img" aria-label={title} className={cn("h-7 w-auto overflow-hidden", className)} initial="rest" animate={play}>
      {/* Halo bajo la barra alta, en el impacto */}
      <m.ellipse
        cx={tallX + barW / 2}
        cy={0}
        rx={520}
        ry={170}
        fill="#A2A2FA"
        style={{ transformBox: "fill-box", transformOrigin: "50% 50%" }}
        variants={{
          rest: { scale: 0.4, opacity: 0 },
          play: { scale: [0.4, 1.4], opacity: [0, 0.35, 0], transition: { delay: 0.55, duration: 1.6, ease: "easeOut" } },
        }}
      />

      {LOGO_LETTERS.map(([x, d], i) => (
        <m.g
          key={x}
          variants={{
            rest: { x: letterMotion[i].from, y: 0, opacity: 0 },
            play: {
              x: [letterMotion[i].from, 0],
              y: [0, -0.06 * EM, 0],
              opacity: [0, 1, 1],
              transition: { delay: letterMotion[i].delay, duration: 0.62, ease: LETTER_EASE, times: [0, 0.55, 1] },
            },
          }}
        >
          <g fill="currentColor" transform="scale(1 -1)">
            <path transform={`translate(${x} 0)`} d={d} />
          </g>
        </m.g>
      ))}

      {/* Barra alta: cae desde arriba con anticipación, estira, aplasta y rebota. */}
      <m.rect
        x={tallX}
        y={-tallH}
        width={barW}
        height={tallH}
        rx={barW / 2}
        fill={variant === "indigo" ? "#FFFFFF" : "#6363F1"}
        style={base}
        variants={{
          rest: { y: -1.5 * tallH, scaleY: 1 },
          play: {
            y: [-1.5 * tallH, -1.68 * tallH, 0, 0, 0, 0],
            scaleY: [1, 1, 1.22, 0.78, 1.06, 1],
            transition: { duration: 0.9, times: [0, 0.2, 0.55, 0.68, 0.84, 1], ease: TALL_EASE },
          },
        }}
      />

      {/* Barra corta: crece desde la base y luego respira en bucle (animación CSS, pausada fuera de pantalla). */}
      <g className={breathe && inView ? "l-bars-short" : undefined} data-paused={visible ? undefined : ""}>
        <m.rect
          x={shortX}
          y={-shortH}
          width={barW}
          height={shortH}
          rx={barW / 2}
          fill="#A2A2FA"
          style={base}
          variants={{
            rest: { scaleY: 0 },
            play: { scaleY: [0, 1.16, 0.95, 1], transition: { delay: 0.62, duration: 0.62, ease: SHORT_EASE, times: [0, 0.5, 0.8, 1] } },
          }}
        />
      </g>
    </m.svg>
  );
}
