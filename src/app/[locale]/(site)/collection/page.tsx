import type { Metadata } from "next";
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { Container, Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Reveal, TextReveal } from "@/components/motion/reveal";
import { LookCard } from "@/components/collection/look-card";
import { collectionChapters, looks, looksInChapter, publishedLooks } from "@/content/collection";
import { pick } from "@/content/types";
import { JsonLd, breadcrumbSchema } from "@/lib/seo/json-ld";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return { title: t("collection"), description: t("collectionDesc"), alternates: { canonical: "/collection", languages: { en: "/collection", fr: "/fr/collection" } } };
}

export default async function CollectionPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("collection");
  const c = await getTranslations("cta");
  const current = await getLocale();
  const chapters = collectionChapters.map((ch) => ({ ...ch, looks: looksInChapter(ch.number) })).filter((ch) => ch.looks.length > 0);
  const pending = looks.length - publishedLooks.length;

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Our Collection", path: "/collection" }])} />
      <Section tone="porcelain" className="pt-[calc(var(--vv-header-h)+3rem)] pb-12 md:pb-16">
        <Container>
          <Eyebrow>{t("eyebrow")}</Eyebrow>
          <TextReveal as="h1" lines={[t("title")]} className="display-xl mt-3" />
          <Reveal delay={0.2}>
            <p className="mt-6 max-w-2xl font-serif text-lg text-ink-soft md:text-xl">{t("intro")}</p>
          </Reveal>
          <Reveal delay={0.3}>
            <p className="mt-8 max-w-2xl border-l-2 border-satin pl-5 text-sm leading-relaxed text-ink-muted">{t("notice")}</p>
          </Reveal>
        </Container>
      </Section>

      {chapters.map((ch, i) => (
        <Section key={ch.slug} id={ch.slug} tone={i % 2 === 0 ? "ivory" : "porcelain"} className="py-16 md:py-24">
          <Container>
            <Reveal className="flex flex-wrap items-end justify-between gap-4 border-b border-ink pb-5">
              <div>
                <p className="font-display text-xs tracking-[0.2em] text-ink-muted">
                  {t("chapter")} {["I", "II", "III", "IV"][ch.number - 1]}
                </p>
                <h2 className="display-lg mt-2">{pick(ch.title, current)}</h2>
                <p className="mt-2 font-serif text-lg italic text-ink-soft">{pick(ch.theme, current)}</p>
              </div>
              <p className="eyebrow text-ink-muted">{t("designs", { count: ch.looks.length })}</p>
            </Reveal>
            <div className="mt-10 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {ch.looks.map((look, j) => (
                <Reveal key={look.code} delay={j * 0.05}>
                  <LookCard look={look} locale={current} priority={i === 0 && j < 4} />
                </Reveal>
              ))}
            </div>
          </Container>
        </Section>
      ))}

      <Section tone="ink">
        <Container className="text-center">
          <Reveal>
            {pending > 0 ? (
              <>
                <Eyebrow tone="ivory">{t("moreComingTitle")}</Eyebrow>
                <p className="mx-auto mt-4 max-w-xl font-serif text-lg text-ivory/80">{t("moreComing")}</p>
              </>
            ) : null}
            <p className="display-md mt-10 italic text-ivory">Virtue Never Goes Out of Style.</p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button href="/book" variant="ivory" size="lg">{c("book")}</Button>
              <Button href="/studio/compass" variant="ghost" size="lg" className="border-ivory/50 text-ivory hover:bg-ivory/10">{c("discover")}</Button>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
