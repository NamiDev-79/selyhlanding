import { ArrowRight, Mail, Phone, Plus } from "lucide-react";
import Link from "next/link";

import { PauseGlyph } from "@/components/landing/ui";
import { Reveal, RevealGroup, RevealItem, RevealWords } from "@/components/landing/reveal";
import { Button } from "@/components/shadcn/button";
import { crisis } from "@/content/crisis";
import { site } from "@/content/site";
import { support } from "@/content/support";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata("/support", support.title, support.description);

const mailto = `mailto:${site.email}?subject=${encodeURIComponent(support.mailSubject)}`;
const link = "font-medium text-brand-strong underline decoration-[#a2a2fa] underline-offset-4 hover:decoration-current";

export default function SupportPage() {
  return (
    <>
      {/* Cabecera: qué hacer primero y cómo escribirnos */}
      <section aria-labelledby="soporte-title" className="l-section">
        <div className="l-wrap l-golden items-start">
          <div className="grid content-start gap-[var(--s4)]">
            <p className="text-[15px] font-medium text-brand-strong">{support.title}</p>
            <h1 id="soporte-title" className="l-h2 max-w-[14ch]">
              <RevealWords text="¿Algo no funciona?" accent="Te ayudamos." accentClassName="l-accent text-brand-strong" />
            </h1>
            <Reveal as="p" delay={0.2} className="l-lead text-muted-foreground">
              {support.lead}
            </Reveal>
            <Reveal as="nav" delay={0.3} aria-label="Temas de soporte" className="flex flex-wrap gap-[var(--s2)]">
              {support.topics.map((t) => (
                <a
                  key={t.id}
                  href={`#${t.id}`}
                  className="rounded-full border border-hairline px-4 py-2 text-[15px] font-medium transition-colors hover:border-brand hover:text-brand-strong"
                >
                  {t.title}
                </a>
              ))}
            </Reveal>
          </div>

          <Reveal delay={0.25} className="l-elev-2 grid gap-[var(--s4)] rounded-[16px] border border-hairline bg-surface-raised p-[var(--s5)] max-sm:p-[var(--s4)]">
            <span className="grid size-12 place-items-center rounded-full bg-brand-tint text-brand-strong">
              <Mail className="size-5" aria-hidden />
            </span>
            <div className="grid gap-[var(--s2)]">
              <h2 className="l-h3">Escríbenos</h2>
              <p className="l-body text-muted-foreground">Respondemos por correo, en horario laboral de Perú. Para resolverlo a la primera, cuéntanos:</p>
            </div>
            <ul className="grid gap-[var(--s2)]">
              {support.checklist.map((c) => (
                <li key={c} className="flex gap-[var(--s2)] text-[15px] leading-relaxed">
                  <PauseGlyph className="mt-1.5 shrink-0 text-brand" />
                  {c}
                </li>
              ))}
            </ul>
            <Button asChild size="lg" className="w-fit max-w-full">
              <a href={mailto}>
                {site.email} <ArrowRight aria-hidden />
              </a>
            </Button>
            <p className="text-[14px] text-muted-foreground">{support.privacyNote}</p>
          </Reveal>
        </div>
      </section>

      {/* Ayuda humana primero: el soporte técnico no es una línea de crisis */}
      <section aria-labelledby="crisis-title" data-nav="night" className="l-night">
        <div className="l-wrap grid gap-[var(--s4)] py-[var(--s5)] lg:grid-cols-[1fr_1.618fr] lg:items-center">
          <div className="grid gap-[var(--s2)]">
            <h2 id="crisis-title" className="l-h3">
              {crisis.title}
            </h2>
            <p className="l-body text-[#c3c8d1]">El soporte técnico responde por correo y puede tardar. {crisis.body}</p>
          </div>
          <ul className="grid gap-[var(--s2)] sm:grid-cols-2">
            {crisis.resources.map((r) => (
              <li key={r.name}>
                <a
                  href={r.href}
                  {...(r.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="flex min-h-[68px] items-center gap-[var(--s3)] rounded-[10px] border border-white/12 px-[var(--s3)] py-[var(--s2)] transition-colors hover:border-[#6363f1] hover:bg-white/5"
                >
                  <Phone className="size-4 shrink-0 text-[#a2a2fa]" aria-hidden />
                  <span className="grid">
                    <span className="font-medium">{r.name}</span>
                    <span className="text-[14px] text-[#9ca3af]">{r.detail}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Temas: preguntas en <details> (el contenido está en el HTML aunque esté cerrado) */}
      <div className="l-section grid gap-[var(--s6)]">
        {support.topics.map((t) => (
          <section key={t.id} id={t.id} aria-labelledby={`${t.id}-title`} className="l-wrap l-golden scroll-mt-28 lg:grid-cols-[1fr_1.618fr]!">
            <h2 id={`${t.id}-title`} className="l-h3 lg:sticky lg:top-28 lg:self-start">
              {t.title}
            </h2>
            <RevealGroup stagger={0.06} className="border-t border-hairline">
              {t.items.map((i) => (
                <RevealItem key={i.q}>
                  <details className="l-faq group border-b border-hairline">
                    <summary className="flex min-h-[68px] items-center justify-between gap-[var(--s4)] py-[var(--s3)] font-display text-[clamp(1.0625rem,1rem+0.3vw,1.25rem)] font-semibold tracking-[-0.01em] transition-colors hover:text-brand-strong">
                      {i.q}
                      <Plus className="l-faq-icon size-5 shrink-0 text-brand transition-transform duration-[380ms]" aria-hidden />
                    </summary>
                    <div className="grid gap-[var(--s3)] pb-[var(--s4)]">
                      <p className="l-body text-muted-foreground">{i.a}</p>
                      {i.href ? (
                        <Link href={i.href} className={`w-fit ${link}`}>
                          {i.cta}
                        </Link>
                      ) : null}
                    </div>
                  </details>
                </RevealItem>
              ))}
            </RevealGroup>
          </section>
        ))}
      </div>

      {/* Cierre: si no estaba tu caso */}
      <section aria-labelledby="sin-respuesta-title" className="l-section border-t border-hairline">
        <div className="l-wrap grid justify-items-start gap-[var(--s4)]">
          <h2 id="sin-respuesta-title" className="l-h2 max-w-[18ch]">
            <RevealWords text="¿No encontraste tu caso?" />
          </h2>
          <p className="l-lead text-muted-foreground">
            Escríbenos a{" "}
            <a href={mailto} className={link}>
              {site.email}
            </a>
            . También tienes las{" "}
            <Link href="/#preguntas" className={link}>
              preguntas frecuentes
            </Link>{" "}
            sobre cómo funciona Selyh.
          </p>
        </div>
      </section>
    </>
  );
}
