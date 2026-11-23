/** Datos generales de la marca. Edita aquí nombre, lema, contacto y navegación. */
export const site = {
  name: "Selyh",
  tagline: "Prevenir también es parte del trabajo",
  /** Título SEO de la portada: lo que la gente busca, con la marca al final. */
  seoTitle: "Salud mental y prevención del estrés para desarrolladores",
  description:
    "Selyh ayuda a desarrolladores y equipos de software a prevenir el estrés laboral y el burnout sin salir de su flujo de trabajo: check-ins de un toque desde VS Code, el escritorio o el móvil, tu propia línea base y pausas breves. Sin vigilancia y con tus datos bajo tu control.",
  keywords: [
    "Hans Selye",
    "Hans Selye estrés",
    "síndrome general de adaptación",
    "ciencia del estrés",
    "salud mental para desarrolladores",
    "estrés laboral",
    "burnout en programadores",
    "prevención del estrés",
    "bienestar de equipos de desarrollo",
    "extensión VS Code bienestar",
    "prevención del agotamiento",
  ],
  url: process.env.SITE_URL ?? "https://selyh.fun",
  locale: "es_PE",
  email: "hola@selyh.fun",
  city: "Trujillo, Perú",
  social: [
    { label: "Instagram", handle: "@selyh.fun", href: "https://www.instagram.com/selyh.fun/" },
    { label: "LinkedIn", handle: "Selyh devs", href: "https://www.linkedin.com/in/selyh-devs-81788344b/" },
  ],
  nav: [
    { href: "/#como-funciona", label: "Cómo funciona" },
    { href: "/#equipos", label: "Para equipos" },
    { href: "/#privacidad", label: "Privacidad" },
    { href: "/#planes", label: "Planes" },
    { href: "/#preguntas", label: "Preguntas" },
  ],
} as const;
