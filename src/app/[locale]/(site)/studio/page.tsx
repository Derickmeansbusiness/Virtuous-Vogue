import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowUpRight } from "lucide-react";
import { Container, Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { EditorialImage } from "@/components/media/editorial-image";
import { getSessionUser } from "@/lib/auth/session";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return { title: t("studio"), description: t("studioDesc") };
}

export default async function StudioPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("studio.index");
  const h = await getTranslations("home.studio");
  const c = await getTranslations("cta");
  const user = await getSessionUser();
  const tools = [
    { key: "compass", href: "/studio/compass", image: "studio-compass", n: "01", cta: c("discover") },
    { key: "colour", href: "/studio/colour-lens", image: "studio-colour-lens", n: "02", cta: c("exploreColours") },
    { key: "remix", href: "/studio/closet-remix", image: "studio-closet-remix", n: "03", cta: c("remixMyCloset") },
  ] as const;

  return (
    <>
      <Section tone="porcelain" className="pt-[calc(var(--vv-header-h)+3rem)] pb-16">
        <Container>
          <Reveal className="max-w-3xl">
            <Eyebrow>{t("eyebrow")}</Eyebrow>
            <h1 className="display-xl mt-4">{t("title")}</h1>
            <p className="mt-6 font-serif text-lg text-ink-soft">{t("body")}</p>
            <p className="eyebrow mt-6 text-ink-muted">{user ? t("note") : t("anonymous")}</p>
          </Reveal>
        </Container>
      </Section>
      <Section tone="ivory" className="pt-0">
        <Container>
          <Stagger className="divide-y divide-line border-y border-line">
            {tools.map((tool, i) => (
              <StaggerItem key={tool.key}>
                <Link
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  href={tool.href as any}
                  className={`group grid items-center gap-8 py-10 md:grid-cols-12 ${i % 2 ? "md:[&>*:first-child]:order-2" : ""}`}
                >
                  <div className="md:col-span-5">
                    <div className="aspect-[4/3] overflow-hidden fabric-hover">
                      <EditorialImage id={tool.image} className="h-full w-full" sizes="(min-width:768px) 40vw, 100vw" />
                    </div>
                  </div>
                  <div className="md:col-span-6 md:col-start-7">
                    <p className="font-display text-xs tracking-[0.2em] text-ink-muted">VV / {tool.n}</p>
                    <h2 className="display-md mt-3 transition-colors group-hover:text-mulberry">{h(`${tool.key}.title`)}</h2>
                    <p className="mt-3 max-w-md font-serif text-lg text-ink-soft">{h(`${tool.key}.body`)}</p>
                    <p className="eyebrow mt-4 text-ink-muted">{h(`${tool.key}.meta`)}</p>
                    <span className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-mulberry">
                      {tool.cta} <ArrowUpRight className="size-4" aria-hidden />
                    </span>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
          <Reveal className="mt-14 grid items-center gap-8 md:grid-cols-12">
            <div className="md:col-span-4">
              <div className="aspect-[4/3]">
                <EditorialImage id="studio-passport" className="h-full w-full" sizes="(min-width:768px) 33vw, 100vw" />
              </div>
            </div>
            <div className="md:col-span-7 md:col-start-6">
              <p className="font-display text-xs tracking-[0.2em] text-ink-muted">VV / 04</p>
              <h2 className="display-md mt-3">{h("passport.title")}</h2>
              <p className="mt-3 max-w-md font-serif text-lg text-ink-soft">{h("passport.body")}</p>
              <div className="mt-6">
                <Button href={user ? "/account" : "/signup"} variant="secondary">
                  {user ? c("passport") : h("passport.title")}
                </Button>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
