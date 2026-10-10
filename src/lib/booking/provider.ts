import "server-only";

/**
 * Booking provider abstraction. The native engine (availability.ts) is the
 * source of truth for the client-facing UI; Cal.com, when configured, is
 * used to mirror bookings onto the stylist's calendar and to pull external
 * busy times so the two never double-book.
 */
export interface BookingProvider {
  name: string;
  getBusy(input: { serviceSlug: string; from: Date; to: Date }): Promise<{ start: Date; end: Date }[]>;
  createBooking(input: { serviceSlug: string; eventTypeId?: string | null; startsAt: Date; endsAt: Date; name: string; email: string; phone?: string; notes?: string; timeZone: string; locale: string }): Promise<{ uid: string | null }>;
  cancelBooking(uid: string, reason?: string): Promise<void>;
  rescheduleBooking(uid: string, startsAt: Date): Promise<{ uid: string | null }>;
}

const nativeProvider: BookingProvider = {
  name: "native",
  async getBusy() {
    return [];
  },
  async createBooking() {
    return { uid: null };
  },
  async cancelBooking() {},
  async rescheduleBooking() {
    return { uid: null };
  },
};

function calcomProvider(): BookingProvider {
  const key = process.env.CALCOM_API_KEY!;
  const base = process.env.CALCOM_API_URL ?? "https://api.cal.com/v2";
  const headers = { Authorization: `Bearer ${key}`, "content-type": "application/json", "cal-api-version": "2024-08-13" };
  return {
    name: "calcom",
    async getBusy({ from, to }) {
      const username = process.env.CALCOM_USERNAME;
      if (!username) return [];
      const url = `${base}/slots/busy?username=${encodeURIComponent(username)}&dateFrom=${from.toISOString()}&dateTo=${to.toISOString()}`;
      const res = await fetch(url, { headers, next: { revalidate: 60 } });
      if (!res.ok) return [];
      const json = (await res.json()) as { data?: { start: string; end: string }[] };
      return (json.data ?? []).map((b) => ({ start: new Date(b.start), end: new Date(b.end) }));
    },
    async createBooking(input) {
      if (!input.eventTypeId) return { uid: null };
      const res = await fetch(`${base}/bookings`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          start: input.startsAt.toISOString(),
          eventTypeId: Number(input.eventTypeId),
          attendee: { name: input.name, email: input.email, timeZone: input.timeZone, language: input.locale, phoneNumber: input.phone },
          metadata: { source: "virtuous-vogue", service: input.serviceSlug },
          bookingFieldsResponses: { notes: input.notes ?? "" },
        }),
      });
      if (!res.ok) throw new Error(`cal.com ${res.status}`);
      const json = (await res.json()) as { data?: { uid?: string } };
      return { uid: json.data?.uid ?? null };
    },
    async cancelBooking(uid, reason) {
      await fetch(`${base}/bookings/${uid}/cancel`, { method: "POST", headers, body: JSON.stringify({ cancellationReason: reason ?? "Cancelled by client" }) });
    },
    async rescheduleBooking(uid, startsAt) {
      const res = await fetch(`${base}/bookings/${uid}/reschedule`, { method: "POST", headers, body: JSON.stringify({ start: startsAt.toISOString() }) });
      if (!res.ok) throw new Error(`cal.com ${res.status}`);
      const json = (await res.json()) as { data?: { uid?: string } };
      return { uid: json.data?.uid ?? uid };
    },
  };
}

export function getBookingProvider(): BookingProvider {
  return process.env.CALCOM_API_KEY ? calcomProvider() : nativeProvider;
}
