import { Link } from "@/i18n/navigation";
import { getAdminStore } from "@/lib/data/store";
import type { Profile } from "@/lib/domain/admin";
import { Table, Td, PageHeader, Badge } from "@/components/admin/ui";

export default async function AdminClients({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const store = getAdminStore();
  const [profiles, appointments] = await Promise.all([store.list<Profile>("profiles", {}, { orderBy: "created_at" }), store.list<{ user_id: string | null }>("appointments")]);
  const rows = profiles.filter((p) => p.role !== "admin").filter((p) => !q || `${p.full_name ?? ""} ${p.email} ${p.city ?? ""}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="space-y-6">
      <PageHeader title="Clients" body={`${rows.length} Style Passports`} action={<form className="flex gap-2"><input name="q" defaultValue={q} placeholder="Search" className="border-b border-line-strong bg-transparent py-1 text-sm outline-none" aria-label="Search clients" /></form>} />
      <Table head={["Name", "Email", "City", "Appointments", "Since", ""]}>
        {rows.length === 0 ? <tr><Td className="text-ink-muted">No clients yet.</Td></tr> : null}
        {rows.map((p) => (
          <tr key={p.id}>
            <Td>{p.full_name ?? "—"}</Td><Td>{p.email}</Td><Td>{p.city ?? "—"}</Td>
            <Td><Badge>{appointments.filter((a) => a.user_id === p.id).length}</Badge></Td>
            <Td>{new Date(p.created_at).toLocaleDateString("en-GB")}</Td>
            <Td><Link href={`/admin/clients/${p.id}`} className="text-mulberry">Open</Link></Td>
          </tr>
        ))}
      </Table>
    </div>
  );
}
