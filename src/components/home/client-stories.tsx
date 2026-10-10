import { getLocale, getTranslations } from "next-intl/server";
import { Section, Container } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { listPublishedTestimonials } from "@/lib/domain/testimonials";

/**
 * Case-study style client stories. Nothing is shown unless a real,
 * consented testimonial has been published from the admin cockpit.
 */
export async function ClientStories() {
  const t = await getTranslations("home.stories");
  const locale = await getLocale();
  const stories = await listPublishedTestimonials();

  return (
    <Section tone="ivory" id="stories">
      <Container>
        <Reveal>
          <Eyebrow>{t("eyebrow")}</Eyebrow>
          <h2 className="display-lg mt-5">{t("title")}</h2>
        </Reveal>
        {stories.length === 0 ? (
          <Reveal delay={0.1} className="mt-12 grid gap-8 border-y border-line py-12 md:grid-cols-12">
            <p className="font-serif text-lg text-ink-soft md:col-span-7">{t("empty")}</p>
            <div className="md:col-span-5 md:text-right">
              <Button href="/book" variant="secondary">
                {t("emptyAction")}
              </Button>
            </div>
          </Reveal>
        ) : (
          <div className="mt-12 grid gap-10 md:grid-cols-2">
            {stories.map((s, i) => (
              <Reveal key={s.id} delay={i * 0.06} as="article" className="border-t border-line pt-6">
                <p className="font-display text-xs tracking-[0.2em] text-ink-muted">VV / {String(i + 1).padStart(2, "0")}</p>
                <blockquote className="mt-4 font-display text-2xl leading-snug text-ink">“{locale === "fr" ? s.quote_fr || s.quote_en : s.quote_en}”</blockquote>
                <p className="mt-5 text-sm text-ink-muted">
                  {s.client_name}
                  {s.context ? ` · ${s.context}` : ""}
                </p>
              </Reveal>
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}
