import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { formatInTimeZone } from "date-fns-tz";
import { clientBrief } from "@/lib/domain/admin";
import { getPassport, getOutfitItems } from "@/lib/domain/passport";
import { directionProfiles } from "@/lib/studio/compass-content";
import type { Direction } from "@/lib/studio/compass-model";
import { PageHeader, Badge, Table, Td } from "@/components/admin/ui";
import { PaletteStrip } from "@/components/studio/palette-strip";
import { StylistNoteForm } from "@/components/admin/stylist-note-form";
import { SITE } from "@/lib/site";

export default async function ClientDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const brief = await clientBrief(id);
  if (!brief.profile) notFound();
  const p = await getPassport(id);
  const looks = await Promise.all(p.outfits.slice(0, 6).map(async (o) => ({ ...o, items: await getOutfitItems(o.id) })));
  const dir = brief.compass ? directionProfiles[brief.compass.primary_direction as Direction] : null;
  return (
    <div className="space-y-10">
      <PageHeader title={brief.profile.full_name ?? brief.profile.email} body={`${brief.profile.email}${brief.profile.phone ? ` · ${brief.profile.phone}` : ""}${brief.profile.city ? ` · ${brief.profile.city}` : ""} · ${brief.profile.locale ?? "en"}`} action={<Link href={`/admin/lookbooks?client=${id}`} className="text-xs uppercase tracking-[0.14em] text-mulberry">New lookbook</Link>} />
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="space-y-8 lg:col-span-7">
          <section className="border border-line bg-ivory p-6">
            <p className="eyebrow text-mulberry">Style profile</p>
            {dir && brief.compass ? (<><p className="display-sm mt-2">{dir.name.en}{brief.compass.secondary_direction ? ` + ${directionProfiles[brief.compass.secondary_direction as Direction].name.en}` : ""}</p><p className="text-sm text-ink-soft">{brief.compass.style_words.join(" · ")}</p><p className="mt-2 text-sm text-ink-soft">{brief.compass.silhouette_direction}</p></>) : <p className="mt-2 text-sm text-ink-muted">No Style Compass yet.</p>}
            {brief.colour ? <div className="mt-4"><p className="eyebrow text-ink-muted">Colour · {brief.colour.source}</p><p className="text-sm">{brief.colour.undertone} · {brief.colour.contrast} contrast</p><PaletteStrip colours={[...brief.colour.neutrals, ...brief.colour.accents].map((s) => s.hex)} className="mt-2 max-w-sm" /></div> : null}
          </section>
          <section className="border border-line bg-ivory p-6">
            <p className="eyebrow text-mulberry">Wardrobe · {p.wardrobe.length} pieces</p>
            <ul className="mt-3 flex flex-wrap gap-2">{p.wardrobe.slice(0, 40).map((w) => <li key={w.id} className="flex items-center gap-2 border border-line px-2 py-1 text-xs"><span aria-hidden className="size-3" style={{ background: w.colour_hex ?? "#C5AE96" }} />{w.name ?? w.subcategory ?? w.category}</li>)}</ul>
          </section>
          <section className="border border-line bg-ivory p-6">
            <p className="eyebrow text-mulberry">Saved looks</p>
            {looks.length ? <ul className="mt-3 divide-y divide-line">{looks.map((l) => <li key={l.id} className="py-3 text-sm"><strong>{l.name ?? l.occasion}</strong> · {l.items.map((x) => x.item.name ?? x.item.subcategory ?? x.item.category).join(", ")}</li>)}</ul> : <p className="mt-2 text-sm text-ink-muted">None yet.</p>}
          </section>
          <section className="border border-line bg-ivory p-6">
            <p className="eyebrow text-mulberry">Add note, principle, priority, colour guidance or recommendation</p>
            <StylistNoteForm userId={id} />
          </section>
        </div>
        <div className="space-y-8 lg:col-span-5">
          <section>
            <p className="eyebrow text-ink-muted">Consultations</p>
            <Table head={["When", "Service", "Status"]} className="mt-3">
              {brief.appointments.length === 0 ? <tr><Td className="text-ink-muted">None.</Td></tr> : null}
              {brief.appointments.map((a) => <tr key={a.id}><Td><Link href={`/admin/appointments/${a.id}`} className="text-mulberry">{formatInTimeZone(new Date(a.starts_at), SITE.timeZone, "d MMM yyyy HH:mm")}</Link></Td><Td>{a.service_slug}</Td><Td><Badge>{a.status}</Badge></Td></tr>)}
            </Table>
          </section>
          <section>
            <p className="eyebrow text-ink-muted">Notes & deliverables</p>
            <ul className="mt-3 divide-y divide-line border-y border-line">{brief.notes.map((n) => <li key={n.id} className="py-3 text-sm"><Badge>{n.kind}</Badge> {n.title ? <strong>{n.title} · </strong> : null}<span className="whitespace-pre-line">{n.body}</span>{!n.visible_to_client ? <span className="ml-2 text-xs text-ink-muted">(private)</span> : null}</li>)}{brief.notes.length === 0 ? <li className="py-3 text-sm text-ink-muted">None yet.</li> : null}</ul>
          </section>
          <section>
            <p className="eyebrow text-ink-muted">Lookbooks</p>
            <ul className="mt-3 divide-y divide-line border-y border-line">{p.lookbooks.map((l) => <li key={l.id} className="py-3 text-sm"><Link href={`/admin/lookbooks/${l.id}`} className="text-mulberry">{l.title}</Link> <Badge>{l.status}</Badge></li>)}{p.lookbooks.length === 0 ? <li className="py-3 text-sm text-ink-muted">None published.</li> : null}</ul>
          </section>
        </div>
      </div>
    </div>
  );
}
