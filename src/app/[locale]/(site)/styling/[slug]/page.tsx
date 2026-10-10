import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { Container, Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Reveal, MaskReveal } from "@/components/motion/reveal";
import { EditorialImage } from "@/components/media/editorial-image";
import { WhatsAppLink } from "@/components/layout/whatsapp";
import { landingPages } from "@/content/landing";
import { getServiceBySlug } from "@/lib/domain/services";
import { pick } from "@/content/types";
import { JsonLd, breadcrumbSchema, serviceSchema } from "@/lib/seo/json-ld";

export function generateStaticParams() {
  return landingPages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const p = landingPages.find((x) => x.slug === slug);
  if (!p) return {};
  return { title: pick(p.title, locale), description: pick(p.intro, locale), alternates: { canonical: `/styling/${slug}`, languages: { en: `/styling/${slug}`, fr: `/fr/styling/${slug}` } } };
}

export default async function LandingPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const p = landingPages.find((x) => x.slug === slug);
  if (!p) notFound();
  const current = await getLocale();
  const c = await getTranslations("cta");
  const s = await getTranslations("services");
  const service = await getServiceBySlug(p.service);
  return (
    <>
      <JsonLd data={[breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Styling", path: "/styling" }, { name: p.title.en, path: `/styling/${p.slug}` }]), ...(service ? [serviceSchema({ name: service.name.en, description: service.short.en, slug: service.slug, durationMinutes: service.durationMinutes, priceXaf: service.priceXaf })] : [])]} />
      <Section tone="porcelain" className="pt-[calc(var(--vv-header-h)+2.5rem)] pb-10">
        <Container>
          <div className="grid items-end gap-10 lg:grid-cols-12">
            <Reveal className="lg:col-span-7">
              <Eyebrow>{pick(p.title, current)}</Eyebrow>
              <h1 className="display-lg mt-4">{pick(p.h1, current)}</h1>
              <p className="mt-6 max-w-xl font-serif text-lg text-ink-soft">{pick(p.intro, current)}</p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                <Button href={`/book?service=${p.service}`} size="lg">{c("book")}</Button>
                <WhatsAppLink context={{ kind: "service", service: pick(p.title, current) }} />
              </div>
            </Reveal>
            <MaskReveal className="lg:col-span-5">
              <div className="aspect-[4/5]"><EditorialImage id={p.image} className="h-full w-full" sizes="(min-width:1024px) 40vw, 100vw" priority /></div>
            </MaskReveal>
          </div>
        </Container>
      </Section>
      <Section tone="ivory">
        <Container narrow>
          <div className="prose-editorial">{p.body.map((b) => <p key={b.en}>{pick(b, current)}</p>)}</div>
          {service ? (
            <Reveal className="mt-12 border-y border-line py-8">
              <p className="eyebrow text-mulberry">{s("eyebrow")}</p>
              <p className="display-sm mt-2">{pick(service.name, current)}</p>
              <p className="mt-2 text-sm text-ink-soft">{pick(service.short, current)}</p>
              <div className="mt-4 flex gap-4">
                <Button href={`/services/${service.slug}`} variant="secondary" size="sm">{s("details")}</Button>
                <Button href={`/book?service=${service.slug}`} size="sm">{c("book")}</Button>
              </div>
            </Reveal>
          ) : null}
          <dl className="mt-12 divide-y divide-line border-y border-line">
            {p.faq.map((f) => (
              <div key={f.q.en} className="py-5">
                <dt className="font-display text-xl">{pick(f.q, current)}</dt>
                <dd className="mt-2 font-serif text-base text-ink-soft">{pick(f.a, current)}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </Section>
    </>
  );
}
