import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container, Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/typography";
import { Reveal, MaskReveal } from "@/components/motion/reveal";
import { EditorialImage } from "@/components/media/editorial-image";
import { NewsletterForm } from "@/components/forms/newsletter-form";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return { title: t("newsletter"), description: t("newsletterDesc") };
}

export default async function NewsletterPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home.newsletter");
  const f = await getTranslations("footer");
  return (
    <Section tone="ivory" className="pt-[calc(var(--vv-header-h)+2.5rem)]">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-6">
            <Eyebrow>{t("eyebrow")}</Eyebrow>
            <h1 className="display-lg mt-3">{t("title")}</h1>
            <p className="mt-5 max-w-md font-serif text-lg text-ink-soft">{f("newsletterBody")}</p>
            <div className="mt-8 max-w-md"><NewsletterForm source="newsletter-page" /></div>
          </Reveal>
          <MaskReveal direction="left" className="lg:col-span-5 lg:col-start-8">
            <div className="aspect-[3/2]"><EditorialImage id="brand-newsletter-letter" alt={t("alt")} className="h-full w-full" sizes="(min-width:1024px) 40vw, 100vw" /></div>
          </MaskReveal>
        </div>
      </Container>
    </Section>
  );
}
