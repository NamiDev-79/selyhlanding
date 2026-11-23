"use client";

import { Globe, Monitor, Smartphone } from "lucide-react";
import { m, type Variants } from "motion/react";
import Link from "next/link";
import type { ReactNode } from "react";

import { platforms } from "@/content/landing";
import { cn } from "@/lib/utils";

import { platformLogo, type PlatformIcon } from "./platform-logos";
import { EASE } from "./reveal";
import { PauseGlyph, SectionHead } from "./ui";

/*
 * Dónde vive Selyh. Cada tarjeta se identifica sin leer: icono grande de la pieza, una miniatura viva
 * de Selyh dentro de ella y botones de descarga con el logo de cada plataforma (como en las tiendas).
 * Las miniaturas se animan una vez al entrar la tarjeta en pantalla (variantes «hidden» → «show»).
 */

const L = platformLogo;

const card: Variants = {
  hidden: { opacity: 0, y: 42 },
  show: { opacity: 1, y: 0, transition: { duration: 0.72, ease: EASE, when: "beforeChildren", staggerChildren: 0.08 } },
};
const fade: Variants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.38 } } };

function VsCodeShot() {
  const lines = [62, 84, 48, 72, 38];
  return (
    <div className="overflow-hidden rounded-[10px] border border-white/10 bg-[#141a29]" aria-hidden>
      <div className="flex items-center gap-1.5 border-b border-white/[0.07] px-3 py-2">
        <span className="rounded-[4px] bg-white/[0.06] px-2 py-0.5 font-mono text-[11px] text-[#c9cdd6]">pagos.ts</span>
        <span className="font-mono text-[11px] text-[#6b7385]">checkout.ts</span>
      </div>
      <div className="grid gap-2 px-4 py-4">
        {lines.map((w, i) => (
          <m.span
            key={i}
            className="h-2 origin-left rounded-full bg-white/10"
            style={{ width: `${w}%`, marginLeft: i % 3 === 1 ? 16 : 0 }}
            variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 0.5, ease: EASE, delay: i * 0.09 } } }}
          />
        ))}
      </div>
      <m.div
        className="flex items-center justify-end gap-2 bg-[#6363f1] px-3 py-1.5 text-[12px] text-white"
        variants={{ hidden: { y: "100%" }, show: { y: "0%", transition: { type: "spring", stiffness: 260, damping: 22, delay: 0.75 } } }}
      >
        <PauseGlyph className="h-3" /> ¿Cómo vas?
        {[1, 2, 3, 4, 5].map((n) => (
          <m.span
            key={n}
            className="grid size-5 place-items-center rounded-[4px] text-[11px] font-semibold"
            variants={{
              hidden: { backgroundColor: "rgba(255,255,255,0.15)", color: "#ffffff" },
              show: n === 2 ? { backgroundColor: "#ffffff", color: "#4f4fd6", scale: [1, 1.25, 1], transition: { delay: 1.5, duration: 0.38 } } : { backgroundColor: "rgba(255,255,255,0.15)" },
            }}
          >
            {n}
          </m.span>
        ))}
      </m.div>
    </div>
  );
}

function DesktopShot() {
  return (
    <div className="relative h-[176px] overflow-hidden rounded-[10px] border border-white/10 bg-[#23284f]" aria-hidden>
      {/* Ventanas de fondo */}
      <div className="absolute left-4 top-4 h-[96px] w-[46%] rounded-[6px] bg-white/[0.06]" />
      <div className="absolute left-[18%] top-9 h-[96px] w-[46%] rounded-[6px] border border-white/10 bg-[#1b2232]" />
      <m.div
        className="absolute right-3 top-3 w-[min(240px,62%)] rounded-[10px] border border-white/10 bg-[#0f1523] p-3 shadow-[0_18px_42px_-18px_rgb(0_0_0/0.8)]"
        variants={{ hidden: { x: "120%", opacity: 0 }, show: { x: "0%", opacity: 1, transition: { type: "spring", stiffness: 180, damping: 20, delay: 0.55 } } }}
      >
        <p className="flex items-center gap-1.5 text-[12px] font-medium text-[#c7c7fa]">
          <PauseGlyph className="h-3" /> Selyh
        </p>
        <p className="mt-1 text-[13px] leading-snug text-white">Llevas 3 h sin pausa. ¿Te estiras 1 minuto?</p>
      </m.div>
      <div className="absolute inset-x-0 bottom-0 flex h-9 items-center justify-between gap-2 bg-[#0b101b] px-3">
        <div className="flex gap-1.5">
          <L.windows className="size-4" />
          <L.apple className="size-4 text-white/80" />
          <L.linux className="size-4" />
        </div>
        <div className="flex items-center gap-2">
          <m.svg
            viewBox="0 0 64 64"
            className="size-5"
            variants={{ hidden: { scale: 1 }, show: { scale: [1, 1.3, 1], transition: { delay: 0.5, duration: 0.5 } } }}
          >
            <rect width="64" height="64" rx="16" fill="#6363F1" />
            <rect x="17" y="11" width="13" height="42" rx="6.5" fill="#FFFFFF" />
            <rect x="35" y="27" width="13" height="26" rx="6.5" fill="#A2A2FA" />
          </m.svg>
          <span className="text-[11px] tabular-nums text-white/70">16:40</span>
        </div>
      </div>
    </div>
  );
}

