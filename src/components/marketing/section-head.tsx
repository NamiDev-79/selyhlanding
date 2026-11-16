import type { ReactNode } from "react";

/** Encabezado de sección: rótulo en píldora + titular. Centrado o alineado a la izquierda. */
export function SectionHead({
  eyebrow,
  title,
  id,
  children,
  center = false,
  className = "",
}: {
  eyebrow: string;
  title: string;
  id?: string;
  children?: ReactNode;
  center?: boolean;
  className?: string;
}) {
  return (
    <div className={`reveal grid gap-5 ${center ? "justify-items-center text-center" : ""} ${className}`}>
      <p className="kicker">{eyebrow}</p>
      <h2 id={id} className={`max-w-[20ch] text-step-4 ${center ? "mx-auto" : ""}`}>
        {title}
      </h2>
      {children}
    </div>
  );
}
