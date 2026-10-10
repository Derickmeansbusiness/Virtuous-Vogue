import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { Section, Container } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { EditorialImage } from "@/components/media/editorial-image";
import { listServices } from "@/lib/domain/services";
import { pick } from "@/content/types";

export async function ServicesPreview() {
  const t = await getTranslations("home.services");
  const locale = await getLocale();
  const services = await listServices();

  return (
    <Section tone="ivory" id="services">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <Eyebrow>{t("eyebrow")}</Eyebrow>
            <h2 className="display-lg mt-5">{t("title")}</h2>
            <p className="mt-6 max-w-sm font-serif text-lg text-ink-soft">{t("body")}</p>
            <p className="eyebrow mt-8 text-ink-muted">{t("format")}</p>
            <div className="mt-10">
              <Button href="/services" variant="secondary">
                {t("viewAll")}
              </Button>
            </div>
          </Reveal>
          <div className="lg:col-span-8">
            <ul className="divide-y divide-line border-y border-line">
              {services.map((s, i) => (
                <li key={s.slug}>
                  <Reveal delay={i * 0.04}>
                    <Link href={{ pathname: "/services/[slug]", params: { slug: s.slug } }} className="group grid grid-cols-[auto_1fr_auto] items-center gap-5 py-6 md:grid-cols-[auto_6rem_1fr_auto] md:gap-8">
                      <span className="font-display text-sm tracking-[0.18em] text-ink-muted">{s.number}</span>
                      <span className="hidden aspect-[3/4] w-24 overflow-hidden md:block">
                        <EditorialImage id={s.image} className="h-full w-full" sizes="96px" />
                      </span>
                      <span>
                        <span className="display-sm block transition-colors group-hover:text-mulberry">{pick(s.name, locale)}</span>
                        <span className="mt-1 block max-w-lg text-sm text-ink-soft">{pick(s.short, locale)}</span>
                        <span className="eyebrow mt-3 block text-ink-muted">
                          {s.durationMinutes} min · {s.priceXaf ? `${s.priceXaf.toLocaleString(locale)} XAF` : t("from")}
                        </span>
                      </span>
                      <ArrowRight className="size-5 text-mulberry transition-transform duration-500 group-hover:translate-x-1" aria-hidden />
                    </Link>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </Section>
  );
}
