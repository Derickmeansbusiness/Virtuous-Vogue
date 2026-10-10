"use client";

import { useActionState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { requestMagicLink, type AuthState } from "@/lib/actions/auth";
import { Field, Input, Notice } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

const initial: AuthState = { status: "idle" };

export function MagicLinkForm({ mode, next, localMode }: { mode: "login" | "signup"; next?: string; localMode: boolean }) {
  const t = useTranslations("auth");
  const locale = useLocale();
  const [state, action, pending] = useActionState(requestMagicLink, initial);

  if (state.status === "sent") {
    return (
      <Notice tone="success">
        <p className="font-semibold">{t("sentTitle")}</p>
        <p className="mt-1">{t("sentBody", { email: state.email })}</p>
      </Notice>
    );
  }

  return (
    <form action={action} className="space-y-6" noValidate>
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="next" value={next ?? "/account"} />
      {mode === "signup" ? (
        <Field label={t("name")} htmlFor="full_name">
          <Input id="full_name" name="full_name" autoComplete="name" maxLength={120} />
        </Field>
      ) : null}
      <Field label={t("email")} htmlFor="email" required error={state.status === "error" && state.code === "invalid" ? t("invalidEmail") : undefined}>
        <Input id="email" name="email" type="email" inputMode="email" autoComplete="email" required />
      </Field>
      {state.status === "error" && state.code !== "invalid" ? <Notice tone="error">{t(state.code === "rate" ? "rate" : "serverError")}</Notice> : null}
      <Button type="submit" size="lg" className="w-full" loading={pending} disabled={pending}>
        {localMode ? t("continueLocal") : t("sendLink")}
      </Button>
      <p className="text-xs text-ink-muted">{localMode ? t("localNote") : t("linkNote")}</p>
    </form>
  );
}
