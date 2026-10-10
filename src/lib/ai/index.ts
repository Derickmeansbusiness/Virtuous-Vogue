import "server-only";
import { createAiProvider } from "./provider";
import type { GarmentGuess, OutfitExplanationInput, StyleSummaryInput } from "./types";

/**
 * AI facade. All calls are server-side and go through a provider
 * abstraction. Deterministic logic (scoring, composition) lives in
 * src/lib/studio; the provider only adds classification and explanatory
 * copy, and every output is labelled as assistance, not verdict.
 */
const provider = createAiProvider();

export async function classifyGarment(image: Buffer): Promise<GarmentGuess> {
  return provider.classifyGarment(image);
}

export async function explainOutfit(input: OutfitExplanationInput): Promise<string | null> {
  return provider.explainOutfit(input);
}

export async function summariseStyleProfile(input: StyleSummaryInput): Promise<string | null> {
  return provider.summariseStyle(input);
}

export async function explainColour(reading: { undertone: string; contrast: string; locale: string }): Promise<string | null> {
  return provider.explainColour(reading);
}
