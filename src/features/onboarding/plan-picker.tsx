"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Loading, Notice } from "@/components/ui/feedback";
import { Input } from "@/components/ui/field";
import { onboardingCopy } from "@/content/onboarding";
import { errorText, type Res } from "@/lib/api/client";
import type { Me } from "@/features/auth/hooks";

import { EmailVerification } from "./email-verification";
import { type PlanChoice, useChoosePlan, useEntitlements, usePlans, useSkipPlans } from "./hooks";

type Plan = Res<"/plans", "get">[number];

const ENTITLEMENT_TO_PLAN: Record<string, Plan["id"]> = { FREE: "PERSONAL_BASIC", PRO_INDIVIDUAL: "PERSONAL_PLUS", TEAM_SEAT: "CORPORATE" };

function price(p: Plan) {
  if (p.price.amount === 0) return { amount: "$0", unit: "siempre" };
  return { amount: `$${p.price.amount}`, unit: p.price.unit === "seat" ? "por puesto al mes" : "al mes" };
}

export function SimulatedNotice() {
  return <Notice tone="calm" title={onboardingCopy.simulated.title}>{onboardingCopy.simulated.body}</Notice>;
}

/**
 * Catálogo de planes (GET /plans). En el primer ingreso permite "Omitir por ahora";
 * desde el panel sirve para cambiar de plan o pasar a una cuenta corporativa.
 */
export function PlanPicker({ me, mode }: { me: Me; mode: "onboarding" | "change" }) {
  const router = useRouter();
  const plans = usePlans();
  const entitlements = useEntitlements();
  const choose = useChoosePlan();
  const skip = useSkipPlans();
  const [corporateOpen, setCorporateOpen] = useState(false);
  const [company, setCompany] = useState({ name: me.pendingCompanyName ?? "", seats: me.pendingSeats ?? 10 });
  const c = onboardingCopy.plans;

  const current = mode === "change" && entitlements.data ? ENTITLEMENT_TO_PLAN[entitlements.data.plan] : undefined;

  const pick = (body: PlanChoice) =>
    choose.mutate(body, {
      onSuccess: (r) => router.replace(r.company ? "/empresa" : "/panel"),
    });

  if (plans.isPending) return <Loading />;
  if (plans.isError) return <Notice tone="attention" title={errorText(plans.error)} />;

  return (
    <div className="grid gap-10">
      <div className="grid border-t border-ink md:grid-cols-3">
        {plans.data.map((p, i) => {
          const pr = price(p);
          const isCurrent = current === p.id;
          return (
            <article key={p.id} className={`grid content-start gap-5 border-b border-line py-7 md:border-b-0 md:px-6 ${i === 0 ? "md:pl-0" : "md:border-l"}`}>
              <header className="grid gap-1">
                <h2 className="text-step-2">{p.name}</h2>
                <p className="flex items-baseline gap-2">
                  <span className="font-display text-step-3 leading-none">{pr.amount}</span>
                  <span className="text-step--1 text-ink-faint">{pr.unit}</span>
                </p>
                {p.minSeats ? <p className="text-step--1 text-ink-faint">Desde {p.minSeats} puestos</p> : null}
              </header>
              <ul className="grid gap-1.5 text-[0.95rem]">
                {p.highlights.map((h) => (
                  <li key={h} className="flex gap-3">
                    <span aria-hidden className="mt-[0.72em] h-px w-3 shrink-0 bg-ink-faint" />
                    {h}
                  </li>
                ))}
              </ul>
              <div>
                {isCurrent ? (
                  <span className="eyebrow text-accent-strong!">{c.current}</span>
                ) : p.id === "CORPORATE" ? (
                  <Button variant={corporateOpen ? "primary" : "secondary"} onClick={() => setCorporateOpen(true)} aria-expanded={corporateOpen}>
                    {c.choose}
                  </Button>
                ) : (
                  <Button variant={p.id === "PERSONAL_PLUS" ? "primary" : "secondary"} pending={choose.isPending && choose.variables?.plan === p.id} onClick={() => pick({ plan: p.id })}>
                    {c.choose}
                  </Button>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {corporateOpen ? (
        <section aria-labelledby="corp-form" className="grid gap-6 border-l-2 border-accent pl-5">
          <h2 id="corp-form" className="text-step-2">
            Datos de tu empresa
          </h2>
          <EmailVerification me={me} />
          <div className="grid gap-5 sm:grid-cols-[2fr_1fr]">
            <Input label="Nombre de la empresa" value={company.name} onChange={(e) => setCompany({ ...company, name: e.target.value })} />
            <Input label="Puestos" type="number" min={5} value={company.seats} onChange={(e) => setCompany({ ...company, seats: Number(e.target.value) })} />
          </div>
          <div>
            <Button
              disabled={!me.emailVerified || company.name.trim().length < 2 || company.seats < 5}
              pending={choose.isPending && choose.variables?.plan === "CORPORATE"}
              onClick={() => pick({ plan: "CORPORATE", companyName: company.name.trim(), seats: company.seats })}
            >
              Adquirir plan corporativo
            </Button>
          </div>
        </section>
      ) : null}

      {choose.isError ? <Notice tone="attention" role="alert" title={errorText(choose.error)} /> : null}
      <SimulatedNotice />

      {mode === "onboarding" ? (
        <div className="flex flex-wrap items-center gap-3 border-t border-line pt-6">
          <Button variant="ghost" pending={skip.isPending} onClick={() => skip.mutate(undefined, { onSuccess: () => router.replace("/panel") })}>
            {c.skip}
          </Button>
          <span className="text-step--1 text-ink-faint">{c.skipHint}</span>
          {skip.isError ? <span role="alert" className="text-step--1 text-warm-ink">{errorText(skip.error)}</span> : null}
        </div>
      ) : null}
    </div>
  );
}
