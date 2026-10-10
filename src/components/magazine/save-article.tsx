"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Bookmark } from "lucide-react";
import { toggleSavedArticle } from "@/lib/actions/saves";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils/cn";

export function SaveArticleButton({ slug, saved: initial, signedIn }: { slug: string; saved: boolean; signedIn: boolean }) {
  const t = useTranslations("magazine");
  const [saved, setSaved] = React.useState(initial);
  const [pending, start] = React.useTransition();
  if (!signedIn) {
    return (
      <Link href={`/login?next=/magazine/${slug}`} className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted hover:text-mulberry">
        <Bookmark className="size-4" aria-hidden /> {t("save")}
      </Link>
    );
  }
  return (
    <button
      type="button"
      disabled={pending}
      aria-pressed={saved}
      onClick={() => start(async () => { const r = await toggleSavedArticle(slug); if (r.ok) setSaved(r.saved); })}
      className={cn("inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] hover:text-mulberry", saved ? "text-mulberry" : "text-ink-muted")}
    >
      <Bookmark className={cn("size-4", saved && "fill-mulberry")} aria-hidden /> {saved ? t("saved") : t("save")}
    </button>
  );
}
