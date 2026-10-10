"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Search } from "lucide-react";

export function MagazineSearch({ defaultValue = "" }: { defaultValue?: string }) {
  const t = useTranslations("magazine");
  const router = useRouter();
  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        const q = new FormData(e.currentTarget).get("q")?.toString().trim() ?? "";
        router.push(`/magazine/search?q=${encodeURIComponent(q)}`);
      }}
      className="flex items-center gap-2 border-b border-line-strong"
    >
      <Search className="size-4 text-ink-muted" aria-hidden />
      <input name="q" type="search" defaultValue={defaultValue} placeholder={t("searchPlaceholder")} aria-label={t("search")} className="w-44 bg-transparent py-1.5 text-sm outline-none placeholder:text-ink-muted" />
    </form>
  );
}
