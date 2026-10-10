import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/typography";
import { SiteFrame } from "@/components/layout/site-frame";
import { EditorialImage } from "@/components/media/editorial-image";

export default async function NotFound() {
  const t = await getTranslations("common");
  return (
    <SiteFrame>
      <section className="container-vv grid min-h-[70vh] items-center gap-12 py-24 lg:grid-cols-2">
        <div>
          <Eyebrow>404</Eyebrow>
          <h1 className="display-lg mt-4">{t("notFoundTitle")}</h1>
          <p className="mt-6 max-w-md font-serif text-lg text-ink-soft">{t("notFoundBody")}</p>
          <div className="mt-10">
            <Button href="/">{t("backHome")}</Button>
          </div>
        </div>
        <EditorialImage id="empty-hanger" className="aspect-[16/10] w-full" sizes="(min-width:1024px) 50vw, 100vw" />
      </section>
    </SiteFrame>
  );
}
