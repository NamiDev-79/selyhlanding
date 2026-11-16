import { LegalPage } from "@/components/marketing/legal-page";
import { privacyPolicy } from "@/content/legal";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata("/privacidad", privacyPolicy.title, privacyPolicy.description);

export default function PrivacyPage() {
  return <LegalPage doc={privacyPolicy} />;
}
