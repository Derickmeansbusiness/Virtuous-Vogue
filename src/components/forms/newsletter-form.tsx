"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { useActionState } from "react";
import { subscribeToNewsletter, type NewsletterState } from "@/lib/actions/newsletter";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/form";
import { cn } from "@/lib/utils/cn";
import { track } from "@/lib/analytics/client";

const initial: NewsletterState = { status: "idle" };

export function NewsletterForm({ tone = "light", source, className }: { tone?: "light" | "dark"; source: string; className?: string }) {
  const t = useTranslations("newsletter");
  const tc = useTranslations("cta");
  const [state, action, pending] = useActionState(subscribeToNewsletter, initial);
  const id = React.useId();

  React.useEffect(() => {
    if (state.status === "success") track("newsletter_subscribe", { source });
  }, [state.status, source]);

  if (state.status === "success" || state.status === "already") {
    return (
      <p role="status" className={cn("font-serif text-base", tone === "dark" ? "text-ivory" : "text-ink")}>
        {state.status === "success" ? t("success") : t("already")}
      </p>
    );
  }

  const dark = tone === "dark";
  return (
    <form action={action} className={cn("flex flex-col gap-4", className)} noValidate>
      <input type="hidden" name="source" value={source} />
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <div className={cn("flex items-end gap-3 border-b", dark ? "border-ivory/30" : "border-line-strong")}>
        <label htmlFor={id} className="sr-only">
          {t("emailLabel")}
        </label>
        <input
          id={id}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          placeholder={t("placeholder")}
          aria-invalid={state.status === "error" || undefined}
          aria-describedby={state.status === "error" ? `${id}-err` : undefined}
          className={cn(
            "w-full bg-transparent py-3 text-base outline-none placeholder:opacity-60",
            dark ? "text-ivory placeholder:text-ivory" : "text-ink placeholder:text-ink-muted",
          )}
        />
        <Button type="submit" variant={dark ? "ivory" : "primary"} size="sm" loading={pending} disabled={pending} className="mb-1.5 shrink-0">
          {tc("subscribe")}
        </Button>
      </div>
      <Checkbox name="consent" required label={t("consent")} className={dark ? "text-ivory/70" : undefined} />
      {state.status === "error" ? (
        <p id={`${id}-err`} role="alert" className="text-xs text-danger">
          {state.code === "invalid" ? t("invalid") : t("error")}
        </p>
      ) : null}
    </form>
  );
}
