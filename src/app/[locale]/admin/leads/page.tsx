import { getAdminStore } from "@/lib/data/store";
import { PageHeader, Table, Td, Badge } from "@/components/admin/ui";
import { LeadStatus } from "@/components/admin/lead-status";

export default async function AdminLeads() {
  const leads = await getAdminStore().list<{ id: string; name?: string; email?: string; phone?: string; channel: string; topic?: string; message?: string; status: "new" | "contacted" | "converted" | "closed"; created_at: string; context?: { outfit?: { items?: { slot: string; item: { name?: string; category: string; colour?: string } }[] } } }>("leads", {}, { orderBy: "created_at" });
  return (
    <div className="space-y-6">
      <PageHeader title="Leads" body="Contact form, Ask Virtuous Vogue and newsletter-sourced enquiries." />
      <Table head={["Received", "Who", "Channel", "Message", "Status"]}>
        {leads.length === 0 ? <tr><Td className="text-ink-muted">No leads yet.</Td></tr> : null}
        {leads.map((l) => (
          <tr key={l.id}>
            <Td>{new Date(l.created_at).toLocaleString("en-GB")}</Td>
            <Td>{l.name ?? "—"}<br /><span className="text-xs text-ink-muted">{l.email}{l.phone ? ` · ${l.phone}` : ""}</span></Td>
            <Td><Badge tone={l.channel === "ask_vv" ? "mulberry" : "muted"}>{l.channel}</Badge><br /><span className="text-xs text-ink-muted">{l.topic}</span></Td>
            <Td className="max-w-md"><p className="whitespace-pre-line text-sm">{l.message}</p>{l.context?.outfit?.items ? <p className="mt-1 text-xs text-ink-muted">Look: {l.context.outfit.items.map((i) => `${i.slot}: ${i.item.name ?? i.item.category}${i.item.colour ? ` (${i.item.colour})` : ""}`).join(" · ")}</p> : null}</Td>
            <Td><LeadStatus id={l.id} status={l.status} /></Td>
          </tr>
        ))}
      </Table>
    </div>
  );
}
