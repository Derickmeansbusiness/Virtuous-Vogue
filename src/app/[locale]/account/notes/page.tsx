import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { requireUser } from "@/lib/auth/session";
import { getPassport } from "@/lib/domain/passport";
import { getAdminStore } from "@/lib/data/store";
import { EmptyState } from "@/components/ui/skeleton";
import { PaletteStrip } from "@/components/studio/palette-strip";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Stylist notes", robots: { index: false } };

export default async function NotesPage() {
  const user = await requireUser();
  const t = await getTranslations("account.notes");
  const c = await getTranslations("cta");
  const locale = await getLocale();
  const p = await getPassport(user.id);
  const store = getAdminStore();
  const lookbooks = await Promise.all(p.lookbooks.map(async (l) => ({ ...l, items: await store.list<{ id: string; kind: string; title?: string | null; body?: string | null; sort_order: number }>("lookbook_items", { lookbook_id: l.id }, { orderBy: "sort_order", ascending: true }) })));
  return (
    <div className="space-y-12">
      <header><h1 className="display-lg">{t("title")}</h1><p className="mt-2 font-serif text-lg text-ink-soft">{t("body")}</p></header>
      {p.notes.length === 0 && lookbooks.length === 0 && p.recommendations.length === 0 ? (
        <EmptyState title={t("emptyTitle")} body={t("emptyBody")} action={<Button href="/book">{c("book")}</Button>} />
      ) : null}
      {p.notes.length ? (
        <section>
          <p className="eyebrow text-mulberry">{t("notes")}</p>
          <ul className="mt-3 divide-y divide-line border-y border-line">
            {p.notes.map((n) => (
              <li key={n.id} className="py-5">
                <div className="flex items-baseline justify-between gap-4"><p className="eyebrow text-ink-muted">{t(`kinds.${n.kind}`)}</p><time className="text-xs text-ink-muted">{new Date(n.created_at).toLocaleDateString(locale)}</time></div>
                {n.title ? <p className="display-sm mt-1">{n.title}</p> : null}
                <p className="mt-2 whitespace-pre-line font-serif text-base text-ink-soft">{n.body}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      {p.recommendations.length ? (
        <section>
          <p className="eyebrow text-mulberry">{t("recommendations")}</p>
          <ul className="mt-3 divide-y divide-line border-y border-line">
            {p.recommendations.map((r) => (
              <li key={r.id} className="py-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2"><p className="display-sm">{r.title}</p><span className="eyebrow text-ink-muted">{r.fills_gap ? t("fillsGap") : t("optional")}{r.budget_hint ? ` · ${r.budget_hint}` : ""}</span></div>
                {r.reason ? <p className="mt-1 font-serif text-sm text-ink-soft">{r.reason}</p> : null}
                {r.url ? <a href={r.url} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block text-xs text-mulberry underline underline-offset-4">{t("view")}</a> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      {lookbooks.map((l) => (
        <section key={l.id} id={`lookbook-${l.id}`} className="border border-line bg-porcelain p-6 md:p-8">
          <p className="eyebrow text-mulberry">{t("lookbook")}</p>
          <h2 className="display-md mt-2">{l.title}</h2>
          {l.theme ? <p className="mt-1 text-sm text-ink-muted">{l.theme}{l.style_direction ? ` · ${l.style_direction}` : ""}</p> : null}
          {l.palette?.length ? <PaletteStrip colours={l.palette} className="mt-4 max-w-sm" /> : null}
          <ol className="mt-6 space-y-5">
            {l.items.map((it, i) => (
              <li key={it.id} className="border-t border-line pt-4">
                <p className="font-display text-xs tracking-[0.2em] text-ink-muted">{String(i + 1).padStart(2, "0")} · {it.kind}</p>
                {it.title ? <p className="display-sm mt-1">{it.title}</p> : null}
                {it.body ? <p className="mt-1 whitespace-pre-line font-serif text-sm text-ink-soft">{it.body}</p> : null}
              </li>
            ))}
          </ol>
          {l.stylist_note ? <blockquote className="mt-6 border-l-2 border-satin pl-4 font-display text-xl italic text-mulberry">{l.stylist_note}</blockquote> : null}
        </section>
      ))}
    </div>
  );
}
