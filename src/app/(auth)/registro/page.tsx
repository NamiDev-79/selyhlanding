import { Suspense } from "react";

import { RegisterForm } from "@/features/auth/forms";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata("/registro", "Crear cuenta", "Crea tu cuenta personal o corporativa en Selyh. Lo esencial es gratis.");

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}
