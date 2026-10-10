import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Section, Container } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Reveal, MaskReveal } from "@/components/motion/reveal";
import { EditorialImage } from "@/components/media/editorial-image";
import { ArticleCard } from "@/components/magazine/article-card";
import { listArticles } from "@/lib/domain/articles";
import { pick } from "@/content/types";
import { categories } from "@/content/authors";

export async function MagazinePreview() {
  const t = await getTranslations("home.magazine");
  const tc = await getTranslations("common");
  const c = await getTranslations("cta");
  const locale = await getLocale();
  const all = await listArticles();
  const featured = all.find((a) => a.featured) ?? all[0];
  const rest = all.filter((a) => a.slug !== featured?.slug).slice(0, 4);
  if (!featured) return null;
  const cat = categories.find((x) => x.slug === featured.category);

  return (
    <Section tone="porcelain" id="magazine">
      <Container>
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow>{t("eyebrow")}</Eyebrow>
            <h2 className="display-lg mt-5 max-w-3xl">{t("title")}</h2>
          </div>
          <p className="font-display text-sm tracking-[0.18em] text-ink-muted">
            {t("issue")} {featured.issue} · {new Date(featured.publishedAt).getFullYear()}
          </p>
        </Reveal>

        <article className="mt-14 grid gap-8 lg:grid-cols-12 lg:gap-12">
          <MaskReveal className="lg:col-span-8">
            <Link href={`/magazine/${featured.slug}`} className="fabric-hover block">
              <div className="aspect-[3/2]">
                <EditorialImage id={featured.hero} alt={pick(featured.heroAlt, locale)} className="h-full w-full" sizes="(min-width:1024px) 66vw, 100vw" />
              </div>
            </Link>
          </MaskReveal>
          <Reveal delay={0.2} className="flex flex-col justify-end lg:col-span-4">
            <p className="eyebrow text-mulberry">{t("featured")} · {cat ? pick(cat.name, locale) : ""}</p>
            <h3 className="display-md mt-4">
              <Link href={`/magazine/${featured.slug}`} className="hover:text-mulberry">
                {pick(featured.title, locale)}
              </Link>
            </h3>
            <p className="mt-4 font-serif text-lg text-ink-soft">{pick(featured.dek, locale)}</p>
            <p className="eyebrow mt-6 text-ink-muted">{tc("minutesRead", { minutes: featured.readingMinutes })}</p>
          </Reveal>
        </article>

        <div className="mt-16 grid gap-10 border-t border-line pt-10 sm:grid-cols-2 lg:grid-cols-4">
          {rest.map((a, i) => (
            <Reveal key={a.slug} delay={i * 0.05}>
              <ArticleCard article={a} locale={locale} />
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-14">
          <Button href="/magazine" variant="secondary" size="lg">
            {c("enterMagazine")}
          </Button>
        </Reveal>
      </Container>
    </Section>
  );
}
