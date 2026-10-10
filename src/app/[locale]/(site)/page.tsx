import type { Metadata } from "next";
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/home/hero";
import { Philosophy } from "@/components/home/philosophy";
import { CollectionGallery } from "@/components/home/collection-gallery";
import { StudioIntro } from "@/components/home/studio-intro";
import { ServicesPreview } from "@/components/home/services-preview";
import { ClosetRemixPreview } from "@/components/home/closet-remix-preview";
import { MagazinePreview } from "@/components/home/magazine-preview";
import { PrivateConsultation } from "@/components/home/private-consultation";
import { ClientStories } from "@/components/home/client-stories";
import { NewsletterSection } from "@/components/home/newsletter-section";
import { JsonLd, organizationSchema, websiteSchema } from "@/lib/seo/json-ld";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return { title: { absolute: t("home") }, description: t("defaultDescription") };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const current = await getLocale();
  return (
    <>
      <JsonLd data={[organizationSchema(), websiteSchema()]} />
      <Hero />
      <Philosophy />
      <CollectionGallery />
      <StudioIntro />
      <ServicesPreview />
      <ClosetRemixPreview locale={current} />
      <MagazinePreview />
      <PrivateConsultation />
      <ClientStories />
      <NewsletterSection />
    </>
  );
}
