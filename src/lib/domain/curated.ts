import "server-only";
import { getStore } from "@/lib/data/store";

export type CuratedProduct = { id: string; slug: string; status: string; category: string; data: { name_en: string; name_fr?: string; price_xaf?: number; image_path?: string } };

export async function listCuratedProducts() {
  try {
    return await getStore().list<CuratedProduct>("curated_products", { status: "published" });
  } catch {
    return [];
  }
}