function MobileShot() {
  const week = [0.42, 0.5, 0.46, 0.62, 0.8, 0.3, 0.24];
  return (
    <div className="flex h-[200px] items-end justify-center gap-[var(--s4)] overflow-hidden rounded-[10px] border border-white/10 bg-[#23284f] px-4" aria-hidden>
      <m.div
        className="h-[176px] w-[132px] shrink-0 overflow-hidden rounded-t-[24px] border-x-[5px] border-t-[5px] border-[#2a3142] bg-[#1b2232] px-3 pt-3"
        variants={{ hidden: { y: 60 }, show: { y: 0, transition: { duration: 0.72, ease: EASE } } }}
      >
        <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-black/40" />
        <p className="text-[10px] text-[#9ca3af]">Tu semana</p>
        <p className="font-display text-[15px] font-semibold leading-tight text-white">Estable</p>
        <div className="mt-3 flex h-[84px] items-end gap-[5px]">
          {week.map((h, i) => (
            <m.span
              key={i}
              className={cn("flex-1 origin-bottom rounded-full", i === 4 ? "bg-[#6363f1]" : "bg-[#a2a2fa]/60")}
              style={{ height: `${h * 100}%` }}
              variants={{ hidden: { scaleY: 0 }, show: { scaleY: 1, transition: { type: "spring", stiffness: 220, damping: 18, delay: 0.5 + i * 0.07 } } }}
            />
          ))}
        </div>
      </m.div>
      {/* Aviso en la pantalla de bloqueo, a la derecha del teléfono */}
      <m.div
        className="mb-auto mt-[var(--s4)] hidden w-[220px] rounded-[16px] border border-white/10 bg-[#0f1523]/80 p-3 shadow-[0_18px_42px_-18px_rgb(0_0_0/0.8)] backdrop-blur sm:block"
        variants={{ hidden: { opacity: 0, y: 16, scale: 0.96 }, show: { opacity: 1, y: 0, scale: 1, transition: { delay: 1.1, duration: 0.5, ease: EASE } } }}
      >
        <p className="flex items-center gap-1.5 text-[11px] text-[#c7c7fa]">
          <PauseGlyph className="h-2.5" /> Selyh · ahora
        </p>
        <p className="mt-1 text-[13px] leading-snug text-white">Cerraste el día. ¿Cómo te vas?</p>
      </m.div>
    </div>
  );
}

function WebShot() {
  return (
    <div className="overflow-hidden rounded-[10px] border border-white/10 bg-[#141a29]" aria-hidden>
      <div className="flex items-center gap-1.5 border-b border-white/[0.07] px-3 py-2">
        {[0, 1, 2].map((i) => (
          <span key={i} className="size-2 rounded-full bg-white/15" />
        ))}
        <span className="ml-3 flex h-5 flex-1 items-center rounded-full bg-white/[0.06] px-2.5 text-[11px] text-[#9ca3af]">app.selyh.fun</span>
      </div>
      <svg viewBox="0 0 320 110" className="block w-full">
        <rect x="0" y="40" width="320" height="34" fill="#a2a2fa" opacity="0.14" />
        <m.polyline
          points="0,62 40,58 80,64 120,55 160,60 200,48 240,34 280,40 320,52"
          fill="none"
          stroke="#8b8bf6"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={{ hidden: { pathLength: 0 }, show: { pathLength: 1, transition: { duration: 1.4, ease: EASE, delay: 0.3 } } }}
        />
        <m.circle
          cx="240"
          cy="34"
          r="5"
          fill="#6363f1"
          stroke="#ffffff"
          strokeWidth="2"
          variants={{ hidden: { scale: 0 }, show: { scale: 1, transition: { type: "spring", stiffness: 400, damping: 14, delay: 1.3 } } }}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        />
      </svg>
    </div>
  );
}

const shots: Record<string, ReactNode> = { vscode: <VsCodeShot />, desktop: <DesktopShot />, mobile: <MobileShot />, web: <WebShot /> };

