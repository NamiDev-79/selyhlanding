import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";

import { siteMetadata } from "@/lib/seo/metadata";
import "./globals.css";

/*
 * Fuentes de la marca, autoalojadas (no dependen de Google Fonts en el build):
 * Bricolage Grotesque (principal), Space Grotesk (secundaria) y Lora cursiva (frases puntuales).
 */
const bricolage = localFont({
  src: "../fonts/bricolage-grotesque.woff2",
  variable: "--font-bricolage",
  weight: "200 800",
  display: "swap",
});
const spaceGrotesk = localFont({
  src: "../fonts/space-grotesk.woff2",
  variable: "--font-space-grotesk",
  weight: "300 700",
  display: "swap",
});
const lora = localFont({
  src: "../fonts/lora-italic.woff2",
  variable: "--font-lora",
  weight: "400 700",
  style: "italic",
  display: "swap",
});

export const metadata: Metadata = siteMetadata;

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f1523" },
  ],
};

/**
 * Tema: la elección guardada (botón sol/luna) manda en toda la web. Sin elección, la web pública es clara
 * y el panel sigue la preferencia del sistema. Se aplica antes del primer pintado (sin parpadeo).
 */
const themeScript = `(function(){try{var t=localStorage.getItem("selyh-theme");if(t==="dark"||(!t&&["/panel","/empresa","/device"].some(function(p){return location.pathname.indexOf(p)===0})&&matchMedia("(prefers-color-scheme: dark)").matches))document.documentElement.classList.add("dark")}catch(e){}})()`;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://selyh.fun/#organization",
      "name": "Selyh",
      "url": "https://selyh.fun",
      "logo": "https://selyh.fun/brand/isotipo-indigo.svg",
      "description": "Plataforma de bienestar y prevención del estrés laboral para desarrolladores y equipos, inspirada en las investigaciones de Hans Selye.",
      "sameAs": [
        "https://www.linkedin.com/in/selyh-devs-81788344b/",
        "https://www.instagram.com/selyh.fun/"
      ],
      "knowsAbout": [
        "Hans Selye",
        "https://es.wikipedia.org/wiki/Hans_Selye",
        "Estrés laboral",
        "https://es.wikipedia.org/wiki/Estr%C3%A9s",
        "Síndrome General de Adaptación",
        "Burnout"
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://selyh.fun/#website",
      "url": "https://selyh.fun",
      "name": "Selyh",
      "description": "Salud mental y prevención del estrés para desarrolladores",
      "publisher": { "@id": "https://selyh.fun/#organization" },
      "inLanguage": "es"
    }
  ]
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${bricolage.variable} ${spaceGrotesk.variable} ${lora.variable} antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className="min-h-dvh" suppressHydrationWarning>
        <a href="#contenido" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-paper focus:px-4 focus:py-2">
          Saltar al contenido
        </a>
        {children}
      </body>
    </html>
  );
}
