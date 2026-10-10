"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils/cn";
import { signOut } from "@/lib/actions/auth";

export function AccountNav({ className }: { className?: string }) {
  const t = useTranslations("account.nav");
  const tc = useTranslations("common");
  const pathname = usePathname();
  const items = [
    ["/account", t("overview")],
    ["/account/passport", t("passport")],
    ["/account/wardrobe", t("wardrobe")],
    ["/account/looks", t("looks")],
    ["/account/bookings", t("bookings")],
    ["/account/saves", t("saves")],
    ["/account/notes", t("notes")],
    ["/account/settings", t("settings")],
    ["/account/privacy", t("privacy")],
  ] as const;
  return (
    <nav aria-label={t("overview")} className={cn("flex gap-4 overflow-x-auto scrollbar-none lg:flex-col lg:gap-0 lg:border-t lg:border-line", className)}>
      {items.map(([href, label]) => {
        const active = href === "/account" ? pathname === "/account" : pathname.startsWith(href);
        return (
          <Link key={href} href={href} aria-current={active ? "page" : undefined} className={cn("shrink-0 py-3 text-sm lg:border-b lg:border-line", active ? "text-mulberry" : "text-ink-soft hover:text-ink")}>
            {label}
          </Link>
        );
      })}
      <form action={signOut} className="shrink-0 lg:mt-4">
        <button type="submit" className="py-3 text-sm text-ink-muted hover:text-ink">{tc("signOut")}</button>
      </form>
    </nav>
  );
}
