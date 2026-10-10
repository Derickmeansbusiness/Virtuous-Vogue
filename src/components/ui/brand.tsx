import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import brand from "../../../public/assets/virtuous-vogue/brand/brand.json";

/**
 * Approved Virtuous Vogue marks (PNG kit in assets-src/brand-kit, exported
 * trimmed and responsive to public/assets/virtuous-vogue/brand). The kit is
 * raster, so marks are rendered with next/image at explicit sizes.
 */
type MarkId = keyof typeof brand.marks;
const BASE = "/assets/virtuous-vogue/brand";

function mark(id: MarkId) {
  const m = brand.marks[id];
  const w = m.widths[m.widths.length - 1];
  return { src: `${BASE}/${id}-${w}.png`, aspect: m.aspect };
}

export function Monogram({
  className,
  tone = "twotone",
  title = "Virtuous Vogue",
  height = 32,
}: {
  className?: string;
  tone?: "twotone" | "ink" | "white" | "mulberry";
  title?: string;
  height?: number;
}) {
  const { src, aspect } = mark(`monogram-${tone}` as MarkId);
  return (
    <Image
      src={src}
      alt={title}
      width={Math.round(height * aspect)}
      height={height}
      className={cn("h-auto w-auto select-none", className)}
      style={{ height, width: "auto" }}
      priority
    />
  );
}

/** Horizontal header lockup: monogram + wordmark, as supplied in the kit. */
export function HeaderLockup({ className, tone = "ink", height = 34 }: { className?: string; tone?: "ink" | "white"; height?: number }) {
  const { src, aspect } = mark(`header-${tone}` as MarkId);
  return (
    <Image
      src={src}
      alt="Virtuous Vogue"
      width={Math.round(height * aspect)}
      height={height}
      className={cn("select-none", className)}
      style={{ height, width: "auto" }}
      priority
    />
  );
}

/** Stacked primary wordmark, optionally with the approved tagline treatment. */
export function Wordmark({
  className,
  tone = "ink",
  tagline = false,
  width = 220,
}: {
  className?: string;
  tone?: "ink" | "white" | "mulberry";
  tagline?: boolean;
  width?: number;
}) {
  const id = (tagline ? "wordmark-tagline-ink" : `wordmark-${tone}`) as MarkId;
  const { src, aspect } = mark(id);
  return (
    <Image
      src={src}
      alt={tagline ? "Virtuous Vogue — Virtue Never Goes Out of Style." : "Virtuous Vogue"}
      width={width}
      height={Math.round(width / aspect)}
      className={cn("select-none", className)}
      style={{ width, height: "auto" }}
    />
  );
}
