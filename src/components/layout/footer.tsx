import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Monogram, Wordmark } from "@/components/ui/brand";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { SITE, FEATURE_FLAGS } from "@/lib/site";
import { WhatsAppLink } from "./whatsapp";

export async function Footer() {
  const t = await getTranslations("footer");
  const n = await getTranslations("nav");
  const year = new Date().getFullYear();

  const cols: { title: string; items: { href: string; label: string; external?: boolean }[] }[] = [
    {
      title: t("navigation"),
      items: [
        { href: "/magazine", label: n("magazine") },
        { href: "/services", label: n("services") },
        { href: "/about", label: n("about") },
        { href: "/contact", label: n("contact") },
        { href: "/styling", label: n("styling") },
        ...(FEATURE_FLAGS.curatedEdit ? [{ href: "/edit", label: n("edit") }] : []),
      ],
    },
    {
      title: t("studio"),
      items: [
        { href: "/studio", label: n("studio") },
        { href: "/studio/compass", label: n("compass") },
        { href: "/studio/colour-lens", label: n("colourLens") },
        { href: "/studio/closet-remix", label: n("closetRemix") },
        { href: "/account", label: n("account") },
      ],
    },
    {
      title: t("connect"),
      items: [
        ...(SITE.instagram ? [{ href: SITE.instagram, label: "Instagram", external: true }] : []),
        ...(SITE.tiktok ? [{ href: SITE.tiktok, label: "TikTok", external: true }] : []),
        { href: "/newsletter", label: n("newsletter") },
        { href: "/contact", label: n("contact") },
      ],
    },
    {
      title: t("legal"),
      items: [
        { href: "/privacy", label: n("privacy") },
        { href: "/terms", label: n("terms") },
      ],
    },
  ];

  return (
    <footer className="bg-ink text-ivory">
      <div className="container-vv grid gap-14 py-20 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <div className="flex items-center gap-3">
            <Monogram className="h-10" />
            <Wordmark stacked descriptor className="text-ivory [&_.eyebrow]:text-ivory/60" />
          </div>
          <p className="mt-10 font-display text-2xl italic leading-tight text-ivory/90 md:text-3xl">
            {t("newsletterTitle")}
          </p>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-ivory/70">{t("newsletterBody")}</p>
          <div className="mt-6 max-w-md">
            <NewsletterForm tone="dark" source="footer" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4 lg:col-span-7">
          {cols.map((col) => (
            <div key={col.title}>
              <p className="eyebrow text-satin">{col.title}</p>
              <ul className="mt-5 space-y-3">
                {col.items.map((item) => (
                  <li key={item.href + item.label}>
                    {item.external ? (
                      <a href={item.href} target="_blank" rel="noopener noreferrer" className="text-sm text-ivory/80 hover:text-ivory">
                        {item.label}
                      </a>
                    ) : (
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      <Link href={item.href as any} className="text-sm text-ivory/80 hover:text-ivory">
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
                {col.title === t("connect") && SITE.whatsappNumber ? (
                  <li>
                    <WhatsAppLink variant="quiet" className="text-ivory/80 hover:text-ivory" label="WhatsApp" />
                  </li>
                ) : null}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-ivory/10">
        <div className="container-vv flex flex-col gap-4 py-8 text-xs text-ivory/60 md:flex-row md:items-center md:justify-between">
          <p className="font-display text-base italic text-ivory/90">{SITE.tagline}</p>
          <div className="flex flex-col gap-2 md:items-end">
            <p>{t("rights", { year })}</p>
            <p className="max-w-md md:text-right">{t("imageNote")}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
