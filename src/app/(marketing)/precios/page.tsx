import { FaqList } from "@/components/marketing/faq";
import { Plans } from "@/components/marketing/plans";
import { SectionHead } from "@/components/marketing/section-head";
import { faq } from "@/content/faq";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata(
  "/precios",
  "Planes y precios",
  "Personal Básico gratis para siempre, Personal Plus con wearables y programas guiados, y el plan Corporativo para equipos. Precios referenciales.",
);

export default function PricingPage() {
  return (
    <>
      <Plans headingLevel={1} />
      <section aria-labelledby="preguntas-title" className="wrap grid gap-12 border-t border-line pt-[var(--section)] lg:grid-cols-[1fr_1.6fr] lg:gap-24">
        <SectionHead id="preguntas-title" eyebrow={faq.eyebrow} title={faq.title} />
        <FaqList />
      </section>
    </>
  );
}
