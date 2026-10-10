import { notFound } from "next/navigation";
import { getAdminStore } from "@/lib/data/store";
import type { Profile } from "@/lib/domain/admin";
import { PageHeader, Badge } from "@/components/admin/ui";
import { LookbookForm, LookbookItemForm, DeleteItemButton } from "@/components/admin/lookbook-form";
import { PaletteStrip } from "@/components/studio/palette-strip";

export default async function LookbookDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const store = getAdminStore();
  const l = await store.get<{ id: string; user_id: string; title: string; theme?: string | null; style_direction?: string | null; palette: string[]; stylist_note?: string | null; status: "draft" | "published" }>("lookbooks", id);
  if (!l) notFound();
  const [items, client, outfits] = await Promise.all([
    store.list<{ id: string; kind: string; title?: string | null; body?: string | null; sort_order: number; outfit_id?: string | null }>("lookbook_items", { lookbook_id: id }, { orderBy: "sort_order", ascending: true }),
    store.get<Profile>("profiles", l.user_id),
    store.list<{ id: string; name?: string | null; occasion?: string | null }>("outfits", { user_id: l.user_id }),
  ]);
  return (
    <div className="space-y-8">
      <PageHeader title={l.title} body={client?.email} action={<Badge tone={l.status === "published" ? "success" : "muted"}>{l.status}</Badge>} />
      {l.palette?.length ? <PaletteStrip colours={l.palette} className="max-w-sm" /> : null}
      <LookbookForm clients={client ? [{ id: client.id, label: client.email }] : []} defaultClient={l.user_id} existing={l} />
      <section>
        <p className="eyebrow text-mulberry">Boards</p>
        <ol className="mt-3 divide-y divide-line border-y border-line">
          {items.map((it, i) => <li key={it.id} className="flex items-start justify-between gap-4 py-3 text-sm"><div><span className="font-display text-xs tracking-[0.2em] text-ink-muted">{String(i + 1).padStart(2, "0")} · {it.kind}</span>{it.title ? <p className="font-semibold">{it.title}</p> : null}{it.body ? <p className="whitespace-pre-line text-ink-soft">{it.body}</p> : null}{it.outfit_id ? <p className="text-xs text-ink-muted">outfit {it.outfit_id.slice(0, 8)}</p> : null}</div><DeleteItemButton id={it.id} lookbookId={id} /></li>)}
          {items.length === 0 ? <li className="py-3 text-sm text-ink-muted">No boards yet.</li> : null}
        </ol>
        <LookbookItemForm lookbookId={id} outfits={outfits.map((o) => ({ id: o.id, label: o.name ?? o.occasion ?? o.id.slice(0, 8) }))} nextOrder={items.length} />
      </section>
    </div>
  );
}
