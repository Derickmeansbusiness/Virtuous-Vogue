"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Home, Compass, Shirt, BookOpen, User } from "lucide-react";
import { cn } from "@/lib/utils/cn";

/** Bottom navigation for signed-in clients on mobile. */
export function MobileNav() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const items = [
    { href: "/", label: t("home"), icon: Home, match: (p: string) => p === "/" },
    { href: "/studio", label: t("studio"), icon: Compass, match: (p: string) => p.startsWith("/studio") },
    { href: "/account/wardrobe", label: t("wardrobe"), icon: Shirt, match: (p: string) => p.startsWith("/account/wardrobe") },
    { href: "/magazine", label: t("magazine"), icon: BookOpen, match: (p: string) => p.startsWith("/magazine") },
    { href: "/account", label: t("profile"), icon: User, match: (p: string) => p.startsWith("/account") && !p.startsWith("/account/wardrobe") },
  ];
  return (
    <nav
      aria-label="Mobile primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ivory/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
      style={{ height: "calc(var(--vv-bottom-nav-h) + env(safe-area-inset-bottom))" }}
    >
      <ul className="grid h-[var(--vv-bottom-nav-h)] grid-cols-5">
        {items.map(({ href, label, icon: Icon, match }) => {
          const active = match(pathname);
          return (
            <li key={href}>
              <Link
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                href={href as any}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-full flex-col items-center justify-center gap-1 text-[0.625rem] font-semibold uppercase tracking-[0.12em]",
                  active ? "text-mulberry" : "text-ink-muted",
                )}
              >
                <Icon className="size-5" aria-hidden strokeWidth={1.5} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
