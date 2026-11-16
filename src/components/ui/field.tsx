"use client";

import { type ComponentProps, type ReactNode, useId } from "react";

const control =
  "w-full rounded-[10px] border border-[var(--line-strong)] bg-paper px-3.5 text-ink placeholder:text-ink-faint transition-[border-color,box-shadow] duration-200 focus:border-[#6363f1] focus:shadow-[0_0_0_4px_rgb(99_99_241/0.15)] focus:outline-none aria-invalid:border-[#6363f1] aria-invalid:shadow-[0_0_0_4px_rgb(99_99_241/0.12)]";

type FieldShellProps = { label: ReactNode; hint?: ReactNode; error?: string; children: (id: string, describedBy: string | undefined) => ReactNode; className?: string };

/** Etiqueta + control + ayuda/error, con los atributos ARIA ya conectados. */
export function FieldShell({ label, hint, error, children, className = "" }: FieldShellProps) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;
  return (
    <div className={`grid gap-1.5 ${className}`}>
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
      </label>
      {children(id, describedBy)}
      {hint ? (
        <p id={hintId} className="text-step--1 text-ink-faint">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} role="alert" className="text-step--1 text-warm-ink">
          {error}
        </p>
      ) : null}
    </div>
  );
}

type InputProps = ComponentProps<"input"> & { label: ReactNode; hint?: ReactNode; error?: string };

export function Input({ label, hint, error, className = "", ...rest }: InputProps) {
  return (
    <FieldShell label={label} hint={hint} error={error} className={className}>
      {(id, describedBy) => <input id={id} aria-describedby={describedBy} aria-invalid={error ? true : undefined} className={`${control} h-11`} {...rest} />}
    </FieldShell>
  );
}

type TextareaProps = ComponentProps<"textarea"> & { label: ReactNode; hint?: ReactNode; error?: string };

export function Textarea({ label, hint, error, className = "", ...rest }: TextareaProps) {
  return (
    <FieldShell label={label} hint={hint} error={error} className={className}>
      {(id, describedBy) => <textarea id={id} aria-describedby={describedBy} aria-invalid={error ? true : undefined} className={`${control} min-h-28 py-2.5`} {...rest} />}
    </FieldShell>
  );
}

type SelectProps = ComponentProps<"select"> & { label: ReactNode; hint?: ReactNode; error?: string };

export function Select({ label, hint, error, className = "", children, ...rest }: SelectProps) {
  return (
    <FieldShell label={label} hint={hint} error={error} className={className}>
      {(id, describedBy) => (
        <select id={id} aria-describedby={describedBy} aria-invalid={error ? true : undefined} className={`${control} h-11 pr-8`} {...rest}>
          {children}
        </select>
      )}
    </FieldShell>
  );
}
