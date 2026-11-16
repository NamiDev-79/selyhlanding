"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Notice } from "@/components/ui/feedback";
import { Input } from "@/components/ui/field";
import { onboardingCopy } from "@/content/onboarding";
import { errorText } from "@/lib/api/client";
import type { Me } from "@/features/auth/hooks";

import { EmailVerification } from "./email-verification";
import { useChoosePlan, usePlans } from "./hooks";
import { SimulatedNotice } from "./plan-picker";

/** Pantalla única de la cuenta corporativa pendiente: hasta adquirir el plan no puede usar nada más. */
export function CorporatePending({ me }: { me: Me }) {
  const router = useRouter();
  const plans = usePlans();
  const choose = useChoosePlan();
  const [name, setName] = useState(me.pendingCompanyName ?? "");
  const [seats, setSeats] = useState(me.pendingSeats ?? 10);
  const c = onboardingCopy.corporate;
  const corp = plans.data?.find((p) => p.id === "CORPORATE");
  const total = corp ? corp.price.amount * seats : null;
  const steps = [me.emailVerified, name.trim().length >= 2 && seats >= 5, false];

  return (
    <div className="grid gap-10">
      <ol className="grid gap-0 border-t border-ink sm:grid-cols-3">
        {c.steps.map((s, i) => (
          <li key={s} className={`flex items-baseline gap-3 border-b border-line py-3 sm:border-b-0 ${i > 0 ? "sm:border-l sm:pl-4" : ""}`}>
            <span className={`figures text-sm ${steps[i] ? "text-accent-strong" : "text-ink-faint"}`}>{steps[i] ? "✓" : `0${i + 1}`}</span>
            <span className={steps[i] ? "text-ink-soft" : "font-medium"}>{s}</span>
          </li>
        ))}
      </ol>

      <EmailVerification me={me} />

      <section className="grid gap-5" aria-labelledby="empresa-datos">
        <h2 id="empresa-datos" className="text-step-2">
          Tu empresa
        </h2>
        <div className="grid gap-5 sm:grid-cols-[2fr_1fr]">
          <Input label="Nombre de la empresa" value={name} onChange={(e) => setName(e.target.value)} autoComplete="organization" />
          <Input label="Puestos" type="number" min={5} max={5000} value={seats} onChange={(e) => setSeats(Number(e.target.value))} hint="Mínimo 5." />
        </div>
        {corp && total != null ? (
          <p className="flex flex-wrap items-baseline gap-x-3 border-y border-line py-4">
            <span className="text-ink-soft">
              {seats} puestos × ${corp.price.amount}
            </span>
            <span className="font-display text-step-3">${total}</span>
            <span className="text-step--1 text-ink-faint">al mes · referencial</span>
          </p>
        ) : null}
        {choose.isError ? <Notice tone="attention" role="alert" title={errorText(choose.error)} /> : null}
        <div className="flex flex-wrap items-center gap-3">
          <Button
            disabled={!me.emailVerified || name.trim().length < 2 || seats < 5}
            pending={choose.isPending && choose.variables?.plan === "CORPORATE"}
            onClick={() => choose.mutate({ plan: "CORPORATE", companyName: name.trim(), seats }, { onSuccess: () => router.replace("/empresa") })}
          >
            {c.acquire}
          </Button>
          {!me.emailVerified ? <span className="text-step--1 text-ink-faint">Primero confirma tu correo.</span> : null}
        </div>
      </section>

      <SimulatedNotice />

      <section className="grid gap-2 border-t border-line pt-6">
        <div>
          <Button
            variant="quiet"
            pending={choose.isPending && choose.variables?.plan === "PERSONAL_BASIC"}
            onClick={() => choose.mutate({ plan: "PERSONAL_BASIC" }, { onSuccess: () => router.replace("/panel") })}
          >
            {c.switchPersonal}
          </Button>
        </div>
        <p className="text-step--1 text-ink-faint">{c.switchHint}</p>
      </section>
    </div>
  );
}
