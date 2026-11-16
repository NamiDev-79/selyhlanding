import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "quiet" | "dark";
type Size = "lg" | "md" | "sm";

/* Botones del sistema Selyh: píldora, índigo para la acción principal, presión táctil (escala 0,97). */
const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-[background-color,color,border-color,box-shadow,transform,opacity] duration-200 ease-[cubic-bezier(.22,1,.36,1)] disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6363f1]";
const variants: Record<Variant, string> = {
  primary: "bg-[#6363f1] text-white shadow-[0_1px_0_inset_rgb(255_255_255/0.2),0_8px_20px_-10px_rgb(99_99_241/0.7)] hover:bg-[#5656e6]",
  dark: "bg-ink text-paper hover:bg-ink/85",
  secondary: "border border-[var(--line-strong)] bg-transparent text-ink hover:border-[#a2a2fa] hover:bg-brand-tint",
  ghost: "text-ink hover:bg-brand-tint",
  quiet: "text-brand-strong underline decoration-1 underline-offset-4 decoration-[#a2a2fa] hover:decoration-current px-0!",
};
const sizes: Record<Size, string> = { lg: "h-12 px-6 text-base", md: "h-11 px-5 text-[0.95rem]", sm: "h-9 px-4 text-sm" };

export function buttonClass(variant: Variant = "primary", size: Size = "md", extra = "") {
  return `${base} ${variants[variant]} ${sizes[size]} ${extra}`;
}

type ButtonProps = ComponentProps<"button"> & { variant?: Variant; size?: Size; pending?: boolean };

export function Button({ variant = "primary", size = "md", pending, className = "", children, disabled, ...rest }: ButtonProps) {
  return (
    <button className={buttonClass(variant, size, className)} disabled={disabled || pending} aria-busy={pending || undefined} {...rest}>
      {pending ? <Dots /> : null}
      {children}
    </button>
  );
}

type LinkButtonProps = ComponentProps<typeof Link> & { variant?: Variant; size?: Size; children: ReactNode };

export function LinkButton({ variant = "primary", size = "md", className = "", ...rest }: LinkButtonProps) {
  return <Link className={buttonClass(variant, size, className)} {...rest} />;
}

function Dots() {
  return (
    <span aria-hidden className="inline-flex gap-0.5">
      {[0, 1, 2].map((i) => (
        <span key={i} className="breathe size-1 rounded-full bg-current" style={{ animationDelay: `${i * 160}ms`, animationDuration: "1.2s" }} />
      ))}
    </span>
  );
}
