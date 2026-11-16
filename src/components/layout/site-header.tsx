import Link from "next/link";

import { Icon } from "@/components/ui/icons";
import { site } from "@/content/site";
import { SessionCta } from "@/features/auth/session-cta";

import { Wordmark } from "./wordmark";

/** Cabecera flotante en forma de cápsula; en móvil la navegación se abre con un <details> (sin JS). */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 px-3 pt-3">
      <div className="mx-auto flex h-14 max-w-[76rem] items-center justify-between gap-4 rounded-full border border-line/80 bg-paper/75 pl-5 pr-2 shadow-card backdrop-blur-xl supports-[backdrop-filter]:bg-paper/65">
        <Wordmark />
        <nav aria-label="Principal" className="hidden items-center gap-1 text-[0.92rem] text-ink-soft lg:flex">
          {site.nav.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-full px-3.5 py-1.5 transition-colors hover:bg-paper-2 hover:text-ink">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-1">
          <SessionCta />
          <details className="group relative lg:hidden">
            <summary className="grid size-10 cursor-pointer list-none place-items-center rounded-full hover:bg-paper-2 [&::-webkit-details-marker]:hidden" aria-label="Abrir menú">
              <Icon name="menu" />
            </summary>
            <nav aria-label="Principal (móvil)" className="pop absolute right-0 top-12 grid w-56 gap-0.5 rounded-2xl border border-line bg-paper p-2 shadow-float">
              {site.nav.map((item) => (
                <Link key={item.href} href={item.href} className="rounded-xl px-3 py-2 text-[0.95rem] hover:bg-paper-2">
                  {item.label}
                </Link>
              ))}
              <Link href="/login" className="rounded-xl px-3 py-2 text-[0.95rem] hover:bg-paper-2 sm:hidden">
                Iniciar sesión
              </Link>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
