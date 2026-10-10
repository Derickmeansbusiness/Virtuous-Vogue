import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container, Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/typography";
import { Reveal, MaskReveal } from "@/components/motion/reveal";
import { EditorialImage } from "@/components/media/editorial-image";
import { ContactForm } from "@/components/forms/contact-form";
import { WhatsAppLink } from "@/components/layout/whatsapp";
import { SITE } from "@/lib/site";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return { title: t("contact"), description: t("contactDesc") };
}

export default async function ContactPage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ topic?: string }> }) {
  const { locale } = await params;
  const { topic } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations("contact");
  return (
    <Section tone="ivory" className="pt-[calc(var(--vv-header-h)+2.5rem)]">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <Eyebrow>{t("eyebrow")}</Eyebrow>
            <h1 className="display-lg mt-3">{t("title")}</h1>
            <p className="mt-5 font-serif text-lg text-ink-soft">{t("body")}</p>
            <dl className="mt-8 space-y-4 border-t border-line pt-6 text-sm">
              <div><dt className="eyebrow text-ink-muted">{t("studio")}</dt><dd className="mt-1">{SITE.city}, {SITE.country} · {t("virtualNote")}</dd></div>
              {SITE.contactEmail ? <div><dt className="eyebrow text-ink-muted">Email</dt><dd className="mt-1"><a href={`mailto:${SITE.contactEmail}`} className="hover:text-mulberry">{SITE.contactEmail}</a></dd></div> : null}
              {SITE.whatsappNumber ? <div><dt className="eyebrow text-ink-muted">WhatsApp</dt><dd className="mt-1"><WhatsAppLink context={{ kind: "generic" }} /></dd></div> : null}
              <div><dt className="eyebrow text-ink-muted">{t("hours")}</dt><dd className="mt-1">{t("hoursValue")}</dd></div>
            </dl>
            <MaskReveal className="mt-10 hidden lg:block">
              <div className="aspect-[3/2]"><EditorialImage id="brand-seal-card" className="h-full w-full" sizes="40vw" /></div>
            </MaskReveal>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-6 lg:col-start-7">
            <ContactForm defaultTopic={topic} />
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
