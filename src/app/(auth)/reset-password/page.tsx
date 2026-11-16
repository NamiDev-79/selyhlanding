import { Suspense } from "react";

import { ResetForm } from "@/features/auth/forms";
import { privateMetadata } from "@/lib/seo/metadata";

export const metadata = { ...privateMetadata, title: "Nueva contraseña" };

export default function ResetPage() {
  return (
    <Suspense>
      <ResetForm />
    </Suspense>
  );
}
