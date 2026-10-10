"use client";

import { useTranslations } from "next-intl";
import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { SITE } from "@/lib/site";
import { track } from "@/lib/analytics/client";

export type WhatsAppContext =
  | { kind: "generic" }
  | { kind: "service"; service: string }
  | { kind: "choose" }
  | { kind: "outfit"; outfitName?: string }
  | { kind: "article"; title: string }
  | { kind: "look"; code: string; name: string };

export function buildWhatsAppHref(message: string, number = SITE.whatsappNumber) {
  const digits = number.replace(/[^\d]/g, "");
  const text = encodeURIComponent(message);
  return digits ? `https://wa.me/${digits}?text=${text}` : "";
}

export function WhatsAppLink({
  context = { kind: "generic" },
  className,
  variant = "quiet",
  label,
}: {
  context?: WhatsAppContext;
  className?: string;
  variant?: "quiet" | "pill" | "inline";
  label?: string;
}) {
  const t = useTranslations("whatsapp");
  let message = t("generic");
  if (context.kind === "service") message = t("service", { service: context.service });
  if (context.kind === "choose") message = t("chooseConsultation");
  if (context.kind === "look") message = t("look", { code: context.code, name: context.name });
  if (context.kind === "outfit")
    message = `${t("outfit")}${context.outfitName ? ` (${context.outfitName})` : ""}`;
  if (context.kind === "article") message = t("article", { title: context.title });
  const href = buildWhatsAppHref(message);
  const text = label ?? message;

  if (!href) {
    return null;
  }

  const styles = {
    quiet:
      "inline-flex items-center gap-2 text-sm text-ink-soft underline-offset-4 hover:text-mulberry hover:underline",
    inline: "inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-mulberry",
    pill:
      "inline-flex items-center gap-2 border border-line-strong bg-porcelain px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-ink hover:border-ink",
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(styles[variant], className)}
      onClick={() => track("whatsapp_click", { context: context.kind })}
      aria-label={`${t("label")}: ${text}`}
    >
      <MessageCircle className="size-4" aria-hidden />
      <span>{text}</span>
    </a>
  );
}
