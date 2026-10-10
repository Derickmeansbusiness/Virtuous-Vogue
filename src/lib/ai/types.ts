import type { RemixItem } from "@/lib/studio/remix-engine";

export type GarmentGuess = Partial<Pick<RemixItem, "category" | "subcategory" | "colour" | "colourHex" | "pattern" | "fabric" | "fit" | "coverage">>;

export type OutfitExplanationInput = {
  items: { slot: string; name: string; colour?: string; fit?: string }[];
  occasion: string;
  locale: string;
};

export type StyleSummaryInput = {
  primary: string;
  secondary?: string | null;
  styleWords: string[];
  answers: Record<string, string | string[]>;
  locale: string;
};

export interface AiProvider {
  name: string;
  classifyGarment(image: Buffer): Promise<GarmentGuess>;
  explainOutfit(input: OutfitExplanationInput): Promise<string | null>;
  summariseStyle(input: StyleSummaryInput): Promise<string | null>;
  explainColour(input: { undertone: string; contrast: string; locale: string }): Promise<string | null>;
}
