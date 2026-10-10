import { getTranslations } from "next-intl/server";
import { Section, Container } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Reveal, MaskReveal } from "@/components/motion/reveal";
import { EditorialImage } from "@/components/media/editorial-image";
import { WhatsAppLink } from "@/components/layout/whatsapp";

export async function PrivateConsultation() {
  const t = await getTranslations("home.private");
  const c = await getTranslations("cta");
  return (
    <Section tone="ink" id="private" className="relative overflow-hidden">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <MaskReveal direction="right" className="lg:col-span-6">
            <div className="aspect-[16/10]">
              <EditorialImage id="consultation-chairs" alt={t("alt")} className="h-full w-full" sizes="(min-width:1024px) 50vw, 100vw" />
            </div>
          </MaskReveal>
          <Reveal className="lg:col-span-5 lg:col-start-8">
            <Eyebrow tone="satin">{t("eyebrow")}</Eyebrow>
            <h2 className="display-lg mt-5 text-ivory">
              {t("line1")}
              <br />
              <span className="italic text-satin">{t("line2")}</span>
            </h2>
            <p className="mt-6 max-w-md font-serif text-lg text-ivory/75">{t("body")}</p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Button href="/book" variant="ivory" size="lg">
                {c("bookPrivate")}
              </Button>
              <WhatsAppLink context={{ kind: "choose" }} variant="quiet" className="text-ivory/70 hover:text-ivory" />
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
