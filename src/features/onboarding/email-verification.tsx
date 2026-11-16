"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Notice } from "@/components/ui/feedback";
import { onboardingCopy } from "@/content/onboarding";
import { errorText } from "@/lib/api/client";
import { type Me, meKey, useResendVerification } from "@/features/auth/hooks";

/** Guía para confirmar el correo (requisito para crear una empresa). */
export function EmailVerification({ me }: { me: Me }) {
  const c = onboardingCopy.email;
  const qc = useQueryClient();
  const resend = useResendVerification();
  const [checking, setChecking] = useState(false);

  if (me.emailVerified) {
    return (
      <p className="flex items-center gap-2 text-ink-soft">
        <span aria-hidden className="size-2 rounded-full bg-accent" />
        {c.verified}: <span className="figures text-sm">{me.email}</span>
      </p>
    );
  }

  return (
    <Notice tone="attention" title={c.pending}>
      <p>
        {c.pendingBody} Lo enviamos a <span className="figures text-ink">{me.email}</span>.
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Button
          size="sm"
          variant="secondary"
          pending={checking}
          onClick={async () => {
            setChecking(true);
            await qc.invalidateQueries({ queryKey: meKey });
            setChecking(false);
          }}
        >
          {c.check}
        </Button>
        <Button size="sm" variant="ghost" pending={resend.isPending} onClick={() => resend.mutate()}>
          {c.resend}
        </Button>
        {resend.isSuccess ? <span role="status">{resend.data.alreadyVerified ? c.verified : c.resent}</span> : null}
        {resend.isError ? <span role="alert">{errorText(resend.error)}</span> : null}
      </div>
    </Notice>
  );
}
