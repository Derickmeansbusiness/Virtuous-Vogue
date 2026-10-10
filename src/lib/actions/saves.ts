"use server";

import { getSessionUser } from "@/lib/auth/session";
import { getAdminStore } from "@/lib/data/store";

export async function toggleSavedArticle(slug: string) {
  const user = await getSessionUser();
  if (!user) return { ok: false as const };
  const store = getAdminStore();
  const id = `${user.id}:${slug}`;
  const existing = await store.get("saved_articles", id);
  if (existing) {
    await store.delete("saved_articles", id);
    return { ok: true as const, saved: false };
  }
  await store.insert("saved_articles", { id, user_id: user.id, article_slug: slug });
  return { ok: true as const, saved: true };
}
