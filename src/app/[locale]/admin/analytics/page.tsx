import { getAdminStore } from "@/lib/data/store";
import { PageHeader, Stat, Table, Td } from "@/components/admin/ui";

export default async function AdminAnalytics() {
  const store = getAdminStore();
  const [compass, colour, outfits, appts, leads, subs, payments] = await Promise.all([
    store.list<{ created_at: string; user_id: string | null; primary_direction: string }>("style_profiles"),
    store.list<{ created_at: string }>("colour_profiles"),
    store.list<{ created_at: string }>("outfits"),
    store.list<{ created_at: string; status: string; service_slug: string }>("appointments"),
    store.list<{ created_at: string; channel: string }>("leads"),
    store.list<{ status: string }>("newsletter_subscribers"),
    store.list<{ status: string; amount: number }>("payments"),
  ]);
  const byDirection = Object.entries(compass.reduce<Record<string, number>>((acc, c) => ((acc[c.primary_direction] = (acc[c.primary_direction] ?? 0) + 1), acc), {})).sort((a, b) => b[1] - a[1]);
  const byService = Object.entries(appts.reduce<Record<string, number>>((acc, a) => ((acc[a.service_slug] = (acc[a.service_slug] ?? 0) + 1), acc), {})).sort((a, b) => b[1] - a[1]);
  const plausible = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  return (
    <div className="space-y-8">
      <PageHeader title="Analytics" body={plausible ? `Traffic and conversion events live in Plausible for ${plausible}. Below: the funnel as recorded in the database.` : "Set NEXT_PUBLIC_PLAUSIBLE_DOMAIN for traffic analytics. Below: the funnel as recorded in the database."} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Discover · Compass" value={compass.length} hint={`${compass.filter((c) => c.user_id).length} saved to a passport`} />
        <Stat label="Understand · Colour Lens" value={colour.length} />
        <Stat label="Experiment · Looks" value={outfits.length} />
        <Stat label="Trust · Newsletter" value={subs.filter((s) => s.status === "subscribed").length} />
        <Stat label="Consult · Bookings" value={appts.length} hint={`${appts.filter((a) => a.status === "confirmed" || a.status === "completed").length} confirmed`} />
        <Stat label="Ask VV" value={leads.filter((l) => l.channel === "ask_vv").length} />
        <Stat label="Paid deposits" value={payments.filter((p) => p.status === "succeeded").length} />
        <Stat label="Return · Completed" value={appts.filter((a) => a.status === "completed").length} />
      </div>
      <div className="grid gap-8 md:grid-cols-2">
        <section><p className="eyebrow text-ink-muted">Style directions</p><Table head={["Direction", "Count"]} className="mt-3">{byDirection.map(([k, v]) => <tr key={k}><Td>{k}</Td><Td>{v}</Td></tr>)}{byDirection.length === 0 ? <tr><Td className="text-ink-muted">No data yet.</Td></tr> : null}</Table></section>
        <section><p className="eyebrow text-ink-muted">Bookings by service</p><Table head={["Service", "Count"]} className="mt-3">{byService.map(([k, v]) => <tr key={k}><Td>{k}</Td><Td>{v}</Td></tr>)}{byService.length === 0 ? <tr><Td className="text-ink-muted">No data yet.</Td></tr> : null}</Table></section>
      </div>
    </div>
  );
}
