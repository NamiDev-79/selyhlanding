import { ForgotForm } from "@/features/auth/forms";
import { privateMetadata } from "@/lib/seo/metadata";

export const metadata = { ...privateMetadata, title: "Recuperar contraseña" };

export default function ForgotPage() {
  return <ForgotForm />;
}
