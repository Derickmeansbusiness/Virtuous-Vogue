import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { requireUser } from "@/lib/auth/session";
import { getPassport } from "@/lib/domain/passport";
import { directionProfiles } from "@/lib/studio/compass-content";
import { DIRECTIONS, type Direction } from "@/lib/studio/compass-model";
import { pick } from "@/content/types";
import { Button } from "@/components/ui/button";
import { BlendBars } from "@/components/studio/blend-bars";
import { PaletteStrip } from "@/components/studio/palette-strip";
import { EmptyState } from "@/components/ui/skeleton";

export const metadata: Metadata = { title: "Style Passport", robots: { index: false } };

export default async function PassportPage() {
  const user = await requireUser();
  const t = await getTranslations("account.passport");
  const tr = await getTranslations("studio.compass.result");
  const tcol = await getTranslations("studio.colour");
  const c = await getTranslations("cta");
  const locale = await getLocale();
  const p = await getPassport(user.id);
  const dir = p.compass ? directionProfiles[p.compass.primary_direction as Direction] : null;
  const scores = p.compass ? DIRECTIONS.map((d) => ({ key: d, name: pick(directionProfiles[d].name, locale), value: Number(p.compass!.scores?.[d] ?? 0) })).sort((a, b) => b.value - a.value) : [];

  return (
    <div className="space-y-14">
      <header>
        <h1 className="display-lg">{t("title")}</h1>
        <p className="mt-2 font-serif text-lg text-ink-soft">{t("body")}</p>
      </header>
      <section>
        <p className="eyebrow text-mulberry">{t("compass")}</p>
        {dir && p.compass ? (
          <div className="mt-4 grid gap-10 md:grid-cols-12">
            <div className="md:col-span-6">
              <h2 className="display-md">{pick(dir.name, locale)}</h2>
              <p className="mt-2 font-serif text-base text-ink-soft">{pick(dir.essence, locale)}</p>
              <p className="eyebrow mt-6 text-ink-muted">{tr("styleWords")}</p>
              <p className="display-sm mt-1 text-mulberry">{(p.compass.style_words ?? []).join(" · ")}</p>
              <p className="eyebrow mt-6 text-ink-muted">{tr("silhouette")}</p>
              <p className="mt-1 font-serif">{p.compass.silhouette_direction}</p>
              <p className="eyebrow mt-6 text-ink-muted">{tr("priorities")}</p>
              <ul className="mt-1 space-y-1 font-serif text-ink-soft">{(p.compass.wardrobe_priorities ?? []).map((x) => <li key={x}>{x}</li>)}</ul>
              <div className="mt-6 flex gap-4"><Button href={`/studio/compass/result/${p.compass.id}`} variant="secondary" size="sm">{t("viewResult")}</Button><Button href="/studio/compass" variant="link">{tr("retake")}</Button></div>
            </div>
            <div className="md:col-span-5 md:col-start-8"><p className="eyebrow text-ink-muted">{tr("blend")}</p><BlendBars items={scores} /></div>
          </div>
        ) : (
          <EmptyState className="mt-4" title={t("noCompass")} action={<Button href="/studio/compass">{c("discover")}</Button>} />
        )}
      </section>
      <section>
        <p className="eyebrow text-mulberry">{t("palette")}</p>
        {p.colour ? (
          <div className="mt-4">
            <p className="text-xs text-ink-muted">{p.colour.source === "stylist" ? t("stylistPalette") : tcol("badge")} · {new Date(p.colour.created_at).toLocaleDateString(locale)}</p>
            <p className="mt-2 font-serif text-base text-ink-soft">{p.colour.notes}</p>
            {[["neutrals", p.colour.neutrals], ["accents", p.colour.accents], ["families", p.colour.families], ["careful", p.colour.test_carefully]].map(([k, sw]) => (
              <div key={k as string} className="mt-5">
                <p className="eyebrow text-ink-muted">{tcol(k as "neutrals")}</p>
                <PaletteStrip colours={(sw as { hex: string; name: string }[]).map((s) => s.hex)} labels={(sw as { hex: string; name: string }[]).map((s) => s.name)} className="mt-2" />
              </div>
            ))}
            <p className="mt-4 text-sm text-ink-soft">{p.colour.metals}</p>
            <div className="mt-6"><Button href="/book?service=colour-harmony" size="sm">{c("refinePalette")}</Button></div>
          </div>
        ) : (
          <EmptyState className="mt-4" title={t("noColour")} action={<Button href="/studio/colour-lens">{c("exploreColours")}</Button>} />
        )}
      </section>
      {p.lookbooks.length ? (
        <section>
          <p className="eyebrow text-mulberry">{t("lookbooks")}</p>
          <ul className="mt-4 divide-y divide-line border-y border-line">
            {p.lookbooks.map((l) => (
              <li key={l.id} className="py-4">
                <a href={`/account/notes#lookbook-${l.id}`} className="display-sm hover:text-mulberry">{l.title}</a>
                {l.theme ? <p className="text-sm text-ink-soft">{l.theme}</p> : null}
                {l.palette?.length ? <PaletteStrip colours={l.palette} className="mt-2 max-w-xs" /> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
