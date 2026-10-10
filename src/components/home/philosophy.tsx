import { getTranslations } from "next-intl/server";
import { Section, Container } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/typography";
import { Reveal, MaskReveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { Parallax } from "@/components/motion/parallax";
import { EditorialImage } from "@/components/media/editorial-image";

export async function Philosophy() {
  const t = await getTranslations("home.philosophy");
  const pillars = t.raw("pillars") as { title: string; body: string }[];

  return (
    <Section tone="ivory" id="philosophy" className="overflow-hidden">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <Reveal>
              <Eyebrow>{t("eyebrow")}</Eyebrow>
              <h2 className="display-lg mt-5">
                {t("title1")}
                <br />
                <span className="italic text-mulberry">{t("title2")}</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1} className="mt-10 max-w-md space-y-6 font-serif text-lg leading-relaxed text-ink-soft">
              <p>{t("p1")}</p>
              <p>{t("p2")}</p>
            </Reveal>
            <Stagger className="mt-12 grid grid-cols-3 gap-4 border-t border-line pt-8">
              {pillars.map((p, i) => (
                <StaggerItem key={p.title}>
                  <p className="font-display text-sm tracking-[0.18em] text-ink-muted">0{i + 1}</p>
                  <p className="mt-2 font-display text-xl">{p.title}</p>
                  <p className="mt-2 text-xs leading-relaxed text-ink-muted">{p.body}</p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
          <div className="relative lg:col-span-7">
            <div className="grid grid-cols-12 gap-3 md:gap-5">
              <MaskReveal direction="up" className="col-span-7 col-start-1">
                <Parallax amount={28} className="aspect-[3/4]">
                  <EditorialImage id="philosophy-wardrobe" alt={t("alt1")} className="h-full w-full" sizes="(min-width:1024px) 35vw, 58vw" />
                </Parallax>
              </MaskReveal>
              <MaskReveal direction="left" delay={0.15} className="col-span-5 col-start-8 mt-16 md:mt-28">
                <Parallax amount={-20} className="aspect-square">
                  <EditorialImage id="philosophy-hands" alt={t("alt3")} className="h-full w-full" sizes="(min-width:1024px) 25vw, 40vw" />
                </Parallax>
              </MaskReveal>
              <MaskReveal direction="right" delay={0.1} className="col-span-6 col-start-2 -mt-6 md:-mt-10">
                <Parallax amount={18} className="aspect-[4/3]">
                  <EditorialImage id="philosophy-mirror" alt={t("alt2")} className="h-full w-full" sizes="(min-width:1024px) 30vw, 50vw" />
                </Parallax>
              </MaskReveal>
              <MaskReveal direction="up" delay={0.2} className="col-span-5 col-start-8 -mt-10 md:-mt-16">
                <Parallax amount={-26} className="aspect-[3/2]">
                  <EditorialImage id="philosophy-city-walk" alt={t("alt4")} className="h-full w-full" sizes="(min-width:1024px) 25vw, 40vw" />
                </Parallax>
              </MaskReveal>
            </div>
            <Reveal delay={0.3} className="mt-10 lg:absolute lg:-bottom-6 lg:left-0 lg:max-w-sm">
              <blockquote className="font-display text-2xl italic leading-snug text-mulberry md:text-3xl">“{t("quote")}”</blockquote>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}
