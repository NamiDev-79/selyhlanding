import { faq } from "@/content/faq";
import { plans } from "@/content/plans";
import { site } from "@/content/site";

/** Datos estructurados (schema.org) de la landing: Organization, WebSite, SoftwareApplication y FAQPage. */
export function LandingJsonLd() {
  const org = `${site.url}/#organization`;
  const graph = [
    {
      "@type": "Organization",
      "@id": org,
      name: site.name,
      url: site.url,
      logo: `${site.url}/brand/selyh-logotipo-color.svg`,
      email: site.email,
      slogan: site.tagline,
      sameAs: site.social.map((s) => s.href),
      address: { "@type": "PostalAddress", addressLocality: "Trujillo", addressCountry: "PE" },
    },
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      url: site.url,
      name: site.name,
      inLanguage: "es",
      publisher: { "@id": org },
    },
    {
      "@type": "SoftwareApplication",
      name: site.name,
      applicationCategory: "HealthApplication",
      applicationSubCategory: "Bienestar laboral para desarrolladores",
      operatingSystem: "Web, Windows, macOS, Linux, Android, iOS, Visual Studio Code",
      description: site.description,
      inLanguage: "es",
      publisher: { "@id": org },
      offers: plans.map((p) => ({ "@type": "Offer", name: p.name, price: p.price, priceCurrency: "USD", url: `${site.url}${p.cta.href}` })),
    },
    {
      "@type": "FAQPage",
      mainEntity: faq.items.map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a } })),
    },
  ];
  const json = JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
