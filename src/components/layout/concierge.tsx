"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { CalendarCheck, X } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { WhatsAppLink } from "./whatsapp";
import { cn } from "@/lib/utils/cn";

/**
 * Floating concierge button, bottom-right on every public page: a tap opens
 * a small card with the two ways to reach the studio, booking and WhatsApp.
 * Hidden on the booking flow and in the admin cockpit.
 */
export function Concierge() {
  const t = useTranslations("common.concierge");
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const panelId = React.useId();

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (pathname.startsWith("/book") || pathname.startsWith("/admin")) return null;

  return (
    <div
      className="fixed right-4 z-30 flex flex-col items-end gap-3 lg:bottom-6 lg:right-6"
      style={{ bottom: "calc(var(--vv-bottom-nav-h) + env(safe-area-inset-bottom) + 0.75rem)" }}
    >
      <div
        id={panelId}
        role="dialog"
        aria-label={t("title")}
        hidden={!open}
        className={cn(
          "w-[min(20rem,calc(100vw-2rem))] border border-line bg-porcelain p-5 shadow-[0_24px_60px_-20px_rgba(25,24,22,0.45)] transition-[opacity,transform] duration-300 ease-[var(--ease-editorial)]",
          open ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0",
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <p className="display-sm">{t("title")}</p>
          <button type="button" onClick={() => setOpen(false)} aria-label={t("close")} className="-mr-1 -mt-1 p-1 text-ink-muted hover:text-ink">
            <X className="size-4" aria-hidden />
          </button>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">{t("body")}</p>
        <div className="mt-4 flex flex-col gap-2">
          <Link
            href="/book"
            onClick={() => setOpen(false)}
            className="inline-flex items-center justify-center gap-2 border border-mulberry bg-mulberry px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-porcelain hover:bg-mulberry-deep"
          >
            <CalendarCheck className="size-4" aria-hidden />
            {t("book")}
          </Link>
          <WhatsAppLink variant="pill" context={{ kind: "choose" }} label={t("whatsapp")} className="justify-center" />
        </div>
      </div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        data-concierge
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? t("close") : t("open")}
        className={cn(
          "glass-glitter flex size-14 items-center justify-center rounded-full bg-mulberry/85 text-porcelain shadow-[0_18px_40px_-14px_rgba(103,47,64,0.7)] transition-transform duration-300 ease-[var(--ease-editorial)] hover:scale-105 active:scale-95",
          open && "bg-ink/85",
        )}
      >
        {open ? <X className="size-5" aria-hidden /> : <CalendarCheck className="size-5" aria-hidden />}
      </button>
    </div>
  );
}
