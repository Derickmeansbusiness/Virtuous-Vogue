import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { Container, Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/typography";
import { Reveal } from "@/components/motion/reveal";
import { ArticleCard } from "@/components/magazine/article-card";
import { listArticles } from "@/lib/domain/articles";
import { authors } from "@/content/authors";
import { pick } from "@/content/types";

export function generateStaticParams() {
  return authors.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = authors.find((x) => x.slug === slug);
  return a ? { title: `${a.name} · Magazine` } : {};
}

export default async function AuthorPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const a = authors.find((x) => x.slug === slug);
  if (!a) notFound();
  const t = await getTranslations("magazine");
  const tc = await getTranslations("common");
  const current = await getLocale();
  const items = (await listArticles()).filter((x) => x.authorSlug === slug);
  return (
    <Section tone="porcelain" className="pt-[calc(var(--vv-header-h)+2.5rem)]">
      <Container>
        <Reveal>
          <Eyebrow>{pick(a.role, current)}</Eyebrow>
          <h1 className="display-lg mt-2">{a.name}</h1>
          <p className="mt-4 max-w-xl font-serif text-lg text-ink-soft">{pick(a.bio, current)}</p>
          {a.isDemo ? <p className="eyebrow mt-3 text-ink-muted">{tc("demoBadge")}</p> : null}
        </Reveal>
        <h2 className="display-sm mt-14 border-b border-line pb-4">{t("byAuthor")}</h2>
        <div className="mt-8 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((x, i) => <Reveal key={x.slug} delay={i * 0.04}><ArticleCard article={x} locale={current} /></Reveal>)}
        </div>
      </Container>
    </Section>
  );
}
