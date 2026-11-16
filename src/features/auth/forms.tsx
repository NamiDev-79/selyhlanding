"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Notice } from "@/components/ui/feedback";
import { Input } from "@/components/ui/field";
import { authCopy } from "@/content/auth";
import { api, ApiError, bff, errorText, unwrap } from "@/lib/api/client";

import { safeNext } from "./hooks";
import { panelHref } from "./session-cta";

type SessionUser = { role: string; onboardingState: string };

const password = z.string().min(10, "Usa al menos 10 caracteres").max(128);

function FormHeader({ title, lead }: { title: string; lead?: string }) {
  return (
    <header className="mb-8 grid gap-2">
      <h1 className="text-step-4">{title}</h1>
      {lead ? <p className="text-ink-soft">{lead}</p> : null}
    </header>
  );
}

/** Lleva los errores de campo de la API (zod del backend) al formulario. */
function applyFieldErrors(e: unknown, setError: (name: never, err: { message: string }) => void) {
  if (e instanceof ApiError) for (const f of e.fields) if (f.path) setError(f.path as never, { message: f.message });
}

// ───────────────────────────── Login ─────────────────────────────

const loginSchema = z.object({ email: z.email("Escribe un correo válido"), password: z.string().min(1, "Escribe tu contraseña") });

export function LoginForm() {
  const params = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const form = useForm<z.infer<typeof loginSchema>>({ resolver: zodResolver(loginSchema) });
  const c = authCopy.login;

  const submit = form.handleSubmit(async (v) => {
    setError(null);
    try {
      const { user } = await bff<{ user: SessionUser }>("/api/auth/login", { body: v });
      const next = safeNext(params.get("next"));
      const invite = next?.startsWith("/invite") ? next : null;
      router.replace(invite ?? (user.onboardingState === "DONE" && next ? next : panelHref(user)));
      router.refresh();
    } catch (e) {
      setError(e instanceof ApiError && e.status === 401 ? "Correo o contraseña incorrectos." : errorText(e));
    }
  });

  return (
    <>
      <FormHeader title={c.title} lead={c.lead} />
      <form onSubmit={submit} noValidate className="grid gap-5">
        <Input label="Correo" type="email" autoComplete="email" error={form.formState.errors.email?.message} {...form.register("email")} />
        <Input label="Contraseña" type="password" autoComplete="current-password" error={form.formState.errors.password?.message} {...form.register("password")} />
        {error ? <Notice tone="attention" role="alert" title={error} /> : null}
        <Button type="submit" pending={form.formState.isSubmitting}>
          {c.submit}
        </Button>
        <div className="flex flex-wrap justify-between gap-3 text-step--1">
          <Link className="link" href="/recuperar">
            {c.forgot}
          </Link>
          <span className="text-ink-soft">
            {c.noAccount}{" "}
            <Link className="link" href={`/registro${params.get("next") ? `?next=${encodeURIComponent(params.get("next")!)}` : ""}`}>
              {c.register}
            </Link>
          </span>
        </div>
      </form>
    </>
  );
}

// ───────────────────────────── Registro ─────────────────────────────

const registerSchema = z
  .object({
    name: z.string().trim().min(1, "Escribe tu nombre").max(100),
    email: z.email("Escribe un correo válido").max(254),
    password,
    accountType: z.enum(["PERSONAL", "CORPORATE"]),
    companyName: z.string().trim().max(120).optional(),
    seats: z.number({ error: "Indica un número" }).int().min(5, "Mínimo 5 puestos").max(5000).optional(),
  })
  .refine((d) => d.accountType !== "CORPORATE" || (d.companyName?.length ?? 0) >= 2, { message: "Escribe el nombre de la empresa", path: ["companyName"] });

