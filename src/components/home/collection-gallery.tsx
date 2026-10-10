import { getLocale, getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { EditorialImage } from "@/components/media/editorial-image";
import { collectionChapters, publishedLooks } from "@/content/collection";
import { pick } from "@/content/types";
import { cn } from "@/lib/utils/cn";

/**
 * Homepage gallery of the Signature Edit: an edge-to-edge runway of the
 * published looks that drifts slowly, pauses on hover, and sits still for
 * readers who prefer reduced motion (where it stays scrollable by hand).
 */
export async function CollectionGallery() {
  const t = await getTranslations("home.collection");
  const current = await getLocale();
  const looks = publishedLooks;
  if (looks.length === 0) return null;
  const track = [...looks, ...looks];

  return (
    <section id="collection-gallery" className="relative isolate overflow-hidden bg-ink py-20 text-ivory md:py-28" aria-labelledby="collection-gallery-title">
      <div aria-hidden className="grain absolute inset-0 opacity-60" />
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-satin/50 to-transparent" />
      <Container className="relative">
        <div className="grid items-end gap-8 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <Eyebrow tone="satin">{t("eyebrow")}</Eyebrow>
            <h2 id="collection-gallery-title" className="display-lg mt-5 text-ivory">
              {t("title1")}
              <br />
              <span className="italic text-satin">{t("title2")}</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-5">
            <p className="max-w-md font-serif text-lg leading-relaxed text-ivory/75">{t("body")}</p>
            <Button href="/collection" variant="ivory" size="lg" className="mt-8">
              {t("cta")}
              <ArrowRight className="size-4" aria-hidden />
            </Button>
          </Reveal>
        </div>
      </Container>

      <div className="relative mt-14 md:mt-20">
        <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-ink to-transparent md:w-32" />
        <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-ink to-transparent md:w-32" />
        <div className="overflow-x-auto overflow-y-hidden scrollbar-none motion-safe:overflow-x-hidden">
          <ul className="runway px-5 py-6" style={{ "--runway-duration": `${Math.max(40, looks.length * 7)}s` } as React.CSSProperties}>
            {track.map((look, i) => {
              const dup = i >= looks.length;
              return (
                <li key={`${look.code}-${i}`} aria-hidden={dup || undefined} className={cn("w-[62vw] shrink-0 sm:w-[300px] lg:w-[280px]", i % 2 === 1 && "mt-10 md:mt-14")}>
                  <Link href={`/collection/${look.slug}`} tabIndex={dup ? -1 : undefined} className="group block">
                    <div className="relative aspect-[3/4] overflow-hidden bg-ink-soft">
                      <EditorialImage id={look.image} className="h-full w-full transition-transform duration-[1400ms] ease-[var(--ease-editorial)] group-hover:scale-[1.04]" sizes="(min-width:640px) 300px, 62vw" />
                      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
                      <span className="absolute left-3 top-3 font-display text-[0.6875rem] tracking-[0.22em] text-ivory/90">{look.code}</span>
                      <div className="absolute inset-x-4 bottom-4">
                        <p className="font-display text-xl leading-tight text-ivory">{pick(look.name, current)}</p>
                        <p className="mt-1 translate-y-1 font-serif text-sm italic text-ivory/70 opacity-0 transition-[opacity,transform] duration-500 group-hover:translate-y-0 group-hover:opacity-100">{pick(look.tagline, current)}</p>
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <Container className="relative mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-ivory/15 pt-6">
        <p className="eyebrow text-ivory/60">{t("meta")}</p>
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          {collectionChapters.map((ch) => (
            <li key={ch.slug} className="font-display text-sm italic text-ivory/70">
              <Link href={`/collection#${ch.slug}`} className="hover:text-satin">{pick(ch.title, current)}</Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
