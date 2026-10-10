import type { Metadata } from "next";
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { Container, Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/typography";
import { ArticleCard } from "@/components/magazine/article-card";
import { MagazineSearch } from "@/components/magazine/search";
import { EmptyState } from "@/components/ui/skeleton";
import { searchArticles } from "@/lib/domain/articles";

export const metadata: Metadata = { robots: { index: false } };

export default async function SearchPage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ q?: string }> }) {
  const { locale } = await params;
  const { q = "" } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations("magazine");
  const current = await getLocale();
  const results = await searchArticles(q, current);
  return (
    <Section tone="porcelain" className="pt-[calc(var(--vv-header-h)+2.5rem)]">
      <Container>
        <Eyebrow>{t("search")}</Eyebrow>
        <h1 className="display-lg mt-2">{q ? t("resultsFor", { q }) : t("search")}</h1>
        <div className="mt-6"><MagazineSearch defaultValue={q} /></div>
        {q && results.length === 0 ? <EmptyState className="mt-12" title={t("noResults")} body={t("noResultsBody")} /> : null}
        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((a) => <ArticleCard key={a.slug} article={a} locale={current} />)}
        </div>
      </Container>
    </Section>
  );
}
