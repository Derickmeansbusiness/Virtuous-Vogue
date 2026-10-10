import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { EditorialImage } from "@/components/media/editorial-image";
import { pick, type Localized } from "@/content/types";
import type { Look } from "@/content/collection";
import { cn } from "@/lib/utils/cn";

export function StatusBadge({ status, label, className }: { status: Look["status"]; label: string; className?: string }) {
  return (
    <span
      className={cn(
        "eyebrow inline-flex items-center gap-1.5 border px-2 py-1 text-[0.625rem]",
        status === "first-sample" ? "border-mulberry/40 bg-mulberry-tint text-mulberry" : "border-line text-ink-muted",
        className,
      )}
    >
      <span aria-hidden className={cn("size-1.5 rounded-full", status === "first-sample" ? "bg-mulberry" : "bg-satin-deep")} />
      {label}
    </span>
  );
}

export function PaletteDots({ palette, locale, className }: { palette: { name: Localized; hex: string }[]; locale: string; className?: string }) {
  return (
    <ul className={cn("flex items-center gap-1.5", className)} aria-label="Palette">
      {palette.map((s) => (
        <li key={s.hex} className="size-3.5 rounded-full border border-ink/10" style={{ backgroundColor: s.hex }} title={pick(s.name, locale)} />
      ))}
    </ul>
  );
}

export async function LookCard({ look, locale, priority }: { look: Look; locale: string; priority?: boolean }) {
  const t = await getTranslations("collection");
  return (
    <article className="group">
      <Link href={`/collection/${look.slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-satin-tint">
          <EditorialImage id={look.image} className="h-full w-full transition-transform duration-[1200ms] ease-[var(--ease-editorial)] group-hover:scale-[1.03]" sizes="(min-width:1280px) 22vw, (min-width:768px) 30vw, 100vw" priority={priority} />
          <StatusBadge status={look.status} label={t(`status.${look.status}`)} className="absolute left-3 top-3 bg-ivory/90 backdrop-blur-sm" />
        </div>
        <div className="mt-4 flex items-start justify-between gap-4">
          <div>
            <p className="font-display text-xs tracking-[0.2em] text-ink-muted">{look.code}</p>
            <h3 className="display-sm mt-1 group-hover:text-mulberry">{pick(look.name, locale)}</h3>
            <p className="mt-1 font-serif text-sm italic text-ink-soft">{pick(look.tagline, locale)}</p>
          </div>
          <PaletteDots palette={look.palette} locale={locale} className="mt-1 shrink-0" />
        </div>
      </Link>
    </article>
  );
}
