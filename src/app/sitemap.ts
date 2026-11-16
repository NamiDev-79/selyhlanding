import type { MetadataRoute } from "next";

import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: { path: string; priority: number }[] = [
    { path: "/", priority: 1 },
    { path: "/precios", priority: 0.8 },
    { path: "/hans-selye", priority: 0.7 },
    { path: "/privacidad", priority: 0.4 },
    { path: "/terminos", priority: 0.3 },
    { path: "/registro", priority: 0.5 },
  ];
  return pages.map((p) => ({ url: `${site.url}${p.path === "/" ? "" : p.path}`, changeFrequency: "monthly", priority: p.priority }));
}
