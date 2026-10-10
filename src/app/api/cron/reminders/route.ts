import { NextResponse, type NextRequest } from "next/server";
import { getAdminStore } from "@/lib/data/store";
import { notifyBooking } from "@/lib/actions/booking";

/**
 * Reminder dispatcher. Schedule hourly (Vercel Cron or any scheduler) with
 * Authorization: Bearer CRON_SECRET. Sends 24h and 2h reminders once each.
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const store = getAdminStore();
  const now = Date.now();
  const rows = await store.list<{ id: string; starts_at: string; status: string; reminders_sent: Record<string, string>; context: { locale?: string } }>("appointments");
  let sent = 0;
  for (const a of rows) {
    if (!["confirmed", "rescheduled"].includes(a.status)) continue;
    const hours = (new Date(a.starts_at).getTime() - now) / 36e5;
    const sentMap = a.reminders_sent ?? {};
    if (hours <= 24 && hours > 2 && !sentMap["24h"]) {
      await notifyBooking(a.id, "reminder_24h", a.context?.locale ?? "en");
      await store.update("appointments", a.id, { reminders_sent: { ...sentMap, "24h": new Date().toISOString() } });
      sent++;
    } else if (hours <= 2 && hours > 0 && !sentMap["2h"]) {
      await notifyBooking(a.id, "reminder_2h", a.context?.locale ?? "en");
      await store.update("appointments", a.id, { reminders_sent: { ...sentMap, "2h": new Date().toISOString() } });
      sent++;
    }
  }
  return NextResponse.json({ sent });
}
