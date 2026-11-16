import { LegalPage } from "@/components/marketing/legal-page";
import { terms } from "@/content/legal";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata("/terminos", terms.title, terms.description);

export default function TermsPage() {
  return <LegalPage doc={terms} />;
}
