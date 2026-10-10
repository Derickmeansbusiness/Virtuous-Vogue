"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Link2, Check, Share2 } from "lucide-react";

export function ShareRow({ title }: { title: string }) {
  const t = useTranslations("magazine");
  const [copied, setCopied] = React.useState(false);
  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) return await navigator.share({ title, url });
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };
  const href = typeof window !== "undefined" ? window.location.href : "";
  return (
    <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.14em]">
      <button type="button" onClick={share} className="inline-flex items-center gap-1.5 text-ink hover:text-mulberry" aria-live="polite">
        {copied ? <Check className="size-4" aria-hidden /> : <Share2 className="size-4" aria-hidden />} {copied ? t("copied") : t("share")}
      </button>
      <a className="inline-flex items-center gap-1.5 text-ink-muted hover:text-mulberry" href={`https://wa.me/?text=${encodeURIComponent(`${title} ${href}`)}`} target="_blank" rel="noopener noreferrer">
        <Link2 className="size-4" aria-hidden /> WhatsApp
      </a>
    </div>
  );
}
