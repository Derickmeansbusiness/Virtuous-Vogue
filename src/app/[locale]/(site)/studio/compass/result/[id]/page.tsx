import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { Container, Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { getCompassResult } from "@/lib/domain/style-profiles";
import { directionProfiles } from "@/lib/studio/compass-content";
import { DIRECTIONS, type Direction } from "@/lib/studio/compass-model";
import { getSessionUser } from "@/lib/auth/session";
import { getServiceBySlug } from "@/lib/domain/services";
import { pick } from "@/content/types";
import { ShareButton } from "@/components/studio/share-button";
import { BlendBars } from "@/components/studio/blend-bars";
import { PaletteStrip } from "@/components/studio/palette-strip";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; id: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "studio.compass.result" });
  return { title: t("eyebrow"), robots: { index: false } };
}

export default async function CompassResultPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("studio.compass.result");
  const tc = await getTranslations("cta");
  const current = await getLocale();
  const user = await getSessionUser();
  const result = await getCompassResult(id);
  if (!result) notFound();

  const primary = directionProfiles[result.primary_direction as Direction];
  const secondary = result.secondary_direction ? directionProfiles[result.secondary_direction as Direction] : null;
  const service = await getServiceBySlug(result.recommended_service ?? primary.service);
  const scores = DIRECTIONS.map((d) => ({ key: d, name: pick(directionProfiles[d].name, current), value: Number(result.scores?.[d] ?? 0) })).sort((a, b) => b.value - a.value);

  return (
    <>
      <Section tone="ivory" className="pt-[calc(var(--vv-header-h)+3rem)] pb-16">
        <Container>
          <Reveal>
            <Eyebrow>VV / {t("eyebrow")}</Eyebrow>
            <h1 className="display-xl mt-4">
              {pick(primary.name, current)}
              {secondary ? <span className="block font-display text-[0.5em] italic text-mulberry">+ {pick(secondary.name, current)}</span> : null}
            </h1>
            <p className="mt-6 max-w-xl font-serif text-lg text-ink-soft">{pick(primary.essence, current)}</p>
            <p className="mt-3 max-w-xl text-sm text-ink-muted">{t("disclaimer")}</p>
          </Reveal>
          <div className="mt-12 grid gap-12 lg:grid-cols-12">
            <Reveal className="lg:col-span-5">
              <p className="eyebrow text-ink-muted">{t("blend")}</p>
              <BlendBars items={scores} />
            </Reveal>
            <Reveal delay={0.1} className="lg:col-span-6 lg:col-start-7">
              <p className="eyebrow text-ink-muted">{t("styleWords")}</p>
              <p className="display-md mt-3 text-mulberry">{(result.style_words ?? []).join(" · ")}</p>
              <p className="eyebrow mt-8 text-ink-muted">{t("colourMood")}</p>
              <p className="mt-2 font-serif text-lg">{result.colour_mood}</p>
              <PaletteStrip colours={primary.palette} className="mt-4" />
              <p className="eyebrow mt-8 text-ink-muted">{t("silhouette")}</p>
              <p className="mt-2 font-serif text-lg">{result.silhouette_direction}</p>
            </Reveal>
          </div>
        </Container>
      </Section>
      <Section tone="porcelain">
        <Container>
          <Stagger className="grid gap-12 md:grid-cols-3">
            {[
              { title: t("priorities"), items: result.wardrobe_priorities ?? [] },
              { title: t("formulas"), items: (result.outfit_formulas ?? []) as string[] },
              { title: t("experiments"), items: result.experiments ?? [] },
            ].map((col, i) => (
              <StaggerItem key={col.title}>
                <p className="font-display text-xs tracking-[0.2em] text-ink-muted">0{i + 1}</p>
                <h2 className="display-sm mt-2">{col.title}</h2>
                <ul className="mt-5 space-y-3 border-t border-line pt-5 font-serif text-base text-ink-soft">
                  {col.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </Section>
      <Section tone="mulberry">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-12">
            <Reveal className="lg:col-span-7">
              <Eyebrow tone="satin">{t("book")}</Eyebrow>
              <h2 className="display-lg mt-4 text-porcelain">{service ? pick(service.name, current) : ""}</h2>
              <p className="mt-5 max-w-xl font-serif text-lg text-porcelain/80">{t("bookBody")}</p>
              {service ? <p className="mt-4 max-w-xl text-sm text-porcelain/70">{pick(service.short, current)}</p> : null}
            </Reveal>
            <Reveal delay={0.1} className="flex flex-col gap-4 lg:col-span-4 lg:col-start-9">
              {service ? (
                <Button href={`/book?service=${service.slug}&compass=${id}`} variant="ivory" size="lg">
                  {tc("book")}
                </Button>
              ) : null}
              <ShareButton slug={result.share_slug ?? id} label={t("share")} copied={t("copied")} />
              {user ? (
                <p className="text-sm text-porcelain/70">{t("saved")}</p>
              ) : (
                <Button href={`/signup?next=/studio/compass/result/${id}`} variant="ghost" className="border-porcelain/50 text-porcelain hover:bg-porcelain/10">
                  {t("save")}
                </Button>
              )}
              <Button href="/studio/compass" variant="link" className="text-porcelain/70">
                {t("retake")}
              </Button>
            </Reveal>
          </div>
        </Container>
      </Section>
    </>
  );
}
