import { getTranslations, setRequestLocale } from "next-intl/server";
import { requireUser } from "@/lib/auth/session";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { AccountNav } from "@/components/account/account-nav";

export default async function AccountLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const user = await requireUser();
  const t = await getTranslations("account");
  return (
    <>
      <Header signedIn isAdmin={user.role === "admin"} tone="light" />
      <main id="main" className="flex-1 bg-ivory pb-safe-nav pt-[var(--vv-header-h)] lg:pb-0">
        <div className="container-vv grid gap-10 py-10 lg:grid-cols-12 lg:py-14">
          <aside className="lg:col-span-3">
            <p className="eyebrow text-mulberry">{t("eyebrow")}</p>
            <p className="display-sm mt-1">{user.name ?? user.email}</p>
            <AccountNav className="mt-6" />
          </aside>
          <div className="lg:col-span-9">{children}</div>
        </div>
      </main>
      <MobileNav />
    </>
  );
}
