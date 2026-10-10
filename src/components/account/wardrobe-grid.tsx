"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Heart, Archive } from "lucide-react";
import { updateWardrobeItem } from "@/lib/actions/wardrobe";
import { cn } from "@/lib/utils/cn";

type Item = { id: string; category: string; subcategory?: string | null; name?: string | null; colour?: string | null; colour_hex?: string | null; is_favourite: boolean; imageUrl: string | null };

export function WardrobeGrid({ items: initial }: { items: Item[] }) {
  const t = useTranslations("account.wardrobe");
  const [items, setItems] = React.useState(initial);
  const [filter, setFilter] = React.useState<string>("all");
  const cats = ["all", ...new Set(items.map((i) => i.category))];
  const shown = items.filter((i) => filter === "all" || i.category === filter);
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {cats.map((c) => (
          <button key={c} type="button" onClick={() => setFilter(c)} aria-pressed={filter === c} className={cn("eyebrow border px-3 py-1.5", filter === c ? "border-mulberry text-mulberry" : "border-line text-ink-muted hover:text-ink")}>{c === "all" ? t("all") : c}</button>
        ))}
      </div>
      <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {shown.map((it) => (
          <li key={it.id} className="group border border-line bg-porcelain">
            <div className="relative aspect-[4/5] bg-ivory">
              {it.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={it.imageUrl} alt={it.name ?? it.category} className="h-full w-full object-contain p-2" loading="lazy" />
              ) : (
                <div className="h-full w-full" style={{ background: it.colour_hex ?? "#EDE3D7" }} />
              )}
              <button type="button" aria-pressed={it.is_favourite} aria-label={t("favourite")} onClick={async () => { const next = !it.is_favourite; setItems((p) => p.map((x) => (x.id === it.id ? { ...x, is_favourite: next } : x))); await updateWardrobeItem(it.id, { is_favourite: next }); }} className="absolute right-2 top-2 bg-ivory/90 p-1.5 text-mulberry">
                <Heart className={cn("size-4", it.is_favourite && "fill-mulberry")} aria-hidden />
              </button>
            </div>
            <div className="flex items-center justify-between px-3 py-2">
              <span className="truncate text-xs uppercase tracking-[0.12em]">{it.name ?? it.subcategory ?? it.category}{it.colour ? ` · ${it.colour}` : ""}</span>
              <button type="button" aria-label={t("archive")} onClick={async () => { setItems((p) => p.filter((x) => x.id !== it.id)); await updateWardrobeItem(it.id, { archived_at: new Date().toISOString() }); }} className="text-ink-muted hover:text-ink"><Archive className="size-4" aria-hidden /></button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
