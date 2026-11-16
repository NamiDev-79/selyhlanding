"use client";

import { onboardingCopy } from "@/content/onboarding";
import { OnboardingGuard } from "@/features/auth/guard";
import { PlanPicker } from "@/features/onboarding/plan-picker";

export default function PlansPage() {
  const c = onboardingCopy.plans;
  return (
    <OnboardingGuard area="plans">
      {(me) => (
        <div className="grid gap-12">
          <header className="grid max-w-2xl gap-3">
            <p className="eyebrow">{c.eyebrow}</p>
            <h1 className="text-step-4">
              {me.name.split(" ")[0]}, {c.title.charAt(0).toLowerCase() + c.title.slice(1)}
            </h1>
            <p className="text-ink-soft">{c.lead}</p>
          </header>
          <PlanPicker me={me} mode="onboarding" />
        </div>
      )}
    </OnboardingGuard>
  );
}
