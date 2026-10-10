"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { getSessionUser } from "@/lib/auth/session";
import { getAdminStore } from "@/lib/data/store";
import { deletePrivateObject } from "@/lib/storage/private";
import { supabaseConfigured } from "@/lib/supabase/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export type ProfileState = { status: "idle" } | { status: "success" } | { status: "error" };

const schema = z.object({ full_name: z.string().trim().max(120).optional(), phone: z.string().trim().max(32).optional(), whatsapp: z.string().trim().max(32).optional(), city: z.string().trim().max(80).optional(), locale: z.enum(["en", "fr"]).optional(), marketing_consent: z.literal("on").optional() });

export async function updateProfile(_prev: ProfileState, formData: FormData): Promise<ProfileState> {
  const user = await getSessionUser();
  if (!user) return { status: "error" };
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: "error" };
  const d = parsed.data;
  try {
    await getAdminStore().upsert("profiles", { id: user.id, email: user.email, full_name: d.full_name || null, phone: d.phone || null, whatsapp: d.whatsapp || null, city: d.city || null, locale: d.locale ?? "en", marketing_consent: d.marketing_consent === "on" });
    revalidatePath("/account");
    return { status: "success" };
  } catch {
    return { status: "error" };
  }
}

/** Download-my-data: everything tied to the account as one JSON document. */
export async function exportMyData() {
  const user = await getSessionUser();
  if (!user) return null;
  const store = getAdminStore();
  const tables = ["profiles", "style_profiles", "colour_profiles", "wardrobe_items", "wardrobe_images", "outfits", "saved_outfits", "appointments", "payments", "stylist_notes", "lookbooks", "shopping_recommendations", "saved_articles", "consultation_forms"];
  const out: Record<string, unknown> = { exported_at: new Date().toISOString(), user: { id: user.id, email: user.email } };
  for (const t of tables) {
    out[t] = t === "profiles" ? await store.get(t, user.id) : await store.list(t, { user_id: user.id }).catch(() => []);
  }
  return out;
}

export async function deleteMyImages() {
  const user = await getSessionUser();
  if (!user) return { ok: false as const };
  const store = getAdminStore();
  const images = await store.list<{ id: string; storage_path: string; cutout_path?: string | null }>("wardrobe_images", { user_id: user.id });
  for (const img of images) {
    await deletePrivateObject("wardrobe", img.storage_path).catch(() => {});
    if (img.cutout_path) await deletePrivateObject("wardrobe", img.cutout_path).catch(() => {});
    await store.delete("wardrobe_images", img.id);
  }
  const colours = await store.list<{ id: string; image_path: string | null }>("colour_profiles", { user_id: user.id });
  for (const c of colours) {
    if (c.image_path) {
      await deletePrivateObject("colour-lens", c.image_path).catch(() => {});
      await store.update("colour_profiles", c.id, { image_path: null, image_deleted_at: new Date().toISOString() });
    }
  }
  return { ok: true as const, count: images.length };
}

/** Deletes the account and every row owned by it. Irreversible by design. */
export async function deleteMyAccount(confirmation: string) {
  const user = await getSessionUser();
  if (!user || confirmation !== "DELETE") return { ok: false as const };
  await deleteMyImages();
  const store = getAdminStore();
  const tables = ["saved_articles", "saved_outfits", "outfit_items", "outfits", "wardrobe_items", "style_answers", "style_profiles", "colour_profiles", "stylist_notes", "shopping_recommendations", "lookbook_items", "lookbooks", "consultation_forms", "client_documents"];
  for (const t of tables) {
    const rows = await store.list<{ id: string }>(t, { user_id: user.id }).catch(() => []);
    for (const r of rows) await store.delete(t, r.id).catch(() => {});
  }
  // Appointments and payments are kept as anonymised financial records.
  const appts = await store.list<{ id: string }>("appointments", { user_id: user.id }).catch(() => []);
  for (const a of appts) await store.update("appointments", a.id, { user_id: null, guest_name: "Deleted client", guest_email: "deleted@example.invalid", guest_phone: null, style_goals: null, context: {} }).catch(() => {});
  await store.delete("profiles", user.id).catch(() => {});
  if (supabaseConfigured) await createSupabaseAdminClient().auth.admin.deleteUser(user.id).catch(() => {});
  const cookieStore = await cookies();
  cookieStore.delete("vv_local_session");
  return { ok: true as const };
}
