import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { EditorialImage } from "@/components/media/editorial-image";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { Button } from "@/components/ui/button";
import { pick, type Article } from "@/content/types";
import { getServiceBySlug } from "@/lib/domain/services";

/** Renders bilingual article blocks with restrained editorial commerce callouts. */
export async function ArticleBody({ article, locale }: { article: Article; locale: string }) {
  const t = await getTranslations("magazine");
  const c = await getTranslations("cta");
  const service = article.relatedService ? await getServiceBySlug(article.relatedService) : null;
  return (
    <div className="prose-editorial">
      {article.blocks.map((b, i) => {
        switch (b.type) {
          case "paragraph":
            return <p key={i}>{pick(b.text, locale)}</p>;
          case "heading":
            return <h2 key={i}>{pick(b.text, locale)}</h2>;
          case "quote":
            return <blockquote key={i}>{pick(b.text, locale)}</blockquote>;
          case "list":
            return (
              <ul key={i}>
                {b.items?.map((it) => <li key={it.en}>{pick(it, locale)}</li>)}
              </ul>
            );
          case "image":
            return (
              <figure key={i}>
                <div className="aspect-[3/2]"><EditorialImage id={b.image!} alt={pick(b.caption, locale)} className="h-full w-full" sizes="(min-width:1024px) 60vw, 100vw" /></div>
                {b.caption ? <figcaption>{pick(b.caption, locale)}</figcaption> : null}
              </figure>
            );
          case "callout":
            if (b.callout === "shop-your-closet")
              return (
                <aside key={i} className="my-12 border-y border-line py-8 font-sans not-italic">
                  <p className="eyebrow text-mulberry">{t("callouts.closetEyebrow")}</p>
                  <p className="display-sm mt-2 text-ink">{t("callouts.closetTitle")}</p>
                  <div className="mt-4"><Button href="/studio/closet-remix" variant="secondary" size="sm">{c("tryRemix")}</Button></div>
                </aside>
              );
            if (b.callout === "book-consultation")
              return (
                <aside key={i} className="my-12 border-y border-line py-8 font-sans not-italic">
                  <p className="eyebrow text-mulberry">{t("callouts.bookEyebrow")}</p>
                  <p className="display-sm mt-2 text-ink">{service ? pick(service.name, locale) : t("callouts.bookTitle")}</p>
                  {service ? <p className="mt-2 text-sm text-ink-soft">{pick(service.short, locale)}</p> : null}
                  <div className="mt-4 flex gap-3">
                    <Button href={service ? `/book?service=${service.slug}` : "/book"} size="sm">{c("book")}</Button>
                    {service ? <Link href={`/services/${service.slug}`} className="text-xs font-semibold uppercase tracking-[0.14em] text-ink hover:text-mulberry self-center">{t("callouts.learn")}</Link> : null}
                  </div>
                </aside>
              );
            return (
              <aside key={i} className="my-12 border-y border-line py-8 font-sans not-italic">
                <p className="eyebrow text-mulberry">The Virtuous Edit</p>
                <p className="display-sm mt-2 text-ink">{t("callouts.editTitle")}</p>
                <div className="mt-4 max-w-md"><NewsletterForm source={`article:${article.slug}`} /></div>
              </aside>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
