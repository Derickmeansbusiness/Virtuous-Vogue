import "server-only";
import type { AiProvider } from "./types";
import { heuristicProvider } from "./providers/heuristic";
import { anthropicProvider } from "./providers/anthropic";

/**
 * AI_PROVIDER=heuristic (default) | anthropic
 * The heuristic provider uses deterministic image statistics and template
 * copy, so the Studio works with zero external calls. The Anthropic
 * provider adds vision classification and generated explanations.
 */
export function createAiProvider(): AiProvider {
  const name = process.env.AI_PROVIDER ?? "heuristic";
  if (name === "anthropic" && process.env.ANTHROPIC_API_KEY) return anthropicProvider(heuristicProvider);
  return heuristicProvider;
}
