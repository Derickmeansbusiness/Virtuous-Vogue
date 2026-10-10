"use client";

import * as React from "react";
import { useRouter } from "@/i18n/navigation";
import { setAppointmentStatus, markPaidManually } from "@/lib/actions/admin";
import { Button } from "@/components/ui/button";

export function AppointmentActions({ id, status, paymentId }: { id: string; status: string; paymentId?: string }) {
  const router = useRouter();
  const [busy, setBusy] = React.useState(false);
  const act = async (fn: () => Promise<unknown>) => { setBusy(true); await fn(); setBusy(false); router.refresh(); };
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {status !== "confirmed" && status !== "cancelled" ? <Button size="sm" onClick={() => act(() => setAppointmentStatus(id, "confirmed"))} disabled={busy}>Confirm</Button> : null}
      {paymentId ? <Button size="sm" variant="secondary" onClick={() => act(() => markPaidManually(paymentId))} disabled={busy}>Mark deposit received</Button> : null}
      {status !== "completed" && status !== "cancelled" ? <Button size="sm" variant="ghost" onClick={() => act(() => setAppointmentStatus(id, "completed"))} disabled={busy}>Completed</Button> : null}
      {status !== "cancelled" ? <Button size="sm" variant="ghost" onClick={() => act(() => setAppointmentStatus(id, "no_show"))} disabled={busy}>No-show</Button> : null}
      {status !== "cancelled" ? <Button size="sm" variant="ghost" className="text-danger" onClick={() => confirm("Cancel this appointment?") && act(() => setAppointmentStatus(id, "cancelled"))} disabled={busy}>Cancel</Button> : null}
    </div>
  );
}
