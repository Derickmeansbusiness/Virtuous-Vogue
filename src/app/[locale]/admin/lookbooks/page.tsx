import { Link } from "@/i18n/navigation";
import { getAdminStore } from "@/lib/data/store";
import type { Profile } from "@/lib/domain/admin";
import { PageHeader, Table, Td, Badge } from "@/components/admin/ui";
import { LookbookForm } from "@/components/admin/lookbook-form";

export default async function AdminLookbooks({ searchParams }: { searchParams: Promise<{ client?: string }> }) {
  const { client } = await searchParams;
  const store = getAdminStore();
  const [lookbooks, profiles] = await Promise.all([store.list<{ id: string; user_id: string; title: string; status: string; created_at: string }>("lookbooks", {}, { orderBy: "created_at" }), store.list<Profile>("profiles")]);
  const clients = profiles.filter((p) => p.role !== "admin");
  return (
    <div className="space-y-8">
      <PageHeader title="Lookbook builder" body="Cover, client, theme, direction, palette, outfit boards, annotations, recommendations and a stylist note. Clients see published lookbooks in their Style Passport. PDF export is architected as a later step." />
      <Table head={["Title", "Client", "Status", "Created", ""]}>
        {lookbooks.length === 0 ? <tr><Td className="text-ink-muted">No lookbooks yet.</Td></tr> : null}
        {lookbooks.map((l) => <tr key={l.id}><Td>{l.title}</Td><Td>{clients.find((c) => c.id === l.user_id)?.email ?? l.user_id}</Td><Td><Badge tone={l.status === "published" ? "success" : "muted"}>{l.status}</Badge></Td><Td>{new Date(l.created_at).toLocaleDateString("en-GB")}</Td><Td><Link href={`/admin/lookbooks/${l.id}`} className="text-mulberry">Open</Link></Td></tr>)}
      </Table>
      <LookbookForm clients={clients.map((c) => ({ id: c.id, label: c.full_name ? `${c.full_name} · ${c.email}` : c.email }))} defaultClient={client} />
    </div>
  );
}
