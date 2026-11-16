import type { MetadataRoute } from "next";

import { site } from "@/content/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/panel", "/empresa", "/planes", "/plan-corporativo", "/api/", "/device", "/invite", "/verify-email", "/reset-password"] },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
