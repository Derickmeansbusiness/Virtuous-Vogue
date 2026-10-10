import type { Metadata } from "next";
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container, Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/typography";
import { landingPages } from "@/content/landing";
import { pick } from "@/content/types";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return { title: t("styling") };
}

export default async function StylingIndex({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const current = await getLocale();
  const n = await getTranslations("nav");
  return (
    <Section tone="porcelain" className="pt-[calc(var(--vv-header-h)+2.5rem)]">
      <Container>
        <Eyebrow>{n("styling")}</Eyebrow>
        <ul className="mt-8 divide-y divide-line border-y border-line">
          {landingPages.map((p) => (
            <li key={p.slug}>
              <Link href={`/styling/${p.slug}`} className="group flex items-baseline justify-between gap-6 py-5">
                <span className="display-sm transition-colors group-hover:text-mulberry">{pick(p.title, current)}</span>
                <span className="hidden max-w-md text-sm text-ink-soft md:block">{pick(p.intro, current)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
