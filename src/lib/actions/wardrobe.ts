"use server";

import { z } from "zod";
import { getSessionUser } from "@/lib/auth/session";
import { getAdminStore } from "@/lib/data/store";

const patchSchema = z.object({ is_favourite: z.boolean().optional(), archived_at: z.string().nullable().optional(), name: z.string().max(80).optional(), notes: z.string().max(300).optional() });

export async function updateWardrobeItem(id: string, patch: unknown) {
  const user = await getSessionUser();
  if (!user) return { ok: false as const };
  const parsed = patchSchema.safeParse(patch);
  if (!parsed.success) return { ok: false as const };
  const store = getAdminStore();
  const item = await store.get<{ user_id: string }>("wardrobe_items", id);
  if (!item || (item.user_id !== user.id && user.role !== "admin")) return { ok: false as const };
  await store.update("wardrobe_items", id, parsed.data);
  return { ok: true as const };
}
