import { getTranslations } from "next-intl/server";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Section, Container } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { EditorialImage } from "@/components/media/editorial-image";

export async function StudioIntro() {
  const t = await getTranslations("home.studio");
  const c = await getTranslations("cta");
  const cards = [
    { key: "compass", href: "/studio/compass", image: "studio-compass", n: "01" },
    { key: "colour", href: "/studio/colour-lens", image: "studio-colour-lens", n: "02" },
    { key: "remix", href: "/studio/closet-remix", image: "studio-closet-remix", n: "03" },
  ] as const;

  return (
    <Section tone="porcelain" id="studio">
      <Container>
        <Reveal className="max-w-2xl">
          <Eyebrow>{t("eyebrow")}</Eyebrow>
          <h2 className="display-lg mt-5">{t("title")}</h2>
          <p className="mt-6 font-serif text-lg text-ink-soft">{t("body")}</p>
        </Reveal>
        <Stagger className="mt-14 grid gap-6 md:grid-cols-3 md:gap-5">
          {cards.map((card) => (
            <StaggerItem key={card.key}>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <Link href={card.href as any} className="group fabric-hover block">
                <div className="aspect-[4/3] overflow-hidden">
                  <EditorialImage id={card.image} className="h-full w-full" sizes="(min-width:768px) 33vw, 100vw" />
                </div>
                <div className="flex items-start justify-between gap-4 border-b border-line pt-5 pb-5">
                  <div>
                    <p className="font-display text-xs tracking-[0.2em] text-ink-muted">VV / {card.n}</p>
                    <h3 className="display-sm mt-2">{t(`${card.key}.title`)}</h3>
                    <p className="mt-2 text-sm text-ink-soft">{t(`${card.key}.body`)}</p>
                    <p className="eyebrow mt-3 text-ink-muted">{t(`${card.key}.meta`)}</p>
                  </div>
                  <ArrowUpRight className="mt-1 size-5 shrink-0 text-mulberry transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
        <Reveal className="mt-12">
          <Button href="/studio" size="lg">
            {c("enterStudio")}
          </Button>
        </Reveal>
      </Container>
    </Section>
  );
}
