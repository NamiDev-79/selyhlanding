"use client";

import { ArrowLeft, Check, Clock, ListChecks, Lock } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Loading, Notice } from "@/components/ui/feedback";
import { scalesCopy } from "@/content/scales";
import { CrisisResources } from "@/features/crisis/crisis-resources";
import { errorText, type Res } from "@/lib/api/client";
import { cn } from "@/lib/utils";

import { type ScaleCode, useCompleteScale, useResetScale, useSaveAnswers, useScaleCatalog, useScaleHistory, useScaleProgress } from "./hooks";

type Catalog = Res<"/scales", "get">[number];
type Text = NonNullable<Catalog["text"]>;
type Progress = Res<"/scales/progress", "get">[number];
type Result = Res<"/scales/{code}/progress/complete", "post">;
type Resources = NonNullable<Res<"/scales/{code}/progress", "put">["crisis"]>["resources"];

const c = scalesCopy;
const BATCH = 3;
const EASE = [0.22, 1, 0.36, 1] as const;

/** Primera tanda cuando aún no hay avance guardado. En PHQ-9 el ítem 9 va primero (protocolo de crisis). */
function firstItems(code: string, total: number) {
  const order = code === "PHQ9" ? [8, ...Array.from({ length: total - 1 }, (_, i) => i)] : Array.from({ length: total }, (_, i) => i);
  return order.slice(0, BATCH);
}

const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("es-PE", { day: "numeric", month: "short", year: "numeric" });
/** Unos 10 s por pregunta. */
const minutes = (items: number) => Math.max(1, Math.round((items * 10) / 60));

