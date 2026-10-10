import { SITE } from "@/lib/site";

export function JsonLd({ data }: { data: object | object[] }) {
  const items = Array.isArray(data) ? data : [data];
  return (
    <>
      {items.map((d, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(d).replace(/</g, "\\u003c") }} />
      ))}
    </>
  );
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE.url}#organization`,
    name: SITE.name,
    url: SITE.url,
    slogan: SITE.tagline,
    description: "Personal styling, wardrobe intelligence and curated fashion for women who dress with intention. Douala, Cameroon and virtual.",
    logo: `${SITE.url}/assets/virtuous-vogue/brand/vv-lockup-ink.svg`,
    address: { "@type": "PostalAddress", addressLocality: SITE.city, addressCountry: "CM" },
    areaServed: ["Douala", "Cameroon", "Worldwide (virtual)"],
    sameAs: [SITE.instagram, SITE.tiktok].filter(Boolean),
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE.url}#website`,
    url: SITE.url,
    name: SITE.name,
    inLanguage: ["en", "fr"],
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${SITE.url}/magazine/search?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
}

export function serviceSchema(s: { name: string; description: string; slug: string; durationMinutes: number; priceXaf: number | null }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.name,
    description: s.description,
    url: `${SITE.url}/services/${s.slug}`,
    provider: { "@id": `${SITE.url}#organization` },
    serviceType: "Personal styling consultation",
    areaServed: ["Douala", "Cameroon", "Virtual"],
    ...(s.priceXaf ? { offers: { "@type": "Offer", price: s.priceXaf, priceCurrency: "XAF" } } : {}),
  };
}

export function articleSchema(a: { title: string; description: string; slug: string; publishedAt: string; author: string; image?: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.description,
    datePublished: a.publishedAt,
    author: { "@type": "Organization", name: a.author },
    publisher: { "@id": `${SITE.url}#organization` },
    mainEntityOfPage: `${SITE.url}/magazine/${a.slug}`,
    ...(a.image ? { image: [`${SITE.url}${a.image}`] } : {}),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: `${SITE.url}${it.path}` })),
  };
}
