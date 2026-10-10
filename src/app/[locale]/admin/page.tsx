import { Link } from "@/i18n/navigation";
import { formatInTimeZone } from "date-fns-tz";
import { adminDashboard } from "@/lib/domain/admin";
import { Stat, Table, Td, Badge, PageHeader } from "@/components/admin/ui";
import { SITE } from "@/lib/site";

export default async function AdminDashboard() {
  const d = await adminDashboard();
  return (
    <div className="space-y-10">
      <PageHeader title="Dashboard" body="What needs you today." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Upcoming" value={d.upcoming.length} hint="confirmed or pending" />
        <Stat label="New leads" value={d.newLeads.length} />
        <Stat label="Clients" value={d.clients} hint={`${d.subscribers} newsletter subscribers`} />
        <Stat label="Revenue · 30 days" value={`${d.revenue30.toLocaleString("en")} XAF`} hint={`${d.pendingPayments} pending payments`} />
      </div>
      <section>
        <div className="flex items-baseline justify-between"><h2 className="display-sm">Upcoming appointments</h2><Link href="/admin/appointments" className="text-xs uppercase tracking-[0.14em] text-mulberry">All</Link></div>
        <Table head={["When", "Client", "Service", "Format", "Status", ""]} className="mt-4">
          {d.upcoming.length === 0 ? <tr><Td className="text-ink-muted">Nothing scheduled.</Td></tr> : null}
          {d.upcoming.map((a) => (
            <tr key={a.id}>
              <Td>{formatInTimeZone(new Date(a.starts_at), SITE.timeZone, "EEE d MMM · HH:mm")}</Td>
              <Td>{a.guest_name}<br /><span className="text-xs text-ink-muted">{a.guest_email}</span></Td>
              <Td>{a.service_slug}</Td>
              <Td>{a.format}</Td>
              <Td><Badge tone={a.status === "confirmed" ? "success" : a.status === "pending_payment" ? "warning" : "muted"}>{a.status}</Badge></Td>
              <Td><Link href={`/admin/appointments/${a.id}`} className="text-mulberry">Brief</Link></Td>
            </tr>
          ))}
        </Table>
      </section>
      <section>
        <div className="flex items-baseline justify-between"><h2 className="display-sm">Recent leads</h2><Link href="/admin/leads" className="text-xs uppercase tracking-[0.14em] text-mulberry">All</Link></div>
        <Table head={["Received", "Name", "Channel", "Topic", "Status"]} className="mt-4">
          {d.recentLeads.length === 0 ? <tr><Td className="text-ink-muted">No leads yet.</Td></tr> : null}
          {d.recentLeads.map((l) => (
            <tr key={l.id}><Td>{new Date(l.created_at).toLocaleDateString("en-GB")}</Td><Td>{l.name ?? "—"}<br /><span className="text-xs text-ink-muted">{l.email}</span></Td><Td>{l.channel}</Td><Td>{l.topic}</Td><Td><Badge tone={l.status === "new" ? "mulberry" : "muted"}>{l.status}</Badge></Td></tr>
          ))}
        </Table>
      </section>
    </div>
  );
}
