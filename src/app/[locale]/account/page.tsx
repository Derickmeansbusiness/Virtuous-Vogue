import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { formatInTimeZone } from "date-fns-tz";
import { requireUser } from "@/lib/auth/session";
import { getPassport } from "@/lib/domain/passport";
import { directionProfiles } from "@/lib/studio/compass-content";
import type { Direction } from "@/lib/studio/compass-model";
import { pick } from "@/content/types";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/skeleton";
import { PaletteStrip } from "@/components/studio/palette-strip";
import { EditorialImage } from "@/components/media/editorial-image";
import { getServiceBySlug } from "@/lib/domain/services";

export const metadata: Metadata = { title: "My Style Passport", robots: { index: false } };

export default async function AccountOverview() {
  const user = await requireUser();
  const t = await getTranslations("account");
  const c = await getTranslations("cta");
  const locale = await getLocale();
  const p = await getPassport(user.id);
  const next = p.appointments.filter((a) => new Date(a.starts_at) > new Date() && a.status !== "cancelled")[0];
  const nextService = next ? await getServiceBySlug(next.service_slug) : null;
  const dir = p.compass ? directionProfiles[p.compass.primary_direction as Direction] : null;

  return (
    <div className="space-y-12">
      <header>
        <h1 className="display-lg">{t("overview.title", { name: user.name?.split(" ")[0] ?? "" })}</h1>
        <p className="mt-2 font-serif text-lg text-ink-soft">{t("overview.body")}</p>
      </header>
      <div className="grid gap-8 md:grid-cols-2">
        <section className="border border-line bg-porcelain p-6">
          <p className="eyebrow text-ink-muted">{t("nav.passport")}</p>
          {dir && p.compass ? (
            <>
              <p className="display-md mt-2">{pick(dir.name, locale)}</p>
              <p className="mt-2 text-sm text-ink-soft">{(p.compass.style_words ?? []).join(" · ")}</p>
              <PaletteStrip colours={(p.colour?.accents ?? []).map((s) => s.hex).concat((p.colour?.neutrals ?? []).map((s) => s.hex)).slice(0, 6).length ? (p.colour?.accents ?? []).map((s) => s.hex).concat((p.colour?.neutrals ?? []).map((s) => s.hex)).slice(0, 6) : dir.palette} className="mt-4" />
              <Button href="/account/passport" variant="link" className="mt-4">{t("overview.openPassport")}</Button>
            </>
          ) : (
            <>
              <p className="mt-2 font-serif text-base text-ink-soft">{t("overview.noCompass")}</p>
              <Button href="/studio/compass" className="mt-4" size="sm">{c("discover")}</Button>
            </>
          )}
        </section>
        <section className="border border-line bg-porcelain p-6">
          <p className="eyebrow text-ink-muted">{t("nav.bookings")}</p>
          {next ? (
            <>
              <p className="display-md mt-2">{nextService ? pick(nextService.name, locale) : next.service_slug}</p>
              <p className="mt-2 text-sm text-ink-soft">{formatInTimeZone(new Date(next.starts_at), next.time_zone, "EEEE d MMMM · HH:mm")} ({next.time_zone})</p>
              <Button href={`/book/manage/${next.manage_token}`} variant="link" className="mt-4">{t("overview.manage")}</Button>
            </>
          ) : (
            <>
              <p className="mt-2 font-serif text-base text-ink-soft">{t("overview.noBooking")}</p>
              <Button href="/book" className="mt-4" size="sm">{c("book")}</Button>
            </>
          )}
        </section>
      </div>
      <div className="grid gap-8 md:grid-cols-3">
        {[
          { href: "/account/wardrobe", label: t("nav.wardrobe"), count: p.wardrobe.length, image: "studio-closet-remix" },
          { href: "/account/looks", label: t("nav.looks"), count: p.outfits.length, image: "studio-compass" },
          { href: "/account/notes", label: t("nav.notes"), count: p.notes.length + p.lookbooks.length, image: "studio-passport" },
        ].map((x) => (
          <Link key={x.href} href={x.href} className="group border border-line bg-porcelain">
            <div className="aspect-[4/3] overflow-hidden"><EditorialImage id={x.image} className="h-full w-full" sizes="(min-width:768px) 25vw, 100vw" /></div>
            <div className="flex items-baseline justify-between p-4">
              <span className="display-sm transition-colors group-hover:text-mulberry">{x.label}</span>
              <span className="font-display text-sm text-ink-muted">{x.count}</span>
            </div>
          </Link>
        ))}
      </div>
      {p.recommendations.length ? (
        <section>
          <p className="eyebrow text-ink-muted">{t("overview.recommendations")}</p>
          <ul className="mt-4 divide-y divide-line border-y border-line">
            {p.recommendations.slice(0, 3).map((r) => (
              <li key={r.id} className="py-3"><span className="font-display">{r.title}</span>{r.reason ? <span className="ml-3 text-sm text-ink-soft">{r.reason}</span> : null}</li>
            ))}
          </ul>
        </section>
      ) : null}
      {!p.compass && !p.wardrobe.length && !p.outfits.length ? <EmptyState title={t("overview.emptyTitle")} body={t("overview.emptyBody")} action={<Button href="/studio">{c("enterStudio")}</Button>} /> : null}
    </div>
  );
}
