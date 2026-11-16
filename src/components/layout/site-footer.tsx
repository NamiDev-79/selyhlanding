import Link from "next/link";

import { crisis } from "@/content/crisis";
import { site } from "@/content/site";

import { Wordmark } from "./wordmark";

const links = [
  { href: "/hans-selye", label: "Hans Selye (Inspiración)" },
  { href: "/precios", label: "Planes" },
  { href: "/privacidad", label: "Privacidad" },
  { href: "/terminos", label: "Términos" },
  { href: "/#contacto", label: "Contacto" },
];

export function SiteFooter() {
  return (
    <footer className="mt-[var(--section)] border-t border-line bg-paper-2">
      <div className="wrap grid gap-12 py-16 md:grid-cols-[1.2fr_0.8fr_1.4fr]">
        <div className="grid content-start gap-4">
          <Wordmark />
          <p className="max-w-xs text-step--1 text-ink-soft">
            {site.tagline}. Hecho por un equipo de cuatro en {site.city}.
          </p>
          <a className="link w-fit text-step--1" href={`mailto:${site.email}`}>
            {site.email}
          </a>
        </div>

        <nav aria-label="Pie de página" className="grid content-start gap-2.5 text-[0.95rem]">
          <p className="eyebrow mb-1">Selyh</p>
          {links.map((l) => (
            <Link key={l.href} className="w-fit text-ink-soft transition-colors hover:text-ink" href={l.href}>
              {l.label}
            </Link>
          ))}
        </nav>

        <section aria-labelledby="ayuda-crisis" className="card grid content-start gap-3 p-5">
          <h2 id="ayuda-crisis" className="font-sans text-[0.95rem] font-semibold tracking-normal">
            {crisis.title}
          </h2>
          <p className="text-step--1 text-ink-soft">{crisis.body}</p>
          <ul className="grid gap-1.5 text-[0.95rem]">
            {crisis.resources.map((r) => (
              <li key={r.name} className="flex flex-wrap items-baseline justify-between gap-x-4 border-b border-line pb-1.5 last:border-b-0">
                <a href={r.href} className="font-medium text-ink hover:text-accent-strong">
                  {r.name}
                </a>
                <span className="text-step--1 text-ink-faint">{r.detail}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
      <div className="wrap flex flex-wrap justify-between gap-2 border-t border-line py-5 text-xs text-ink-faint">
        <p>© 2026 Selyh. No es un dispositivo médico ni reemplaza a un profesional.</p>
        <p>{site.city}</p>
      </div>
    </footer>
  );
}
