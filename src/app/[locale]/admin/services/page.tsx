import { listServices } from "@/lib/domain/services";
import { getAdminStore } from "@/lib/data/store";
import { PageHeader } from "@/components/admin/ui";
import { ServiceForm } from "@/components/admin/service-form";

export default async function AdminServices() {
  const services = await listServices();
  const rows = await getAdminStore().list<{ slug: string; active: boolean; cal_event_type_id?: string | null; location_note?: string | null }>("services");
  return (
    <div className="space-y-8">
      <PageHeader title="Services" body="Duration, price (XAF), deposit, capacity, formats and availability per consultation. Prices are only shown publicly once set here." />
      <div className="grid gap-6 lg:grid-cols-2">
        {services.map((s) => {
          const r = rows.find((x) => x.slug === s.slug);
          return <ServiceForm key={s.slug} service={s} row={r} />;
        })}
      </div>
    </div>
  );
}
