"use client";

import { AppShell } from "@/components/layout/app-shell";
import { panelNav } from "@/content/panel";
import { OnboardingGuard } from "@/features/auth/guard";

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <OnboardingGuard area="app">
      {(me) => (
        <AppShell nav={panelNav} title="Mi panel" switcher={me.role === "COMPANY_ADMIN" ? { href: "/empresa", label: "Panel corporativo" } : undefined}>
          {children}
        </AppShell>
      )}
    </OnboardingGuard>
  );
}
