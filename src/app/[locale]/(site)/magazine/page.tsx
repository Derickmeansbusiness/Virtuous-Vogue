import type { Metadata } from "next";
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container, Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/typography";
import { Reveal, MaskReveal } from "@/components/motion/reveal";
import { EditorialImage } from "@/components/media/editorial-image";
import { ArticleCard } from "@/components/magazine/article-card";
import { MagazineSearch } from "@/components/magazine/search";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { listArticles } from "@/lib/domain/articles";
import { categories } from "@/content/authors";
import { pick } from "@/content/types";
import { JsonLd, breadcrumbSchema } from "@/lib/seo/json-ld";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return { title: t("magazine"), description: t("magazineDesc"), alternates: { canonical: "/magazine", languages: { en: "/magazine", fr: "/fr/magazine" } } };
}

export default async function MagazinePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("magazine");
  const tc = await getTranslations("common");
  const current = await getLocale();
  const all = await listArticles();
  const featured = all.find((a) => a.featured) ?? all[0];
  const picks = all.filter((a) => a.editorsPick && a.slug !== featured?.slug).slice(0, 3);
  const latest = all.filter((a) => a.slug !== featured?.slug).slice(0, 8);
  const issue = all[0]?.issue ?? "01";

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Magazine", path: "/magazine" }])} />
      <Section tone="porcelain" className="pt-[calc(var(--vv-header-h)+2.5rem)] pb-10">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6 border-b border-ink pb-6">
            <Reveal>
              <Eyebrow>{t("eyebrow")}</Eyebrow>
              <h1 className="display-xl mt-2">{t("title")}</h1>
            </Reveal>
            <div className="flex flex-col items-end gap-3">
              <p className="font-display text-sm tracking-[0.18em] text-ink-muted">
                {t("issue")} {issue} · {new Date().getFullYear()}
              </p>
              <MagazineSearch />
            </div>
          </div>
          <nav aria-label={t("categories")} className="mt-5 flex gap-6 overflow-x-auto scrollbar-none pb-2">
            {categories.map((c) => (
              <Link key={c.slug} href={`/magazine/category/${c.slug}`} className="eyebrow shrink-0 text-ink-soft hover:text-mulberry">
                {pick(c.name, current)}
              </Link>
            ))}
          </nav>
        </Container>
      </Section>

      {featured ? (
        <Section tone="porcelain" className="pt-6">
          <Container>
            <article className="grid gap-8 lg:grid-cols-12">
              <MaskReveal className="lg:col-span-8">
                <Link href={`/magazine/${featured.slug}`} className="fabric-hover block">
                  <div className="aspect-[3/2]">
                    <EditorialImage id={featured.hero} alt={pick(featured.heroAlt, current)} className="h-full w-full" sizes="(min-width:1024px) 66vw, 100vw" priority />
                  </div>
                </Link>
              </MaskReveal>
              <Reveal delay={0.2} className="flex flex-col justify-end lg:col-span-4">
                <p className="eyebrow text-mulberry">{t("featured")}</p>
                <h2 className="display-md mt-3">
                  <Link href={`/magazine/${featured.slug}`} className="hover:text-mulberry">{pick(featured.title, current)}</Link>
                </h2>
                <p className="mt-4 font-serif text-lg text-ink-soft">{pick(featured.dek, current)}</p>
                <p className="eyebrow mt-6 text-ink-muted">{tc("minutesRead", { minutes: featured.readingMinutes })}</p>
              </Reveal>
            </article>
          </Container>
        </Section>
      ) : null}

      {picks.length ? (
        <Section tone="ivory" className="py-16">
          <Container>
            <Reveal className="flex items-baseline justify-between border-b border-line pb-4">
              <h2 className="display-sm">{t("editorsPick")}</h2>
            </Reveal>
            <div className="mt-8 grid gap-10 md:grid-cols-3">
              {picks.map((a, i) => (
                <Reveal key={a.slug} delay={i * 0.05}><ArticleCard article={a} locale={current} /></Reveal>
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      <Section tone="porcelain" className="py-16">
        <Container>
          <Reveal className="flex items-baseline justify-between border-b border-line pb-4">
            <h2 className="display-sm">{t("latest")}</h2>
          </Reveal>
          <div className="mt-8 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {latest.map((a, i) => (
              <Reveal key={a.slug} delay={i * 0.04}><ArticleCard article={a} locale={current} /></Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="ink">
        <Container narrow>
          <Eyebrow tone="satin">The Virtuous Edit</Eyebrow>
          <h2 className="display-md mt-3 text-ivory">{t("newsletterTitle")}</h2>
          <div className="mt-6 max-w-md"><NewsletterForm tone="dark" source="magazine" /></div>
        </Container>
      </Section>
    </>
  );
}
