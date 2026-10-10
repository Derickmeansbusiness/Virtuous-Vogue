"use server";

import { z } from "zod";
import { randomUUID } from "node:crypto";
import { headers } from "next/headers";
import { addMinutes } from "date-fns";
import { getAdminStore } from "@/lib/data/store";
import { getSessionUser } from "@/lib/auth/session";
import { getServiceBySlug } from "@/lib/domain/services";
import { getSlots, isSlotFree } from "@/lib/booking/availability";
import { getBookingProvider } from "@/lib/booking/provider";
import { getProviderFor, getProviderByName, availableMethods, type PaymentMethod } from "@/lib/payments/provider";
import { rateLimit } from "@/lib/security/rate-limit";
import { sendEmail } from "@/lib/email/send";
import { BookingEmail } from "@/lib/email/templates/booking";
import { SITE } from "@/lib/site";
import { pick } from "@/content/types";

export async function fetchSlots(input: { serviceSlug: string; format: string; from: string; to: string }) {
  const service = await getServiceBySlug(input.serviceSlug);
  if (!service) return {};
  return getSlots({ serviceSlug: service.slug, durationMinutes: service.durationMinutes, format: input.format, from: new Date(input.from), to: new Date(input.to) });
}

export async function paymentOptions(currency = "XAF") {
  return { methods: availableMethods(currency), manualAllowed: true };
}

const createSchema = z.object({
  serviceSlug: z.string(),
  format: z.enum(["in_person", "virtual", "group"]),
  startsAt: z.string().datetime(),
  timeZone: z.string().max(64),
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().toLowerCase().email(),
  phone: z.string().trim().max(32).optional(),
  goals: z.string().trim().max(2000).optional(),
  attachPassport: z.boolean().optional(),
  compassId: z.string().optional(),
  outfitId: z.string().optional(),
  locale: z.enum(["en", "fr"]).default("en"),
  method: z.enum(["mtn_momo", "orange_money", "card", "later"]),
  momoPhone: z.string().trim().max(32).optional(),
});

export type CreateBookingResult =
  | { ok: true; appointmentId: string; manageToken: string; payment: null | { id: string; kind: "redirect"; url: string } | { id: string; kind: "push"; instructions: string } }
  | { ok: false; error: "invalid" | "service" | "slot" | "rate" | "payment" | "server" };

export async function createBooking(raw: unknown): Promise<CreateBookingResult> {
  const parsed = createSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "invalid" };
  const input = parsed.data;
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0] ?? "anon";
  if (!(await rateLimit(`booking:${ip}`, 6, 10 * 60_000))) return { ok: false, error: "rate" };

  const service = await getServiceBySlug(input.serviceSlug);
  if (!service || !service.formats.includes(input.format)) return { ok: false, error: "service" };
  const startsAt = new Date(input.startsAt);
  const endsAt = addMinutes(startsAt, service.durationMinutes);
  if (!(await isSlotFree(startsAt, endsAt))) return { ok: false, error: "slot" };

  const user = await getSessionUser();
  const store = getAdminStore();
  const manageToken = randomUUID().replace(/-/g, "");
  const price = service.priceXaf;
  const deposit = price ? Math.round((price * service.depositPercent) / 100) : null;
  const wantsPayment = input.method !== "later" && deposit && deposit > 0;

  try {
    const appointment = await store.insert<{ id: string }>("appointments", {
      user_id: user?.id ?? null,
      guest_email: input.email,
      guest_name: input.name,
      guest_phone: input.phone ?? null,
      service_slug: service.slug,
      format: input.format,
      starts_at: startsAt.toISOString(),
      ends_at: endsAt.toISOString(),
      time_zone: input.timeZone,
      status: wantsPayment ? "pending_payment" : "confirmed",
      style_goals: input.goals ?? null,
      context: { attachPassport: Boolean(input.attachPassport && user), compassId: input.compassId ?? null, outfitId: input.outfitId ?? null, locale: input.locale, priceAtBooking: price, deposit },
      style_profile_id: input.compassId ?? null,
      outfit_id: input.outfitId ?? null,
      manage_token: manageToken,
      reminders_sent: {},
    });

    // Mirror on the stylist's calendar when Cal.com is configured (never blocks the client).
    const provider = getBookingProvider();
    provider
      .createBooking({ serviceSlug: service.slug, eventTypeId: null, startsAt, endsAt, name: input.name, email: input.email, phone: input.phone, notes: input.goals, timeZone: input.timeZone, locale: input.locale })
      .then(({ uid }) => (uid ? store.update("appointments", appointment.id, { cal_booking_uid: uid }) : null))
      .catch((e) => console.warn("[booking] calendar mirror failed", e));

    if (!wantsPayment) {
      await notifyBooking(appointment.id, "pending_confirmation", input.locale).catch(() => {});
      return { ok: true, appointmentId: appointment.id, manageToken, payment: null };
    }

    const method = input.method as PaymentMethod;
    const gateway = getProviderFor(method, "XAF") ?? getProviderByName("manual")!;
    const idempotencyKey = `vv_${appointment.id.slice(0, 8)}_${randomUUID().slice(0, 8)}`;
    const payment = await store.insert<{ id: string }>("payments", {
      appointment_id: appointment.id,
      user_id: user?.id ?? null,
      provider: gateway.name,
      idempotency_key: idempotencyKey,
      amount: deposit,
      currency: "XAF",
      status: "initiated",
      method,
      customer_email: input.email,
      customer_phone: input.momoPhone ?? input.phone ?? null,
      metadata: { service: service.slug },
    });
    try {
      const result = await gateway.initiate({
        paymentId: payment.id,
        idempotencyKey,
        amount: deposit!,
        currency: "XAF",
        method,
        customer: { email: input.email, name: input.name, phone: input.momoPhone ?? input.phone },
        description: `${pick(service.name, input.locale)} · deposit`,
        returnUrl: `${SITE.url}/book/confirm/${manageToken}?payment=${payment.id}`,
        metadata: { appointment_id: appointment.id, payment_id: payment.id },
      });
      await store.update("payments", payment.id, { provider_reference: result.providerReference, status: result.kind === "none" ? "pending" : "pending" });
      await store.insert("transactions", { payment_id: payment.id, event: "initiate", provider_event_id: `init:${idempotencyKey}`, status: "pending", raw: { kind: result.kind } });
      if (result.kind === "redirect") return { ok: true, appointmentId: appointment.id, manageToken, payment: { id: payment.id, kind: "redirect", url: result.url } };
      if (result.kind === "push") return { ok: true, appointmentId: appointment.id, manageToken, payment: { id: payment.id, kind: "push", instructions: result.instructions } };
      // manual: nothing to do, stylist confirms
      await store.update("appointments", appointment.id, { status: "confirmed" });
      await notifyBooking(appointment.id, "pending_confirmation", input.locale).catch(() => {});
      return { ok: true, appointmentId: appointment.id, manageToken, payment: null };
    } catch (e) {
      console.error("[booking] payment initiate", e);
      await store.update("payments", payment.id, { status: "failed" });
      return { ok: false, error: "payment" };
    }
  } catch (e) {
    console.error("[booking] create", e);
    return { ok: false, error: "server" };
  }
}

