import "server-only";
import { cache } from "react";
import { getStore } from "@/lib/data/store";

export type Testimonial = {
  id: string;
  client_name: string;
  quote_en: string;
  quote_fr?: string | null;
  context?: string | null;
  service_slug?: string | null;
  consent_at: string | null;
  status: "draft" | "published";
  sort_order?: number | null;
};

/** Only testimonials with explicit consent and published status are shown. */
export const listPublishedTestimonials = cache(async (): Promise<Testimonial[]> => {
  try {
    const rows = await getStore().list<Testimonial>("testimonials", { status: "published" }, { orderBy: "sort_order", ascending: true });
    return rows.filter((r) => Boolean(r.consent_at));
  } catch {
    return [];
  }
});
