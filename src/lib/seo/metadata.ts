import type { Metadata } from "next";

import { site } from "@/content/site";

export const siteMetadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.seoTitle} · ${site.name}`, template: `%s · ${site.name}` },
  description: site.description,
  applicationName: site.name,
  keywords: [...site.keywords],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  category: "health",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/brand/isotipo-indigo.svg" }],
  },
  openGraph: { type: "website", siteName: site.name, locale: site.locale, url: "/", title: `${site.name} · ${site.tagline}`, description: site.description },
  twitter: { card: "summary_large_image", title: `${site.name} · ${site.tagline}`, description: site.description },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
};

/** Metadatos de una página pública: título, descripción y URL canónica. */
export function pageMetadata(path: string, title: string, description: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path },
  };
}

/** Paneles y flujos de cuenta: nunca indexar. */
export const privateMetadata: Metadata = { robots: { index: false, follow: false } };
