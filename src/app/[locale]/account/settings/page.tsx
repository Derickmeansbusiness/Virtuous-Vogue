import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { requireUser } from "@/lib/auth/session";
import { getAdminStore } from "@/lib/data/store";
import { SettingsForm } from "@/components/account/settings-form";

export const metadata: Metadata = { title: "Account", robots: { index: false } };

export default async function SettingsPage() {
  const user = await requireUser();
  const t = await getTranslations("account.settings");
  type P = { full_name?: string | null; phone?: string | null; whatsapp?: string | null; city?: string | null; locale?: string; marketing_consent?: boolean };
  const profile: P = (await getAdminStore().get<P>("profiles", user.id)) ?? {};
  return (
    <div className="space-y-8">
      <header><h1 className="display-lg">{t("title")}</h1></header>
      <SettingsForm email={user.email} profile={{ full_name: profile.full_name ?? user.name ?? "", phone: profile.phone ?? "", whatsapp: profile.whatsapp ?? "", city: profile.city ?? "", locale: profile.locale ?? "en", marketing_consent: Boolean(profile.marketing_consent) }} />
    </div>
  );
}
