import { getTranslations } from "next-intl/server";
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TextReveal, Reveal } from "@/components/motion/reveal";
import { HeroVideo } from "@/components/media/hero-video";
import { getImage, getVideo } from "@/lib/assets";

export async function Hero() {
  const t = await getTranslations("home.hero");
  const c = await getTranslations("cta");
  const desktop = getVideo("hero-video-staircase-wide");
  const mobile = getVideo("hero-video-staircase-mobile");
  const poster = desktop?.poster ?? getImage("hero-06-staircase");
  const mobilePoster = mobile?.poster ?? getImage("hero-06-staircase-mobile");

  return (
    <section className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-ink text-ivory" aria-label="Virtuous Vogue">
      <HeroVideo
        desktop={desktop}
        mobile={mobile}
        poster={poster}
        mobilePoster={mobilePoster}
        alt={t("videoAlt")}
        // On phones, enlarge and slide the film to the right so the model stands clear of the headline.
        mediaClassName="max-md:origin-center max-md:scale-[1.4] max-md:translate-x-[18%] max-md:transform-gpu"
      />
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(to_top,rgba(25,24,22,0.82)_0%,rgba(25,24,22,0.42)_38%,rgba(25,24,22,0.06)_68%,rgba(25,24,22,0.18)_100%)]" />
      <div aria-hidden className="grain absolute inset-0" />
      <div className="container-vv relative z-10 pb-[calc(var(--vv-bottom-nav-h)+2.5rem)] pt-40 lg:pb-24">
        <p className="mb-6 font-display text-lg italic text-ivory/85 md:text-xl">Virtue Never Goes Out of Style.</p>
        <TextReveal as="h1" lines={[t("line1"), t("line2")]} className="display-xl max-w-5xl text-ivory" />
        <Reveal delay={0.4} className="mt-8 max-w-xl">
          <p className="font-serif text-lg leading-relaxed text-ivory/85 md:text-xl">{t("support")}</p>
        </Reveal>
        <Reveal delay={0.55} className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <Button href="/studio/compass" variant="glass" size="lg">
            {c("discover")}
          </Button>
          <Button href="/book" variant="glass" size="lg" className="glass-glitter-soft">
            {c("book")}
          </Button>
        </Reveal>
        <div className="mt-14 hidden items-center gap-3 text-ivory/60 md:flex">
          <ArrowDown className="size-4 animate-bounce [animation-duration:2.2s]" aria-hidden />
          <span className="eyebrow">{t("scroll")}</span>
        </div>
      </div>
    </section>
  );
}
