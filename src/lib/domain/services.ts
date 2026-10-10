import "server-only";
import { cache } from "react";
import { services as seed, getService as getSeed } from "@/content/services";
import type { Service } from "@/content/types";
import { getStore, storeMode } from "@/lib/data/store";

type ServiceRow = {
  id: string;
  slug: string;
  active: boolean;
  duration_minutes: number | null;
  price_xaf: number | null;
  deposit_percent: number | null;
  capacity: number | null;
  formats: string[] | null;
  name_en?: string | null;
  name_fr?: string | null;
  short_en?: string | null;
  short_fr?: string | null;
  sort_order?: number | null;
};

/**
 * Services = editorial seed content merged with admin-configurable
 * overrides stored in the `services` table (duration, price, formats,
 * availability). The seed is the fallback when no row exists.
 */
export const listServices = cache(async (): Promise<Service[]> => {
  if (storeMode === "local") {
    return mergeRows(seed, await safeRows());
  }
  return mergeRows(seed, await safeRows());
});

async function safeRows(): Promise<ServiceRow[]> {
  try {
    return await getStore().list<ServiceRow>("services");
  } catch {
    return [];
  }
}

function mergeRows(base: Service[], rows: ServiceRow[]): Service[] {
  const bySlug = new Map(rows.map((r) => [r.slug, r]));
  return base
    .filter((s) => bySlug.get(s.slug)?.active !== false)
    .map((s) => {
      const r = bySlug.get(s.slug);
      if (!r) return s;
      return {
        ...s,
        durationMinutes: r.duration_minutes ?? s.durationMinutes,
        priceXaf: r.price_xaf ?? s.priceXaf,
        depositPercent: r.deposit_percent ?? s.depositPercent,
        capacity: r.capacity ?? s.capacity,
        formats: (r.formats as Service["formats"]) ?? s.formats,
        name: { en: r.name_en ?? s.name.en, fr: r.name_fr ?? s.name.fr },
        short: { en: r.short_en ?? s.short.en, fr: r.short_fr ?? s.short.fr },
      };
    });
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const all = await listServices();
  return all.find((s) => s.slug === slug) ?? (getSeed(slug) ?? null);
}
