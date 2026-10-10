"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Home, Compass, Shirt, BookOpen, User, LogIn } from "lucide-react";
import { cn } from "@/lib/utils/cn";

/**
 * Floating glass dock on phones and tablets, for every visitor: Home, Studio,
 * Collection, Magazine and either the Style Passport or Sign in. Booking lives
 * in the Concierge button so the dock stays about moving around the house.
 */
export function MobileNav({ signedIn = false }: { signedIn?: boolean }) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const items = [
    { href: "/", label: t("home"), icon: Home, match: (p: string) => p === "/" },
    { href: "/studio", label: t("studioShort"), icon: Compass, match: (p: string) => p.startsWith("/studio") },
    { href: "/collection", label: t("collectionShort"), icon: Shirt, match: (p: string) => p.startsWith("/collection") },
    { href: "/magazine", label: t("magazine"), icon: BookOpen, match: (p: string) => p.startsWith("/magazine") },
    signedIn
      ? { href: "/account", label: t("account"), icon: User, match: (p: string) => p.startsWith("/account") }
      : { href: "/login", label: t("signIn"), icon: LogIn, match: (p: string) => p.startsWith("/login") || p.startsWith("/signup") },
  ];
  return (
    <nav
      aria-label="Mobile primary"
      className="fixed inset-x-3 z-30 lg:hidden"
      style={{ bottom: "calc(env(safe-area-inset-bottom) + 0.75rem)" }}
    >
      <ul className="glass-dock grid h-16 grid-cols-5 rounded-full px-1">
        {items.map(({ href, label, icon: Icon, match }) => {
          const active = match(pathname);
          return (
            <li key={href} className="min-w-0">
              <Link
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                href={href as any}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-full flex-col items-center justify-center gap-1 rounded-full text-[0.5625rem] font-semibold uppercase tracking-[0.12em] transition-colors",
                  active ? "text-mulberry" : "text-ink-soft hover:text-ink",
                )}
              >
                <span className={cn("flex size-7 items-center justify-center rounded-full transition-colors", active && "bg-mulberry/10")}>
                  <Icon className="size-[1.125rem]" aria-hidden strokeWidth={1.6} />
                </span>
                <span className="truncate">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
