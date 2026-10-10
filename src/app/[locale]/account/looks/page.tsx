import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { requireUser } from "@/lib/auth/session";
import { getPassport, getOutfitItems } from "@/lib/domain/passport";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/skeleton";

export const metadata: Metadata = { title: "Looks", robots: { index: false } };

export default async function LooksPage() {
  const user = await requireUser();
  const t = await getTranslations("account.looks");
  const tr = await getTranslations("studio.remix");
  const c = await getTranslations("cta");
  const locale = await getLocale();
  const p = await getPassport(user.id);
  const looks = await Promise.all(p.outfits.map(async (o) => ({ ...o, items: await getOutfitItems(o.id) })));
  const scheduled = looks.filter((l) => l.scheduled_for);
  return (
    <div className="space-y-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div><h1 className="display-lg">{t("title")}</h1><p className="mt-2 font-serif text-lg text-ink-soft">{t("body")}</p></div>
        <Button href="/studio/closet-remix">{c("remixMyCloset")}</Button>
      </header>
      {scheduled.length ? (
        <section>
          <p className="eyebrow text-mulberry">{t("scheduled")}</p>
          <ul className="mt-3 divide-y divide-line border-y border-line">
            {scheduled.map((l) => <li key={l.id} className="flex justify-between py-3 text-sm"><span>{l.name ?? l.occasion}</span><span className="text-ink-muted">{new Date(l.scheduled_for!).toLocaleDateString(locale)}</span></li>)}
          </ul>
        </section>
      ) : null}
      {looks.length ? (
        <ul className="grid gap-8 md:grid-cols-2">
          {looks.map((l, i) => (
            <li key={l.id} className="border border-line bg-porcelain p-5">
              <p className="font-display text-xs tracking-[0.2em] text-ink-muted">VV / {String(i + 1).padStart(2, "0")} · {l.created_by === "stylist" ? t("byStylist") : tr("useWhatYouOwn")}</p>
              <h2 className="display-sm mt-2">{l.name ?? l.occasion ?? t("untitled")}</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {l.items.map((x) => <li key={x.item.id} className="flex items-center gap-2 border border-line px-2 py-1 text-xs"><span aria-hidden className="size-3" style={{ background: x.item.colour_hex ?? "#C5AE96" }} />{x.item.name ?? x.item.subcategory ?? x.item.category}</li>)}
              </ul>
              {l.reasoning ? <p className="mt-3 font-serif text-sm text-ink-soft">{l.reasoning}</p> : null}
              <div className="mt-4 flex gap-3"><Button href={`/book?service=style-clarity&outfit=${l.id}`} size="sm" variant="secondary">{tr("bookFromLook")}</Button></div>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState title={t("emptyTitle")} body={t("emptyBody")} action={<Button href="/studio/closet-remix">{c("tryRemix")}</Button>} />
      )}
    </div>
  );
}
