import "server-only";
import { getAdminStore } from "@/lib/data/store";

export async function isArticleSaved(userId: string, slug: string) {
  return Boolean(await getAdminStore().get("saved_articles", `${userId}:${slug}`));
}

export async function listSavedArticles(userId: string) {
  return getAdminStore().list<{ article_slug: string; created_at: string }>("saved_articles", { user_id: userId }, { orderBy: "created_at" });
}
