"use client";

import * as React from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X, User } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { HeaderLockup, Monogram } from "@/components/ui/brand";
import { Button } from "@/components/ui/button";
import { LocaleSwitch } from "./locale-switch";

type NavItem = { href: string; label: string };

export function Header({
  signedIn,
  isAdmin,
  tone = "auto",
}: {
  signedIn: boolean;
  isAdmin?: boolean;
  tone?: "auto" | "light" | "dark";
}) {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const tcta = useTranslations("cta");
  const pathname = usePathname();
  const locale = useLocale();
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from a browser API after mount
    setOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const nav: NavItem[] = [
    { href: "/studio", label: t("studio") },
    { href: "/collection", label: t("collection") },
    { href: "/services", label: t("services") },
    { href: "/magazine", label: t("magazine") },
    { href: "/about", label: t("about") },
  ];

  const onHome = pathname === "/";
  const overHero = tone === "dark" || (tone === "auto" && onHome && !scrolled);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:bg-ivory focus:px-4 focus:py-2 focus:text-ink"
      >
        {tc("skipToContent")}
      </a>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,color] duration-500",
          overHero && !open
            ? "border-b border-transparent bg-transparent text-ivory"
            : "border-b border-line bg-ivory/92 text-ink backdrop-blur-md",
        )}
        style={{ height: "var(--vv-header-h)" }}
      >
        <div className="container-vv flex h-full items-center justify-between">
          <Link href="/" className="flex items-center" aria-label="Virtuous Vogue home">
            <HeaderLockup tone={overHero && !open ? "white" : "ink"} height={30} className="hidden sm:block" />
            <Monogram tone={overHero && !open ? "white" : "twotone"} height={30} className="sm:hidden" />
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                href={item.href as any}
                className={cn(
                  "eyebrow relative py-2 transition-opacity hover:opacity-70",
                  pathname.startsWith(item.href) && "after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:bg-current",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-5 lg:flex">
            <LocaleSwitch current={locale} />
            {signedIn ? (
              <Link href={isAdmin ? "/admin" : "/account"} className="eyebrow inline-flex items-center gap-2 hover:opacity-70">
                <User className="size-4" aria-hidden />
                {isAdmin ? t("admin") : t("account")}
              </Link>
            ) : (
              <Link href="/login" className="eyebrow hover:opacity-70">
                {tc("signIn")}
              </Link>
            )}
            <Button href="/book" variant={overHero ? "ivory" : "primary"} size="sm">
              {tcta("book")}
            </Button>
          </div>

          <button
            type="button"
            className="inline-flex size-11 items-center justify-center lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? tc("close") : tc("menu")}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-40 flex flex-col bg-ivory pt-[var(--vv-header-h)] text-ink lg:hidden"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <nav aria-label="Mobile" className="container-vv flex flex-1 flex-col gap-1 overflow-y-auto py-8">
              {[{ href: "/", label: t("home") }, ...nav, { href: "/contact", label: t("contact") }].map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.4 }}
                >
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  <Link href={item.href as any} className="display-md block border-b border-line py-4">
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <div className="mt-8 flex flex-col gap-4">
                <Button href="/book" size="lg">
                  {tcta("book")}
                </Button>
                {signedIn ? (
                  <Button href={isAdmin ? "/admin" : "/account"} variant="secondary" size="lg">
                    {isAdmin ? t("admin") : tcta("passport")}
                  </Button>
                ) : (
                  <Button href="/login" variant="secondary" size="lg">
                    {tc("signIn")}
                  </Button>
                )}
                <div className="flex items-center justify-between pt-4">
                  <LocaleSwitch current={locale} />
                </div>
              </div>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
