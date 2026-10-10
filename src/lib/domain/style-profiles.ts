import "server-only";
import { cache } from "react";
import { getAdminStore } from "@/lib/data/store";
import { getSessionUser } from "@/lib/auth/session";
import { cookies } from "next/headers";

export type StyleProfileRow = {
  id: string;
  user_id: string | null;
  anon_token: string | null;
  scores: Record<string, number>;
  primary_direction: string;
  secondary_direction: string | null;
  style_words: string[];
  colour_mood: string;
  silhouette_direction: string;
  wardrobe_priorities: string[];
  outfit_formulas: string[];
  experiments: string[];
  recommended_service: string | null;
  share_slug: string | null;
  created_at: string;
};

/**
 * A result is visible to its owner (user or anonymous cookie holder), to the
 * admin, or to anyone holding the share slug.
 */
export const getCompassResult = cache(async (idOrShare: string): Promise<StyleProfileRow | null> => {
  const store = getAdminStore();
  let row = await store.get<StyleProfileRow>("style_profiles", idOrShare);
  if (!row) {
    const byShare = await store.list<StyleProfileRow>("style_profiles", { share_slug: idOrShare }, { limit: 1 });
    row = byShare[0] ?? null;
    if (row) return row; // share link access
  }
  if (!row) return null;
  const user = await getSessionUser();
  const anon = (await cookies()).get("vv_anon")?.value;
  const owner = (user && row.user_id === user.id) || (anon && row.anon_token === anon) || user?.role === "admin";
  return owner ? row : null;
});

export async function listUserStyleProfiles(userId: string) {
  return getAdminStore().list<StyleProfileRow>("style_profiles", { user_id: userId }, { orderBy: "created_at", ascending: false });
}
