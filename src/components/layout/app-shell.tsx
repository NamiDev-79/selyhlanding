"use client";

import * as Dialog from "@radix-ui/react-dialog";
import {
  ArrowLeftRight,
  ChartLine,
  CreditCard,
  Ellipsis,
  House,
  ListChecks,
  LogOut,
  Mail,
  MonitorSmartphone,
  Phone,
  ShieldCheck,
  SlidersHorizontal,
  UserRound,
  Users,
  Watch,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode, useState } from "react";

import { Logo } from "@/components/brand/logo";
import { MotionProvider } from "@/components/landing/motion-provider";
import { ThemeToggle } from "@/components/landing/theme-toggle";
import { PauseGlyph } from "@/components/landing/ui";
import { crisis } from "@/content/crisis";
import { useLogout, useMe } from "@/features/auth/hooks";
import { cn } from "@/lib/utils";

/*
 * Armazón del panel. Pocas decisiones a la vista:
 *   · escritorio: barra lateral con lo de cada día arriba y los ajustes agrupados debajo;
 *   · móvil: barra superior (logo, tema) y barra inferior con las 4 secciones diarias + «Más».
 * El indicador de la sección activa se desliza entre opciones (layoutId) y cada página entra con un fundido corto.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

type NavItem = { href: string; label: string; icon?: string; group?: string };

const icons: Record<string, (p: { className?: string }) => ReactNode> = {
  home: (p) => <House {...p} />,
  chart: (p) => <ChartLine {...p} />,
  pause: (p) => <PauseGlyph className={cn("h-[18px]", p.className)} />,
  list: (p) => <ListChecks {...p} />,
  sliders: (p) => <SlidersHorizontal {...p} />,
  shield: (p) => <ShieldCheck {...p} />,
  devices: (p) => <MonitorSmartphone {...p} />,
  watch: (p) => <Watch {...p} />,
  card: (p) => <CreditCard {...p} />,
  user: (p) => <UserRound {...p} />,
  users: (p) => <Users {...p} />,
  mail: (p) => <Mail {...p} />,
};

function NavIcon({ name, className }: { name?: string; className?: string }) {
  const I = name ? icons[name] : undefined;
  return I ? <I className={cn("size-[18px] shrink-0", className)} /> : null;
}

function useActive(nav: readonly NavItem[]) {
  const pathname = usePathname();
  const root = nav[0]!.href;
  return (href: string) => (href === root ? pathname === href : pathname === href || pathname.startsWith(href + "/"));
}

function initials(name?: string) {
  return (name ?? "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
}

/* ---------- Escritorio ---------- */

function SideLink({ item, active, layoutId }: { item: NavItem; active: boolean; layoutId: string }) {
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "relative flex h-10 items-center gap-3 rounded-[10px] px-3 text-[15px] transition-colors duration-200",
        active ? "font-medium text-brand-strong" : "text-muted-foreground hover:bg-[var(--app-card-2)] hover:text-foreground",
      )}
    >
      {active ? (
        <motion.span layoutId={layoutId} transition={{ type: "spring", stiffness: 420, damping: 36 }} className="absolute inset-0 rounded-[10px] bg-brand-tint" />
      ) : null}
      <NavIcon name={item.icon} className="relative" />
      <span className="relative truncate">{item.label}</span>
    </Link>
  );
}

