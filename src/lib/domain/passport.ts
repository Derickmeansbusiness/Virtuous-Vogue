import "server-only";
import { getAdminStore } from "@/lib/data/store";
import { listUserStyleProfiles } from "./style-profiles";

export type AppointmentRow = { id: string; service_slug: string; starts_at: string; ends_at: string; status: string; format: string; time_zone: string; manage_token: string; style_goals?: string | null; guest_name?: string; guest_email?: string; user_id?: string | null; context?: Record<string, unknown> };
export type ColourRow = { id: string; undertone: string; contrast: string; confidence: number; families: { name: string; hex: string }[]; neutrals: { name: string; hex: string }[]; accents: { name: string; hex: string }[]; metals: string; combinations: string[]; test_carefully: { name: string; hex: string }[]; notes: string; image_path: string | null; source: string; created_at: string };
export type WardrobeRow = { id: string; category: string; subcategory?: string | null; name?: string | null; colour?: string | null; colour_hex?: string | null; pattern?: string | null; fabric?: string | null; fit?: string | null; seasons: string[]; occasions: string[]; is_favourite: boolean; archived_at?: string | null; created_at: string };
export type OutfitRow = { id: string; name?: string | null; occasion?: string | null; reasoning?: string | null; gap_suggestions: unknown[]; scheduled_for?: string | null; created_by: string; created_at: string };
export type NoteRow = { id: string; kind: string; title?: string | null; body: string; created_at: string; visible_to_client: boolean; appointment_id?: string | null };
export type LookbookRow = { id: string; title: string; theme?: string | null; style_direction?: string | null; palette: string[]; stylist_note?: string | null; status: string; created_at: string };
export type RecommendationRow = { id: string; title: string; reason?: string | null; category?: string | null; budget_hint?: string | null; url?: string | null; fills_gap: boolean; status: string; created_at: string };

export async function getPassport(userId: string) {
  const store = getAdminStore();
  const [profiles, colours, wardrobe, outfits, appointments, notes, lookbooks, recs, saves] = await Promise.all([
    listUserStyleProfiles(userId),
    store.list<ColourRow>("colour_profiles", { user_id: userId }, { orderBy: "created_at" }),
    store.list<WardrobeRow>("wardrobe_items", { user_id: userId }, { orderBy: "created_at" }),
    store.list<OutfitRow>("outfits", { user_id: userId }, { orderBy: "created_at" }),
    store.list<AppointmentRow>("appointments", { user_id: userId }, { orderBy: "starts_at" }),
    store.list<NoteRow>("stylist_notes", { user_id: userId }, { orderBy: "created_at" }),
    store.list<LookbookRow>("lookbooks", { user_id: userId, status: "published" }, { orderBy: "created_at" }),
    store.list<RecommendationRow>("shopping_recommendations", { user_id: userId }, { orderBy: "created_at" }),
    store.list<{ article_slug: string }>("saved_articles", { user_id: userId }),
  ]);
  return {
    compass: profiles[0] ?? null,
    compassHistory: profiles,
    colour: colours[0] ?? null,
    wardrobe: wardrobe.filter((w) => !w.archived_at),
    outfits,
    appointments,
    notes: notes.filter((n) => n.visible_to_client),
    lookbooks,
    recommendations: recs,
    savedArticles: saves.map((s) => s.article_slug),
  };
}

export async function getOutfitItems(outfitId: string) {
  const store = getAdminStore();
  const links = await store.list<{ item_id: string; slot: string }>("outfit_items", { outfit_id: outfitId });
  const items = await Promise.all(links.map(async (l) => ({ slot: l.slot, item: await store.get<WardrobeRow>("wardrobe_items", l.item_id) })));
  return items.filter((x) => x.item) as { slot: string; item: WardrobeRow }[];
}
