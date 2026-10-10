/**
 * Content types shared by the seed content, the CMS tables and the UI.
 * Every piece of human-facing text is bilingual.
 */
export type Localized = { en: string; fr: string };
export type Locale = "en" | "fr";

export function pick(value: Localized | undefined, locale: string): string {
  if (!value) return "";
  return (locale === "fr" ? value.fr : value.en) || value.en;
}

export type ServiceSlug =
  | "style-clarity"
  | "colour-harmony"
  | "wardrobe-edit"
  | "occasion-styling"
  | "personal-shopping"
  | "signature-private-styling";

export type ConsultationFormat = "in_person" | "virtual" | "group";

export interface Service {
  slug: ServiceSlug;
  number: string;
  name: Localized;
  short: Localized;
  intro: Localized;
  whoFor: Localized[];
  explore: Localized[];
  receive: Localized[];
  next: Localized;
  formats: ConsultationFormat[];
  durationMinutes: number;
  /** null = pricing shared on request; otherwise XAF amount set by admin */
  priceXaf: number | null;
  depositPercent: number;
  capacity: number;
  image: string; // asset id
  accent: "mulberry" | "satin" | "ink";
  isDemo?: boolean;
}

export type ArticleCategorySlug =
  | "style"
  | "wardrobe"
  | "colour"
  | "modest-elegance"
  | "work-occasion"
  | "culture"
  | "confidence"
  | "lifestyle";

export type ArticleType =
  | "how-to"
  | "the-edit"
  | "style-notes"
  | "wardrobe-intelligence"
  | "conversations"
  | "vv-profiles"
  | "occasion-guide"
  | "colour-notes"
  | "the-virtuous-woman"
  | "city-style";

export interface ArticleBlock {
  type: "paragraph" | "heading" | "quote" | "list" | "image" | "callout";
  text?: Localized;
  items?: Localized[];
  image?: string;
  caption?: Localized;
  callout?: "shop-your-closet" | "book-consultation" | "virtuous-edit";
}

export interface Article {
  slug: string;
  issue: string;
  title: Localized;
  dek: Localized;
  category: ArticleCategorySlug;
  type: ArticleType;
  authorSlug: string;
  publishedAt: string;
  readingMinutes: number;
  hero: string; // asset id
  heroAlt: Localized;
  blocks: ArticleBlock[];
  related: string[];
  relatedService?: ServiceSlug;
  featured?: boolean;
  editorsPick?: boolean;
  isDemo: boolean;
}

export interface Author {
  slug: string;
  name: string;
  role: Localized;
  bio: Localized;
  isDemo: boolean;
}

export interface Category {
  slug: ArticleCategorySlug;
  name: Localized;
  description: Localized;
}

export interface Faq {
  q: Localized;
  a: Localized;
  group: "general" | "booking" | "studio" | "privacy";
}
