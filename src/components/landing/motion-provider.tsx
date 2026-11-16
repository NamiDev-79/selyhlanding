"use client";

import { LazyMotion, MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/** Las funciones de animación (variantes, gestos, inView) llegan en un trozo aparte, después del primer pintado. */
const loadFeatures = () => import("./motion-features").then((r) => r.default);

/**
 * Motion en modo ligero: los componentes usan `m.*` (núcleo pequeño) y LazyMotion carga el resto bajo demanda.
 * Respeta "reducir movimiento" del sistema: las transformaciones se vuelven instantáneas.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
