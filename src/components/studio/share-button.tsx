"use client";

import * as React from "react";
import { Share2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ShareButton({ slug, label, copied }: { slug: string; label: string; copied: string }) {
  const [done, setDone] = React.useState(false);
  const share = async () => {
    const url = `${window.location.origin}${window.location.pathname.replace(/\/[^/]+$/, `/${slug}`)}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "Virtuous Vogue · Style Compass", url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setDone(true);
      setTimeout(() => setDone(false), 2000);
    } catch {}
  };
  return (
    <Button variant="ghost" className="border-porcelain/50 text-porcelain hover:bg-porcelain/10" onClick={share} aria-live="polite">
      {done ? <Check className="size-4" aria-hidden /> : <Share2 className="size-4" aria-hidden />}
      {done ? copied : label}
    </Button>
  );
}
