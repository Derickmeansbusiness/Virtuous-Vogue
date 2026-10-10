"use client";

/**
 * Privacy-conscious analytics facade. Conversion events are sent to
 * whichever provider is configured (Plausible by default) and otherwise
 * are no-ops. No personal data is ever attached to an event.
 */
export type AnalyticsEvent =
  | "newsletter_subscribe"
  | "lead_submit"
  | "booking_start"
  | "booking_step"
  | "booking_complete"
  | "booking_whatsapp"
  | "payment_start"
  | "payment_complete"
  | "compass_start"
  | "compass_complete"
  | "colour_lens_start"
  | "colour_lens_complete"
  | "remix_start"
  | "remix_outfit_saved"
  | "ask_vv"
  | "whatsapp_click"
  | "article_read"
  | "signup"
  | "login";

type Props = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Props }) => void;
  }
}

export function track(event: AnalyticsEvent, props?: Props) {
  if (typeof window === "undefined") return;
  try {
    window.plausible?.(event, props ? { props } : undefined);
    if (process.env.NODE_ENV !== "production") {
      console.debug("[analytics]", event, props ?? {});
    }
  } catch {
    // analytics must never break the experience
  }
}
