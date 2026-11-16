"use client";

import { ArrowRight, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/shadcn/button";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/shadcn/sheet";
import { site } from "@/content/site";
import { panelHref } from "@/features/auth/session-cta";
import { bff } from "@/lib/api/client";
import { cn } from "@/lib/utils";

import { ThemeToggle } from "./theme-toggle";
import { BrandLogo } from "./ui";

type Session = { authenticated: false } | { authenticated: true; user: { name: string; role: string; onboardingState: string } };

/** La sesión se consulta en el navegador para que la landing siga siendo estática. */
function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  useEffect(() => {
    bff<Session>("/api/auth/session")
      .then(setSession)
      .catch(() => setSession({ authenticated: false }));
  }, []);
  return session;
}

/**
 * Mientras la barra está sobre una banda oscura (portada, equipos) es transparente y en negativo;
 * fuera de ellas pasa a vidrio claro. Las bandas oscuras se marcan con [data-nav="night"].
 */
function useOverNight() {
  // Solo la portada empieza sobre una banda oscura; así no parpadea en las demás páginas.
  const [over, setOver] = useState(usePathname() === "/");
  useEffect(() => {
    const check = () => {
      const probe = 32; // altura media de la barra
      const bands = document.querySelectorAll<HTMLElement>("[data-nav='night']");
      let inside = false;
      bands.forEach((b) => {
        const r = b.getBoundingClientRect();
        if (r.top <= probe && r.bottom >= probe) inside = true;
      });
      setOver(inside);
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, []);
  return over;
}

export function SiteNav() {
  const home = usePathname() === "/";
  const session = useSession();
  const night = useOverNight();
  const panel = session?.authenticated ? { href: panelHref(session.user), label: "Ir a mi panel" } : null;

  return (
    <>
    {/* Fuera de la portada la barra fija necesita su hueco para no tapar el contenido. */}
    {home ? null : <div aria-hidden className="h-[68px]" />}
    <header className="fixed inset-x-0 top-0 z-40 px-3 pt-3 sm:px-4">
      <div
        className={cn(
          "mx-auto flex h-14 max-w-[1180px] items-center justify-between gap-3 rounded-full pl-5 pr-2 transition-[background-color,box-shadow,border-color] duration-[380ms] ease-[cubic-bezier(.22,1,.36,1)]",
          night ? "l-night border border-transparent bg-transparent!" : "glass",
        )}
      >
        <Link href="/" aria-label="Selyh, inicio" className="flex shrink-0 items-center rounded-md">
          <BrandLogo negative={night} priority className="h-[22px]" />
        </Link>

        <nav aria-label="Principal" className="hidden items-center xl:flex">
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-full px-3.5 py-2 text-[15px] text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <div className={cn("flex items-center gap-1 transition-opacity duration-300", session ? "opacity-100" : "opacity-0")}>
            {panel ? (
              <Button asChild size="sm">
                <Link href={panel.href}>{panel.label}</Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm" className="max-sm:hidden">
                  <Link href="/login">Iniciar sesión</Link>
                </Button>
                <Button asChild size="sm" className="max-[400px]:hidden">
                  <Link href="/registro">
                    Empezar gratis <ArrowRight aria-hidden />
                  </Link>
                </Button>
              </>
            )}
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="xl:hidden" aria-label="Abrir menú">
                <Menu className="size-5" aria-hidden />
              </Button>
            </SheetTrigger>
            <SheetContent className="glass">
              <SheetTitle>Menú</SheetTitle>
              <SheetDescription>Secciones de la página y acceso a tu cuenta.</SheetDescription>
              <nav aria-label="Principal (móvil)" className="grid gap-1 pt-12">
                {site.nav.map((item) => (
                  <SheetClose asChild key={item.href}>
                    <Link href={item.href} className="rounded-2xl px-4 py-3 font-display text-2xl font-semibold tracking-[-0.02em] text-foreground transition-colors hover:bg-muted">
                      {item.label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
              <div className="mt-4 grid gap-2 border-t border-border pt-4 sm:grid-cols-2">
                {panel ? (
                  <Button asChild size="lg">
                    <Link href={panel.href}>{panel.label}</Link>
                  </Button>
                ) : (
                  <>
                    <Button asChild size="lg">
                      <Link href="/registro">Crear cuenta gratis</Link>
                    </Button>
                    <Button asChild size="lg" variant="outline">
                      <Link href="/login">Iniciar sesión</Link>
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
    </>
  );
}
