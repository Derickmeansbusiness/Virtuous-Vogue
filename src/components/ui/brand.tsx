import { cn } from "@/lib/utils/cn";

/**
 * VV monogram, following the identity proposal: two overlapping V forms,
 * the left in Signature Mulberry and the right in Satin.
 */
export function Monogram({ className, title = "Virtuous Vogue" }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 120 100" className={cn("h-8 w-auto", className)} role="img" aria-label={title}>
      <title>{title}</title>
      <defs>
        <linearGradient id="vv-satin" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#D7C3B1" />
          <stop offset="1" stopColor="#A88D72" />
        </linearGradient>
      </defs>
      <path d="M6 8h18l22 60 8-22-14-38h18l20 60L96 8h18L84 92H66L56 64 46 92H28z" fill="#672F40" />
      <path d="M58 8h18l20 60L114 8h-18L78 68z" fill="url(#vv-satin)" />
    </svg>
  );
}

export function Wordmark({
  className,
  stacked = false,
  descriptor = false,
}: {
  className?: string;
  stacked?: boolean;
  descriptor?: boolean;
}) {
  return (
    <span className={cn("inline-flex flex-col leading-none", className)}>
      <span
        className={cn(
          "font-display uppercase tracking-[0.02em]",
          stacked ? "flex flex-col text-[1.9rem] leading-[0.86]" : "text-xl",
        )}
      >
        <span>Virtuous</span>
        {stacked ? <span className="self-end">Vogue</span> : <span> Vogue</span>}
      </span>
      {descriptor ? (
        <span className="mt-2 eyebrow text-[0.56rem] text-ink-muted">
          Fashion Styling &amp; Lifestyle Consultancy
        </span>
      ) : null}
    </span>
  );
}
