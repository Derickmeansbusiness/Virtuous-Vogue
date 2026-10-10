import "server-only";
import type { AiProvider, GarmentGuess } from "../types";

/**
 * Anthropic provider. Uses the Messages API directly (no SDK dependency) so
 * the bundle stays small. Model is configurable; outputs are validated and
 * fall back to the heuristic provider on any failure.
 */
const MODEL = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-5-5";
const API = "https://api.anthropic.com/v1/messages";

async function call(body: object) {
  const res = await fetch(API, {
    method: "POST",
    headers: { "content-type": "application/json", "x-api-key": process.env.ANTHROPIC_API_KEY ?? "", "anthropic-version": "2023-06-01" },
    body: JSON.stringify({ model: MODEL, max_tokens: 400, ...body }),
  });
  if (!res.ok) throw new Error(`anthropic ${res.status}`);
  const json = (await res.json()) as { content: { type: string; text?: string }[] };
  return json.content.find((c) => c.type === "text")?.text ?? "";
}

const GUARD = "You assist a personal stylist. Never claim certainty, never comment on body shape or worth, never shame. Keep to plain, warm language.";

export function anthropicProvider(fallback: AiProvider): AiProvider {
  return {
    name: "anthropic",
    async classifyGarment(image) {
      try {
        const text = await call({
          system: `${GUARD} Return only compact JSON with optional keys: category (top|bottom|dress|outerwear|shoes|bag|accessory|other), subcategory, colour (one word colour family), colourHex, pattern (plain|stripe|check|print|floral|heritage|other), fabric, fit (fitted|regular|relaxed|oversized), coverage (full|mostly|balanced|light).`,
          messages: [{ role: "user", content: [{ type: "image", source: { type: "base64", media_type: "image/jpeg", data: image.toString("base64") } }, { type: "text", text: "Classify this single garment photo." }] }],
        });
        const json = JSON.parse(text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1)) as GarmentGuess;
        return { ...(await fallback.classifyGarment(image)), ...json };
      } catch {
        return fallback.classifyGarment(image);
      }
    },
    async explainOutfit(input) {
      try {
        return await call({
          system: `${GUARD} Explain in two sentences why this outfit may work for the occasion, referring to proportion, colour and fabric. Language: ${input.locale === "fr" ? "French" : "English"}.`,
          messages: [{ role: "user", content: JSON.stringify(input) }],
        });
      } catch {
        return fallback.explainOutfit(input);
      }
    },
    async summariseStyle(input) {
      try {
        return await call({
          system: `${GUARD} Write a warm 80-word summary of this client's style direction for her private Style Passport. Directions, not identities. Language: ${input.locale === "fr" ? "French" : "English"}.`,
          messages: [{ role: "user", content: JSON.stringify(input) }],
        });
      } catch {
        return fallback.summariseStyle(input);
      }
    },
    async explainColour(input) {
      try {
        return await call({
          system: `${GUARD} In three sentences, explain what a ${input.undertone} undertone tendency with ${input.contrast} contrast suggests for colour, and say plainly it is a digital preview, not an analysis. Language: ${input.locale === "fr" ? "French" : "English"}.`,
          messages: [{ role: "user", content: "Explain." }],
        });
      } catch {
        return fallback.explainColour(input);
      }
    },
  };
}
