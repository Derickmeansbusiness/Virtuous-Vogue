import { getAdminStore } from "@/lib/data/store";
import { PageHeader, Table, Td, Badge, Stat } from "@/components/admin/ui";
import { SubscriberToggle } from "@/components/admin/subscriber-toggle";

export default async function AdminNewsletter() {
  const subs = await getAdminStore().list<{ id: string; email: string; status: string; source?: string; locale?: string; created_at: string }>("newsletter_subscribers", {}, { orderBy: "created_at" });
  const active = subs.filter((s) => s.status === "subscribed");
  return (
    <div className="space-y-8">
      <PageHeader title="The Virtuous Edit" body="Subscribers with explicit consent. Export as CSV for your sending tool." action={<a href="/api/admin/subscribers.csv" className="text-xs uppercase tracking-[0.14em] text-mulberry">Export CSV</a>} />
      <div className="grid gap-4 sm:grid-cols-3"><Stat label="Subscribed" value={active.length} /><Stat label="French" value={active.filter((s) => s.locale === "fr").length} /><Stat label="Unsubscribed" value={subs.length - active.length} /></div>
      <Table head={["Email", "Source", "Locale", "Since", "Status", ""]}>
        {subs.map((s) => <tr key={s.id}><Td>{s.email}</Td><Td>{s.source}</Td><Td>{s.locale}</Td><Td>{new Date(s.created_at).toLocaleDateString("en-GB")}</Td><Td><Badge tone={s.status === "subscribed" ? "success" : "muted"}>{s.status}</Badge></Td><Td><SubscriberToggle id={s.id} status={s.status} /></Td></tr>)}
      </Table>
    </div>
  );
}
