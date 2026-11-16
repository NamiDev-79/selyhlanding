"use client";

import { useQuery } from "@tanstack/react-query";
import { ChevronDown, NotebookPen, PersonStanding, Sparkles, Timer, Wind } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Empty, Loading, Notice } from "@/components/ui/feedback";
import { interventionCopy } from "@/content/panel";
import { api, errorText, unwrap } from "@/lib/api/client";
import { CrisisResources } from "@/features/crisis/crisis-resources";

import { useFeedback, useLibrary, useNextSuggestion, useRespond, useSuggestionHistory } from "./hooks";

const c = interventionCopy;

/** Icono por tipo de ejercicio: se reconoce qué es sin leer el título. */
function CategoryIcon({ category, className = "size-5" }: { category?: string; className?: string }) {
  const I = category === "BREATHING" ? Wind : category === "PHYSICAL_BREAK" ? PersonStanding : category === "CBT" ? NotebookPen : Sparkles;
  return <I className={className} aria-hidden />;
}

/** Primera frase del ejercicio, sin marcas de Markdown, para el resumen de la lista. */
const preview = (md: string) => md.replace(/[*_#`]/g, "").split(/\n+/)[0]!.trim();

/** Texto del ejercicio: párrafos simples (el contenido clínico es Markdown sencillo). */
function Body({ text }: { text: string }) {
  return (
    <div className="grid max-w-[60ch] gap-3">
      {text.split(/\n{2,}/).map((p, i) => (
        <p key={i}>{p.replace(/[*_#`]/g, "")}</p>
      ))}
    </div>
  );
}

function Actions({ id, response, feedback }: { id: string; response: string | null; feedback: string | null }) {
  const respond = useRespond();
  const rate = useFeedback();
  if (!response) {
    return (
      <div className="flex flex-wrap gap-2">
        {(["ACCEPTED", "POSTPONED", "DISMISSED"] as const).map((r) => (
          <Button key={r} size="sm" variant={r === "ACCEPTED" ? "primary" : "ghost"} pending={respond.isPending && respond.variables?.response === r} onClick={() => respond.mutate({ id, response: r })}>
            {c.respond[r]}
          </Button>
        ))}
      </div>
    );
  }
  if (response === "ACCEPTED" && !feedback) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-step--1 text-ink-soft">{c.feedbackQuestion}</span>
        {(["HELPFUL", "NOT_HELPFUL"] as const).map((f) => (
          <Button key={f} size="sm" variant="secondary" pending={rate.isPending && rate.variables?.feedback === f} onClick={() => rate.mutate({ id, feedback: f })}>
            {c.feedback[f]}
          </Button>
        ))}
      </div>
    );
  }
  return (
    <p className="text-step--1 text-ink-faint">
      {c.responded[response]}
      {feedback ? ` · ${c.feedback[feedback as "HELPFUL" | "NOT_HELPFUL"]}` : ""}
    </p>
  );
}

/** Pedir un ejercicio ahora (manual) y responderlo. Respeta tope diario y alertas de crisis. */
export function SuggestionNow() {
  const next = useNextSuggestion();
  const prefs = useQuery({ queryKey: ["preferences"], queryFn: () => unwrap(api.GET("/preferences")) });
  const history = useSuggestionHistory();
  const result = next.data;
  const current = result?.suggestion ? history.data?.find((h) => h.id === result.suggestion!.id) : undefined;

  return (
    <section className="grid gap-6">
      <div className="flex flex-wrap items-center gap-4">
        <Button onClick={() => next.mutate()} pending={next.isPending}>
          {c.ask}
        </Button>
        {prefs.data ? <span className="text-step--1 text-ink-faint">{c.cap(prefs.data.dailySuggestionCap)}</span> : null}
      </div>
      {next.isError ? <Notice tone="attention" title={errorText(next.error)} /> : null}
      {result && !result.suggestion ? (
        result.reason === "OPEN_CRISIS_FLAG" && result.resources ? (
          <CrisisResources resources={result.resources} lead={c.reasons.OPEN_CRISIS_FLAG} />
        ) : (
          <Notice tone="neutral" title={c.reasons[result.reason] ?? result.reason} />
        )
      ) : null}
      {result?.suggestion ? (
        <article className="p-card grid gap-4 p-[clamp(20px,3vw,32px)]">
          <p className="text-[14px] font-medium text-brand-strong">
            {c.category[result.suggestion.intervention.category] ?? result.suggestion.intervention.category} · {result.suggestion.intervention.durationMinutes} min
          </p>
          <h3 className="p-h2 text-[clamp(1.5rem,1.2rem+1vw,2rem)]!">{result.suggestion.intervention.title}</h3>
          <Body text={result.suggestion.intervention.bodyMarkdown} />
          <Actions id={result.suggestion.id} response={current?.response ?? null} feedback={current?.feedback ?? null} />
        </article>
      ) : null}
    </section>
  );
}

export function SuggestionHistory() {
  const history = useSuggestionHistory();
  const library = useLibrary();
  if (history.isPending) return <Loading />;
  if (history.isError) return <Notice tone="attention" title={errorText(history.error)} />;
  if (!history.data.length) return <Empty title="Aún no hay sugerencias">Cuando tu carga suba o pidas un ejercicio, aparecerá aquí con lo que respondiste.</Empty>;

  const byId = new Map((library.data ?? []).map((i) => [i.id, i]));
  return (
    <ol className="grid">
      {history.data.map((s) => {
        const item = byId.get(s.interventionId);
        return (
          <li key={s.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-[var(--app-edge)] py-3.5 first:pt-0 last:border-0 last:pb-0">
            <span className="grid size-10 shrink-0 place-items-center rounded-[10px] bg-brand-tint text-brand">
              <CategoryIcon category={item?.category} />
            </span>
            <span className="grid min-w-0 flex-1 gap-0.5">
              <span className="font-medium">{item?.title ?? "Ejercicio que ya no está en la biblioteca"}</span>
              <span className="text-[13px] text-muted-foreground">
                {new Date(s.suggestedAt).toLocaleDateString("es-PE", { day: "numeric", month: "long" })}
                {item ? ` · ${c.category[item.category] ?? item.category} · ${item.durationMinutes} min` : ""}
              </span>
            </span>
            <Actions id={s.id} response={s.response} feedback={s.feedback} />
          </li>
        );
      })}
    </ol>
  );
}

export function Library() {
  const library = useLibrary();
  if (library.isPending) return <Loading />;
  if (library.isError) return <Notice tone="attention" title={errorText(library.error)} />;
  if (!library.data.length) return <Empty title="Biblioteca en preparación">Los ejercicios aparecen aquí cuando nuestra psicóloga los aprueba.</Empty>;
  return (
    <ul className="grid gap-3 md:grid-cols-2">
      {library.data.map((i) => (
        <li key={i.id}>
          <details className="group h-full rounded-[16px] border border-[var(--app-edge)] p-4 transition-colors open:border-[#a2a2fa] hover:border-[#a2a2fa]">
            <summary className="flex cursor-pointer list-none items-start gap-3 [&::-webkit-details-marker]:hidden">
              <span className="grid size-11 shrink-0 place-items-center rounded-[12px] bg-brand-tint text-brand">
                <CategoryIcon category={i.category} />
              </span>
              <span className="grid min-w-0 flex-1 gap-1">
                <span className="font-display text-[17px] font-semibold leading-tight">{i.title}</span>
                <span className="flex flex-wrap items-center gap-x-2 text-[13px] text-muted-foreground">
                  {c.category[i.category] ?? i.category}
                  <span aria-hidden>·</span>
                  <span className="inline-flex items-center gap-1">
                    <Timer className="size-3.5" aria-hidden /> {i.durationMinutes} min
                  </span>
                </span>
                <span className="line-clamp-2 text-[14px] text-muted-foreground group-open:hidden">{preview(i.bodyMarkdown)}</span>
              </span>
              <ChevronDown className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform duration-300 group-open:rotate-180" aria-hidden />
            </summary>
            <div className="pt-3 pl-14 text-[15px] text-foreground/85">
              <Body text={i.bodyMarkdown} />
            </div>
          </details>
        </li>
      ))}
    </ul>
  );
}
