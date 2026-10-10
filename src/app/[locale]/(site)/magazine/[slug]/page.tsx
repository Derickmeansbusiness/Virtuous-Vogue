import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container, Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/typography";
import { Reveal, MaskReveal } from "@/components/motion/reveal";
import { EditorialImage } from "@/components/media/editorial-image";
import { ArticleCard } from "@/components/magazine/article-card";
import { ArticleBody } from "@/components/magazine/article-body";
import { ShareRow } from "@/components/magazine/share-row";
import { SaveArticleButton } from "@/components/magazine/save-article";
import { ReadingProgress } from "@/components/magazine/reading-progress";
import { WhatsAppLink } from "@/components/layout/whatsapp";
import { getArticleBySlug, listArticles } from "@/lib/domain/articles";
import { articles as seed } from "@/content/articles";
import { authors, categories } from "@/content/authors";
import { pick } from "@/content/types";
import { getImage } from "@/lib/assets";
import { getSessionUser } from "@/lib/auth/session";
import { isArticleSaved } from "@/lib/domain/saves";
import { JsonLd, articleSchema, breadcrumbSchema } from "@/lib/seo/json-ld";
import { SITE } from "@/lib/site";

export function generateStaticParams() {
  return seed.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const a = await getArticleBySlug(slug);
  if (!a) return {};
  const img = getImage(a.hero);
  return {
    title: pick(a.title, locale),
    description: pick(a.dek, locale),
    alternates: { canonical: `/magazine/${slug}`, languages: { en: `/magazine/${slug}`, fr: `/fr/magazine/${slug}` } },
    openGraph: { type: "article", publishedTime: a.publishedAt, images: img?.base ? [{ url: `${img.base}-${img.widths[img.widths.length - 1]}.jpg` }] : undefined },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const a = await getArticleBySlug(slug);
  if (!a) notFound();
  const t = await getTranslations("magazine");
  const tc = await getTranslations("common");
  const current = await getLocale();
  const author = authors.find((x) => x.slug === a.authorSlug);
  const cat = categories.find((x) => x.slug === a.category);
  const all = await listArticles();
  const related = a.related.map((s) => all.find((x) => x.slug === s)).filter(Boolean).slice(0, 3) as typeof all;
  const user = await getSessionUser();
  const saved = user ? await isArticleSaved(user.id, a.slug) : false;
  const img = getImage(a.hero);
  const date = new Date(a.publishedAt).toLocaleDateString(current === "fr" ? "fr-FR" : "en-GB", { day: "numeric", month: "long", year: "numeric" });

  return (
    <>
      <ReadingProgress />
      <JsonLd data={[articleSchema({ title: a.title.en, description: a.dek.en, slug: a.slug, publishedAt: a.publishedAt, author: author?.name ?? SITE.name, image: img?.base ? `${img.base}-${img.widths[img.widths.length - 1]}.jpg` : undefined }), breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Magazine", path: "/magazine" }, { name: a.title.en, path: `/magazine/${a.slug}` }])]} />
      <article>
        <Section tone="porcelain" className="pt-[calc(var(--vv-header-h)+2.5rem)] pb-10">
          <Container narrow>
            <Reveal>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                {cat ? <Link href={`/magazine/category/${cat.slug}`} className="eyebrow text-mulberry hover:underline">{pick(cat.name, current)}</Link> : null}
                <span className="font-display text-xs tracking-[0.2em] text-ink-muted">VV {a.issue} · {t(`types.${a.type}`)}</span>
                {a.isDemo ? <span className="eyebrow border border-line px-1.5 py-0.5 text-ink-muted">{tc("demoBadge")}</span> : null}
              </div>
              <h1 className="display-lg mt-5">{pick(a.title, current)}</h1>
              <p className="mt-6 font-serif text-xl text-ink-soft">{pick(a.dek, current)}</p>
              <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-5 text-sm text-ink-muted">
                <p>
                  {author ? <Link href={`/magazine/author/${author.slug}`} className="text-ink hover:text-mulberry">{author.name}</Link> : null} · {date} · {tc("minutesRead", { minutes: a.readingMinutes })}
                </p>
                <div className="flex items-center gap-4">
                  <SaveArticleButton slug={a.slug} saved={saved} signedIn={Boolean(user)} />
                  <ShareRow title={pick(a.title, current)} />
                </div>
              </div>
            </Reveal>
          </Container>
        </Section>
        <MaskReveal className="bg-porcelain">
          <Container>
            <figure>
              <div className="aspect-[3/2] md:aspect-[2/1]">
                <EditorialImage id={a.hero} alt={pick(a.heroAlt, current)} className="h-full w-full" sizes="100vw" priority />
              </div>
              <figcaption className="eyebrow pt-3 text-ink-muted">{pick(a.heroAlt, current)} · VV / {a.issue}</figcaption>
            </figure>
          </Container>
        </MaskReveal>
        <Section tone="porcelain" className="py-14 md:py-20">
          <Container narrow>
            <ArticleBody article={a} locale={current} />
            <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
              <ShareRow title={pick(a.title, current)} />
              <WhatsAppLink context={{ kind: "article", title: pick(a.title, current) }} />
            </div>
          </Container>
        </Section>
      </article>
      {related.length ? (
        <Section tone="ivory" className="py-16">
          <Container>
            <Reveal><Eyebrow>{t("related")}</Eyebrow></Reveal>
            <div className="mt-8 grid gap-10 md:grid-cols-3">
              {related.map((r, i) => (
                <Reveal key={r.slug} delay={i * 0.05}><ArticleCard article={r} locale={current} /></Reveal>
              ))}
            </div>
          </Container>
        </Section>
      ) : null}
    </>
  );
}
