import Link from "next/link";

import { AnimatedLogo } from "@/components/brand/animated-logo";
import { site } from "@/content/site";

import { RevealGroup, RevealItem } from "./reveal";
import { Year } from "./year";

/** Iconos de marca (lucide ya no incluye logos de terceros). */
const socialIcon: Record<string, React.ReactNode> = {
  Instagram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="size-[18px]" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </svg>
  ),
  LinkedIn: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-[18px]" aria-hidden>
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4v11H3v-11Zm6.5 0h3.83v1.5h.05c.53-1 1.84-2.06 3.79-2.06 4.05 0 4.8 2.66 4.8 6.13v5.43h-4v-4.81c0-1.15-.02-2.63-1.6-2.63-1.6 0-1.85 1.25-1.85 2.55v4.89h-4v-11Z" />
    </svg>
  ),
};

const columns = [
  {
    title: "Producto",
    links: [
      { label: "Cómo funciona", href: "/#como-funciona" },
      { label: "Para equipos", href: "/#equipos" },
      { label: "Privacidad", href: "/#privacidad" },
      { label: "Planes y precios", href: "/precios" },
    ],
  },
  {
    title: "Selyh",
    links: [
      { label: "Por qué Hans Selye", href: "/hans-selye" },
      { label: "Pedir una demo", href: "/#contacto" },
      { label: "Preguntas frecuentes", href: "/#preguntas" },
      { label: "Iniciar sesión", href: "/login" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Política de privacidad", href: "/privacidad" },
      { label: "Términos y condiciones", href: "/terminos" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer data-nav="night" className="l-night">
      <div className="l-wrap pb-[var(--s5)] pt-[var(--s6)]">
        <RevealGroup className="grid gap-[var(--s5)] lg:grid-cols-[1.618fr_1fr_1fr_1fr]">
          <RevealItem className="grid content-start gap-[var(--s3)]">
            {/* Entra con la animación del manual una sola vez y queda quieto (sin respiración en bucle). */}
            <Link href="/" aria-label="Selyh, inicio" className="w-fit">
              <AnimatedLogo breathe={false} className="h-9 text-white" title="Selyh" />
            </Link>
            <p className="l-accent max-w-[22ch] text-[26px] leading-snug">
              Prevenir también es <span className="text-[#a2a2fa]">parte del trabajo.</span>
            </p>
            <ul className="flex gap-2.5" aria-label="Redes sociales">
              {site.social.map((s) => (
                <li key={s.href}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${s.label}: ${s.handle}`}
                    title={`${s.label} · ${s.handle}`}
                    className="grid size-11 place-items-center rounded-full border border-white/12 text-[#c3c8d1] transition-[color,background-color,border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-[#6363f1] hover:bg-[#6363f1] hover:text-white"
                  >
                    {socialIcon[s.label]}
                  </a>
                </li>
              ))}
            </ul>
          </RevealItem>
          {columns.map((c) => (
            <RevealItem as="nav" key={c.title} aria-label={c.title}>
              <p className="text-[13px] font-medium text-[#9ca3af]">{c.title}</p>
              <ul className="mt-[var(--s3)] grid gap-2.5 text-[15px]">
                {c.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-[#e5e7eb] hover:text-white hover:underline hover:underline-offset-4">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </RevealItem>
          ))}
        </RevealGroup>

        <div className="mt-[var(--s6)] flex flex-col gap-2 border-t border-white/10 pt-[var(--s4)] text-[14px] text-[#9ca3af] sm:flex-row sm:items-center sm:justify-between">
          <p>
            © <Year /> {site.name} · {site.city}
          </p>
          <a href={`mailto:${site.email}`} className="w-fit text-[#c3c8d1] hover:text-white hover:underline hover:underline-offset-4">
            {site.email}
          </a>
        </div>
      </div>
    </footer>
  );
}
