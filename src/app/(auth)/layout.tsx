import { Wordmark } from "@/components/layout/wordmark";
import { authCopy } from "@/content/auth";
import { crisis } from "@/content/crisis";

/** Pantallas de cuenta: columna de marca a la izquierda y el formulario con todo el aire a la derecha. */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-theme="light" className="grid min-h-dvh bg-paper text-ink lg:grid-cols-[minmax(24rem,0.85fr)_1.15fr]">
      <aside className="relative isolate m-3 hidden flex-col justify-between overflow-hidden rounded-[1.6rem] bg-night p-10 text-white lg:flex">
        <div aria-hidden className="drift absolute -left-24 -top-24 -z-10 size-96 rounded-full bg-[oklch(50%_0.2_277/0.5)] blur-3xl" />
        <div aria-hidden className="drift absolute -bottom-32 -right-16 -z-10 size-80 rounded-full bg-[oklch(60%_0.12_168/0.35)] blur-3xl" style={{ "--i": 1 } as React.CSSProperties} />
        <Wordmark className="text-white!" />
        <div className="grid gap-8">
          <p className="max-w-[16ch] font-display text-step-4 font-semibold leading-[1.05]">{authCopy.aside.quote}</p>
          <ul className="grid gap-2.5 text-white/75">
            {authCopy.aside.points.map((p) => (
              <li key={p} className="flex gap-3">
                <span aria-hidden className="mt-[0.55em] size-2 shrink-0 rounded-full bg-mint" />
                {p}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-step--1 text-white/60">
          ¿Necesitas ayuda ahora? {crisis.resources[0]!.name}: <a className="font-medium text-white underline underline-offset-4" href={crisis.resources[0]!.href}>113</a>
        </p>
      </aside>
      <div className="flex flex-col">
        <div className="wrap flex h-16 items-center lg:hidden">
          <Wordmark />
        </div>
        <main id="contenido" className="grid flex-1 place-items-center px-[var(--gutter)] py-12">
          <div className="w-full max-w-md">{children}</div>
        </main>
      </div>
    </div>
  );
}
