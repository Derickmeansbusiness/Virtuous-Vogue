import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { Eyebrow } from "@/components/ui/typography";
import { MagicLinkForm } from "@/components/auth/magic-link-form";
import { getSessionUser } from "@/lib/auth/session";
import { supabaseConfigured } from "@/lib/supabase/env";
import { Notice } from "@/components/ui/form";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return { title: t("login"), robots: { index: false } };
}

export default async function LoginPage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ next?: string; error?: string }> }) {
  const { locale } = await params;
  const { next, error } = await searchParams;
  setRequestLocale(locale);
  const user = await getSessionUser();
  if (user) redirect({ href: next && next.startsWith("/") ? next : "/account", locale });
  const t = await getTranslations("auth");
  return (
    <div>
      <Eyebrow>{t("loginEyebrow")}</Eyebrow>
      <h1 className="display-md mt-3">{t("loginTitle")}</h1>
      <p className="mt-3 font-serif text-base text-ink-soft">{t("loginBody")}</p>
      {error === "link" ? <Notice tone="error" className="mt-6">{t("linkError")}</Notice> : null}
      <div className="mt-8">
        <MagicLinkForm mode="login" next={next} localMode={!supabaseConfigured} />
      </div>
      <p className="mt-8 text-sm text-ink-muted">
        {t("noAccount")}{" "}
        <Link href={{ pathname: "/signup", query: next ? { next } : undefined }} className="text-mulberry underline underline-offset-4">
          {t("createOne")}
        </Link>
      </p>
    </div>
  );
}
