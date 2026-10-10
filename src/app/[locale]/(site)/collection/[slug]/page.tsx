import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { Container, Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Reveal, MaskReveal } from "@/components/motion/reveal";
import { EditorialImage } from "@/components/media/editorial-image";
import { WhatsAppLink } from "@/components/layout/whatsapp";
import { LookCard, StatusBadge } from "@/components/collection/look-card";
import { collectionChapters, getLook, looksInChapter, publishedLooks } from "@/content/collection";
import { pick } from "@/content/types";
import { JsonLd, breadcrumbSchema } from "@/lib/seo/json-ld";
import { Link } from "@/i18n/navigation";

export function generateStaticParams() {
  return publishedLooks.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const look = getLook(slug);
  if (!look) return {};
  return {
    title: `${look.code} ${pick(look.name, locale)}`,
    description: pick(look.signature, locale),
    alternates: { canonical: `/collection/${slug}`, languages: { en: `/collection/${slug}`, fr: `/fr/collection/${slug}` } },
  };
}

export default async function LookPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const look = getLook(slug);
  if (!look) notFound();
  const t = await getTranslations("collection");
  const c = await getTranslations("cta");
  const current = await getLocale();
  const chapter = collectionChapters.find((ch) => ch.number === look.chapter)!;
  const related = looksInChapter(look.chapter).filter((l) => l.slug !== look.slug).slice(0, 3);
  const name = pick(look.name, current);

  const sections = [
    { key: "signature", title: t("signature"), body: pick(look.signature, current) },
    { key: "construction", title: t("construction"), body: pick(look.construction, current) },
    { key: "materials", title: t("materials"), body: pick(look.materials, current) },
    { key: "fit", title: t("fit"), body: pick(look.fit, current) },
    { key: "occasions", title: t("occasions"), body: pick(look.occasions, current) },
  ];

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Our Collection", path: "/collection" }, { name: `${look.code} ${look.name.en}`, path: `/collection/${look.slug}` }])} />
      <Section tone="porcelain" className="pt-[calc(var(--vv-header-h)+2.5rem)] pb-16 md:pb-24">
        <Container>
          <Reveal>
            <Link href="/collection" className="eyebrow text-ink-muted hover:text-mulberry">← {t("all")}</Link>
          </Reveal>
          <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-16">
            <MaskReveal className="lg:col-span-6">
              <div className="aspect-[3/4] lg:sticky lg:top-[calc(var(--vv-header-h)+1.5rem)]">
                <EditorialImage id={look.image} className="h-full w-full" sizes="(min-width:1024px) 48vw, 100vw" priority />
              </div>
            </MaskReveal>
            <div className="lg:col-span-6">
              <Reveal>
                <p className="font-display text-xs tracking-[0.2em] text-ink-muted">
                  {look.code} · {t("chapter")} {["I", "II", "III", "IV"][look.chapter - 1]} · {pick(chapter.title, current)}
                </p>
                <h1 className="display-xl mt-3">{name}</h1>
                <p className="mt-4 font-serif text-xl italic text-ink-soft">{pick(look.tagline, current)}</p>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <StatusBadge status={look.status} label={t(`status.${look.status}`)} />
                  <span className="text-sm text-ink-muted">{t(`statusNote.${look.status}`)}</span>
                </div>
                <dl className="mt-8 grid gap-6 border-t border-line pt-6 sm:grid-cols-2">
                  <div>
                    <dt className="eyebrow text-ink-muted">{t("silhouette")}</dt>
                    <dd className="mt-2 font-display text-lg">{pick(look.silhouette, current)}</dd>
                  </div>
                  <div>
                    <dt className="eyebrow text-ink-muted">{t("palette")}</dt>
                    <dd className="mt-2 flex flex-wrap gap-4">
                      {look.palette.map((s) => (
                        <span key={s.hex} className="flex items-center gap-2 text-sm">
                          <span aria-hidden className="size-5 rounded-full border border-ink/10" style={{ backgroundColor: s.hex }} />
                          {pick(s.name, current)}
                        </span>
                      ))}
                    </dd>
                  </div>
                </dl>
              </Reveal>
              <div className="mt-10 space-y-8">
                {sections.map((sec, i) => (
                  <Reveal key={sec.key} delay={i * 0.04}>
                    <h2 className="eyebrow text-mulberry">{sec.title}</h2>
                    <p className="mt-2 font-serif text-lg leading-relaxed text-ink-soft">{sec.body}</p>
                  </Reveal>
                ))}
              </div>
              <Reveal className="mt-12 border border-line bg-ivory p-6 md:p-8">
                <Eyebrow>{t("enquireTitle")}</Eyebrow>
                <p className="mt-3 max-w-lg font-serif text-lg text-ink-soft">{t("enquireBody")}</p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <WhatsAppLink variant="pill" context={{ kind: "look", code: look.code, name }} label={t("enquireWhatsApp")} />
                  <Button href="/book" variant="primary">{c("book")}</Button>
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      {related.length ? (
        <Section tone="ivory" className="py-16 md:py-24">
          <Container>
            <Reveal className="flex items-end justify-between border-b border-ink pb-5">
              <h2 className="display-md">{t("related")}</h2>
              <Link href="/collection" className="eyebrow text-ink-soft hover:text-mulberry">{t("all")}</Link>
            </Reveal>
            <div className="mt-10 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((l, i) => (
                <Reveal key={l.code} delay={i * 0.05}>
                  <LookCard look={l} locale={current} />
                </Reveal>
              ))}
            </div>
          </Container>
        </Section>
      ) : null}
    </>
  );
}
