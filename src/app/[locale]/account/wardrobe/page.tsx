import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { requireUser } from "@/lib/auth/session";
import { getPassport } from "@/lib/domain/passport";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/skeleton";
import { WardrobeGrid } from "@/components/account/wardrobe-grid";
import { getAdminStore } from "@/lib/data/store";
import { signedPrivateUrl } from "@/lib/storage/private";

export const metadata: Metadata = { title: "Wardrobe", robots: { index: false } };

export default async function WardrobePage() {
  const user = await requireUser();
  const t = await getTranslations("account.wardrobe");
  const c = await getTranslations("cta");
  const p = await getPassport(user.id);
  const images = await getAdminStore().list<{ item_id: string; storage_path: string; cutout_path?: string | null }>("wardrobe_images", { user_id: user.id });
  const items = await Promise.all(
    p.wardrobe.map(async (w) => {
      const img = images.find((i) => i.item_id === w.id);
      const url = img ? await signedPrivateUrl("wardrobe", img.storage_path).catch(() => null) : null;
      return { ...w, imageUrl: url };
    }),
  );
  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="display-lg">{t("title")}</h1>
          <p className="mt-2 font-serif text-lg text-ink-soft">{t("body", { count: items.length })}</p>
        </div>
        <Button href="/studio/closet-remix">{c("remixMyCloset")}</Button>
      </header>
      {items.length ? <WardrobeGrid items={items} /> : <EmptyState title={t("emptyTitle")} body={t("emptyBody")} action={<Button href="/studio/closet-remix">{c("remixMyCloset")}</Button>} />}
    </div>
  );
}
