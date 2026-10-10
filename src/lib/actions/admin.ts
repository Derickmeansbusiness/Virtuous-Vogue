"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/session";
import { getAdminStore } from "@/lib/data/store";
import { notifyBooking, settlePayment } from "./booking";

export type AdminFormState = { status: "idle" } | { status: "success"; id?: string } | { status: "error"; message?: string };

async function audit(action: string, entity: string, entityId: string, meta: Record<string, unknown> = {}) {
  const admin = await requireAdmin();
  await getAdminStore().insert("audit_log", { actor_id: admin.id, action, entity, entity_id: entityId, meta }).catch(() => {});
}

export async function setAppointmentStatus(id: string, status: "confirmed" | "completed" | "cancelled" | "no_show") {
  await requireAdmin();
  const store = getAdminStore();
  const a = await store.update<{ context: { locale?: string } }>("appointments", id, { status });
  if (status === "confirmed") await notifyBooking(id, "confirmed", a.context?.locale ?? "en").catch(() => {});
  if (status === "cancelled") await notifyBooking(id, "cancelled", a.context?.locale ?? "en").catch(() => {});
  await audit("appointment.status", "appointments", id, { status });
  revalidatePath("/admin/appointments");
  return { ok: true };
}

export async function markPaidManually(paymentId: string) {
  const admin = await requireAdmin();
  await settlePayment(paymentId, "succeeded", undefined, `manual:${admin.id}:${Date.now()}`, { by: admin.id });
  await audit("payment.manual", "payments", paymentId);
  revalidatePath("/admin");
  return { ok: true };
}

const noteSchema = z.object({ user_id: z.string(), appointment_id: z.string().optional(), kind: z.enum(["note", "principle", "priority", "colour", "outfit", "recommendation"]), title: z.string().max(120).optional(), body: z.string().min(1).max(4000), budget_hint: z.string().max(60).optional(), url: z.string().max(300).optional(), visible: z.literal("on").optional() });

export async function addStylistNote(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const admin = await requireAdmin();
  const parsed = noteSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: "error", message: "Check the fields." };
  const d = parsed.data;
  const store = getAdminStore();
  try {
    if (d.kind === "recommendation") {
      await store.insert("shopping_recommendations", { user_id: d.user_id, author_id: admin.id, title: d.title || d.body.slice(0, 60), reason: d.body, budget_hint: d.budget_hint || null, url: d.url || null, fills_gap: true, status: "suggested" });
    } else {
      await store.insert("stylist_notes", { user_id: d.user_id, author_id: admin.id, appointment_id: d.appointment_id ?? null, kind: d.kind, title: d.title || null, body: d.body, visible_to_client: d.visible === "on" });
    }
    await audit("note.add", "stylist_notes", d.user_id, { kind: d.kind });
    revalidatePath(`/admin/clients/${d.user_id}`);
    return { status: "success" };
  } catch (e) {
    return { status: "error", message: (e as Error).message };
  }
}

const serviceSchema = z.object({ slug: z.string(), active: z.literal("on").optional(), duration_minutes: z.coerce.number().int().min(15).max(600), price_xaf: z.coerce.number().int().min(0).optional().or(z.literal("")), deposit_percent: z.coerce.number().int().min(0).max(100), capacity: z.coerce.number().int().min(1).max(30), formats: z.array(z.string()).or(z.string()).optional(), location_note: z.string().max(200).optional(), cal_event_type_id: z.string().max(40).optional(), name_en: z.string().max(120).optional(), name_fr: z.string().max(120).optional(), short_en: z.string().max(300).optional(), short_fr: z.string().max(300).optional() });

export async function saveService(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  await requireAdmin();
  const raw = Object.fromEntries(formData) as Record<string, unknown>;
  raw.formats = formData.getAll("formats");
  const parsed = serviceSchema.safeParse(raw);
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message };
  const d = parsed.data;
  const store = getAdminStore();
  const existing = await store.list<{ id: string }>("services", { slug: d.slug });
  const row = { slug: d.slug, active: d.active === "on", duration_minutes: d.duration_minutes, price_xaf: d.price_xaf === "" || d.price_xaf === undefined ? null : d.price_xaf, deposit_percent: d.deposit_percent, capacity: d.capacity, formats: Array.isArray(d.formats) ? d.formats : d.formats ? [d.formats] : [], location_note: d.location_note || null, cal_event_type_id: d.cal_event_type_id || null, name_en: d.name_en || null, name_fr: d.name_fr || null, short_en: d.short_en || null, short_fr: d.short_fr || null };
  if (existing[0]) await store.update("services", existing[0].id, row);
  else await store.insert("services", row);
  await audit("service.save", "services", d.slug);
  revalidatePath("/services");
  revalidatePath("/admin/services");
  return { status: "success" };
}

const availabilitySchema = z.object({ weekday: z.coerce.number().int().min(0).max(6).optional().or(z.literal("")), date: z.string().optional(), start_time: z.string(), end_time: z.string(), buffer_minutes: z.coerce.number().int().min(0).max(120), is_day_off: z.literal("on").optional(), note: z.string().max(120).optional() });

