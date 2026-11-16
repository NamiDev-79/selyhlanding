"use client";

import { ArrowRight, Check } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

import { checkinCopy } from "@/content/panel";
import { useSetConsent } from "@/features/privacy/hooks";
import { ApiError, errorText } from "@/lib/api/client";
import { cn } from "@/lib/utils";

import { type Tag, useCreateCheckin } from "./hooks";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Check-in del día, la acción principal del panel (tarjeta índigo).
 * Flujo: eliges cómo llegas (1–5) → si quieres, añades contexto → guardas. Tras guardar, confirmación y listo.
 */
export function QuickCheckin() {
  const [score, setScore] = useState<number | null>(null);
  const [tag, setTag] = useState<Tag | undefined>();
  const create = useCreateCheckin();
  const consent = useSetConsent();
  const c = checkinCopy;
  const needsConsent = create.error instanceof ApiError && create.error.code === "CONSENT_REQUIRED";
  const done = create.isSuccess;

  const save = () => score && create.mutate({ score, tag });
  const reset = () => {
    create.reset();
    setScore(null);
    setTag(undefined);
  };

  return (
    <section aria-labelledby="checkin-q" className="p-hero relative isolate overflow-clip p-[clamp(20px,3vw,32px)]">
      {/* Las dos barras del logo, gigantes y tenues, como marca de agua */}
      <svg aria-hidden viewBox="0 0 333 715" className="pointer-events-none absolute -bottom-24 -right-20 -z-10 h-[130%] opacity-[0.08] max-sm:hidden">
        <rect x="0" y="0" width="140" height="715" rx="70" fill="#fff" />
        <rect x="193" y="273" width="140" height="442" rx="70" fill="#fff" />
      </svg>

      <AnimatePresence mode="wait" initial={false}>
        {done ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="grid min-h-[260px] content-center justify-items-start gap-4"
            role="status"
          >
            <motion.span
              initial={{ scale: 0, rotate: -40 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 380, damping: 16, delay: 0.1 }}
              className="grid size-14 place-items-center rounded-full bg-white text-[#4f4fd6]"
            >
              <Check className="size-7" strokeWidth={2.6} aria-hidden />
            </motion.span>
            <p className="font-display text-[clamp(1.5rem,1.2rem+1vw,2rem)] font-bold leading-tight tracking-[-0.02em]">
              Guardado. <span className="l-accent font-normal">Gracias por tomarte un segundo.</span>
            </p>
            <button type="button" onClick={reset} className="text-[15px] text-white/80 underline decoration-white/40 underline-offset-4 hover:text-white">
              Registrar otro momento
            </button>
          </motion.div>
        ) : (
          <motion.div key="ask" exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }} className="grid gap-[clamp(16px,2vw,26px)]">
            <div className="grid gap-1">
              <p className="text-[14px] text-white/75">Check-in · te toma dos segundos</p>
              <h2 id="checkin-q" className="font-display text-[clamp(1.625rem,1.2rem+1.4vw,2.375rem)] font-bold leading-[1.05] tracking-[-0.03em]">
                {c.question}
              </h2>
            </div>

            <div role="radiogroup" aria-labelledby="checkin-q" className="grid grid-cols-5 gap-[clamp(6px,1vw,10px)]">
              {c.scale.map((s) => {
                const selected = score === s.value;
                return (
                  <motion.button
                    key={s.value}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    aria-label={`${s.value}: ${s.label}`}
                    disabled={create.isPending}
                    onClick={() => setScore(s.value)}
                    whileTap={{ scale: 0.94 }}
                    animate={{ y: selected ? -4 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 28 }}
                    className={cn(
                      "grid min-h-[64px] content-center sm:min-h-[88px] justify-items-center gap-1.5 rounded-[16px] px-1 py-3 transition-colors duration-200",
                      selected ? "bg-white text-[#4f4fd6] shadow-[0_14px_30px_-14px_rgb(15_21_35/0.6)]" : "bg-white/[0.12] text-white hover:bg-white/[0.2]",
                    )}
                  >
                    <span className="font-display text-[clamp(1.5rem,1.2rem+1vw,2rem)] font-bold leading-none tabular-nums">{s.value}</span>
                    <span className={cn("hidden text-center text-[12px] leading-tight sm:block", selected ? "text-[#4f4fd6]" : "text-white/75")}>{s.label}</span>
                  </motion.button>
                );
              })}
            </div>

            {/* En móvil las etiquetas no caben en cada botón: se leen debajo (extremos, o la elegida) */}
            <p aria-hidden className="-mt-2 flex justify-between gap-2 text-[12px] text-white/75 sm:hidden">
              {score ? (
                <span className="w-full text-center font-medium text-white">{c.scale[score - 1]!.label}</span>
              ) : (
                <>
                  <span>{c.scale[0]!.label}</span>
                  <span>{c.scale[4]!.label}</span>
                </>
              )}
            </p>

            {/* Contexto opcional y guardar: aparecen solo cuando ya elegiste un número */}
            <AnimatePresence initial={false}>
              {score ? (
                <motion.div
                  key="more"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className="overflow-hidden"
                >
                  <fieldset className="grid gap-2 pt-1">
                    <legend className="mb-2 text-[14px] text-white/80">{c.tagsLabel}</legend>
                    <div className="flex flex-wrap gap-2">
                      {c.tags.map((t) => (
                        <button
                          key={t.value}
                          type="button"
                          aria-pressed={tag === t.value}
                          onClick={() => setTag(tag === t.value ? undefined : (t.value as Tag))}
                          className="h-9 rounded-full border border-white/25 px-3.5 text-[14px] text-white/90 transition-colors hover:bg-white/10 aria-pressed:border-white aria-pressed:bg-white aria-pressed:text-[#4f4fd6]"
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                  <div className="mt-[18px] flex flex-wrap items-center gap-3">
                    <motion.button
                      type="button"
                      onClick={save}
                      disabled={create.isPending}
                      whileTap={{ scale: 0.97 }}
                      className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 font-medium text-[#4f4fd6] shadow-[0_10px_24px_-12px_rgb(15_21_35/0.7)] transition-opacity disabled:opacity-60"
                    >
                      {create.isPending ? "Guardando…" : "Guardar check-in"} <ArrowRight className="size-4" aria-hidden />
                    </motion.button>
                    <span className="text-[13px] text-white/70">Solo tú lo ves. Tu empresa nunca.</span>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>

            <div aria-live="polite">
              {needsConsent ? (
                <div className="rounded-[10px] bg-white/[0.12] p-4 text-[14px]">
                  <p>{c.consent}</p>
                  <button
                    type="button"
                    disabled={consent.isPending}
                    onClick={() => consent.mutate({ source: "CHECKIN", granted: true }, { onSuccess: save })}
                    className="mt-3 inline-flex h-10 items-center rounded-full bg-white px-4 font-medium text-[#4f4fd6] disabled:opacity-60"
                  >
                    {c.consentAction}
                  </button>
                </div>
              ) : create.isError ? (
                <p role="alert" className="text-[14px] text-white">
                  {errorText(create.error)}
                </p>
              ) : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
