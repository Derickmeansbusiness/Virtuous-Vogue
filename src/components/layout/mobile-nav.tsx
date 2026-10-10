"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Home, Compass, CalendarCheck, BookOpen, User, LogIn } from "lucide-react";
import { cn } from "@/lib/utils/cn";

/**
 * Bottom-docked primary navigation on phones and tablets, for every visitor.
 * Signed-in clients get their Style Passport as the last stop; guests get Sign in.
 */
export function MobileNav({ signedIn = false }: { signedIn?: boolean }) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const items = [
    { href: "/", label: t("home"), icon: Home, match: (p: string) => p === "/" },
    { href: "/studio", label: t("studioShort"), icon: Compass, match: (p: string) => p.startsWith("/studio") },
    { href: "/book", label: t("book"), icon: CalendarCheck, match: (p: string) => p.startsWith("/book") || p.startsWith("/services"), primary: true },
    { href: "/magazine", label: t("magazine"), icon: BookOpen, match: (p: string) => p.startsWith("/magazine") },
    signedIn
      ? { href: "/account", label: t("account"), icon: User, match: (p: string) => p.startsWith("/account") }
      : { href: "/login", label: t("signIn"), icon: LogIn, match: (p: string) => p.startsWith("/login") || p.startsWith("/signup") },
  ];
  return (
    <nav
      aria-label="Mobile primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line/80 bg-ivory/92 pb-[env(safe-area-inset-bottom)] shadow-[0_-12px_30px_-18px_rgba(25,24,22,0.35)] backdrop-blur-xl lg:hidden"
      style={{ height: "calc(var(--vv-bottom-nav-h) + env(safe-area-inset-bottom))" }}
    >
      <ul className="grid h-[var(--vv-bottom-nav-h)] grid-cols-5">
        {items.map(({ href, label, icon: Icon, match, primary }) => {
          const active = match(pathname);
          return (
            <li key={href}>
              <Link
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                href={href as any}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-full flex-col items-center justify-center gap-1 text-[0.625rem] font-semibold uppercase tracking-[0.12em] transition-colors",
                  active ? "text-mulberry" : "text-ink-muted hover:text-ink",
                )}
              >
                {primary ? (
                  <span className={cn("flex size-9 -mt-1 items-center justify-center rounded-full border transition-colors", active ? "border-mulberry bg-mulberry text-porcelain" : "border-mulberry/40 bg-mulberry-tint text-mulberry")}>
                    <Icon className="size-[1.125rem]" aria-hidden strokeWidth={1.6} />
                  </span>
                ) : (
                  <Icon className="size-5" aria-hidden strokeWidth={1.5} />
                )}
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
