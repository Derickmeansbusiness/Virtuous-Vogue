import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container, Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Reveal, MaskReveal, TextReveal } from "@/components/motion/reveal";
import { Parallax } from "@/components/motion/parallax";
import { EditorialImage } from "@/components/media/editorial-image";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: t("about"),
    description: t("aboutDesc"),
    alternates: { canonical: "/about", languages: { en: "/about", fr: "/fr/about" } },
    openGraph: { title: `${t("about")} · Kimbi Rosa`, description: t("aboutDesc"), images: [{ url: "/og/about.jpg", width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", images: ["/og/about.jpg"] },
  };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const c = await getTranslations("cta");
  const approach = t.raw("approach.items") as { title: string; body: string }[];

  return (
    <>
      {/* 01 The Philosophy */}
      <section className="relative isolate flex min-h-[90svh] items-end bg-ink text-ivory">
        <EditorialImage id="hero-03-intentional-elegance" className="absolute inset-0 h-full w-full" sizes="100vw" priority />
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(to_top,rgba(25,24,22,0.75),rgba(25,24,22,0.15)_55%)]" />
        <Container className="relative z-10 pb-20 pt-40">
          <Eyebrow tone="ivory">01 · {t("philosophy.eyebrow")}</Eyebrow>
          <TextReveal as="h1" lines={[t("philosophy.line1"), t("philosophy.line2")]} className="display-xl mt-4 max-w-5xl text-ivory" />
          <Reveal delay={0.4}><p className="mt-6 max-w-xl font-serif text-lg text-ivory/85">{t("philosophy.body")}</p></Reveal>
        </Container>
      </section>

      {/* 02 The Woman Before the Wardrobe */}
      <Section tone="ivory">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-12">
            <MaskReveal className="lg:col-span-5">
              <Parallax amount={24} className="aspect-[3/4]"><EditorialImage id="about-woman-before-wardrobe" className="h-full w-full" sizes="(min-width:1024px) 40vw, 100vw" /></Parallax>
            </MaskReveal>
            <Reveal className="lg:col-span-6 lg:col-start-7">
              <Eyebrow>02 · {t("woman.eyebrow")}</Eyebrow>
              <h2 className="display-lg mt-4">{t("woman.title")}</h2>
              <div className="mt-6 space-y-5 font-serif text-lg text-ink-soft">
                <p>{t("woman.p1")}</p>
                <p>{t("woman.p2")}</p>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* 03 Why Virtuous Vogue Exists */}
      <Section tone="mulberry">
        <Container narrow>
          <Reveal>
            <Eyebrow tone="satin">03 · {t("why.eyebrow")}</Eyebrow>
            <h2 className="display-lg mt-4 text-porcelain">{t("why.title")}</h2>
            <div className="mt-8 space-y-5 font-serif text-lg text-porcelain/85">
              <p>{t("why.p1")}</p>
              <p>{t("why.p2")}</p>
            </div>
            <blockquote className="mt-12 border-l-2 border-satin pl-6 font-display text-3xl italic leading-tight text-porcelain md:text-4xl">
              “{t("why.quote1")}
              <br />
              {t("why.quote2")}”
            </blockquote>
          </Reveal>
        </Container>
      </Section>

      {/* 04 Styling Before Selling */}
      <Section tone="porcelain">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-12">
            <Reveal className="lg:col-span-6">
              <Eyebrow>04 · {t("selling.eyebrow")}</Eyebrow>
              <h2 className="display-lg mt-4">{t("selling.title")}</h2>
              <div className="mt-6 space-y-5 font-serif text-lg text-ink-soft">
                <p>{t("selling.p1")}</p>
                <p>{t("selling.p2")}</p>
              </div>
            </Reveal>
            <MaskReveal direction="left" className="lg:col-span-5 lg:col-start-8">
              <div className="aspect-[4/3]"><EditorialImage id="studio-closet-remix" className="h-full w-full" sizes="(min-width:1024px) 40vw, 100vw" /></div>
            </MaskReveal>
          </div>
        </Container>
      </Section>

      {/* 05 Meet the Founder */}
      <Section tone="ivory">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <MaskReveal>
                <Parallax amount={20} className="aspect-[3/4]">
                  <EditorialImage id="founder-kimbi-rosa" className="h-full w-full" sizes="(min-width:1024px) 40vw, 100vw" />
                </Parallax>
              </MaskReveal>
              <p className="mt-4 font-display text-sm tracking-[0.12em] text-ink">
                {t("founder.name")}
                <span className="block font-sans text-xs tracking-[0.18em] text-ink-muted uppercase">{t("founder.role")}</span>
              </p>
            </div>
            <Reveal className="lg:col-span-6 lg:col-start-7">
              <Eyebrow>05 · {t("founder.eyebrow")}</Eyebrow>
              <h2 className="display-lg mt-4">{t("founder.title")}</h2>
              <div className="mt-6 space-y-5 font-serif text-lg text-ink-soft">
                <p>{t("founder.p1")}</p>
                <p>{t("founder.p2")}</p>
              </div>
              <blockquote className="mt-8 font-display text-2xl italic leading-snug text-mulberry md:text-3xl">
                “{t("founder.quote1")}
                <br />
                {t("founder.quote2")}”
              </blockquote>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* 06 Our Approach */}
      <Section tone="porcelain">
        <Container>
          <Reveal>
            <Eyebrow>06 · {t("approach.eyebrow")}</Eyebrow>
            <h2 className="display-lg mt-4 max-w-3xl">{t("approach.title")}</h2>
          </Reveal>
          <ol className="mt-12 grid gap-10 border-t border-line pt-10 md:grid-cols-2 lg:grid-cols-4">
            {approach.map((a, i) => (
              <Reveal key={a.title} delay={i * 0.06} as="li">
                <p className="font-display text-xs tracking-[0.2em] text-ink-muted">0{i + 1}</p>
                <h3 className="display-sm mt-2">{a.title}</h3>
                <p className="mt-3 text-sm text-ink-soft">{a.body}</p>
              </Reveal>
            ))}
          </ol>
        </Container>
      </Section>

      {/* 07 Virtue Never Goes Out of Style */}
      <section className="relative isolate flex min-h-[70svh] items-center bg-ink text-ivory">
        <EditorialImage id="hero-05-colonnade" className="absolute inset-0 h-full w-full" sizes="100vw" />
        <div aria-hidden className="absolute inset-0 bg-ink/55" />
        <Container className="relative z-10 py-24 text-center">
          <Reveal>
            <Eyebrow tone="ivory">07</Eyebrow>
            <p className="display-xl mt-4 italic text-ivory">Virtue Never Goes Out of Style.</p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button href="/studio/compass" variant="ivory" size="lg">{c("discover")}</Button>
              <Button href="/book" variant="ghost" size="lg" className="border-ivory/50 text-ivory hover:bg-ivory/10">{c("book")}</Button>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
