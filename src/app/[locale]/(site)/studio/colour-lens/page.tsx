import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container, Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/typography";
import { Reveal } from "@/components/motion/reveal";
import { EditorialImage } from "@/components/media/editorial-image";
import { ColourLens } from "@/components/studio/colour-lens";
import { getSessionUser } from "@/lib/auth/session";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "studio.colour" });
  return { title: t("eyebrow"), description: t("intro") };
}

export default async function ColourLensPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("studio.colour");
  const user = await getSessionUser();
  return (
    <>
      <Section tone="porcelain" className="pt-[calc(var(--vv-header-h)+3rem)] pb-12 md:pb-16">
        <Container>
          <div className="grid items-end gap-8 lg:grid-cols-12">
            <Reveal className="lg:col-span-7">
              <Eyebrow>VV / {t("eyebrow")}</Eyebrow>
              <h1 className="display-lg mt-4">{t("title")}</h1>
              <p className="mt-5 max-w-xl font-serif text-lg text-ink-soft">{t("intro")}</p>
              <span className="eyebrow mt-6 inline-block border border-mulberry px-2 py-1 text-mulberry">{t("badge")}</span>
            </Reveal>
            <Reveal delay={0.1} className="lg:col-span-5">
              <div className="aspect-[4/3]">
                <EditorialImage id="studio-colour-lens" className="h-full w-full" sizes="(min-width:1024px) 40vw, 100vw" />
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>
      <Section tone="ivory">
        <Container>
          <ColourLens signedIn={Boolean(user)} />
        </Container>
      </Section>
    </>
  );
}
