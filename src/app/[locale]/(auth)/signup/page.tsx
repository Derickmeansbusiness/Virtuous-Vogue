import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect, Link } from "@/i18n/navigation";
import { Eyebrow } from "@/components/ui/typography";
import { MagicLinkForm } from "@/components/auth/magic-link-form";
import { getSessionUser } from "@/lib/auth/session";
import { supabaseConfigured } from "@/lib/supabase/env";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return { title: t("signup"), robots: { index: false } };
}

export default async function SignupPage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ next?: string }> }) {
  const { locale } = await params;
  const { next } = await searchParams;
  setRequestLocale(locale);
  const user = await getSessionUser();
  if (user) redirect({ href: "/account", locale });
  const t = await getTranslations("auth");
  const perks = t.raw("perks") as string[];
  return (
    <div>
      <Eyebrow>{t("signupEyebrow")}</Eyebrow>
      <h1 className="display-md mt-3">{t("signupTitle")}</h1>
      <p className="mt-3 font-serif text-base text-ink-soft">{t("signupBody")}</p>
      <ul className="mt-5 space-y-1.5 text-sm text-ink-soft">
        {perks.map((p) => (
          <li key={p} className="flex gap-3">
            <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-mulberry" />
            {p}
          </li>
        ))}
      </ul>
      <div className="mt-8">
        <MagicLinkForm mode="signup" next={next} localMode={!supabaseConfigured} />
      </div>
      <p className="mt-8 text-sm text-ink-muted">
        {t("haveAccount")}{" "}
        <Link href="/login" className="text-mulberry underline underline-offset-4">
          {t("signInInstead")}
        </Link>
      </p>
      <p className="mt-4 text-xs text-ink-muted">{t("terms")}</p>
    </div>
  );
}
