"use client";

import { AppShell } from "@/components/layout/app-shell";
import { LinkButton } from "@/components/ui/button";
import { Loading, Notice } from "@/components/ui/feedback";
import { companyNav } from "@/content/company";
import { OnboardingGuard } from "@/features/auth/guard";
import { CompanyContext, useAdminCompany } from "@/features/company/hooks";
import { errorText } from "@/lib/api/client";

function CompanyGate({ children }: { children: React.ReactNode }) {
  const company = useAdminCompany();
  if (company.isPending) return <Loading />;
  if (company.isError) return <Notice tone="attention" title={errorText(company.error)} />;
  if (!company.data) {
    return (
      <div className="p-card grid max-w-xl gap-4 p-[clamp(20px,3vw,32px)]">
        <h1 className="p-title">Aún no administras una empresa</h1>
        <p className="text-muted-foreground">Puedes pasar a una cuenta corporativa desde tu plan. Necesitarás confirmar tu correo.</p>
        <div>
          <LinkButton href="/panel/plan">Ver planes</LinkButton>
        </div>
      </div>
    );
  }
  return <CompanyContext value={company.data}>{children}</CompanyContext>;
}

export default function CompanyLayout({ children }: { children: React.ReactNode }) {
  return (
    <OnboardingGuard area="app">
      {() => (
        <AppShell nav={companyNav} title="Empresa" switcher={{ href: "/panel", label: "Mi panel personal" }}>
          <CompanyGate>{children}</CompanyGate>
        </AppShell>
      )}
    </OnboardingGuard>
  );
}
