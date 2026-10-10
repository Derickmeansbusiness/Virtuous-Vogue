import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { fontVariables } from "@/lib/fonts";
import { SITE } from "@/lib/site";
import { Analytics } from "@/components/layout/analytics";
import { ServiceWorker } from "@/components/layout/service-worker";
import { MotionProvider } from "@/components/motion/motion-provider";
import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    metadataBase: new URL(SITE.url),
    title: {
      default: t("defaultTitle"),
      template: `%s · ${SITE.name}`,
    },
    description: t("defaultDescription"),
    applicationName: SITE.name,
    manifest: "/manifest.webmanifest",
    openGraph: {
      type: "website",
      siteName: SITE.name,
      title: t("shareTitle"),
      description: t("shareDescription"),
      locale: locale === "fr" ? "fr_CM" : "en_GB",
      images: [{ url: "/og/virtuous-vogue.jpg", width: 1200, height: 630, alt: t("shareTitle") }],
    },
    twitter: { card: "summary_large_image", title: t("shareTitle"), description: t("shareDescription"), images: ["/og/virtuous-vogue.jpg"] },
    alternates: {
      canonical: "/",
      languages: { en: "/", fr: "/fr" },
    },
    icons: { icon: [{ url: "/icons/favicon-32.png", sizes: "32x32" }, { url: "/icons/favicon-64.png", sizes: "64x64" }], apple: "/icons/apple-touch-icon.png" },
  };
}

export const viewport: Viewport = {
  themeColor: "#F4EFE7",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <html lang={locale} className={`${fontVariables} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <NextIntlClientProvider>
          <MotionProvider>{children}</MotionProvider>
          <ServiceWorker />
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
