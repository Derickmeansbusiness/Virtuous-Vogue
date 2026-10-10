import { Link } from "@/i18n/navigation";
import { getAdminStore } from "@/lib/data/store";
import { articles as seed } from "@/content/articles";
import { PageHeader, Table, Td, Badge } from "@/components/admin/ui";

export default async function AdminMagazine() {
  const rows = await getAdminStore().list<{ id: string; slug: string; status: string; updated_at?: string }>("articles");
  const all = [...seed.map((a) => ({ slug: a.slug, title: a.title.en, source: "seed", status: rows.find((r) => r.slug === a.slug)?.status ?? "published (seed)" })), ...rows.filter((r) => !seed.some((s) => s.slug === r.slug)).map((r) => ({ slug: r.slug, title: r.slug, source: "cms", status: r.status }))];
  return (
    <div className="space-y-6">
      <PageHeader title="Magazine" body="Seed stories are marked DEMO in code. Create or override any story in the CMS by slug; an override wins over the seed." action={<Link href="/admin/magazine/new" className="text-xs uppercase tracking-[0.14em] text-mulberry">New story</Link>} />
      <Table head={["Title", "Slug", "Source", "Status", ""]}>
        {all.map((a) => <tr key={a.slug}><Td>{a.title}</Td><Td className="font-mono text-xs">{a.slug}</Td><Td><Badge>{a.source}</Badge></Td><Td><Badge tone={a.status.startsWith("published") ? "success" : "muted"}>{a.status}</Badge></Td><Td><Link href={`/admin/magazine/${a.slug}`} className="text-mulberry">Edit</Link></Td></tr>)}
      </Table>
    </div>
  );
}