export function RegisterForm() {
  const params = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const c = authCopy.register;
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { accountType: params.get("tipo") === "corporativa" ? "CORPORATE" : "PERSONAL", seats: 10 },
  });
  const type = useWatch({ control: form.control, name: "accountType" });

  const submit = form.handleSubmit(async (v) => {
    setError(null);
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    try {
      const { user } = await bff<{ user: SessionUser }>("/api/auth/register", {
        body: {
          name: v.name,
          email: v.email,
          password: v.password,
          timezone,
          locale: "es",
          accountType: v.accountType,
          ...(v.accountType === "CORPORATE" ? { companyName: v.companyName, seats: v.seats } : {}),
        },
      });
      const next = safeNext(params.get("next"));
      // Una invitación pendiente tiene prioridad: se acepta y luego se eligen planes.
      router.replace(next?.startsWith("/invite") ? next : panelHref(user));
      router.refresh();
    } catch (e) {
      applyFieldErrors(e, form.setError as never);
      setError(errorText(e));
    }
  });

  return (
    <>
      <FormHeader title={c.title} lead={c.lead} />
      <form onSubmit={submit} noValidate className="grid gap-5">
        <fieldset className="grid gap-2">
          <legend className="mb-2 text-sm font-medium">{c.typeLabel}</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {(["PERSONAL", "CORPORATE"] as const).map((t) => {
              const opt = t === "PERSONAL" ? c.personal : c.corporate;
              return (
                <label
                  key={t}
                  className={`grid cursor-pointer gap-1 rounded-ui border px-4 py-3 transition-colors ${type === t ? "border-accent-strong bg-accent-wash" : "border-line-strong hover:border-ink-faint"}`}
                >
                  <span className="flex items-center gap-2 font-medium">
                    <input type="radio" value={t} className="accent-[var(--accent-strong)]" {...form.register("accountType")} />
                    {opt.label}
                  </span>
                  <span className="text-step--1 text-ink-soft">{opt.hint}</span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <Input label="Nombre" autoComplete="name" error={form.formState.errors.name?.message} {...form.register("name")} />
        <Input label="Correo" type="email" autoComplete="email" error={form.formState.errors.email?.message} {...form.register("email")} />
        <Input label="Contraseña" type="password" autoComplete="new-password" hint="Mínimo 10 caracteres. Una frase corta funciona bien." error={form.formState.errors.password?.message} {...form.register("password")} />

        {type === "CORPORATE" ? (
          <div className="grid gap-5 border-l-2 border-accent pl-4">
            <Input label="Nombre de la empresa" autoComplete="organization" error={form.formState.errors.companyName?.message} {...form.register("companyName")} />
            <Input label="Puestos" type="number" min={5} inputMode="numeric" hint="Personas que usarán Selyh. Puedes cambiarlo después." error={form.formState.errors.seats?.message} {...form.register("seats", { valueAsNumber: true })} />
            <p className="text-step--1 text-ink-soft">{c.corporateNote}</p>
          </div>
        ) : null}

        {error ? <Notice tone="attention" role="alert" title={error} /> : null}
        <Button type="submit" pending={form.formState.isSubmitting}>
          {c.submit}
        </Button>
        <p className="text-step--1 text-ink-faint">
          Al crear tu cuenta aceptas los{" "}
          <Link className="link" href="/terminos">
            términos
          </Link>{" "}
          y la{" "}
          <Link className="link" href="/privacidad">
            política de privacidad
          </Link>
          .
        </p>
        <p className="text-step--1 text-ink-soft">
          {c.haveAccount}{" "}
          <Link className="link" href="/login">
            {c.login}
          </Link>
        </p>
      </form>
    </>
  );
}

// ───────────────────────────── Recuperar / restablecer ─────────────────────────────

export function ForgotForm() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const form = useForm<{ email: string }>({ resolver: zodResolver(z.object({ email: z.email("Escribe un correo válido") })) });
  const c = authCopy.forgot;

  const submit = form.handleSubmit(async (v) => {
    setError(null);
    try {
      await unwrap(api.POST("/auth/forgot-password", { body: v }));
      setSent(true);
    } catch (e) {
      setError(errorText(e));
    }
  });

  return (
    <>
      <FormHeader title={c.title} lead={c.lead} />
      {sent ? (
        <Notice tone="calm" role="status" title={c.sent} />
      ) : (
        <form onSubmit={submit} noValidate className="grid gap-5">
          <Input label="Correo" type="email" autoComplete="email" error={form.formState.errors.email?.message} {...form.register("email")} />
          {error ? <Notice tone="attention" role="alert" title={error} /> : null}
          <Button type="submit" pending={form.formState.isSubmitting}>
            {c.submit}
          </Button>
        </form>
      )}
      <p className="mt-6 text-step--1">
        <Link className="link" href="/login">
          Volver a iniciar sesión
        </Link>
      </p>
    </>
  );
}

const resetSchema = z.object({ newPassword: password, confirm: z.string() }).refine((d) => d.newPassword === d.confirm, { message: "Las contraseñas no coinciden", path: ["confirm"] });

export function ResetForm() {
  const token = useSearchParams().get("token");
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const form = useForm<z.infer<typeof resetSchema>>({ resolver: zodResolver(resetSchema) });
  const c = authCopy.reset;

  const submit = form.handleSubmit(async (v) => {
    setError(null);
    try {
      await unwrap(api.POST("/auth/reset-password", { body: { token: token!, newPassword: v.newPassword } }));
      setDone(true);
    } catch (e) {
      setError(errorText(e));
    }
  });

  if (!token) return <Notice tone="attention" title={c.missing} />;
  return (
    <>
      <FormHeader title={c.title} />
      {done ? (
        <div className="grid gap-5">
          <Notice tone="calm" role="status" title={c.done} />
          <Link className="link" href="/login">
            Iniciar sesión
          </Link>
        </div>
      ) : (
        <form onSubmit={submit} noValidate className="grid gap-5">
          <Input label="Contraseña nueva" type="password" autoComplete="new-password" hint="Mínimo 10 caracteres." error={form.formState.errors.newPassword?.message} {...form.register("newPassword")} />
          <Input label="Repite la contraseña" type="password" autoComplete="new-password" error={form.formState.errors.confirm?.message} {...form.register("confirm")} />
          {error ? <Notice tone="attention" role="alert" title={error} /> : null}
          <Button type="submit" pending={form.formState.isSubmitting}>
            {c.submit}
          </Button>
        </form>
      )}
    </>
  );
}
