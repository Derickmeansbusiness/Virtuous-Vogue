import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/account", "/admin", "/api", "/auth", "/book/manage", "/book/confirm", "/studio/compass/result"] }],
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
