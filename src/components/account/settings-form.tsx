"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { updateProfile, type ProfileState } from "@/lib/actions/profile";
import { Field, Input, Select, Checkbox, Notice } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

const initial: ProfileState = { status: "idle" };

export function SettingsForm({ email, profile }: { email: string; profile: { full_name: string; phone: string; whatsapp: string; city: string; locale: string; marketing_consent: boolean } }) {
  const t = useTranslations("account.settings");
  const tc = useTranslations("common");
  const [state, action, pending] = useActionState(updateProfile, initial);
  return (
    <form action={action} className="max-w-xl space-y-6">
      <Field label={t("email")} htmlFor="s-email"><Input id="s-email" value={email} readOnly disabled /></Field>
      <Field label={t("name")} htmlFor="s-name"><Input id="s-name" name="full_name" defaultValue={profile.full_name} maxLength={120} autoComplete="name" /></Field>
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label={t("phone")} htmlFor="s-phone"><Input id="s-phone" name="phone" type="tel" defaultValue={profile.phone} maxLength={32} /></Field>
        <Field label="WhatsApp" htmlFor="s-wa"><Input id="s-wa" name="whatsapp" type="tel" defaultValue={profile.whatsapp} maxLength={32} /></Field>
        <Field label={t("city")} htmlFor="s-city"><Input id="s-city" name="city" defaultValue={profile.city} maxLength={80} /></Field>
        <Field label={tc("language")} htmlFor="s-locale"><Select id="s-locale" name="locale" defaultValue={profile.locale}><option value="en">{tc("english")}</option><option value="fr">{tc("french")}</option></Select></Field>
      </div>
      <Checkbox name="marketing_consent" defaultChecked={profile.marketing_consent} label={t("marketing")} />
      {state.status === "success" ? <Notice tone="success">{t("saved")}</Notice> : null}
      {state.status === "error" ? <Notice tone="error">{tc("errorBody")}</Notice> : null}
      <Button type="submit" loading={pending} disabled={pending}>{tc("save")}</Button>
    </form>
  );
}
