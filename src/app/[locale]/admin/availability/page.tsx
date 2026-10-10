import { getAdminStore } from "@/lib/data/store";
import type { AvailabilityRule } from "@/lib/booking/availability";
import { PageHeader, Table, Td, Badge } from "@/components/admin/ui";
import { AvailabilityForm, DeleteRuleButton } from "@/components/admin/availability-form";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default async function AdminAvailability() {
  const rules = await getAdminStore().list<AvailabilityRule>("availability");
  return (
    <div className="space-y-8">
      <PageHeader title="Availability" body="Weekly hours, specific dates, days off and buffer time. Times are Douala time. Without rules, the default Tue–Sat schedule applies." />
      <Table head={["Rule", "Hours", "Buffer", "Type", ""]}>
        {rules.length === 0 ? <tr><Td className="text-ink-muted">Using defaults: Tue–Fri 09:00–17:00, Sat 10:00–15:00, 15 min buffer.</Td></tr> : null}
        {rules.map((r) => <tr key={r.id}><Td>{r.date ?? (r.weekday !== null ? DAYS[r.weekday] : "—")}</Td><Td>{r.start_time}–{r.end_time}</Td><Td>{r.buffer_minutes} min</Td><Td><Badge tone={r.is_day_off ? "danger" : "success"}>{r.is_day_off ? "Day off" : "Open"}</Badge></Td><Td><DeleteRuleButton id={r.id} /></Td></tr>)}
      </Table>
      <AvailabilityForm />
    </div>
  );
}
