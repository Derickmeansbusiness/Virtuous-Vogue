"use client";

import { setLeadStatus } from "@/lib/actions/admin";

export function LeadStatus({ id, status }: { id: string; status: "new" | "contacted" | "converted" | "closed" }) {
  return (
    <select defaultValue={status} onChange={(e) => setLeadStatus(id, e.target.value as "new")} className="border-b border-line bg-transparent py-1 text-xs uppercase tracking-[0.12em]" aria-label="Lead status">
      {["new", "contacted", "converted", "closed"].map((s) => <option key={s} value={s}>{s}</option>)}
    </select>
  );
}
