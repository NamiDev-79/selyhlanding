import { Suspense } from "react";

import { VerifyEmail } from "@/features/auth/token-pages";
import { privateMetadata } from "@/lib/seo/metadata";

export const metadata = { ...privateMetadata, title: "Confirmar correo" };

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmail />
    </Suspense>
  );
}
