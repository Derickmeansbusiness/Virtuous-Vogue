"use client";

import * as React from "react";
import Image from "next/image";
import { useReducedMotion } from "motion/react";
import type { AssetImage, AssetVideo } from "@/lib/assets";
import { cn } from "@/lib/utils/cn";

type NetworkInformation = { saveData?: boolean; effectiveType?: string };

/**
 * Hero playback that respects data: the poster is always rendered first,
 * video sources are attached only when the viewer has a fast connection,
 * no data-saver, and no reduced-motion preference. The mobile variant is
 * only used on small screens; nothing heavy is downloaded twice.
 */
export function HeroVideo({
  desktop,
  mobile,
  poster,
  mobilePoster,
  className,
  mediaClassName,
  alt,
}: {
  desktop: AssetVideo | null;
  mobile: AssetVideo | null;
  poster: AssetImage | null;
  mobilePoster?: AssetImage | null;
  className?: string;
  /** Extra classes on the poster and video, e.g. a phone-only shift so the subject clears the headline. */
  mediaClassName?: string;
  alt: string;
}) {
  const reduce = useReducedMotion();
  const [playVideo, setPlayVideo] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);
  const ref = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from a browser API after mount
    update();
    mq.addEventListener("change", update);
    const conn = (navigator as Navigator & { connection?: NetworkInformation }).connection;
    const slow = conn?.saveData || ["slow-2g", "2g", "3g"].includes(conn?.effectiveType ?? "");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from a browser API after mount
    if (!reduce && !slow) setPlayVideo(true);
    return () => mq.removeEventListener("change", update);
  }, [reduce]);

  const video = isMobile ? mobile ?? desktop : desktop;
  const posterAsset = isMobile && mobilePoster ? mobilePoster : poster;
  const posterSrc = posterAsset?.base ? `${posterAsset.base}-${posterAsset.widths[posterAsset.widths.length - 1]}.jpg` : null;

  return (
    <div className={cn("absolute inset-0 overflow-hidden bg-ink", className)}>
      {posterSrc && posterAsset ? (
        <Image
          src={posterSrc}
          alt={alt}
          fill
          priority
          sizes="100vw"
          placeholder={posterAsset.blurDataURL ? "blur" : "empty"}
          blurDataURL={posterAsset.blurDataURL || undefined}
          className={cn("object-cover", mediaClassName)}
          quality={80}
        />
      ) : (
        <div className="absolute inset-0 bg-[linear-gradient(160deg,#3a3733,#191816)]" />
      )}
      {playVideo && video ? (
        <video
          ref={ref}
          className={cn(
            "absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-[1200ms] ease-out data-[ready=true]:opacity-100",
            mediaClassName,
          )}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden
          onCanPlay={(e) => {
            e.currentTarget.dataset.ready = "true";
          }}
        >
          {video.outputs.map((o) => (
            <React.Fragment key={o.suffix}>
              <source src={o.webm} type="video/webm" />
              <source src={o.mp4} type="video/mp4" />
            </React.Fragment>
          ))}
        </video>
      ) : null}
    </div>
  );
}
