import { getTranslations } from "next-intl/server";
import { Section, Container } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/typography";
import { Reveal, MaskReveal } from "@/components/motion/reveal";
import { EditorialImage } from "@/components/media/editorial-image";
import { NewsletterForm } from "@/components/forms/newsletter-form";

export async function NewsletterSection() {
  const t = await getTranslations("home.newsletter");
  return (
    <Section tone="porcelain" id="newsletter">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-6">
            <Eyebrow>{t("eyebrow")}</Eyebrow>
            <h2 className="display-md mt-5 max-w-xl">{t("title")}</h2>
            <p className="mt-4 max-w-md text-sm text-ink-muted">{t("body")}</p>
            <div className="mt-8 max-w-md">
              <NewsletterForm source="home" />
            </div>
          </Reveal>
          <MaskReveal direction="left" className="lg:col-span-5 lg:col-start-8">
            <div className="aspect-[3/2]">
              <EditorialImage id="brand-newsletter-letter" alt={t("alt")} className="h-full w-full" sizes="(min-width:1024px) 40vw, 100vw" />
            </div>
          </MaskReveal>
        </div>
      </Container>
    </Section>
  );
}