/** Polled by the confirmation page while a Mobile Money push is pending. Always re-verifies server-side. */
export async function checkPayment(paymentId: string): Promise<{ status: string; appointmentStatus?: string }> {
  const store = getAdminStore();
  const payment = await store.get<{ id: string; provider: string; provider_reference: string | null; status: string; appointment_id: string | null; amount: number }>("payments", paymentId);
  if (!payment) return { status: "unknown" };
  if (payment.status === "succeeded" || payment.status === "failed") {
    const a = payment.appointment_id ? await store.get<{ status: string }>("appointments", payment.appointment_id) : null;
    return { status: payment.status, appointmentStatus: a?.status };
  }
  const gateway = getProviderByName(payment.provider);
  if (!gateway || !payment.provider_reference) return { status: payment.status };
  const v = await gateway.verify(payment.provider_reference).catch(() => null);
  if (v && v.status !== "pending") await settlePayment(payment.id, v.status, v.amount, `verify:${Date.now()}`, v.raw);
  const fresh = await store.get<{ status: string; appointment_id: string | null }>("payments", paymentId);
  const a = fresh?.appointment_id ? await store.get<{ status: string }>("appointments", fresh.appointment_id) : null;
  return { status: fresh?.status ?? payment.status, appointmentStatus: a?.status };
}

/** Single place that moves a payment to a terminal state and confirms the appointment. Idempotent. */
export async function settlePayment(paymentId: string, status: "succeeded" | "failed" | "cancelled", amount: number | undefined, eventId: string, raw: unknown) {
  const store = getAdminStore();
  const payment = await store.get<{ id: string; status: string; amount: number; appointment_id: string | null }>("payments", paymentId);
  if (!payment) return;
  const existing = await store.list("transactions", { payment_id: paymentId, provider_event_id: eventId });
  if (existing.length) return; // already processed
  await store.insert("transactions", { payment_id: paymentId, event: status, provider_event_id: eventId, status, raw: raw ?? {} });
  if (payment.status === "succeeded") return;
  if (status === "succeeded" && amount !== undefined && Math.round(amount) < payment.amount) {
    await store.update("payments", paymentId, { status: "failed", metadata: { reason: "amount_mismatch", received: amount } });
    return;
  }
  await store.update("payments", paymentId, { status, verified_at: status === "succeeded" ? new Date().toISOString() : null });
  if (status === "succeeded" && payment.appointment_id) {
    const appt = await store.update<{ context: { locale?: string } }>("appointments", payment.appointment_id, { status: "confirmed" });
    await notifyBooking(payment.appointment_id, "confirmed", appt.context?.locale ?? "en").catch(() => {});
  }
}

