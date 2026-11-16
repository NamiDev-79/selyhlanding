"use client";

import { m, useReducedMotion, useScroll, useTransform, type Variants } from "motion/react";
import { Fragment, type ReactNode, useRef } from "react";

import { cn } from "@/lib/utils";

/*
 * Coreografía de entrada de la landing, igual en todas las secciones:
 *   los bloques suben 26 px y aparecen en 0,62 s, ease-out de la marca (solo opacidad y transform:
 *   nada de blur animado, que obliga a repintar cada fotograma),
 *   los grupos se escalonan cada 0,1 s y los titulares entran palabra por palabra.
 * Una sola vez por elemento. Con «reducir movimiento», Motion quita el desplazamiento y queda solo el fundido.
 */
export const EASE = [0.22, 1, 0.36, 1] as const;
const VIEW = { once: true, amount: 0.25, margin: "0px 0px -8% 0px" } as const;

const rise: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.62, ease: EASE } },
};

type Tag = "div" | "li" | "ul" | "ol" | "section" | "p" | "figure" | "aside" | "dl" | "nav" | "span";

/** Un bloque que entra al aparecer en pantalla. `x`/`y`/`scale` = desde dónde llega. */
export function Reveal({
  as = "div",
  delay = 0,
  x = 0,
  y = 26,
  scale = 1,
  duration = 0.62,
  className,
  children,
  ...rest
}: { as?: Tag; delay?: number; x?: number; y?: number; scale?: number; duration?: number; className?: string; children: ReactNode } & Record<string, unknown>) {
  const M = m[as] as typeof m.div;
  return (
    <M
      initial="hidden"
      whileInView="show"
      viewport={VIEW}
      variants={{
        hidden: { opacity: 0, x, y, scale },
        show: { opacity: 1, x: 0, y: 0, scale: 1, transition: { duration, ease: EASE, delay } },
      }}
      className={className}
      {...rest}
    >
      {children}
    </M>
  );
}

/** Contenedor que escalona a sus `RevealItem`. */
export function RevealGroup({ as = "div", stagger = 0.1, delay = 0, className, children, ...rest }: { as?: Tag; stagger?: number; delay?: number; className?: string; children: ReactNode } & Record<string, unknown>) {
  const M = m[as] as typeof m.div;
  return (
    <M
      initial="hidden"
      whileInView="show"
      viewport={VIEW}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
      className={className}
      {...rest}
    >
      {children}
    </M>
  );
}

export function RevealItem({ as = "div", className, children, ...rest }: { as?: Tag; className?: string; children: ReactNode } & Record<string, unknown>) {
  const M = m[as] as typeof m.div;
  return (
    <M variants={rise} className={className} {...rest}>
      {children}
    </M>
  );
}

/**
 * Titular que entra palabra por palabra, cada una saliendo de detrás de una máscara.
 * El texto sigue siendo un solo encabezado para lectores de pantalla y buscadores.
 */
export function RevealWords({ text, accent, accentClassName, className, delay = 0 }: { text: string; accent?: string; accentClassName?: string; className?: string; delay?: number }) {
  const words = [...text.split(" ").map((w) => ({ w, a: false })), ...(accent ? accent.split(" ").map((w) => ({ w, a: true })) : [])];
  return (
    <m.span
      initial="hidden"
      whileInView="show"
      viewport={VIEW}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.055, delayChildren: delay } } }}
      className={cn("inline", className)}
    >
      {words.map(({ w, a }, i) => (
        <Fragment key={i}>
          <span className={cn("-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] align-bottom", a && "-mr-[0.12em] pr-[0.12em]")}>
            <m.span
              className={cn("inline-block", a && accentClassName)}
              variants={{ hidden: { y: "105%", opacity: 0 }, show: { y: "0%", opacity: 1, transition: { duration: 0.72, ease: EASE } } }}
            >
              {w}
            </m.span>
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </m.span>
  );
}

/**
 * Desplazamiento suave ligado al scroll (parallax): el contenido se mueve de `from` a `to` px
 * mientras su sección cruza la pantalla. Quieto si el sistema pide reducir movimiento.
 */
export function Parallax({ from = 60, to = -60, className, children }: { from?: number; to?: number; className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [from, to]);
  return (
    <m.div ref={ref} style={reduce ? undefined : { y }} className={className}>
      {children}
    </m.div>
  );
}
