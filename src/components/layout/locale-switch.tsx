"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils/cn";

export function LocaleSwitch({ current, className }: { current: string; className?: string }) {
  const pathname = usePathname();
  const t = useTranslations("common");
  return (
    <div className={cn("flex items-center gap-2 text-[0.6875rem] font-semibold tracking-[0.2em]", className)} aria-label={t("language")}>
      {(["en", "fr"] as const).map((l, i) => (
        <span key={l} className="flex items-center gap-2">
          {i > 0 ? <span aria-hidden className="opacity-40">/</span> : null}
          <Link
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            href={pathname as any}
            locale={l}
            hrefLang={l}
            aria-current={current === l ? "true" : undefined}
            className={cn("uppercase", current === l ? "opacity-100 underline underline-offset-4" : "opacity-50 hover:opacity-100")}
          >
            {l}
          </Link>
        </span>
      ))}
    </div>
  );
}
