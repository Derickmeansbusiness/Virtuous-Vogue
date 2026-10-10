import type { Metadata } from "next";
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { Container, Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Reveal, MaskReveal } from "@/components/motion/reveal";
import { EditorialImage } from "@/components/media/editorial-image";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { FEATURE_FLAGS } from "@/lib/site";
import { listCuratedProducts } from "@/lib/domain/curated";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return { title: t("edit"), description: t("editDesc"), robots: FEATURE_FLAGS.curatedEdit ? undefined : { index: false } };
}

/**
 * /edit · curated fashion. Behind a feature flag: until it launches the page
 * is a considered "coming soon" moment with the category architecture in
 * place, so retail can switch on without a redesign.
 */
export default async function EditPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("edit");
  const c = await getTranslations("cta");
  const current = await getLocale();
  const categories = t.raw("categories") as string[];
  const products = FEATURE_FLAGS.curatedEdit ? await listCuratedProducts() : [];
  return (
    <>
      <Section tone="porcelain" className="pt-[calc(var(--vv-header-h)+2.5rem)]">
        <Container>
          <div className="grid items-end gap-10 lg:grid-cols-12">
            <Reveal className="lg:col-span-7">
              <Eyebrow>{t("eyebrow")}</Eyebrow>
              <h1 className="display-xl mt-4">{t("title")}</h1>
              <p className="mt-6 max-w-xl font-serif text-lg text-ink-soft">{t("intro")}</p>
              <p className="eyebrow mt-6 text-mulberry">{t("principle")}</p>
            </Reveal>
            <MaskReveal className="lg:col-span-5">
              <div className="aspect-[4/5]"><EditorialImage id="service-personal-shopping" className="h-full w-full" sizes="(min-width:1024px) 40vw, 100vw" /></div>
            </MaskReveal>
          </div>
        </Container>
      </Section>
      <Section tone="ivory">
        <Container>
          <ul className="grid gap-x-8 gap-y-6 border-y border-line py-8 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat, i) => (
              <li key={cat} className="flex items-baseline gap-4">
                <span className="font-display text-xs tracking-[0.2em] text-ink-muted">0{i + 1}</span>
                <span className="display-sm">{cat}</span>
              </li>
            ))}
          </ul>
          {FEATURE_FLAGS.curatedEdit && products.length ? (
            <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((p) => (
                <article key={p.slug}>
                  <div className="aspect-[4/5] bg-satin-tint" />
                  <p className="eyebrow mt-3 text-ink-muted">{p.category}</p>
                  <h2 className="font-display text-xl">{current === "fr" ? p.data.name_fr ?? p.data.name_en : p.data.name_en}</h2>
                </article>
              ))}
            </div>
          ) : (
            <Reveal className="mt-12 grid gap-8 md:grid-cols-12">
              <div className="md:col-span-6">
                <h2 className="display-md">{t("soonTitle")}</h2>
                <p className="mt-4 font-serif text-lg text-ink-soft">{t("soonBody")}</p>
                <div className="mt-6 flex gap-4">
                  <Button href="/studio/closet-remix" variant="secondary">{c("tryRemix")}</Button>
                  <Button href="/book?service=personal-shopping">{c("book")}</Button>
                </div>
              </div>
              <div className="md:col-span-5 md:col-start-8">
                <p className="eyebrow text-ink-muted">{t("notify")}</p>
                <div className="mt-3"><NewsletterForm source="edit-waitlist" /></div>
              </div>
            </Reveal>
          )}
        </Container>
      </Section>
    </>
  );
}
