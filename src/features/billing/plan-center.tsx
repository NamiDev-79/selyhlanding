"use client";

import { Section } from "@/components/layout/app-shell";
import { LinkButton } from "@/components/ui/button";
import { Loading } from "@/components/ui/feedback";
import type { Me } from "@/features/auth/hooks";
import { useEntitlements } from "@/features/onboarding/hooks";
import { PlanPicker } from "@/features/onboarding/plan-picker";

const PLAN_NAMES: Record<string, string> = { FREE: "Personal Básico", PRO_INDIVIDUAL: "Personal Plus", TEAM_SEAT: "Puesto corporativo" };

export function PlanCenter({ me }: { me: Me }) {
  const ent = useEntitlements();
  return (
    <div className="grid gap-16">
      <Section title="Tu plan">
        {ent.isPending ? (
          <Loading />
        ) : ent.data ? (
          <div className="grid gap-3">
            <p className="font-display text-step-3">{PLAN_NAMES[ent.data.plan] ?? ent.data.plan}</p>
            {ent.data.plan === "TEAM_SEAT" ? <p className="text-ink-soft">Tu empresa cubre tu puesto. Tus datos siguen siendo solo tuyos.</p> : null}
            {me.role === "COMPANY_ADMIN" ? (
              <div>
                <LinkButton href="/empresa/plan" variant="secondary" size="sm">
                  Plan y puestos de la empresa
                </LinkButton>
              </div>
            ) : null}
          </div>
        ) : null}
      </Section>
      <Section title="Cambiar de plan" description="También puedes pasar a una cuenta corporativa para gestionar los equipos de tu empresa.">
        <PlanPicker me={me} mode="change" />
      </Section>
    </div>
  );
}
