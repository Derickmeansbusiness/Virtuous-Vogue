/**
 * Site-wide constants. Anything that is a real business fact (phone numbers,
 * handles, addresses) comes from environment variables so the repository
 * never ships placeholder contact details as if they were real.
 */
export const SITE = {
  name: "Virtuous Vogue",
  descriptor: "Fashion Styling & Lifestyle Consultancy",
  tagline: "Virtue Never Goes Out of Style.",
  statement: "Style should express you. It should not define you.",
  city: "Douala",
  country: "Cameroon",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "",
  tiktok: process.env.NEXT_PUBLIC_TIKTOK_URL ?? "",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "",
  timeZone: "Africa/Douala",
  currency: "XAF",
  locale: "en",
} as const;

export const FEATURE_FLAGS = {
  curatedEdit: process.env.NEXT_PUBLIC_FEATURE_EDIT === "true",
  groupConsultations: process.env.NEXT_PUBLIC_FEATURE_GROUP === "true",
  internationalCards: process.env.NEXT_PUBLIC_FEATURE_INTL_CARDS === "true",
  customCursor: process.env.NEXT_PUBLIC_FEATURE_CURSOR !== "false",
} as const;
