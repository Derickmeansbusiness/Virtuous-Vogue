import { getAdminStore } from "@/lib/data/store";
import { PageHeader, Table, Td, Badge } from "@/components/admin/ui";
import { TestimonialForm, DeleteTestimonialButton } from "@/components/admin/testimonial-form";

export default async function AdminTestimonials() {
  const rows = await getAdminStore().list<{ id: string; client_name: string; quote_en: string; status: string; consent_at: string | null; context?: string | null }>("testimonials", {}, { orderBy: "sort_order", ascending: true });
  return (
    <div className="space-y-8">
      <PageHeader title="Client stories" body="Only real, consented testimonials are ever shown. Nothing is published without written consent recorded here." />
      <Table head={["Client", "Quote", "Consent", "Status", ""]}>
        {rows.length === 0 ? <tr><Td className="text-ink-muted">None yet. The homepage shows an honest empty state until the first one.</Td></tr> : null}
        {rows.map((r) => <tr key={r.id}><Td>{r.client_name}<br /><span className="text-xs text-ink-muted">{r.context}</span></Td><Td className="max-w-md text-sm">“{r.quote_en}”</Td><Td><Badge tone={r.consent_at ? "success" : "danger"}>{r.consent_at ? "Yes" : "No"}</Badge></Td><Td><Badge tone={r.status === "published" ? "success" : "muted"}>{r.status}</Badge></Td><Td><DeleteTestimonialButton id={r.id} /></Td></tr>)}
      </Table>
      <TestimonialForm />
    </div>
  );
}
