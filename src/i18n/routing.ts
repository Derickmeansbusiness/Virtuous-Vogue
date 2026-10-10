import { defineRouting } from "next-intl/routing";

export const locales = ["en", "fr"] as const;
export type AppLocale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: "en",
  localePrefix: "as-needed",
  localeCookie: {
    name: "vv_locale",
    maxAge: 60 * 60 * 24 * 365,
  },
});