/** Lista de escalas con su estado y el cuestionario por partes de la elegida (?code=…). */
export function ScalesView() {
  const params = useSearchParams();
  const router = useRouter();
  const code = params.get("code");
  const catalog = useScaleCatalog();
  const progress = useScaleProgress();
  const history = useScaleHistory();

  if (catalog.isPending || progress.isPending) return <Loading />;
  if (catalog.isError) return <Notice tone="attention" title={errorText(catalog.error)} />;

  const selected = catalog.data.find((s) => s.code === code);
  if (selected?.text) {
    return (
      <Runner
        key={selected.code}
        scale={selected as Catalog & { code: ScaleCode }}
        text={selected.text}
        progress={progress.data?.find((p) => p.code === selected.code)}
        onClose={() => router.push("/panel/escalas")}
      />
    );
  }

  const available = catalog.data.filter((s) => s.available);
  const soon = catalog.data.filter((s) => !s.available);
  // Primero las que tienes a medias.
  available.sort((a, b) => Number(!!progress.data?.find((p) => p.code === b.code)) - Number(!!progress.data?.find((p) => p.code === a.code)));

  return (
    <div className="grid gap-[42px]">
      {available.length ? (
        <ul className="grid gap-4 lg:grid-cols-2">
          {available.map((s, i) => {
            const p = progress.data?.find((x) => x.code === s.code);
            const last = history.data?.find((h) => h.instrument === s.code);
            return (
              <motion.li
                key={s.code}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: EASE, delay: i * 0.05 }}
                className={cn("p-card flex flex-col gap-4 p-[clamp(20px,2.6vw,28px)] transition-colors hover:border-[#a2a2fa]", p && "border-[#a2a2fa]")}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="grid size-11 shrink-0 place-items-center rounded-[12px] bg-brand-tint text-brand-strong">
                    <ListChecks className="size-5" aria-hidden />
                  </span>
                  {p ? (
                    <span className="rounded-full bg-[#6363f1] px-3 py-1 text-xs font-medium text-white">En curso</span>
                  ) : last ? (
                    <span className="flex items-center gap-1.5 rounded-full bg-[var(--app-card-2)] px-3 py-1 text-xs text-ink-soft">
                      <Check className="size-3.5" aria-hidden /> {c.last}: {fmtDate(last.completedAt)}
                    </span>
                  ) : null}
                </div>
                <div className="grid gap-1.5">
                  <h2 className="p-h2">{s.name}</h2>
                  <p className="text-ink-soft">{s.text?.about}</p>
                </div>
                <p className="figures flex items-center gap-2 text-sm text-ink-faint">
                  <span>{s.items} preguntas</span>
                  <span aria-hidden>·</span>
                  <Clock className="size-3.5" aria-hidden />
                  <span>unos {minutes(s.items)} min</span>
                  {last && !p ? (
                    <>
                      <span aria-hidden>·</span>
                      <span>
                        última: {last.totalScore}/{s.maxScore}
                      </span>
                    </>
                  ) : null}
                </p>
                {p ? (
                  <div className="grid gap-1.5">
                    <div className="h-1.5 overflow-hidden rounded-full bg-brand-tint" aria-hidden>
                      <motion.div className="h-full rounded-full bg-[#6363f1]" initial={{ width: 0 }} animate={{ width: `${(p.answered / p.total) * 100}%` }} transition={{ duration: 0.7, ease: EASE }} />
                    </div>
                    <p className="figures text-xs text-ink-faint">
                      {p.answered} de {p.total} respondidas
                    </p>
                  </div>
                ) : null}
                <div className="mt-auto pt-1">
                  <Button variant={p ? "primary" : "secondary"} onClick={() => router.push(`/panel/escalas?code=${s.code}`)}>
                    {p ? c.resume : last ? c.again : c.start}
                  </Button>
                </div>
              </motion.li>
            );
          })}
        </ul>
      ) : (
        <div className="p-card grid justify-items-start gap-2 p-[clamp(20px,3vw,32px)]">
          <h2 className="p-h2">Aún no hay escalas disponibles</h2>
          <p className="text-ink-soft">{c.soonNote} Te avisaremos cuando puedas responderlas.</p>
        </div>
      )}

      {soon.length ? (
        <section className="grid gap-3" aria-labelledby="escalas-pronto">
          <h2 id="escalas-pronto" className="p-label">
            {c.soon}
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {soon.map((s) => (
              <li key={s.code} className="flex items-center justify-between gap-3 rounded-[14px] border border-dashed border-[var(--app-edge)] px-5 py-4">
                <div className="grid gap-0.5">
                  <p className="font-medium">{s.name}</p>
                  <p className="text-sm text-ink-faint">{c.soonNote}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <p className="flex items-center gap-2 text-sm text-ink-faint">
        <Lock className="size-4" aria-hidden /> {c.privacy}
      </p>
    </div>
  );
}

function Runner({ scale, text, progress, onClose }: { scale: Catalog & { code: ScaleCode }; text: Text; progress?: Progress; onClose: () => void }) {
  const save = useSaveAnswers(scale.code);
  const complete = useCompleteScale(scale.code);
  const reset = useResetScale(scale.code);
  const reduce = useReducedMotion();
  const [state, setState] = useState(() => ({
    answered: progress?.answered ?? 0,
    nextItems: progress?.nextItems?.length ? progress.nextItems : firstItems(scale.code, scale.items),
  }));
  const [draft, setDraft] = useState<Record<number, number>>({});
  const [crisis, setCrisis] = useState<Resources | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [justSaved, setJustSaved] = useState(false);
  const itemRefs = useRef<Record<number, HTMLFieldSetElement | null>>({});
  const topRef = useRef<HTMLDivElement>(null);

  const options = Array.from({ length: scale.maxPerItem - scale.minPerItem + 1 }, (_, i) => scale.minPerItem + i);
  const allAnswered = state.answered >= scale.items;
  const ready = state.nextItems.every((i) => draft[i] !== undefined);
  const lastBatch = state.answered + state.nextItems.length >= scale.items;
  const shownAnswered = state.answered + state.nextItems.filter((i) => draft[i] !== undefined).length;

  const choose = (index: number, value: number) => {
    const next = { ...draft, [index]: value };
    setDraft(next);
    setJustSaved(false);
    // Lleva a la siguiente pregunta sin responder de esta tanda.
    const pending = state.nextItems.find((i) => next[i] === undefined);
    if (pending !== undefined && draft[index] === undefined) {
      itemRefs.current[pending]?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
    }
  };

  const submit = () =>
    save.mutate(
      state.nextItems.map((index) => ({ index, value: draft[index]! })),
      {
        onSuccess: (r) => {
          setState({ answered: r.answered, nextItems: r.nextItems });
          setDraft({});
          setJustSaved(true);
          if (r.crisis) setCrisis(r.crisis.resources);
          topRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
        },
      },
    );

  const back = (
    <button type="button" onClick={onClose} className="inline-flex w-fit items-center gap-2 text-sm text-ink-soft transition-colors hover:text-[var(--ink)]">
      <ArrowLeft className="size-4" aria-hidden /> {c.back}
    </button>
  );

  if (result) {
    return (
      <div className="grid gap-6">
        {back}
        {result.crisis ? <CrisisResources resources={result.crisis.resources} /> : null}
        <motion.article initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE }} className="p-card grid gap-5 p-[clamp(22px,3.4vw,40px)]">
          <p className="text-[14px] font-medium text-brand-strong">{scale.name}</p>
          <div className="flex items-baseline gap-3">
            <span className="font-display text-step-5 font-bold leading-none tracking-[-0.04em] text-brand">{result.totalScore}</span>
            <span className="figures text-ink-faint">de {result.maxScore}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-brand-tint" aria-hidden>
            <motion.div className="h-full rounded-full bg-[#6363f1]" initial={{ width: 0 }} animate={{ width: `${(result.totalScore / result.maxScore) * 100}%` }} transition={{ duration: 0.9, ease: EASE, delay: 0.2 }} />
          </div>
          <p className="text-step-1 first-letter:uppercase">{result.band}</p>
          <p className="max-w-[56ch] text-ink-soft">{result.note}</p>
          <p className="font-quote max-w-[56ch] italic text-ink-soft">{c.resultNote}</p>
        </motion.article>
        <div>
          <Button variant="secondary" onClick={onClose}>
            {c.back}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6" ref={topRef}>
      {back}

      {/* Con riesgo detectado, la ayuda va primero: antes de seguir con cualquier pregunta. */}
      {crisis ? <CrisisResources resources={crisis} /> : null}

      <div className="p-card grid gap-8 p-[clamp(20px,3.4vw,40px)]">
        <header className="grid gap-4">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h2 className="p-h2 text-[clamp(1.375rem,1.1rem+1vw,1.875rem)]!">{scale.name}</h2>
            <span className="figures text-sm text-ink-faint">
              {shownAnswered} de {scale.items}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-brand-tint" aria-hidden>
            <motion.div className="h-full rounded-full bg-[#6363f1]" animate={{ width: `${(shownAnswered / scale.items) * 100}%` }} transition={{ duration: 0.5, ease: EASE }} />
          </div>
          <p className="font-quote text-[clamp(1.125rem,1rem+0.4vw,1.375rem)] italic leading-snug">{text.period}</p>
        </header>

        <AnimatePresence>
          {justSaved && !allAnswered ? (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2 text-sm text-brand-strong"
              role="status"
            >
              <Check className="size-4" aria-hidden /> {c.saved}
            </motion.p>
          ) : null}
        </AnimatePresence>

        {allAnswered ? (
          <div className="grid justify-items-start gap-4">
            <p className="text-step-1">{c.allAnswered}</p>
            <Button pending={complete.isPending} onClick={() => complete.mutate(undefined, { onSuccess: setResult })}>
              {c.finish}
            </Button>
            {complete.isError ? <Notice tone="attention" title={errorText(complete.error)} /> : null}
          </div>
        ) : (
          <form
            className="grid gap-8"
            onSubmit={(e) => {
              e.preventDefault();
              if (ready) submit();
            }}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {state.nextItems.map((index, n) => (
                <motion.fieldset
                  key={index}
                  ref={(el) => {
                    itemRefs.current[index] = el;
                  }}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, ease: EASE, delay: n * 0.06 }}
                  className="min-w-0 border-t border-[var(--app-edge)] pt-6 first:border-t-0 first:pt-0"
                >
                  <legend className="block w-full">
                    <span className="figures block text-xs text-ink-faint">
                      Pregunta {index + 1} de {scale.items}
                    </span>
                    <span className="mt-1 block text-[clamp(1.125rem,1rem+0.5vw,1.375rem)] font-medium leading-snug">{text.items[index]}</span>
                  </legend>
                  <div className={cn("mt-4 grid gap-2", options.length <= 4 ? "sm:grid-cols-2 xl:grid-cols-4" : "sm:grid-cols-2 xl:grid-cols-3")}>
                    {options.map((v, i) => {
                      const on = draft[index] === v;
                      return (
                        <label key={v} className="cursor-pointer">
                          <input type="radio" name={`item-${index}`} value={v} checked={on} onChange={() => choose(index, v)} className="peer sr-only" />
                          <span
                            className={cn(
                              "flex h-full min-h-12 items-center gap-3 rounded-[12px] border px-4 py-3 text-[15px] leading-snug transition-[background-color,border-color,color,transform] duration-150 active:scale-[0.98]",
                              "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#6363f1]",
                              on ? "border-[#6363f1] bg-[#6363f1] text-white" : "border-[var(--app-edge)] bg-[var(--app-card)] hover:border-[#a2a2fa]",
                            )}
                          >
                            <span className={cn("grid size-5 shrink-0 place-items-center rounded-full border", on ? "border-white bg-white text-[#4f4fd6]" : "border-[var(--line-strong)]")} aria-hidden>
                              {on ? <Check className="size-3" strokeWidth={3} /> : null}
                            </span>
                            {text.options[i] ?? v}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </motion.fieldset>
              ))}
            </AnimatePresence>

            {save.isError ? <Notice tone="attention" title={errorText(save.error)} /> : null}
            <div className="flex flex-wrap items-center gap-3 border-t border-[var(--app-edge)] pt-6">
              <Button type="submit" disabled={!ready} pending={save.isPending}>
                {lastBatch ? c.saveLast : c.save}
              </Button>
              <Button type="button" variant="ghost" onClick={onClose}>
                {c.later}
              </Button>
              <span className="text-sm text-ink-faint">Se guarda por tandas de {BATCH} preguntas.</span>
            </div>
          </form>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        {text.source ? <p className="text-xs text-ink-faint">{text.source}</p> : <span />}
        {state.answered > 0 ? (
          <Button
            variant="quiet"
            size="sm"
            pending={reset.isPending}
            onClick={() =>
              reset.mutate(undefined, {
                onSuccess: () => {
                  setState({ answered: 0, nextItems: firstItems(scale.code, scale.items) });
                  setDraft({});
                  setJustSaved(false);
                },
              })
            }
          >
            {c.restart}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
