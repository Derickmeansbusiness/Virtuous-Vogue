import { Link } from "@/i18n/navigation";
import { formatInTimeZone } from "date-fns-tz";
import { getAdminStore } from "@/lib/data/store";
import type { AppointmentRow } from "@/lib/domain/passport";
import { Table, Td, Badge, PageHeader } from "@/components/admin/ui";
import { SITE } from "@/lib/site";

export default async function AdminAppointments({ searchParams }: { searchParams: Promise<{ view?: string }> }) {
  const { view = "upcoming" } = await searchParams;
  const all = await getAdminStore().list<AppointmentRow>("appointments", {}, { orderBy: "starts_at", ascending: view === "upcoming" });
  // eslint-disable-next-line react-hooks/purity -- server component; current time is request-scoped
  const now = Date.now();
  const rows = view === "upcoming" ? all.filter((a) => new Date(a.starts_at).getTime() >= now) : all.filter((a) => new Date(a.starts_at).getTime() < now);
  return (
    <div className="space-y-6">
      <PageHeader title="Appointments" action={<div className="flex gap-3 text-xs uppercase tracking-[0.14em]"><Link href="/admin/appointments?view=upcoming" className={view === "upcoming" ? "text-mulberry" : "text-ink-muted"}>Upcoming</Link><Link href="/admin/appointments?view=past" className={view === "past" ? "text-mulberry" : "text-ink-muted"}>Past</Link></div>} />
      <Table head={["When", "Client", "Service", "Format", "Status", ""]}>
        {rows.length === 0 ? <tr><Td className="text-ink-muted">Nothing here.</Td></tr> : null}
        {rows.map((a) => (
          <tr key={a.id}>
            <Td>{formatInTimeZone(new Date(a.starts_at), SITE.timeZone, "EEE d MMM yyyy · HH:mm")}</Td>
            <Td>{a.guest_name}<br /><span className="text-xs text-ink-muted">{a.guest_email}</span></Td>
            <Td>{a.service_slug}</Td><Td>{a.format}</Td>
            <Td><Badge tone={a.status === "confirmed" ? "success" : a.status === "cancelled" ? "danger" : a.status === "pending_payment" ? "warning" : "muted"}>{a.status}</Badge></Td>
            <Td><Link href={`/admin/appointments/${a.id}`} className="text-mulberry">Open</Link></Td>
          </tr>
        ))}
      </Table>
    </div>
  );
}
