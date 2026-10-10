import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { Container, Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/typography";
import { Reveal } from "@/components/motion/reveal";
import { ArticleCard } from "@/components/magazine/article-card";
import { EmptyState } from "@/components/ui/skeleton";
import { listArticles } from "@/lib/domain/articles";
import { categories } from "@/content/authors";
import { pick } from "@/content/types";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const c = categories.find((x) => x.slug === slug);
  if (!c) return {};
  return { title: `${pick(c.name, locale)} · Magazine`, description: pick(c.description, locale) };
}

export default async function CategoryPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const c = categories.find((x) => x.slug === slug);
  if (!c) notFound();
  const t = await getTranslations("magazine");
  const current = await getLocale();
  const items = (await listArticles()).filter((a) => a.category === slug);
  return (
    <Section tone="porcelain" className="pt-[calc(var(--vv-header-h)+2.5rem)]">
      <Container>
        <Reveal>
          <Eyebrow>{t("eyebrow")}</Eyebrow>
          <h1 className="display-lg mt-2">{pick(c.name, current)}</h1>
          <p className="mt-4 max-w-xl font-serif text-lg text-ink-soft">{pick(c.description, current)}</p>
        </Reveal>
        {items.length ? (
          <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((a, i) => <Reveal key={a.slug} delay={i * 0.04}><ArticleCard article={a} locale={current} /></Reveal>)}
          </div>
        ) : (
          <EmptyState className="mt-12" title={t("emptyCategory")} body={t("emptyCategoryBody")} />
        )}
      </Container>
    </Section>
  );
}
