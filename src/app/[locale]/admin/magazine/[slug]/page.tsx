import { getAdminStore } from "@/lib/data/store";
import { articles as seed } from "@/content/articles";
import { PageHeader } from "@/components/admin/ui";
import { ArticleEditor } from "@/components/admin/article-editor";

export default async function AdminArticle({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const rows = await getAdminStore().list<{ slug: string; status: string; data: unknown }>("articles", { slug });
  const seedArticle = seed.find((a) => a.slug === slug);
  const row = rows[0];
  const data = row?.data ?? seedArticle ?? { slug: slug === "new" ? "" : slug, issue: "02", title: { en: "", fr: "" }, dek: { en: "", fr: "" }, category: "style", type: "style-notes", authorSlug: "vv-editors", publishedAt: new Date().toISOString().slice(0, 10), readingMinutes: 5, hero: "mag-swatch-wall", heroAlt: { en: "", fr: "" }, blocks: [{ type: "paragraph", text: { en: "", fr: "" } }], related: [], isDemo: false };
  return (
    <div className="space-y-6">
      <PageHeader title={slug === "new" ? "New story" : slug} body="Bilingual article JSON. Blocks: paragraph, heading, quote, list, image, callout (shop-your-closet | book-consultation | virtuous-edit). Hero is an asset id from the manifest." />
      <ArticleEditor slug={slug === "new" ? "" : slug} status={(row?.status as "draft" | "published" | "archived") ?? (seedArticle ? "published" : "draft")} data={data} />
    </div>
  );
}
