import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { Container, Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Reveal, MaskReveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { EditorialImage } from "@/components/media/editorial-image";
import { WhatsAppLink } from "@/components/layout/whatsapp";
import { getServiceBySlug, listServices } from "@/lib/domain/services";
import { services as seed } from "@/content/services";
import { pick } from "@/content/types";
import { JsonLd, breadcrumbSchema, serviceSchema } from "@/lib/seo/json-ld";
import { Link } from "@/i18n/navigation";

export function generateStaticParams() {
  return seed.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const s = await getServiceBySlug(slug);
  if (!s) return {};
  return { title: pick(s.name, locale), description: pick(s.short, locale), alternates: { canonical: `/services/${slug}`, languages: { en: `/services/${slug}`, fr: `/fr/services/${slug}` } } };
}

export default async function ServicePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const s = await getServiceBySlug(slug);
  if (!s) notFound();
  const t = await getTranslations("services");
  const h = await getTranslations("home.services");
  const c = await getTranslations("cta");
  const current = await getLocale();
  const others = (await listServices()).filter((x) => x.slug !== s.slug).slice(0, 3);

  const blocks = [
    { key: "whoFor", title: t("whoFor"), items: s.whoFor },
    { key: "explore", title: t("explore"), items: s.explore },
    { key: "receive", title: t("receive"), items: s.receive },
  ];

  return (
    <>
      <JsonLd data={[serviceSchema({ name: s.name.en, description: s.short.en, slug: s.slug, durationMinutes: s.durationMinutes, priceXaf: s.priceXaf }), breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Consultations", path: "/services" }, { name: s.name.en, path: `/services/${s.slug}` }])]} />
      <Section tone="porcelain" className="pt-[calc(var(--vv-header-h)+3rem)] pb-0">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12">
            <Reveal className="flex flex-col justify-end lg:col-span-6 lg:pb-16">
              <p className="font-display text-xs tracking-[0.2em] text-ink-muted">VV / {s.number}</p>
              <Eyebrow className="mt-3">{t("eyebrow")}</Eyebrow>
              <h1 className="display-xl mt-3">{pick(s.name, current)}</h1>
              <p className="mt-6 max-w-xl font-serif text-lg text-ink-soft">{pick(s.intro, current)}</p>
              <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-line pt-5 text-sm">
                <div>
                  <dt className="eyebrow text-ink-muted">{t("duration")}</dt>
                  <dd className="mt-1 font-display text-xl">{s.durationMinutes} min</dd>
                </div>
                <div>
                  <dt className="eyebrow text-ink-muted">{t("format")}</dt>
                  <dd className="mt-1 font-display text-xl">{s.formats.map((f) => t(`formats.${f}`)).join(" / ")}</dd>
                </div>
                <div>
                  <dt className="eyebrow text-ink-muted">{t("investment")}</dt>
                  <dd className="mt-1 font-display text-xl">{s.priceXaf ? `${s.priceXaf.toLocaleString(current)} XAF` : h("from")}</dd>
                </div>
              </dl>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                <Button href={`/book?service=${s.slug}`} size="lg">
                  {c("book")}
                </Button>
                <WhatsAppLink context={{ kind: "service", service: pick(s.name, current) }} />
              </div>
            </Reveal>
            <MaskReveal className="lg:col-span-5 lg:col-start-8">
              <div className="aspect-[3/4]">
                <EditorialImage id={s.image} className="h-full w-full" sizes="(min-width:1024px) 40vw, 100vw" priority />
              </div>
            </MaskReveal>
          </div>
        </Container>
      </Section>

      <Section tone="ivory">
        <Container>
          <Stagger className="grid gap-12 md:grid-cols-3">
            {blocks.map((b, i) => (
              <StaggerItem key={b.key}>
                <p className="font-display text-xs tracking-[0.2em] text-ink-muted">0{i + 1}</p>
                <h2 className="display-sm mt-2">{b.title}</h2>
                <ul className="mt-5 space-y-3 border-t border-line pt-5 font-serif text-base text-ink-soft">
                  {b.items.map((it) => (
                    <li key={it.en}>{pick(it, current)}</li>
                  ))}
                </ul>
              </StaggerItem>
            ))}
          </Stagger>
          <Reveal className="mt-16 grid gap-6 border-t border-line pt-10 md:grid-cols-12">
            <div className="md:col-span-4">
              <p className="font-display text-xs tracking-[0.2em] text-ink-muted">04</p>
              <h2 className="display-sm mt-2">{t("next")}</h2>
            </div>
            <p className="font-serif text-lg text-ink-soft md:col-span-7 md:col-start-6">{pick(s.next, current)}</p>
          </Reveal>
        </Container>
      </Section>

      <Section tone="porcelain">
        <Container>
          <Reveal>
            <Eyebrow>{t("alsoConsider")}</Eyebrow>
          </Reveal>
          <ul className="mt-6 divide-y divide-line border-y border-line">
            {others.map((o) => (
              <li key={o.slug}>
                <Link href={`/services/${o.slug}`} className="group flex items-baseline justify-between gap-6 py-5">
                  <span>
                    <span className="font-display text-xs tracking-[0.2em] text-ink-muted">VV / {o.number}</span>
                    <span className="display-sm ml-4 transition-colors group-hover:text-mulberry">{pick(o.name, current)}</span>
                  </span>
                  <span className="hidden max-w-md text-sm text-ink-soft md:block">{pick(o.short, current)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
    </>
  );
}
