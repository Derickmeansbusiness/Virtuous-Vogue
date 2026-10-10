import { Link } from "@/i18n/navigation";
import { EditorialImage } from "@/components/media/editorial-image";
import { pick, type Article } from "@/content/types";
import { categories } from "@/content/authors";
import { cn } from "@/lib/utils/cn";

export function ArticleCard({ article, locale, large, className }: { article: Article; locale: string; large?: boolean; className?: string }) {
  const cat = categories.find((c) => c.slug === article.category);
  return (
    <article className={cn("group", className)}>
      <Link href={{ pathname: "/magazine/[slug]", params: { slug: article.slug } }} className="fabric-hover block">
        <div className={cn("overflow-hidden", large ? "aspect-[3/2]" : "aspect-[4/5]")}>
          <EditorialImage id={article.hero} alt={pick(article.heroAlt, locale)} className="h-full w-full" sizes={large ? "(min-width:1024px) 50vw, 100vw" : "(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw"} />
        </div>
      </Link>
      <div className="mt-4">
        <p className="eyebrow text-mulberry">
          {cat ? pick(cat.name, locale) : ""} <span className="text-ink-muted">· VV {article.issue}</span>
        </p>
        <h3 className={cn("mt-2 font-display leading-tight", large ? "text-3xl" : "text-xl")}>
          <Link href={{ pathname: "/magazine/[slug]", params: { slug: article.slug } }} className="transition-colors group-hover:text-mulberry">
            {pick(article.title, locale)}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-3 text-sm text-ink-soft">{pick(article.dek, locale)}</p>
      </div>
    </article>
  );
}
