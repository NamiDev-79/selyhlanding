import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { LinkButton } from "@/components/ui/button";
import { Icon } from "@/components/ui/icons";
import { hansSelyeDoc } from "@/content/hans-selye";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = {
  ...pageMetadata(
    "/hans-selye",
    "Hans Selye y el origen de Selyh",
    hansSelyeDoc.description,
  ),
  openGraph: {
    title: "Hans Selye: la ciencia del estrés y el origen de Selyh",
    description: hansSelyeDoc.description,
    url: "/hans-selye",
    images: [{ url: hansSelyeDoc.portrait.src, width: 800, height: 1000, alt: hansSelyeDoc.portrait.alt }],
  },
};

export default function HansSelyePage() {
  return (
    <article className="py-[clamp(3rem,2rem+4vw,6.5rem)]">
      {/* Cabecera editorial */}
      <header className="wrap mb-16 max-w-5xl">
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/#ciencia"
            className="inline-flex items-center gap-1.5 text-step--1 text-ink-soft transition-colors hover:text-ink"
          >
            <Icon name="arrowLeft" className="size-3.5" />
            Volver a Respaldo científico
          </Link>
          <span className="text-ink-faint">/</span>
          <span className="eyebrow text-accent-strong">{hansSelyeDoc.eyebrow}</span>
        </div>

        <div className="mt-8 grid gap-4">
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
            <h1 className="font-display text-step-5 font-semibold tracking-tight text-ink">
              {hansSelyeDoc.name}
            </h1>
            <span className="font-mono text-step-1 text-ink-soft">
              ({hansSelyeDoc.lifespan})
            </span>
          </div>

          <p className="max-w-[52ch] font-quote text-step-2 italic leading-snug text-ink-soft">
            {hansSelyeDoc.description}
          </p>
        </div>
      </header>

      {/* Contenido principal en dos columnas asimétricas */}
      <div className="wrap grid max-w-6xl gap-16 lg:grid-cols-[1fr_1.65fr] lg:gap-20">
        {/* Columna lateral izquierda: Retrato, cita y datos clave */}
        <aside className="space-y-8 lg:sticky lg:top-28 lg:self-start">
          <figure className="overflow-hidden rounded-2xl border border-line bg-paper-2 p-3 shadow-sm">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-paper-3">
              <Image
                src={hansSelyeDoc.portrait.src}
                alt={hansSelyeDoc.portrait.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 420px"
                className="object-cover object-top grayscale contrast-[1.08] transition duration-500 hover:grayscale-0"
                priority
                unoptimized
              />
            </div>
            <figcaption className="mt-3 px-1.5 text-center text-xs leading-normal text-ink-faint">
              {hansSelyeDoc.portrait.caption}
            </figcaption>
          </figure>

          {/* Cita célebre */}
          <blockquote className="rounded-2xl border-l-4 border-accent bg-accent-wash/60 p-6">
            <p className="font-quote text-step-2 italic leading-snug text-ink">
              «{hansSelyeDoc.quote.text}»
            </p>
            <footer className="mt-3 text-step--1 text-ink-soft">
              <strong className="font-medium text-ink">{hansSelyeDoc.quote.author}</strong> —{" "}
              <span>{hansSelyeDoc.quote.context}</span>
            </footer>
          </blockquote>

          {/* Ficha biográfica rápida */}
          <div className="card space-y-3 p-5">
            <p className="eyebrow text-ink-soft">Ficha biográfica</p>
            <dl className="grid gap-2.5 text-[0.92rem]">
              {hansSelyeDoc.facts.map((fact) => (
                <div key={fact.label} className="border-b border-line pb-2 last:border-0 last:pb-0">
                  <dt className="text-xs uppercase tracking-wider text-ink-faint">{fact.label}</dt>
                  <dd className="font-medium text-ink">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </aside>

        {/* Columna derecha: Desarrollo biográfico y conceptual */}
        <main className="space-y-16">
          {/* Sección 1: El síndrome inespecífico */}
          <section id="sindrome-general" className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-accent-strong">
                I. Observación clínica
              </span>
              <div className="h-px flex-1 bg-line" />
            </div>
            <h2 className="font-display text-step-3 font-semibold text-ink">
              {hansSelyeDoc.sections[0].h}
            </h2>
            <div className="space-y-4 text-[1.06rem] leading-relaxed text-ink/85">
              {/* El primer párrafo abre la historia en Lora cursiva, como una entradilla editorial */}
              {hansSelyeDoc.sections[0].p.map((parr, idx) => (
                <p key={idx} className={idx === 0 ? "font-quote text-step-1 italic leading-snug text-ink" : undefined}>
                  {parr}
                </p>
              ))}
            </div>
          </section>

          {/* Sección 2: Las 3 fases del GAS */}
          <section id="fases-gas" className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-accent-strong">
                II. Modelo teórico
              </span>
              <div className="h-px flex-1 bg-line" />
            </div>
            <h2 className="font-display text-step-3 font-semibold text-ink">
              {hansSelyeDoc.sections[1].h}
            </h2>
            <p className="text-[1.06rem] leading-relaxed text-ink/85">
              {hansSelyeDoc.sections[1].p[0]}
            </p>

            {/* Tarjetas secuenciales de las 3 fases */}
            <div className="grid gap-4 pt-2">
              {hansSelyeDoc.sections[1].stages?.map((stage) => (
                <div
                  key={stage.num}
                  className="card flex flex-col gap-3 p-6 sm:flex-row sm:items-start sm:gap-6"
                >
                  <span className="font-mono text-step-3 font-semibold text-accent-strong">
                    {stage.num}
                  </span>
                  <div className="space-y-1.5">
                    <h3 className="font-quote text-step-2 italic text-ink">
                      {stage.name}
                    </h3>
                    <p className="text-[0.96rem] leading-relaxed text-ink-soft">
                      {stage.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Sección 3: Eustrés vs. Distrés */}
          <section id="eustres-distres" className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-accent-strong">
                III. La dualidad biológica
              </span>
              <div className="h-px flex-1 bg-line" />
            </div>
            <h2 className="font-display text-step-3 font-semibold text-ink">
              {hansSelyeDoc.sections[2].h}
            </h2>
            <div className="space-y-4 text-[1.06rem] leading-relaxed text-ink/85">
              {hansSelyeDoc.sections[2].p.map((parr, idx) => (
                <p key={idx}>{parr}</p>
              ))}
            </div>

            {/* Comparativa visual Eustrés vs Distrés */}
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-mint/40 bg-mint-wash p-6">
                <span className="eyebrow text-mint-ink">Eustrés (Positivo)</span>
                <h4 className="mt-2 font-quote text-step-2 italic text-ink">
                  El reto estimulante
                </h4>
                <p className="mt-2 text-step--1 leading-relaxed text-ink-soft">
                  El impulso que despierta la curiosidad, enfoca la atención y nos permite
                  resolver problemas complejos manteniendo el control y la satisfacción.
                </p>
              </div>

              <div className="rounded-2xl border border-warm/40 bg-warm-wash p-6">
                <span className="eyebrow text-warm-ink">Distrés (Perjudicial)</span>
                <h4 className="mt-2 font-quote text-step-2 italic text-ink">
                  La sobrecarga continua
                </h4>
                <p className="mt-2 text-step--1 leading-relaxed text-ink-soft">
                  Demandas que superan la capacidad biológica de respuesta sin pausas de
                  recuperación, desgastando la salud mental, el sueño y la claridad.
                </p>
              </div>
            </div>
          </section>

          {/* Sección 4: De Selye a Selyh */}
          <section id="por-que-selyh" className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-accent-strong">
                IV. El origen de nuestro nombre
              </span>
              <div className="h-px flex-1 bg-line" />
            </div>
            <h2 className="font-display text-step-3 font-semibold text-ink">
              {hansSelyeDoc.sections[3].h}
            </h2>
            <div className="space-y-4 text-[1.06rem] leading-relaxed text-ink/85">
              {hansSelyeDoc.sections[3].p.map((parr, idx) => (
                <p key={idx}>{parr}</p>
              ))}
            </div>
          </section>

          {/* Resumen de pilares Selyh inspirados en Selye */}
          <div className="rounded-2xl border border-line bg-paper-2 p-8 space-y-6">
            <div className="space-y-1">
              <p className="eyebrow text-accent-strong">Cómo aplicamos su legado hoy</p>
              <h3 className="font-display text-step-2 font-semibold text-ink">
                Los principios de Hans Selye dentro de Selyh
              </h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {hansSelyeDoc.legacyTakeaways.map((item, i) => (
                <div key={i} className="space-y-2">
                  <span className="font-mono text-xs font-semibold text-ink-faint">
                    0{i + 1}.
                  </span>
                  <h4 className="font-sans text-sm font-semibold text-ink">
                    {item.title}
                  </h4>
                  <p className="text-xs leading-relaxed text-ink-soft">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Llamado a la acción final hacia el producto */}
          <footer className="border-t border-line pt-10 flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="font-quote text-step-2 italic leading-snug text-ink">
                Conoce cómo Selyh traduce esta ciencia en tu editor
              </p>
              <p className="text-step--1 text-ink-soft">
                Check-ins de un toque, tu propia línea base y pausas que sí sirven.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <LinkButton href="/#como-funciona" variant="primary">
                Ver cómo funciona
              </LinkButton>
              <LinkButton href="/precios" variant="secondary">
                Ver planes
              </LinkButton>
            </div>
          </footer>
        </main>
      </div>
    </article>
  );
}
