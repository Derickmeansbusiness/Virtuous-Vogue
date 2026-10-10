"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export default function LocaleError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations("common");
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <main className="container-vv flex min-h-[70vh] flex-col items-start justify-center py-24">
      <p className="eyebrow text-mulberry">Error</p>
      <h1 className="display-lg mt-4">{t("errorTitle")}</h1>
      <p className="mt-6 max-w-md font-serif text-lg text-ink-soft">{t("errorBody")}</p>
      <div className="mt-10 flex gap-4">
        <Button onClick={reset}>{t("retry")}</Button>
        <Button href="/" variant="secondary">
          {t("backHome")}
        </Button>
      </div>
    </main>
  );
}
