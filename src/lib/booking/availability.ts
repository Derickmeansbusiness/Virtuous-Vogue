import "server-only";
import { addMinutes, eachDayOfInterval, format, isBefore, isSameDay, startOfDay } from "date-fns";
import { fromZonedTime, toZonedTime } from "date-fns-tz";
import { getAdminStore } from "@/lib/data/store";
import { SITE } from "@/lib/site";
import { getBookingProvider } from "./provider";

export type AvailabilityRule = {
  id: string;
  weekday: number | null;
  date: string | null;
  start_time: string;
  end_time: string;
  formats: string[] | null;
  buffer_minutes: number;
  is_day_off: boolean;
};

export type Slot = { startsAt: string; endsAt: string };

const DEFAULT_RULES: AvailabilityRule[] = [2, 3, 4, 5].map((w) => ({ id: `d${w}`, weekday: w, date: null, start_time: "09:00", end_time: "17:00", formats: null, buffer_minutes: 15, is_day_off: false })).concat([{ id: "d6", weekday: 6, date: null, start_time: "10:00", end_time: "15:00", formats: null, buffer_minutes: 15, is_day_off: false }]);

async function loadRules(): Promise<AvailabilityRule[]> {
  try {
    const rows = await getAdminStore().list<AvailabilityRule>("availability");
    return rows.length ? rows : DEFAULT_RULES;
  } catch {
    return DEFAULT_RULES;
  }
}

async function loadBusy(from: Date, to: Date): Promise<{ start: Date; end: Date }[]> {
  const rows = await getAdminStore().list<{ starts_at: string; ends_at: string; status: string }>("appointments").catch(() => []);
  return rows
    .filter((a) => !["cancelled"].includes(a.status))
    .map((a) => ({ start: new Date(a.starts_at), end: new Date(a.ends_at) }))
    .filter((a) => a.end > from && a.start < to);
}

/**
 * Computes bookable slots for a service over a date range in the studio's
 * time zone, honouring weekly rules, specific-date rules, days off, buffer
 * time, existing appointments and a 12-hour minimum notice. When Cal.com is
 * configured its availability is intersected with the local rules.
 */
export async function getSlots({ serviceSlug, durationMinutes, format: fmt, from, to, stepMinutes = 30 }: { serviceSlug: string; durationMinutes: number; format: string; from: Date; to: Date; stepMinutes?: number }): Promise<Record<string, Slot[]>> {
  const tz = SITE.timeZone;
  const rules = await loadRules();
  const busy = await loadBusy(from, to);
  const provider = getBookingProvider();
  const external = await provider.getBusy({ serviceSlug, from, to }).catch(() => [] as { start: Date; end: Date }[]);
  const allBusy = [...busy, ...external];
  const minStart = addMinutes(new Date(), 12 * 60);
  const result: Record<string, Slot[]> = {};

  for (const day of eachDayOfInterval({ start: from, end: to })) {
    const local = toZonedTime(day, tz);
    const key = format(local, "yyyy-MM-dd");
    const dayRules = rules.filter((r) => (r.date ? r.date === key : r.weekday === local.getDay()));
    if (dayRules.some((r) => r.is_day_off)) {
      result[key] = [];
      continue;
    }
    const slots: Slot[] = [];
    for (const r of dayRules) {
      if (r.formats && r.formats.length && !r.formats.includes(fmt)) continue;
      const [sh, sm] = r.start_time.split(":").map(Number);
      const [eh, em] = r.end_time.split(":").map(Number);
      let cursor = fromZonedTime(new Date(local.getFullYear(), local.getMonth(), local.getDate(), sh, sm), tz);
      const end = fromZonedTime(new Date(local.getFullYear(), local.getMonth(), local.getDate(), eh, em), tz);
      while (!isBefore(end, addMinutes(cursor, durationMinutes))) {
        const slotEnd = addMinutes(cursor, durationMinutes);
        const padded = { start: addMinutes(cursor, -r.buffer_minutes), end: addMinutes(slotEnd, r.buffer_minutes) };
        const clash = allBusy.some((b) => b.start < padded.end && b.end > padded.start);
        if (!clash && !isBefore(cursor, minStart)) slots.push({ startsAt: cursor.toISOString(), endsAt: slotEnd.toISOString() });
        cursor = addMinutes(cursor, stepMinutes);
      }
    }
    result[key] = slots.sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  }
  return result;
}

export async function isSlotFree(startsAt: Date, endsAt: Date) {
  const busy = await loadBusy(startOfDay(startsAt), endsAt);
  return !busy.some((b) => b.start < endsAt && b.end > startsAt && !isSameDay(b.start, new Date(0)));
}
