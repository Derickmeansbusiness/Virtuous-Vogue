import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { formatInTimeZone } from "date-fns-tz";
import { getAdminStore } from "@/lib/data/store";
import type { AppointmentRow } from "@/lib/domain/passport";
import { clientBrief } from "@/lib/domain/admin";
import { getServiceBySlug } from "@/lib/domain/services";
import { directionProfiles } from "@/lib/studio/compass-content";
import type { Direction } from "@/lib/studio/compass-model";
import { questions } from "@/lib/studio/compass-model";
import { PageHeader, Badge } from "@/components/admin/ui";
import { PaletteStrip } from "@/components/studio/palette-strip";
import { AppointmentActions } from "@/components/admin/appointment-actions";
import { StylistNoteForm } from "@/components/admin/stylist-note-form";
import { SITE } from "@/lib/site";

export default async function AppointmentDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const store = getAdminStore();
  const a = await store.get<AppointmentRow>("appointments", id);
  if (!a) notFound();
  const service = await getServiceBySlug(a.service_slug);
  const brief = await clientBrief(a.user_id ?? null, a.guest_email);
  const payments = await store.list<{ id: string; status: string; amount: number; currency: string; method?: string; provider: string }>("payments", { appointment_id: id });
  const dir = brief.compass ? directionProfiles[brief.compass.primary_direction as Direction] : null;
  const label = (key: string, value: unknown) => {
    const q = questions.find((x) => x.key === key);
    if (!q) return String(value);
    if ((q.kind === "single" || q.kind === "multi") && q.options) {
      const vals = Array.isArray(value) ? value : [value];
      return vals.map((v) => q.options.find((o) => o.value === v)?.label.en ?? String(v)).join(", ");
    }
    return Array.isArray(value) ? value.join(", ") : String(value);
  };

  return (
    <div className="space-y-10">
      <PageHeader title={`${a.guest_name} · ${service?.name.en ?? a.service_slug}`} body={`${formatInTimeZone(new Date(a.starts_at), SITE.timeZone, "EEEE d MMMM yyyy, HH:mm")} (${SITE.timeZone}) · ${a.format}`} action={<Badge tone={a.status === "confirmed" ? "success" : a.status === "cancelled" ? "danger" : "warning"}>{a.status}</Badge>} />
      <div className="grid gap-8 lg:grid-cols-12">
        <section className="space-y-8 lg:col-span-7">
          <div className="border border-line bg-ivory p-6">
            <p className="eyebrow text-mulberry">Client Style Brief</p>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2 text-sm">
              <div><dt className="eyebrow text-ink-muted">Contact</dt><dd className="mt-1">{a.guest_email}{a.guest_phone ? ` · ${a.guest_phone}` : ""}{brief.profile?.city ? ` · ${brief.profile.city}` : ""}</dd></div>
              <div><dt className="eyebrow text-ink-muted">History</dt><dd className="mt-1">{brief.appointments.length} appointments · {brief.wardrobeCount} wardrobe pieces · {brief.outfits.length} looks</dd></div>
              <div className="sm:col-span-2"><dt className="eyebrow text-ink-muted">Style goals</dt><dd className="mt-1 whitespace-pre-line font-serif">{a.style_goals || "—"}</dd></div>
              {dir && brief.compass ? (
                <div className="sm:col-span-2 border-t border-line pt-4">
                  <dt className="eyebrow text-ink-muted">Style Compass</dt>
                  <dd className="mt-1"><span className="display-sm">{dir.name.en}</span>{brief.compass.secondary_direction ? <span className="text-ink-soft"> + {directionProfiles[brief.compass.secondary_direction as Direction].name.en}</span> : null}<br /><span className="text-ink-soft">{brief.compass.style_words.join(" · ")}</span></dd>
                </div>
              ) : <div className="sm:col-span-2 text-ink-muted">No Style Compass result attached.</div>}
              {brief.colour ? (
                <div className="sm:col-span-2 border-t border-line pt-4">
                  <dt className="eyebrow text-ink-muted">Colour ({brief.colour.source})</dt>
                  <dd className="mt-1">{brief.colour.undertone} undertone · {brief.colour.contrast} contrast<PaletteStrip colours={[...brief.colour.neutrals, ...brief.colour.accents].map((s) => s.hex)} className="mt-2 max-w-sm" /></dd>
                </div>
              ) : null}
              {brief.answers.length ? (
                <div className="sm:col-span-2 border-t border-line pt-4">
                  <dt className="eyebrow text-ink-muted">Compass answers</dt>
                  <dd className="mt-2 grid gap-1 text-xs">{brief.answers.map((x) => <div key={x.question_key}><span className="text-ink-muted">{x.question_key}:</span> {label(x.question_key, x.answer)}</div>)}</dd>
                </div>
              ) : null}
              {a.context && (a.context as { outfitId?: string }).outfitId ? <div className="sm:col-span-2"><dt className="eyebrow text-ink-muted">Attached look</dt><dd className="mt-1 text-xs">{(a.context as { outfitId?: string }).outfitId}</dd></div> : null}
            </dl>
          </div>
          <div className="border border-line bg-ivory p-6">
            <p className="eyebrow text-mulberry">Add a note or deliverable</p>
            {a.user_id ? <StylistNoteForm userId={a.user_id} appointmentId={a.id} /> : <p className="mt-2 text-sm text-ink-muted">Guest booking: notes can be added once the client creates a Style Passport with {a.guest_email}.</p>}
          </div>
          {brief.notes.length ? (
            <div className="border border-line bg-ivory p-6">
              <p className="eyebrow text-ink-muted">Previous notes</p>
              <ul className="mt-3 divide-y divide-line">{brief.notes.map((n) => <li key={n.id} className="py-3 text-sm"><Badge>{n.kind}</Badge> {n.title ? <strong>{n.title} · </strong> : null}<span className="whitespace-pre-line">{n.body}</span></li>)}</ul>
            </div>
          ) : null}
        </section>
        <aside className="space-y-6 lg:col-span-5">
          <div className="border border-line bg-ivory p-6">
            <p className="eyebrow text-ink-muted">Payments</p>
            {payments.length ? <ul className="mt-3 space-y-2 text-sm">{payments.map((p) => <li key={p.id} className="flex justify-between"><span>{p.amount.toLocaleString("en")} {p.currency} · {p.method ?? p.provider}</span><Badge tone={p.status === "succeeded" ? "success" : p.status === "failed" ? "danger" : "warning"}>{p.status}</Badge></li>)}</ul> : <p className="mt-2 text-sm text-ink-muted">No payment recorded.</p>}
          </div>
          <div className="border border-line bg-ivory p-6">
            <p className="eyebrow text-ink-muted">Actions</p>
            <AppointmentActions id={a.id} status={a.status} paymentId={payments.find((p) => p.status !== "succeeded")?.id} />
            {a.user_id ? <Link href={`/admin/clients/${a.user_id}`} className="mt-4 inline-block text-xs uppercase tracking-[0.14em] text-mulberry">Open client profile</Link> : null}
          </div>
        </aside>
      </div>
    </div>
  );
}
