import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { requireUser } from "@/lib/auth/session";
import { listSavedArticles } from "@/lib/domain/saves";
import { listArticles } from "@/lib/domain/articles";
import { ArticleCard } from "@/components/magazine/article-card";
import { EmptyState } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Saved stories", robots: { index: false } };

export default async function SavesPage() {
  const user = await requireUser();
  const t = await getTranslations("account.saves");
  const c = await getTranslations("cta");
  const locale = await getLocale();
  const [saves, all] = await Promise.all([listSavedArticles(user.id), listArticles()]);
  const items = saves.map((s) => all.find((a) => a.slug === s.article_slug)).filter(Boolean) as typeof all;
  return (
    <div className="space-y-8">
      <header><h1 className="display-lg">{t("title")}</h1></header>
      {items.length ? <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">{items.map((a) => <ArticleCard key={a.slug} article={a} locale={locale} />)}</div> : <EmptyState title={t("emptyTitle")} body={t("emptyBody")} action={<Button href="/magazine">{c("readMagazine")}</Button>} />}
    </div>
  );
}
