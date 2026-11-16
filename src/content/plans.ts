/**
 * Planes que muestra la landing (estático, para SEO). Deben coincidir con GET /plans de la API;
 * la pantalla de elección de plan dentro de la app usa siempre el catálogo de la API.
 */
export type PlanId = "PERSONAL_BASIC" | "PERSONAL_PLUS" | "CORPORATE";

export const plansIntro = {
  eyebrow: "Planes",
  title: "Lo esencial es gratis y lo seguirá siendo",
  body: "Los check-ins, tu panel, las escalas, los ejercicios y el protocolo de ayuda en crisis están en el plan gratuito, completos. Lo de pago suma, nunca recorta lo básico.",
  referential: "Precios en USD. Cancelas cuando quieras, sin permanencia.",
};

export const plans: {
  id: PlanId;
  name: string;
  price: string;
  unit: string;
  audience: string;
  highlights: string[];
  cta: { label: string; href: string };
  featured?: boolean;
}[] = [
  {
    id: "PERSONAL_BASIC",
    name: "Personal Básico",
    price: "0",
    unit: "siempre",
    audience: "Para empezar a conocer tu ritmo.",
    highlights: ["Check-ins de 1 toque", "Panel personal y tendencia", "Escalas validadas", "Ejercicios breves", "Protocolo de crisis siempre incluido"],
    cta: { label: "Crear cuenta gratis", href: "/registro" },
  },
  {
    id: "PERSONAL_PLUS",
    name: "Personal Plus",
    price: "5.99",
    unit: "al mes",
    audience: "Para quien quiere más contexto y acompañamiento.",
    highlights: ["Todo lo del plan Básico", "Conexión con wearables", "Programas guiados de 2 a 4 semanas", "Descuento para estudiantes"],
    cta: { label: "Empezar con Plus", href: "/registro?plan=PERSONAL_PLUS" },
    featured: true,
  },
  {
    id: "CORPORATE",
    name: "Corporativo",
    price: "9",
    unit: "por puesto al mes · desde 5 puestos",
    audience: "Para equipos de desarrollo que quieren actuar a tiempo.",
    highlights: ["Todo lo del plan Plus para cada integrante", "Panel de equipos con tendencias agregadas", "Nunca datos individuales", "Registro de auditoría de accesos", "Invitaciones por correo"],
    cta: { label: "Crear cuenta corporativa", href: "/registro?tipo=corporativa" },
  },
];
