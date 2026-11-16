"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { Loading } from "@/components/ui/feedback";

import { type Me, useMe } from "./hooks";

type Area = "app" | "plans" | "corporate";

/** Adónde debe ir la cuenta según su estado de onboarding (null = puede quedarse). */
function destination(me: Me, area: Area): string | null {
  if (me.onboardingState === "CORPORATE_PENDING") return area === "corporate" ? null : "/plan-corporativo";
  if (me.onboardingState === "PLAN_PENDING") return area === "plans" ? null : "/planes";
  return area === "app" ? null : "/panel";
}

/** Guard de ruta según `onboardingState`. Mientras decide, muestra un esqueleto en vez de contenido. */
export function OnboardingGuard({ area, children }: { area: Area; children: (me: Me) => React.ReactNode }) {
  const me = useMe();
  const router = useRouter();
  const target = me.data ? destination(me.data, area) : null;

  useEffect(() => {
    if (target) router.replace(target);
  }, [target, router]);

  if (!me.data || target) {
    return (
      <div className="wrap max-w-2xl py-16">
        <Loading />
      </div>
    );
  }
  return <>{children(me.data)}</>;
}
