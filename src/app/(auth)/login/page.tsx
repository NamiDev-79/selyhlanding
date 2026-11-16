import { Suspense } from "react";

import { LoginForm } from "@/features/auth/forms";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata("/login", "Iniciar sesión", "Entra a tu panel de Selyh.");

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
