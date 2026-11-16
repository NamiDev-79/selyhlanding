"use client";

import { onboardingCopy } from "@/content/onboarding";
import { OnboardingGuard } from "@/features/auth/guard";
import { CorporatePending } from "@/features/onboarding/corporate-pending";

export default function CorporatePlanPage() {
  const c = onboardingCopy.corporate;
  return (
    <OnboardingGuard area="corporate">
      {(me) => (
        <div className="grid max-w-3xl gap-10">
          <header className="grid gap-3">
            <p className="eyebrow">{c.eyebrow}</p>
            <h1 className="text-step-4">{c.title}</h1>
            <p className="text-ink-soft">{c.lead}</p>
          </header>
          <CorporatePending me={me} />
        </div>
      )}
    </OnboardingGuard>
  );
}
