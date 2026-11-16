import type { LegalDoc } from "@/content/legal";

export function LegalPage({ doc }: { doc: LegalDoc }) {
  return (
    <article className="wrap grid gap-12 py-[clamp(3rem,2rem+4vw,6rem)] lg:grid-cols-[1fr_2fr] lg:gap-24">
      <header className="grid content-start gap-4 lg:sticky lg:top-28">
        <p className="eyebrow">Actualizado: {doc.updated}</p>
        <h1 className="text-step-4">{doc.title}</h1>
        <p className="text-ink-soft">{doc.description}</p>
      </header>
      <div className="grid max-w-[66ch] gap-10 border-t border-ink pt-8">
        {doc.sections.map((s) => (
          <section key={s.h} className="grid gap-3">
            <h2 className="text-step-2">{s.h}</h2>
            {s.p.map((p) => (
              <p key={p} className="text-ink-soft">
                {p}
              </p>
            ))}
          </section>
        ))}
      </div>
    </article>
  );
}
