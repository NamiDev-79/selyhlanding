import { Plus } from "lucide-react";

import { faq } from "@/content/faq";

import { RevealGroup, RevealItem, RevealWords } from "./reveal";

/** Preguntas frecuentes con <details>: el contenido está en el HTML (y en FAQPage) aunque esté cerrado. */
export function Faq() {
  return (
    <section id="preguntas" aria-labelledby="preguntas-title" className="l-section border-t border-hairline">
      <div className="l-wrap l-golden lg:grid-cols-[1fr_1.618fr]!">
        <div className="grid content-start gap-[var(--s3)] lg:sticky lg:top-28">
          <h2 id="preguntas-title" className="l-h2">
            <RevealWords text={faq.title} />
          </h2>
          <p className="l-body text-muted-foreground">
            ¿No está tu pregunta?{" "}
            <a href="#contacto" className="font-medium text-brand-strong underline decoration-[#a2a2fa] underline-offset-4 hover:decoration-current">
              Escríbenos
            </a>
            .
          </p>
        </div>
        <RevealGroup stagger={0.06} className="border-t border-hairline">
          {faq.items.map((i) => (
            <RevealItem key={i.q}>
            <details className="l-faq group border-b border-hairline">
              <summary className="flex min-h-[68px] items-center justify-between gap-[var(--s4)] py-[var(--s3)] font-display text-[clamp(1.125rem,1rem+0.4vw,1.375rem)] font-semibold tracking-[-0.01em] transition-colors hover:text-brand-strong">
                {i.q}
                <Plus className="l-faq-icon size-5 shrink-0 text-brand transition-transform duration-[380ms]" aria-hidden />
              </summary>
              <p className="l-body pb-[var(--s4)] text-muted-foreground">{i.a}</p>
            </details>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
