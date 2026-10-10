import Image from "next/image";
import { getImage, placeholderImage } from "@/lib/assets";
import { cn } from "@/lib/utils/cn";

/**
 * Responsive, art-directed image backed by the generated asset manifest.
 * Serves AVIF/WebP via next/image with a blur placeholder; renders an
 * elegant tonal placeholder when an asset hasn't been built yet so no
 * layout ever breaks.
 */
export function EditorialImage({
  id,
  alt,
  className,
  imgClassName,
  sizes = "100vw",
  priority,
  fill = true,
  aspect,
  rounded,
}: {
  id: string;
  alt?: string;
  className?: string;
  imgClassName?: string;
  sizes?: string;
  priority?: boolean;
  fill?: boolean;
  aspect?: number;
  rounded?: boolean;
}) {
  const asset = getImage(id) ?? placeholderImage(id, aspect ?? 1.5);
  const hasFile = Boolean(asset.base);
  const label = alt ?? asset.alt;
  const style = aspect ? { aspectRatio: String(aspect) } : undefined;

  if (!hasFile) {
    return (
      <div
        role="img"
        aria-label={label || undefined}
        className={cn("relative overflow-hidden bg-satin-tint", rounded && "rounded-soft", className)}
        style={style}
        data-asset={id}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(255,255,255,0.6),transparent_60%),linear-gradient(160deg,#EDE3D7,#C5AE96)]" />
        <span className="absolute bottom-3 left-3 font-display text-xs tracking-[0.2em] text-mulberry/60">VV</span>
      </div>
    );
  }

  const largest = asset.widths[asset.widths.length - 1];
  const src = `${asset.base}-${largest}.jpg`;

  return (
    <div className={cn("relative overflow-hidden", rounded && "rounded-soft", className)} style={style} data-asset={id}>
      <Image
        src={src}
        alt={label}
        fill={fill}
        width={fill ? undefined : asset.width}
        height={fill ? undefined : asset.height}
        sizes={sizes}
        priority={priority}
        placeholder={asset.blurDataURL ? "blur" : "empty"}
        blurDataURL={asset.blurDataURL || undefined}
        className={cn("img-editorial", fill && "h-full w-full", imgClassName)}
        quality={82}
      />
    </div>
  );
}
