import "server-only";
import { getAdminStore } from "@/lib/data/store";
import type { AppointmentRow, ColourRow, WardrobeRow, OutfitRow, NoteRow } from "./passport";
import type { StyleProfileRow } from "./style-profiles";

export type Profile = { id: string; email: string; full_name?: string | null; phone?: string | null; whatsapp?: string | null; city?: string | null; locale?: string; role: string; created_at: string };

export async function adminDashboard() {
  const store = getAdminStore();
  const now = Date.now();
  const [appointments, leads, payments, profiles, subscribers] = await Promise.all([
    store.list<AppointmentRow>("appointments", {}, { orderBy: "starts_at", ascending: true }),
    store.list<{ id: string; status: string; created_at: string; name?: string; email?: string; topic?: string; channel: string }>("leads", {}, { orderBy: "created_at" }),
    store.list<{ id: string; status: string; amount: number; currency: string; created_at: string; method?: string }>("payments", {}, { orderBy: "created_at" }),
    store.list<Profile>("profiles", {}, { orderBy: "created_at" }),
    store.list<{ status: string }>("newsletter_subscribers"),
  ]);
  const upcoming = appointments.filter((a) => new Date(a.starts_at).getTime() >= now && a.status !== "cancelled").slice(0, 8);
  const revenue30 = payments.filter((p) => p.status === "succeeded" && now - new Date(p.created_at).getTime() < 30 * 864e5).reduce((s, p) => s + p.amount, 0);
  return {
    upcoming,
    newLeads: leads.filter((l) => l.status === "new"),
    clients: profiles.filter((p) => p.role !== "admin").length,
    subscribers: subscribers.filter((s) => s.status === "subscribed").length,
    revenue30,
    pendingPayments: payments.filter((p) => p.status === "pending" || p.status === "initiated").length,
    appointmentsTotal: appointments.length,
    recentLeads: leads.slice(0, 5),
  };
}

/** Concise pre-consultation brief for the stylist. */
export async function clientBrief(userId: string | null, guestEmail?: string) {
  const store = getAdminStore();
  if (!userId) {
    const leads = guestEmail ? await store.list("leads", { email: guestEmail }) : [];
    return { profile: null, compass: null, colour: null, wardrobeCount: 0, outfits: [], notes: [], leads, appointments: [] as AppointmentRow[], answers: [] as { question_key: string; answer: unknown }[] };
  }
  const [profile, compassList, colours, wardrobe, outfits, notes, appointments] = await Promise.all([
    store.get<Profile>("profiles", userId),
    store.list<StyleProfileRow>("style_profiles", { user_id: userId }, { orderBy: "created_at" }),
    store.list<ColourRow>("colour_profiles", { user_id: userId }, { orderBy: "created_at" }),
    store.list<WardrobeRow>("wardrobe_items", { user_id: userId }),
    store.list<OutfitRow>("outfits", { user_id: userId }, { orderBy: "created_at", limit: 5 }),
    store.list<NoteRow>("stylist_notes", { user_id: userId }, { orderBy: "created_at" }),
    store.list<AppointmentRow>("appointments", { user_id: userId }, { orderBy: "starts_at" }),
  ]);
  const compass = compassList[0] ?? null;
  const answers = compass ? await store.list<{ question_key: string; answer: unknown }>("style_answers", { style_profile_id: compass.id }) : [];
  return { profile, compass, colour: colours[0] ?? null, wardrobeCount: wardrobe.filter((w) => !w.archived_at).length, outfits, notes, leads: [], appointments, answers };
}