function Sidebar({ nav, title, switcher }: { nav: readonly NavItem[]; title: string; switcher?: NavItem }) {
  const isActive = useActive(nav);
  const me = useMe();
  const logout = useLogout();
  const main = nav.filter((n) => n.group !== "account");
  const account = nav.filter((n) => n.group === "account");

  return (
    <aside className="sticky top-0 hidden h-dvh min-w-0 flex-col border-r border-[var(--app-edge)] bg-[var(--app-side)] lg:flex">
      <div className="flex h-[76px] items-center justify-between px-5">
        <Link href={nav[0]!.href} aria-label="Selyh, inicio" className="text-foreground">
          <Logo className="h-[26px]" title="Selyh" />
        </Link>
        <ThemeToggle />
      </div>

      <nav aria-label={title} className="flex-1 overflow-y-auto px-3 pb-4">
        <ul className="grid gap-0.5">
          {main.map((item) => (
            <li key={item.href}>
              <SideLink item={item} active={isActive(item.href)} layoutId="side-active" />
            </li>
          ))}
        </ul>
        {account.length ? (
          <>
            <p className="p-label mt-[26px] px-3 pb-1.5">{title === "Empresa" ? "Administración" : "Tu cuenta"}</p>
            <ul className="grid gap-0.5">
              {account.map((item) => (
                <li key={item.href}>
                  <SideLink item={item} active={isActive(item.href)} layoutId="side-active" />
                </li>
              ))}
            </ul>
          </>
        ) : null}
        {switcher ? (
          <Link
            href={switcher.href}
            className="mt-[26px] flex h-10 items-center gap-3 rounded-[10px] border border-dashed border-[var(--app-edge)] px-3 text-[14px] text-muted-foreground transition-colors hover:border-[#a2a2fa] hover:text-foreground"
          >
            <ArrowLeftRight className="size-4" aria-hidden />
            {switcher.label}
          </Link>
        ) : null}
      </nav>

      <div className="grid grid-cols-[minmax(0,1fr)] gap-3 border-t border-[var(--app-edge)] p-3">
        <a href={crisis.resources[0]!.href} className="flex items-center gap-3 rounded-[10px] bg-[var(--app-card-2)] px-3 py-2.5 text-[13px] leading-snug text-muted-foreground transition-colors hover:text-foreground">
          <Phone className="size-4 shrink-0 text-brand" aria-hidden />
          <span>
            ¿Mal momento? <span className="font-medium text-foreground">Línea 113, opción 5</span>
          </span>
        </a>
        <div className="flex items-center gap-3 px-1">
          <span aria-hidden className="grid size-9 shrink-0 place-items-center rounded-full bg-brand text-[13px] font-semibold text-white">
            {initials(me.data?.name)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[14px] font-medium leading-tight">{me.data?.name}</p>
            <p className="truncate text-[12px] text-muted-foreground">{me.data?.email}</p>
          </div>
          <button
            type="button"
            onClick={() => logout.mutate()}
            disabled={logout.isPending}
            aria-label="Cerrar sesión"
            title="Cerrar sesión"
            className="grid size-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-[var(--app-card-2)] hover:text-foreground disabled:opacity-50"
          >
            <LogOut className="size-4" aria-hidden />
          </button>
        </div>
      </div>
    </aside>
  );
}

/* ---------- Móvil ---------- */

function MobileBars({ nav, title, switcher }: { nav: readonly NavItem[]; title: string; switcher?: NavItem }) {
  const isActive = useActive(nav);
  const [open, setOpen] = useState(false);
  const me = useMe();
  const logout = useLogout();
  const main = nav.filter((n) => n.group !== "account").slice(0, 4);
  const rest = nav.filter((n) => !main.includes(n));
  const restActive = rest.some((n) => isActive(n.href));

  return (
    <>
      <header className="glass sticky top-0 z-40 flex h-14 items-center justify-between rounded-none! border-x-0! border-t-0! px-4 lg:hidden">
        <Link href={nav[0]!.href} aria-label="Selyh, inicio" className="text-foreground">
          <Logo className="h-[22px]" title="Selyh" />
        </Link>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <span aria-hidden className="grid size-8 place-items-center rounded-full bg-brand text-[12px] font-semibold text-white">
            {initials(me.data?.name)}
          </span>
        </div>
      </header>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <nav aria-label={title} className="glass fixed inset-x-3 bottom-3 z-40 rounded-[22px]! px-1.5 pb-[max(6px,env(safe-area-inset-bottom))] pt-1.5 lg:hidden">
          <ul className="grid grid-cols-5">
            {main.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn("relative flex h-14 flex-col items-center justify-center gap-1 rounded-[16px] text-[11px]", active ? "font-medium text-brand-strong" : "text-muted-foreground")}
                  >
                    {active ? <motion.span layoutId="tab-active" transition={{ type: "spring", stiffness: 420, damping: 36 }} className="absolute inset-0 rounded-[16px] bg-brand-tint" /> : null}
                    <NavIcon name={item.icon} className="relative" />
                    <span className="relative">{item.label}</span>
                  </Link>
                </li>
              );
            })}
            <li>
              <Dialog.Trigger
                className={cn("relative flex h-14 w-full flex-col items-center justify-center gap-1 rounded-[16px] text-[11px]", restActive ? "font-medium text-brand-strong" : "text-muted-foreground")}
              >
                {restActive ? <motion.span layoutId="tab-active" className="absolute inset-0 rounded-[16px] bg-brand-tint" /> : null}
                <Ellipsis className="relative size-[18px]" aria-hidden />
                <span className="relative">Más</span>
              </Dialog.Trigger>
            </li>
          </ul>
        </nav>

        <AnimatePresence>
          {open ? (
            <Dialog.Portal forceMount>
              <Dialog.Overlay asChild forceMount>
                <motion.div className="fixed inset-0 z-50 bg-[#0f1523]/40 backdrop-blur-[2px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
              </Dialog.Overlay>
              <Dialog.Content asChild forceMount aria-describedby={undefined}>
                <motion.div
                  className="selyh selyh-app fixed inset-x-0 bottom-0 z-50 max-h-[86dvh] overflow-y-auto rounded-t-[26px] px-4 pb-[max(16px,env(safe-area-inset-bottom))] pt-3 outline-none"
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: "spring", stiffness: 380, damping: 38 }}
                  drag="y"
                  dragConstraints={{ top: 0, bottom: 0 }}
                  dragElastic={{ top: 0, bottom: 0.6 }}
                  onDragEnd={(_, info) => {
                    if (info.offset.y > 90 || info.velocity.y > 500) setOpen(false);
                  }}
                >
                  <div aria-hidden className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-[var(--app-edge)]" />
                  <div className="flex items-center justify-between pb-2">
                    <Dialog.Title className="p-h2">{title === "Empresa" ? "Administración" : "Tu cuenta"}</Dialog.Title>
                    <Dialog.Close aria-label="Cerrar" className="grid size-10 place-items-center rounded-full text-muted-foreground hover:bg-[var(--app-card-2)]">
                      <X className="size-5" aria-hidden />
                    </Dialog.Close>
                  </div>
                  <ul className="p-card grid divide-y divide-[var(--app-edge)] overflow-hidden">
                    {rest.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => setOpen(false)}
                          aria-current={isActive(item.href) ? "page" : undefined}
                          className="flex h-[52px] items-center gap-3 px-4 text-[15px] aria-[current=page]:font-medium aria-[current=page]:text-brand-strong"
                        >
                          <NavIcon name={item.icon} className="text-brand" />
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  {switcher ? (
                    <Link href={switcher.href} onClick={() => setOpen(false)} className="p-card mt-3 flex h-[52px] items-center gap-3 px-4 text-[15px]">
                      <ArrowLeftRight className="size-[18px] text-brand" aria-hidden />
                      {switcher.label}
                    </Link>
                  ) : null}
                  <a href={crisis.resources[0]!.href} className="mt-3 flex items-center gap-3 rounded-[16px] bg-brand-tint px-4 py-3 text-[14px]">
                    <Phone className="size-[18px] text-brand" aria-hidden />
                    <span>
                      ¿Mal momento? <span className="font-medium">Línea 113, opción 5</span>
                    </span>
                  </a>
                  <button
                    type="button"
                    onClick={() => logout.mutate()}
                    disabled={logout.isPending}
                    className="mt-3 flex h-[52px] w-full items-center justify-center gap-2 rounded-[16px] text-[15px] text-muted-foreground hover:text-foreground"
                  >
                    <LogOut className="size-4" aria-hidden /> Cerrar sesión
                  </button>
                </motion.div>
              </Dialog.Content>
            </Dialog.Portal>
          ) : null}
        </AnimatePresence>
      </Dialog.Root>
    </>
  );
}