export async function notifyBooking(appointmentId: string, kind: "confirmed" | "pending_confirmation" | "reminder_24h" | "reminder_2h" | "cancelled" | "rescheduled", locale: string) {
  const store = getAdminStore();
  const a = await store.get<{ guest_email: string; guest_name: string; service_slug: string; starts_at: string; time_zone: string; format: string; manage_token: string }>("appointments", appointmentId);
  if (!a) return;
  const service = await getServiceBySlug(a.service_slug);
  const subjectMap: Record<typeof kind, [string, string]> = {
    confirmed: ["Your consultation is confirmed", "Votre consultation est confirmée"],
    pending_confirmation: ["We received your request", "Nous avons reçu votre demande"],
    reminder_24h: ["Tomorrow: your consultation", "Demain : votre consultation"],
    reminder_2h: ["In two hours: your consultation", "Dans deux heures : votre consultation"],
    cancelled: ["Your consultation was cancelled", "Votre consultation a été annulée"],
    rescheduled: ["Your consultation was rescheduled", "Votre consultation a été reportée"],
  };
  const subject = subjectMap[kind][locale === "fr" ? 1 : 0];
  await sendEmail({
    to: a.guest_email,
    subject: `${subject} · Virtuous Vogue`,
    react: BookingEmail({ kind, locale, name: a.guest_name, service: service ? pick(service.name, locale) : a.service_slug, startsAt: a.starts_at, timeZone: a.time_zone, format: a.format, manageUrl: `${SITE.url}/book/manage/${a.manage_token}`, icsUrl: `${SITE.url}/api/bookings/${a.manage_token}/calendar.ics` }),
  });
  const stylist = process.env.STYLIST_NOTIFICATION_EMAIL;
  if (stylist && (kind === "confirmed" || kind === "pending_confirmation" || kind === "cancelled" || kind === "rescheduled")) {
    await sendEmail({ to: stylist, subject: `[Cockpit] ${subject}: ${a.guest_name}`, react: BookingEmail({ kind, locale: "en", name: a.guest_name, service: service?.name.en ?? a.service_slug, startsAt: a.starts_at, timeZone: SITE.timeZone, format: a.format, manageUrl: `${SITE.url}/admin/appointments/${appointmentId}`, icsUrl: `${SITE.url}/api/bookings/${a.manage_token}/calendar.ics`, forStylist: true }) }).catch(() => {});
  }
}

const manageSchema = z.object({ token: z.string().min(10), action: z.enum(["cancel", "reschedule"]), startsAt: z.string().datetime().optional(), reason: z.string().max(300).optional() });

export async function manageBooking(raw: unknown): Promise<{ ok: true } | { ok: false; error: "invalid" | "notFound" | "late" | "slot" | "server" }> {
  const parsed = manageSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "invalid" };
  const store = getAdminStore();
  const rows = await store.list<{ id: string; starts_at: string; service_slug: string; cal_booking_uid: string | null; status: string; context: { locale?: string } }>("appointments", { manage_token: parsed.data.token });
  const a = rows[0];
  if (!a) return { ok: false, error: "notFound" };
  const hoursAway = (new Date(a.starts_at).getTime() - Date.now()) / 36e5;
  if (hoursAway < 24) return { ok: false, error: "late" };
  const provider = getBookingProvider();
  try {
    if (parsed.data.action === "cancel") {
      await store.update("appointments", a.id, { status: "cancelled", cancelled_reason: parsed.data.reason ?? null });
      if (a.cal_booking_uid) await provider.cancelBooking(a.cal_booking_uid, parsed.data.reason).catch(() => {});
      await notifyBooking(a.id, "cancelled", a.context?.locale ?? "en").catch(() => {});
      return { ok: true };
    }
    const service = await getServiceBySlug(a.service_slug);
    if (!service || !parsed.data.startsAt) return { ok: false, error: "invalid" };
    const startsAt = new Date(parsed.data.startsAt);
    const endsAt = addMinutes(startsAt, service.durationMinutes);
    if (!(await isSlotFree(startsAt, endsAt))) return { ok: false, error: "slot" };
    await store.update("appointments", a.id, { starts_at: startsAt.toISOString(), ends_at: endsAt.toISOString(), status: a.status === "cancelled" ? "cancelled" : "rescheduled", reminders_sent: {} });
    if (a.cal_booking_uid) await provider.rescheduleBooking(a.cal_booking_uid, startsAt).catch(() => {});
    await notifyBooking(a.id, "rescheduled", a.context?.locale ?? "en").catch(() => {});
    return { ok: true };
  } catch (e) {
    console.error("[booking] manage", e);
    return { ok: false, error: "server" };
  }
}
