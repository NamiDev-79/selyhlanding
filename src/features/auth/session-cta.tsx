"use client";

import { useEffect, useState } from "react";

import { LinkButton } from "@/components/ui/button";
import { bff } from "@/lib/api/client";

type Session = { authenticated: false } | { authenticated: true; user: { name: string; role: string; onboardingState: string } };

/** Destino según la cuenta: pendientes van a su plan; administradores de empresa, al panel corporativo. */
export function panelHref(user: { role: string; onboardingState: string }) {
  if (user.onboardingState === "CORPORATE_PENDING") return "/plan-corporativo";
  if (user.onboardingState === "PLAN_PENDING") return "/planes";
  return user.role === "COMPANY_ADMIN" ? "/empresa" : "/panel";
}

/**
 * Botones de la cabecera pública. La landing es estática (SEO); la sesión se consulta en el
 * navegador para no volverla dinámica.
 */
export function SessionCta() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    bff<Session>("/api/auth/session")
      .then(setSession)
      .catch(() => setSession({ authenticated: false }));
  }, []);

  if (session?.authenticated) {
    const corporate = session.user.role === "COMPANY_ADMIN" && session.user.onboardingState === "DONE";
    return (
      <LinkButton href={panelHref(session.user)} size="sm">
        {corporate ? "Ir a mi panel corporativo" : "Ir a mi panel"}
      </LinkButton>
    );
  }
  return (
    <div className={`flex items-center gap-1 transition-opacity duration-300 ${session ? "opacity-100" : "opacity-0"}`}>
      <LinkButton href="/login" variant="ghost" size="sm" className="max-sm:hidden!">
        Iniciar sesión
      </LinkButton>
      <LinkButton href="/registro" size="sm">
        Crear cuenta
      </LinkButton>
    </div>
  );
}
