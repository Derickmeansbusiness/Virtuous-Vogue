import "server-only";
import { cache } from "react";
import { articles as seed } from "@/content/articles";
import type { Article } from "@/content/types";
import { getStore } from "@/lib/data/store";

type ArticleRow = { id: string; slug: string; status: "draft" | "published" | "archived"; data: Article };

/**
 * Published articles = seed content + CMS rows. A CMS row with the same slug
 * overrides the seed, and `archived` hides it. Sorted newest first.
 */
export const listArticles = cache(async (): Promise<Article[]> => {
  let rows: ArticleRow[] = [];
  try {
    rows = await getStore().list<ArticleRow>("articles");
  } catch {
    rows = [];
  }
  const bySlug = new Map(rows.map((r) => [r.slug, r]));
  const merged: Article[] = [];
  for (const s of seed) {
    const r = bySlug.get(s.slug);
    if (!r) merged.push(s);
    else if (r.status === "published") merged.push({ ...s, ...r.data, isDemo: false });
  }
  for (const r of rows) {
    if (!seed.some((s) => s.slug === r.slug) && r.status === "published") merged.push({ ...r.data, slug: r.slug, isDemo: false });
  }
  return merged.sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
});

export async function getArticleBySlug(slug: string) {
  const all = await listArticles();
  return all.find((a) => a.slug === slug) ?? null;
}

export async function searchArticles(query: string, locale: string) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const all = await listArticles();
  const key = locale === "fr" ? "fr" : "en";
  return all.filter((a) => {
    const hay = [a.title[key], a.dek[key], ...a.blocks.flatMap((b) => [b.text?.[key] ?? "", ...(b.items?.map((i) => i[key]) ?? [])])].join(" ").toLowerCase();
    return hay.includes(q);
  });
}