/* ---------- Armazón ---------- */

export function AppShell({ nav, title, switcher, children }: { nav: readonly NavItem[]; title: string; aside?: ReactNode; switcher?: NavItem; children: ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="selyh selyh-app min-h-dvh font-sans lg:grid lg:grid-cols-[264px_1fr]">
      <MotionProvider>
        <Sidebar nav={nav} title={title} switcher={switcher} />
        <MobileBars nav={nav} title={title} switcher={switcher} />
        <div className="min-w-0">
          <motion.main
            key={pathname}
            id="contenido"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="mx-auto w-full max-w-[1120px] px-[clamp(16px,3.2vw,42px)] pb-[120px] pt-[clamp(26px,3.6vw,42px)] lg:pb-[68px]"
          >
            {children}
          </motion.main>
        </div>
      </MotionProvider>
    </div>
  );
}

/** Encabezado de página: título (con remate opcional en Lora cursiva) y una línea que dice para qué sirve. */
export function PageHeader({ title, accent, lead, eyebrow, actions }: { title: string; accent?: string; lead?: ReactNode; eyebrow?: string; actions?: ReactNode }) {
  return (
    <header className="mb-[26px] flex flex-wrap items-end justify-between gap-4 sm:mb-[42px]">
      <div className="grid max-w-2xl gap-2">
        {eyebrow ? <p className="text-[14px] font-medium text-brand-strong">{eyebrow}</p> : null}
        <h1 className="p-title">
          {title}
          {accent ? (
            <>
              {" "}
              <span className="l-accent text-brand">{accent}</span>
            </>
          ) : null}
        </h1>
        {lead ? <div className="text-[16px] leading-relaxed text-muted-foreground">{lead}</div> : null}
      </div>
      {actions}
    </header>
  );
}

/** Bloque de contenido del panel: una tarjeta con título y explicación corta. Entra al aparecer en pantalla. */
export function Section({ title, description, children, className = "" }: { title: string; description?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, ease: EASE }}
      className={cn("p-card grid gap-5 p-[clamp(18px,2.6vw,26px)]", className)}
    >
      <div className="grid gap-1">
        <h2 className="p-h2">{title}</h2>
        {description ? <div className="max-w-2xl text-[14px] leading-relaxed text-muted-foreground">{description}</div> : null}
      </div>
      {children}
    </motion.section>
  );
}
