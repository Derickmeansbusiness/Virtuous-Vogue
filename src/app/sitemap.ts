import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { services } from "@/content/services";
import { articles } from "@/content/articles";
import { categories, authors } from "@/content/authors";
import { landingPages } from "@/content/landing";
import { publishedLooks } from "@/content/collection";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url;
  const entry = (path: string, priority = 0.6, changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "weekly"): MetadataRoute.Sitemap[number] => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
    alternates: { languages: { en: `${base}${path}`, fr: `${base}/fr${path}` } },
  });
  return [
    entry("/", 1, "weekly"),
    entry("/studio", 0.9), entry("/studio/compass", 0.8), entry("/studio/colour-lens", 0.8), entry("/studio/closet-remix", 0.8),
    entry("/services", 0.9), ...services.map((s) => entry(`/services/${s.slug}`, 0.8)),
    entry("/collection", 0.8), ...publishedLooks.map((l) => entry(`/collection/${l.slug}`, 0.7)),
    entry("/book", 0.8),
    entry("/magazine", 0.9), ...articles.map((a) => entry(`/magazine/${a.slug}`, 0.7)), ...categories.map((c) => entry(`/magazine/category/${c.slug}`, 0.5)), ...authors.map((a) => entry(`/magazine/author/${a.slug}`, 0.4)),
    entry("/about", 0.7), entry("/contact", 0.5), entry("/newsletter", 0.5), entry("/styling", 0.6), ...landingPages.map((p) => entry(`/styling/${p.slug}`, 0.7)),
    entry("/privacy", 0.2, "yearly"), entry("/terms", 0.2, "yearly"),
  ];
}
