import { Link } from "@/i18n/navigation";
import { getAdminStore } from "@/lib/data/store";
import { PageHeader, Table, Td, Badge, Stat } from "@/components/admin/ui";
import { listProviders } from "@/lib/payments/provider";

export default async function AdminPayments() {
  const payments = await getAdminStore().list<{ id: string; appointment_id: string | null; provider: string; method?: string; amount: number; currency: string; status: string; customer_email?: string; created_at: string; provider_reference?: string | null }>("payments", {}, { orderBy: "created_at" });
  const total = payments.filter((p) => p.status === "succeeded").reduce((s, p) => s + p.amount, 0);
  const providers = listProviders().map((p) => p.name);
  return (
    <div className="space-y-8">
      <PageHeader title="Payments" body={`Gateways configured: ${providers.length ? providers.join(", ") : "none (manual confirmation only)"}`} />
      <div className="grid gap-4 sm:grid-cols-3"><Stat label="Collected" value={`${total.toLocaleString("en")} XAF`} /><Stat label="Pending" value={payments.filter((p) => p.status === "pending" || p.status === "initiated").length} /><Stat label="Failed" value={payments.filter((p) => p.status === "failed").length} /></div>
      <Table head={["Date", "Client", "Amount", "Method", "Provider", "Status", "Ref", ""]}>
        {payments.length === 0 ? <tr><Td className="text-ink-muted">No payments yet.</Td></tr> : null}
        {payments.map((p) => <tr key={p.id}><Td>{new Date(p.created_at).toLocaleDateString("en-GB")}</Td><Td>{p.customer_email}</Td><Td>{p.amount.toLocaleString("en")} {p.currency}</Td><Td>{p.method}</Td><Td>{p.provider}</Td><Td><Badge tone={p.status === "succeeded" ? "success" : p.status === "failed" ? "danger" : "warning"}>{p.status}</Badge></Td><Td className="font-mono text-xs">{p.provider_reference ?? "—"}</Td><Td>{p.appointment_id ? <Link href={`/admin/appointments/${p.appointment_id}`} className="text-mulberry">Appointment</Link> : null}</Td></tr>)}
      </Table>
    </div>
  );
}