export async function addAvailability(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  await requireAdmin();
  const parsed = availabilitySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message };
  const d = parsed.data;
  await getAdminStore().insert("availability", { weekday: d.date ? null : d.weekday === "" ? null : d.weekday, date: d.date || null, start_time: d.start_time, end_time: d.end_time, buffer_minutes: d.buffer_minutes, is_day_off: d.is_day_off === "on", note: d.note || null, formats: ["virtual", "in_person"] });
  revalidatePath("/admin/availability");
  return { status: "success" };
}

export async function deleteAvailability(id: string) {
  await requireAdmin();
  await getAdminStore().delete("availability", id);
  revalidatePath("/admin/availability");
  return { ok: true };
}

export async function setLeadStatus(id: string, status: "new" | "contacted" | "converted" | "closed") {
  await requireAdmin();
  await getAdminStore().update("leads", id, { status });
  revalidatePath("/admin/leads");
  return { ok: true };
}

const testimonialSchema = z.object({ id: z.string().optional(), client_name: z.string().min(1).max(120), quote_en: z.string().min(1).max(1200), quote_fr: z.string().max(1200).optional(), context: z.string().max(120).optional(), service_slug: z.string().max(60).optional(), consent: z.literal("on").optional(), status: z.enum(["draft", "published"]), sort_order: z.coerce.number().int().default(0) });

export async function saveTestimonial(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  await requireAdmin();
  const parsed = testimonialSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message };
  const d = parsed.data;
  if (d.status === "published" && d.consent !== "on") return { status: "error", message: "A testimonial can only be published with the client's written consent." };
  const store = getAdminStore();
  const row = { client_name: d.client_name, quote_en: d.quote_en, quote_fr: d.quote_fr || null, context: d.context || null, service_slug: d.service_slug || null, consent_at: d.consent === "on" ? new Date().toISOString() : null, status: d.status, sort_order: d.sort_order };
  if (d.id) await store.update("testimonials", d.id, row);
  else await store.insert("testimonials", row);
  revalidatePath("/");
  revalidatePath("/admin/testimonials");
  return { status: "success" };
}

export async function deleteTestimonial(id: string) {
  await requireAdmin();
  await getAdminStore().delete("testimonials", id);
  revalidatePath("/admin/testimonials");
  return { ok: true };
}

const articleSchema = z.object({ slug: z.string().min(3).max(120).regex(/^[a-z0-9-]+$/), status: z.enum(["draft", "published", "archived"]), data: z.string() });

export async function saveArticle(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  await requireAdmin();
  const parsed = articleSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message };
  let data: unknown;
  try {
    data = JSON.parse(parsed.data.data);
  } catch {
    return { status: "error", message: "Article JSON is not valid." };
  }
  const store = getAdminStore();
  const existing = await store.list<{ id: string }>("articles", { slug: parsed.data.slug });
  const row = { slug: parsed.data.slug, status: parsed.data.status, data, published_at: parsed.data.status === "published" ? new Date().toISOString() : null };
  if (existing[0]) await store.update("articles", existing[0].id, row);
  else await store.insert("articles", row);
  revalidatePath("/magazine");
  revalidatePath(`/magazine/${parsed.data.slug}`);
  return { status: "success" };
}

const lookbookSchema = z.object({ id: z.string().optional(), user_id: z.string(), title: z.string().min(1).max(120), theme: z.string().max(120).optional(), style_direction: z.string().max(120).optional(), palette: z.string().max(200).optional(), stylist_note: z.string().max(2000).optional(), status: z.enum(["draft", "published"]) });

export async function saveLookbook(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const admin = await requireAdmin();
  const parsed = lookbookSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message };
  const d = parsed.data;
  const store = getAdminStore();
  const row = { user_id: d.user_id, created_by: admin.id, title: d.title, theme: d.theme || null, style_direction: d.style_direction || null, palette: (d.palette ?? "").split(",").map((s) => s.trim()).filter(Boolean), stylist_note: d.stylist_note || null, status: d.status };
  const saved = d.id ? await store.update<{ id: string }>("lookbooks", d.id, row) : await store.insert<{ id: string }>("lookbooks", row);
  revalidatePath("/admin/lookbooks");
  return { status: "success", id: saved.id };
}

const lookbookItemSchema = z.object({ lookbook_id: z.string(), kind: z.enum(["outfit", "board", "note", "recommendation"]), title: z.string().max(120).optional(), body: z.string().max(3000).optional(), outfit_id: z.string().optional(), sort_order: z.coerce.number().int().default(0) });

export async function addLookbookItem(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  await requireAdmin();
  const parsed = lookbookItemSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message };
  const d = parsed.data;
  await getAdminStore().insert("lookbook_items", { lookbook_id: d.lookbook_id, kind: d.kind, title: d.title || null, body: d.body || null, outfit_id: d.outfit_id || null, sort_order: d.sort_order, annotations: [] });
  revalidatePath(`/admin/lookbooks/${d.lookbook_id}`);
  return { status: "success" };
}

export async function deleteLookbookItem(id: string, lookbookId: string) {
  await requireAdmin();
  await getAdminStore().delete("lookbook_items", id);
  revalidatePath(`/admin/lookbooks/${lookbookId}`);
  return { ok: true };
}

export async function setSubscriberStatus(id: string, status: "subscribed" | "unsubscribed") {
  await requireAdmin();
  await getAdminStore().update("newsletter_subscribers", id, { status });
  revalidatePath("/admin/newsletter");
  return { ok: true };
}
