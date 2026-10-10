"use client";

import { useActionState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { submitLead, type LeadState } from "@/lib/actions/leads";
import { Field, Input, Notice, Select, Textarea, Checkbox } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

const initial: LeadState = { status: "idle" };

export function ContactForm({ defaultTopic }: { defaultTopic?: string }) {
  const t = useTranslations("contact");
  const locale = useLocale();
  const [state, action, pending] = useActionState(submitLead, initial);
  const topics = ["consultation", "styling", "press", "collaboration", "other"] as const;
  if (state.status === "success") return <Notice tone="success"><p className="font-semibold">{t("sentTitle")}</p><p className="mt-1">{t("sentBody")}</p></Notice>;
  return (
    <form action={action} className="space-y-6" noValidate>
      <input type="hidden" name="locale" value={locale} />
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label={t("name")} htmlFor="c-name" required><Input id="c-name" name="name" autoComplete="name" required maxLength={120} /></Field>
        <Field label={t("email")} htmlFor="c-email" required error={state.status === "error" && state.code === "invalid" ? t("invalid") : undefined}><Input id="c-email" name="email" type="email" autoComplete="email" required /></Field>
        <Field label={t("phone")} htmlFor="c-phone"><Input id="c-phone" name="phone" type="tel" autoComplete="tel" maxLength={32} /></Field>
        <Field label={t("topic")} htmlFor="c-topic">
          <Select id="c-topic" name="topic" defaultValue={topics.includes(defaultTopic as (typeof topics)[number]) ? defaultTopic : "consultation"}>
            {topics.map((x) => <option key={x} value={x}>{t(`topics.${x}`)}</option>)}
          </Select>
        </Field>
      </div>
      <Field label={t("message")} htmlFor="c-message" required><Textarea id="c-message" name="message" required maxLength={3000} /></Field>
      <Checkbox name="consent" required label={t("consent")} />
      {state.status === "error" && state.code !== "invalid" ? <Notice tone="error">{t("error")}</Notice> : null}
      <Button type="submit" size="lg" loading={pending} disabled={pending}>{t("send")}</Button>
    </form>
  );
}
