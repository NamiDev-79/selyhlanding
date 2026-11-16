"use client";

import { Moon, Pause, Play } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { type DayMoment, workday } from "@/content/landing";
import { cn } from "@/lib/utils";

import { Reveal } from "./reveal";
import { PauseGlyph, SampleNote, SectionHead } from "./ui";

const moments = workday.moments as DayMoment[];
const START = moments[0].from;
const END = moments[moments.length - 1].to;
const SPAN = END - START;
const pct = (m: number) => ((m - START) / SPAN) * 100;
const hhmm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(Math.floor(m % 60)).padStart(2, "0")}`;
const at = (m: number) => moments.find((x) => m >= x.from && m < x.to) ?? moments[moments.length - 1];

const kindStyle: Record<DayMoment["kind"], string> = {
  focus: "bg-[#6363f1]",
  meeting: "bg-[#a2a2fa]",
  incident: "bg-[#0f1523]",
  pause: "bg-surface",
  off: "bg-[repeating-linear-gradient(135deg,var(--hairline)_0_6px,transparent_6px_12px)]",
};
const kindName: Record<DayMoment["kind"], string> = { focus: "Foco", meeting: "Reunión", incident: "Incidente", pause: "Pausa natural", off: "Descanso o fuera de horario" };

/**
 * Un día cualquiera: arrastras la hora y ves cuándo aparece Selyh (pausas naturales) y cuándo calla
 * (foco, reuniones, incidentes, fuera de horario). Se reproduce sola una vez al entrar en pantalla.
 */
export function Workday() {
  const [minute, setMinute] = useState(START + 20);
  const [playing, setPlaying] = useState(false);
  const raf = useRef<number | null>(null);
  const stage = useRef<HTMLDivElement>(null);
  const played = useRef(false);
  const m = at(minute);

  const stop = useCallback(() => {
    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = null;
    setPlaying(false);
  }, []);

  const play = useCallback(() => {
    stop();
    setPlaying(true);
    let from = minute >= END - 5 ? START : minute;
    let last = performance.now();
    let painted = 0;
    const step = (now: number) => {
      // Todo el día en unos 14 s, más lento en las pausas para que se lea lo que dice Selyh.
      const speed = at(from).selyh.asks ? 9 : 52;
      from = Math.min(END - 1, from + (Math.min(now - last, 100) / 1000) * speed);
      last = now;
      // El reloj avanza a ~30 fps: suficiente para verse fluido y la mitad de renders de React.
      if (now - painted >= 33 || from >= END - 1) {
        painted = now;
        setMinute(from);
      }
      if (from >= END - 1) return stop();
      raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
  }, [minute, stop]);

  // `play` cambia con cada minuto; el observador lee la versión actual por ref y se crea una sola vez.
  const playRef = useRef(play);
  useEffect(() => {
    playRef.current = play;
  }, [play]);

  // Se reproduce una vez al aparecer, salvo con movimiento reducido.
  useEffect(() => {
    const el = stage.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.intersectionRatio >= 0.55 && !played.current) {
          played.current = true;
          playRef.current();
        } else if (!e.isIntersecting && raf.current) {
          stop(); // si sales de la sección a mitad de la reproducción, se detiene: nada corre fuera de pantalla
        }
      },
      { threshold: [0, 0.55] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [stop]);

  useEffect(() => stop, [stop]);

  return (
    <section aria-labelledby="dia-title" className="l-section bg-surface-raised">
      <div className="l-wrap">
        <SectionHead id="dia-title" title={workday.title} lead={workday.lead} />

        <Reveal y={42} scale={0.98} duration={0.82} className="mt-[var(--s6)]">
        <div ref={stage} className="l-elev-1 rounded-[16px] border border-hairline bg-surface p-[clamp(16px,3vw,42px)]">
          {/* Hora y lo que hace Selyh */}
          <div className="grid gap-[var(--s4)] md:grid-cols-[1fr_1.618fr] md:items-center">
            <div>
              <p className="font-display text-[clamp(3.5rem,2.6rem+3vw,6rem)] font-bold leading-none tracking-[-0.04em] tabular-nums" aria-hidden>
                {hhmm(minute)}
              </p>
              <p className="mt-2 text-[15px] text-muted-foreground">
                {m.label} · {kindName[m.kind]}
              </p>
            </div>

            <div className="min-h-[124px]" aria-live="polite">
              {m.selyh.asks ? (
                <div key={m.from} className="l-pop l-elev-2 rounded-[16px] border border-hairline bg-surface p-[var(--s3)] sm:p-[var(--s4)]">
                  <p className="flex items-center gap-2 text-[13px] font-medium text-brand-strong">
                    <PauseGlyph /> Selyh aparece
                  </p>
                  <p className="mt-1.5 font-display text-[21px] font-semibold leading-snug">{m.selyh.title}</p>
                  <p className="mt-1 text-muted-foreground">{m.selyh.body}</p>
                </div>
              ) : (
                <div key={m.from} className="l-pop flex items-start gap-3 rounded-[16px] border border-dashed border-hairline p-[var(--s3)] sm:p-[var(--s4)]">
                  <Moon className="mt-1 size-5 shrink-0 text-muted-foreground" aria-hidden />
                  <div>
                    <p className="font-display text-[21px] font-semibold leading-snug">{m.selyh.title}</p>
                    <p className="mt-1 text-muted-foreground">{m.selyh.body}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* La jornada */}
          <div className="mt-[var(--s5)]">
            <div className="relative">
              <div className="flex h-[68px] overflow-hidden rounded-[10px] border border-hairline" aria-hidden>
                {moments.map((x) => (
                  <div
                    key={x.from}
                    className={cn("relative h-full border-r border-surface last:border-r-0", kindStyle[x.kind], at(minute) === x && x.kind !== "pause" && "brightness-110")}
                    style={{ width: `${((x.to - x.from) / SPAN) * 100}%` }}
                  >
                    {x.kind === "pause" ? <PauseGlyph className="absolute left-1/2 top-1/2 h-4 -translate-x-1/2 -translate-y-1/2 text-brand" /> : null}
                  </div>
                ))}
              </div>
              {/* Cursor */}
              <div aria-hidden className="pointer-events-none absolute -bottom-2 -top-2 w-[3px] -translate-x-1/2 rounded-full bg-foreground" style={{ left: `${pct(minute)}%` }}>
                <span className="absolute -top-1 left-1/2 size-3 -translate-x-1/2 rounded-full bg-foreground ring-4 ring-surface" />
              </div>
              <label htmlFor="dia-hora" className="sr-only">
                {workday.scrubLabel}
              </label>
              <input
                id="dia-hora"
                type="range"
                min={START}
                max={END - 1}
                step={5}
                value={Math.round(minute)}
                aria-valuetext={`${hhmm(minute)}: ${m.label}. ${m.selyh.title}`}
                onChange={(e) => {
                  stop();
                  setMinute(Number(e.target.value));
                }}
                className="l-range peer absolute inset-x-0 top-1/2 -translate-y-1/2"
              />
              <div aria-hidden className="pointer-events-none absolute -inset-1 rounded-[14px] opacity-0 outline-2 outline-[var(--ring)] peer-focus-visible:opacity-100" />
            </div>

            {/* Etiquetas de los tramos con pausa */}
            <div aria-hidden className="relative mt-3 h-6 text-[13px] text-muted-foreground max-sm:hidden">
              {moments
                .filter((x) => x.kind === "pause")
                .map((x) => (
                  <span key={x.from} className="absolute -translate-x-1/2 whitespace-nowrap" style={{ left: `${pct((x.from + x.to) / 2)}%` }}>
                    {x.label}
                  </span>
                ))}
            </div>

            <div className="mt-[var(--s3)] flex flex-wrap items-center justify-between gap-[var(--s3)]">
              <button
                type="button"
                onClick={playing ? stop : play}
                className="inline-flex h-11 items-center gap-2 rounded-full border border-hairline px-5 text-[15px] font-medium transition-colors hover:bg-muted"
              >
                {playing ? <Pause className="size-4" aria-hidden /> : <Play className="size-4" aria-hidden />}
                {playing ? workday.pauseLabel : workday.play}
              </button>
              <ul className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-muted-foreground">
                {(["focus", "meeting", "incident", "pause", "off"] as const).map((k) => (
                  <li key={k} className="flex items-center gap-1.5">
                    <span className={cn("size-3 rounded-[3px] border border-hairline", kindStyle[k])} />
                    {kindName[k]}
                  </li>
                ))}
                <li>
                  <SampleNote>{workday.note}</SampleNote>
                </li>
              </ul>
            </div>
          </div>
        </div>
        </Reveal>
      </div>
    </section>
  );
}
