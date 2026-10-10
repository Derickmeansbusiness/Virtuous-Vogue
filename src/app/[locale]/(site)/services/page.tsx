import type { Metadata } from "next";
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { Container, Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Reveal, MaskReveal } from "@/components/motion/reveal";
import { EditorialImage } from "@/components/media/editorial-image";
import { WhatsAppLink } from "@/components/layout/whatsapp";
import { listServices } from "@/lib/domain/services";
import { pick } from "@/content/types";
import { faqs } from "@/content/authors";
import { JsonLd, breadcrumbSchema, serviceSchema } from "@/lib/seo/json-ld";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: t("services"),
    description: t("servicesDesc"),
    alternates: { canonical: "/services", languages: { en: "/services", fr: "/fr/services" } },
    openGraph: { title: t("services"), description: t("servicesDesc"), images: [{ url: "/og/consultations.jpg", width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", images: ["/og/consultations.jpg"] },
  };
}

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("services");
  const h = await getTranslations("home.services");
  const c = await getTranslations("cta");
  const current = await getLocale();
  const services = await listServices();

  return (
    <>
      <JsonLd data={[breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Consultations", path: "/services" }]), ...services.map((s) => serviceSchema({ name: s.name.en, description: s.short.en, slug: s.slug, durationMinutes: s.durationMinutes, priceXaf: s.priceXaf }))]} />
      <section className="relative isolate flex min-h-[70svh] items-end bg-ink text-ivory">
        <EditorialImage id="hero-04-column-dress" className="absolute inset-0 h-full w-full" sizes="100vw" priority />
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(to_top,rgba(25,24,22,0.7),rgba(25,24,22,0.1)_60%)]" />
        <Container className="relative z-10 pb-16 pt-40">
          <Reveal>
            <Eyebrow tone="ivory">{t("eyebrow")}</Eyebrow>
            <h1 className="display-xl mt-4 max-w-4xl">{t("title")}</h1>
            <p className="mt-6 max-w-xl font-serif text-lg text-ivory/85">{t("intro")}</p>
          </Reveal>
        </Container>
      </section>

      <Section tone="ivory">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <Reveal className="lg:col-span-4">
              <h2 className="display-md">{t("howTitle")}</h2>
              <ol className="mt-6 space-y-5 border-t border-line pt-6">
                {(t.raw("how") as { title: string; body: string }[]).map((step, i) => (
                  <li key={step.title} className="flex gap-4">
                    <span className="font-display text-xs tracking-[0.2em] text-ink-muted">0{i + 1}</span>
                    <div>
                      <p className="font-display text-lg">{step.title}</p>
                      <p className="mt-1 text-sm text-ink-soft">{step.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="mt-8 flex flex-col gap-3">
                <Button href="/book">{c("book")}</Button>
                <WhatsAppLink context={{ kind: "choose" }} />
              </div>
            </Reveal>
            <div className="space-y-16 lg:col-span-7 lg:col-start-6">
              {services.map((s, i) => (
                <article key={s.slug} className={`grid gap-6 md:grid-cols-12 ${i % 2 ? "md:[&>*:first-child]:order-2" : ""}`}>
                  <MaskReveal direction={i % 2 ? "left" : "right"} className="md:col-span-5">
                    <Link href={`/services/${s.slug}`} className="fabric-hover block">
                      <div className="aspect-[3/4]">
                        <EditorialImage id={s.image} className="h-full w-full" sizes="(min-width:768px) 30vw, 100vw" />
                      </div>
                    </Link>
                  </MaskReveal>
                  <Reveal delay={0.1} className="flex flex-col justify-center md:col-span-7">
                    <p className="font-display text-xs tracking-[0.2em] text-ink-muted">VV / {s.number}</p>
                    <h3 className="display-md mt-2">
                      <Link href={`/services/${s.slug}`} className="hover:text-mulberry">
                        {pick(s.name, current)}
                      </Link>
                    </h3>
                    <p className="mt-3 font-serif text-base text-ink-soft">{pick(s.short, current)}</p>
                    <p className="eyebrow mt-4 text-ink-muted">
                      {s.durationMinutes} min · {s.formats.map((f) => t(`formats.${f}`)).join(" / ")} · {s.priceXaf ? `${s.priceXaf.toLocaleString(current)} XAF` : h("from")}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-4">
                      <Link href={`/services/${s.slug}`} className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-mulberry">
                        {t("details")} <ArrowRight className="size-4" aria-hidden />
                      </Link>
                      <Link href={{ pathname: "/book", query: { service: s.slug } }} className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-ink hover:text-mulberry">
                        {c("book")}
                      </Link>
                    </div>
                  </Reveal>
                </article>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="porcelain">
        <Container narrow>
          <Reveal>
            <Eyebrow>FAQ</Eyebrow>
            <h2 className="display-md mt-4">{t("faqTitle")}</h2>
          </Reveal>
          <dl className="mt-10 divide-y divide-line border-y border-line">
            {faqs.filter((f) => f.group === "general" || f.group === "booking").map((f) => (
              <div key={f.q.en} className="grid gap-3 py-6 md:grid-cols-12">
                <dt className="font-display text-xl md:col-span-5">{pick(f.q, current)}</dt>
                <dd className="font-serif text-base text-ink-soft md:col-span-7">{pick(f.a, current)}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </Section>
    </>
  );
}
