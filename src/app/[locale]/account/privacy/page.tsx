import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { requireUser } from "@/lib/auth/session";
import { PrivacyControls } from "@/components/account/privacy-controls";

export const metadata: Metadata = { title: "Privacy", robots: { index: false } };

export default async function PrivacyPage() {
  await requireUser();
  const t = await getTranslations("account.privacy");
  return (
    <div className="space-y-8">
      <header><h1 className="display-lg">{t("title")}</h1><p className="mt-2 font-serif text-lg text-ink-soft">{t("body")}</p></header>
      <PrivacyControls />
    </div>
  );
}
