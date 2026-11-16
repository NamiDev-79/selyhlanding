import type { ReactNode } from "react";

type Tone = "neutral" | "calm" | "attention";

const tones: Record<Tone, string> = {
  neutral: "border-line bg-paper-2 text-ink",
  calm: "border-[#a2a2fa]/50 bg-brand-tint text-ink",
  attention: "border-[#a2a2fa] bg-brand-tint text-ink",
};

/** Aviso en línea. Sin rojos: "attention" se marca con un borde índigo más presente, nunca con alarma. */
export function Notice({ tone = "neutral", title, children, role }: { tone?: Tone; title?: ReactNode; children?: ReactNode; role?: "status" | "alert" }) {
  return (
    <div role={role} className={`rounded-[10px] border px-4 py-3 ${tones[tone]} ${tone === "attention" ? "border-l-4 border-l-[#6363f1]" : ""}`}>
      {title ? <p className="font-medium">{title}</p> : null}
      {children ? <div className={`text-step--1 text-ink-soft ${title ? "mt-1" : ""}`}>{children}</div> : null}
    </div>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return <div aria-hidden className={`animate-pulse rounded-[10px] bg-brand-tint ${className}`} />;
}

export function Loading({ label = "Cargando…" }: { label?: string }) {
  return (
    <div role="status" className="grid gap-3 py-2">
      <span className="sr-only">{label}</span>
      <Skeleton className="h-5 w-1/3" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );
}

/** Estado vacío que explica qué hacer, no solo que no hay nada. */
export function Empty({ title, children }: { title: ReactNode; children?: ReactNode }) {
  return (
    <div className="rounded-[10px] border border-dashed border-[var(--line-strong)] px-4 py-4">
      <p className="font-medium text-ink">{title}</p>
      {children ? <div className="mt-1 text-step--1 text-ink-soft">{children}</div> : null}
    </div>
  );
}

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: Tone }) {
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${tones[tone]}`}>{children}</span>;
}
