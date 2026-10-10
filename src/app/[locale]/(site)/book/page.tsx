import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container, Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/typography";
import { BookingFlow } from "@/components/booking/booking-flow";
import { SITE } from "@/lib/site";
import { listServices } from "@/lib/domain/services";
import { paymentOptions } from "@/lib/actions/booking";
import { getSessionUser } from "@/lib/auth/session";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return { title: t("book"), description: t("bookDesc") };
}

export default async function BookPage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ service?: string; compass?: string; outfit?: string; occasion?: string }> }) {
  const { locale } = await params;
  const sp = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations("booking");
  const [services, options, user] = await Promise.all([listServices(), paymentOptions("XAF"), getSessionUser()]);
  return (
    <Section tone="ivory" className="pt-[calc(var(--vv-header-h)+2.5rem)]">
      <Container>
        <Eyebrow>{t("eyebrow")}</Eyebrow>
        <h1 className="display-lg mt-3 max-w-3xl">{t("title")}</h1>
        <div className="mt-10">
          <BookingFlow mode={SITE.bookingMode} services={services} initialService={services.some((s) => s.slug === sp.service) ? sp.service : undefined} methods={options.methods} user={user ? { name: user.name, email: user.email } : null} compassId={sp.compass} outfitId={sp.outfit} occasion={sp.occasion} />
        </div>
      </Container>
    </Section>
  );
}
