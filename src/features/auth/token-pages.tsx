"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Button, LinkButton } from "@/components/ui/button";
import { Loading, Notice } from "@/components/ui/feedback";
import { authCopy } from "@/content/auth";
import { api, ApiError, bff, errorText, type Res, unwrap } from "@/lib/api/client";

/** /verify-email?token=… (enlace del correo). Se confirma una sola vez al abrir. */
export function VerifyEmail() {
  const token = useSearchParams().get("token");
  const [state, setState] = useState<"working" | "ok" | "fail">(token ? "working" : "fail");
  const [error, setError] = useState<string | null>(token ? null : "Falta el código del enlace.");
  const once = useRef(false);
  const c = authCopy.verify;

  useEffect(() => {
    if (!token || once.current) return;
    once.current = true;
    unwrap(api.POST("/auth/verify-email", { body: { token } }))
      .then(() => setState("ok"))
      .catch((e) => {
        setError(errorText(e));
        setState("fail");
      });
  }, [token]);

  return (
    <div className="grid gap-6">
      <h1 className="text-step-4">{c.title}</h1>
      {state === "working" ? <Loading label="Confirmando…" /> : null}
      {state === "ok" ? (
        <>
          <Notice tone="calm" role="status" title={c.ok} />
          <div>
            <LinkButton href="/panel">Ir a mi panel</LinkButton>
          </div>
        </>
      ) : null}
      {state === "fail" ? (
        <>
          <Notice tone="attention" role="alert" title={c.fail}>
            {error}
          </Notice>
          <p className="text-step--1 text-ink-soft">Puedes pedir un enlace nuevo desde tu panel, en Cuenta.</p>
        </>
      ) : null}
    </div>
  );
}

type Lookup = Res<"/invites/lookup", "get">;

/** /invite?token=… Muestra la empresa; si hay sesión se acepta, si no, se pide entrar o registrarse. */
export function InviteAccept() {
  const token = useSearchParams().get("token");
  const router = useRouter();
  const [invite, setInvite] = useState<Lookup | null>(null);
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(token ? null : "Falta el código de la invitación.");
  const [pending, setPending] = useState(false);
  const c = authCopy.invite;

  useEffect(() => {
    if (!token) return;
    unwrap(api.GET("/invites/lookup", { params: { query: { token } } }))
      .then(setInvite)
      .catch((e) => setError(errorText(e)));
    bff<{ authenticated: boolean }>("/api/auth/session")
      .then((s) => setAuthed(s.authenticated))
      .catch(() => setAuthed(false));
  }, [token]);

  const [needsVerify, setNeedsVerify] = useState(false);
  const [resent, setResent] = useState(false);

  const accept = async () => {
    setPending(true);
    setError(null);
    try {
      await unwrap(api.POST("/invites/accept", { body: { token: token! } }));
      router.replace("/panel");
    } catch (e) {
      setNeedsVerify(e instanceof ApiError && e.code === "EMAIL_NOT_VERIFIED");
      setError(errorText(e));
      setPending(false);
    }
  };

  const resend = async () => {
    await unwrap(api.POST("/auth/resend-verification")).catch(() => null);
    setResent(true);
  };

  const here = `/invite?token=${encodeURIComponent(token ?? "")}`;

  return (
    <div className="grid gap-6">
      <h1 className="text-step-4">{c.title}</h1>
      {!invite && !error ? <Loading /> : null}
      {invite ? (
        <dl className="grid gap-3 border-y border-line py-5">
          <div className="flex justify-between gap-4">
            <dt className="text-ink-soft">Empresa</dt>
            <dd className="font-medium">{invite.companyName}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-ink-soft">Para</dt>
            <dd className="figures text-sm">{invite.emailHint}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-ink-soft">Rol</dt>
            <dd>{invite.role === "ADMIN" ? "Administración" : "Integrante"}</dd>
          </div>
        </dl>
      ) : null}
      {invite ? <p className="text-step--1 text-ink-soft">{c.privacy}</p> : null}
      {error ? <Notice tone="attention" role="alert" title={error} /> : null}
      {invite && authed ? (
        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={accept} pending={pending}>
            {needsVerify ? "Ya confirmé mi correo, aceptar" : c.accept}
          </Button>
          {needsVerify ? (
            <Button variant="ghost" onClick={resend} disabled={resent}>
              {resent ? "Enlace reenviado" : "Reenviar enlace"}
            </Button>
          ) : null}
        </div>
      ) : null}
      {needsVerify ? <p className="text-step--1 text-ink-soft">Abre el enlace del correo en otra pestaña y vuelve aquí: la invitación te espera.</p> : null}
      {invite && authed === false ? (
        <div className="flex flex-wrap gap-3">
          <LinkButton href={`/registro?next=${encodeURIComponent(here)}`}>Crear cuenta</LinkButton>
          <LinkButton href={`/login?next=${encodeURIComponent(here)}`} variant="secondary">
            Ya tengo cuenta
          </LinkButton>
        </div>
      ) : null}
      <Link href="/" className="link text-step--1">
        Conocer Selyh
      </Link>
    </div>
  );
}