/** Icono grande de cada pieza, para reconocerla de un vistazo. */
const tiles: Record<string, ReactNode> = {
  vscode: <L.vscode className="size-7" />,
  desktop: <Monitor className="size-7" strokeWidth={1.8} aria-hidden />,
  mobile: <Smartphone className="size-7" strokeWidth={1.8} aria-hidden />,
  web: <Globe className="size-7" strokeWidth={1.8} aria-hidden />,
};

/** Anchos en proporción áurea, alternados por fila (los que tienen más botones, más anchos). */
const spans = ["lg:col-span-5", "lg:col-span-8", "lg:col-span-8", "lg:col-span-5"];

type Get = { icon: string; kicker: string; label: string; href: string; disabled?: boolean };

/** Botón de descarga al estilo de las tiendas: logo + «Descargar para» + plataforma. */
function GetButton({ g }: { g: Get }) {
  const Logo = platformLogo[g.icon as PlatformIcon];

  if (g.disabled) {
    return (
      <m.div variants={fade} className="cursor-not-allowed">
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          tabIndex={-1}
          aria-disabled="true"
          title={`${g.label} (Próximamente)`}
          className="flex h-[52px] cursor-not-allowed select-none items-center gap-2.5 rounded-[10px] bg-[#0f1523]/30 pl-3 pr-4 text-white/45 ring-1 ring-white/10 grayscale filter transition-opacity [.dark_&]:bg-white/10 [.dark_&]:text-[#0f1523]/40 [.dark_&]:ring-black/10"
        >
          <Logo className="opacity-45" />
          <span className="grid text-left leading-none">
            <span className="text-[11px] opacity-60">{g.kicker}</span>
            <span className="mt-1 font-display text-[16px] font-semibold tracking-[-0.01em] opacity-80">{g.label}</span>
          </span>
        </a>
      </m.div>
    );
  }

  const isExternal = g.href.startsWith("http");

  return (
    <m.div variants={fade} whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 500, damping: 30 }}>
      <Link
        href={g.href}
        {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="flex h-[52px] items-center gap-2.5 rounded-[10px] bg-[#0f1523] pl-3 pr-4 text-white ring-1 ring-[#0f1523] transition-[background-color,color,box-shadow] duration-200 hover:bg-[#6363f1] hover:text-white hover:ring-[#6363f1] [.dark_&]:bg-white [.dark_&]:text-[#0f1523] [.dark_&]:ring-white [.dark_&]:hover:bg-[#6363f1] [.dark_&]:hover:text-white [.dark_&]:hover:ring-[#6363f1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6363f1]"
      >
        <Logo />
        <span className="grid text-left leading-none">
          <span className="text-[11px] opacity-70">{g.kicker}</span>
          <span className="mt-1 font-display text-[16px] font-semibold tracking-[-0.01em]">{g.label}</span>
        </span>
      </Link>
    </m.div>
  );
}

export function Platforms() {
  return (
    <section id="como-funciona" aria-labelledby="plataformas-title" className="l-section relative isolate overflow-hidden">
      {/* Resplandor índigo que da profundidad a la banda */}
      <div aria-hidden className="pointer-events-none absolute -top-[20%] left-1/2 -z-10 h-[60%] w-[80%] -translate-x-1/2 rounded-full bg-[#6363f1]/[0.09] blur-[110px]" />
      <div className="l-wrap">
        <SectionHead id="plataformas-title" title={platforms.title} lead={platforms.lead} />
        <ul className="mt-[var(--s6)] grid gap-[var(--s3)] lg:grid-cols-13">
          {platforms.items.map((p, i) => (
            <m.li
              key={p.id}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              variants={card}
              whileHover={{ y: -4 }}
              className={cn(
                "group relative flex flex-col gap-[var(--s4)] overflow-hidden rounded-[16px] border border-hairline bg-surface-raised p-[var(--s4)] transition-colors duration-[380ms] hover:border-[#a2a2fa]",
                spans[i],
              )}
            >
              <div className="relative">{shots[p.id]}</div>
              <div className="mt-auto grid gap-[var(--s3)] border-t border-hairline pt-[var(--s4)]">
                <div className="flex items-center gap-3">
                  <m.span
                    variants={{ hidden: { scale: 0.6, rotate: -12, opacity: 0 }, show: { scale: 1, rotate: 0, opacity: 1, transition: { type: "spring", stiffness: 320, damping: 16 } } }}
                    className="grid size-12 shrink-0 place-items-center rounded-[12px] bg-surface text-brand-strong ring-1 ring-[var(--hairline)]"
                  >
                    {tiles[p.id]}
                  </m.span>
                  <h3 className="l-h3">{p.name}</h3>
                </div>
                <p className="l-body text-muted-foreground">{p.body}</p>
                <div className="mt-1 flex flex-wrap gap-2.5">
                  {p.get.map((g) => (
                    <GetButton key={`${g.icon}-${g.label}`} g={g} />
                  ))}
                </div>
              </div>
            </m.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
