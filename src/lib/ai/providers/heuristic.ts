import "server-only";
import sharp from "sharp";
import type { AiProvider, GarmentGuess } from "../types";

const COLOUR_NAMES: { name: string; hex: string; rgb: [number, number, number] }[] = [
  { name: "ivory", hex: "#F4EFE7", rgb: [244, 239, 231] },
  { name: "white", hex: "#FFFFFF", rgb: [250, 250, 250] },
  { name: "black", hex: "#191816", rgb: [25, 24, 22] },
  { name: "charcoal", hex: "#3A3733", rgb: [58, 55, 51] },
  { name: "grey", hex: "#A9A6A0", rgb: [169, 166, 160] },
  { name: "navy", hex: "#1F2A44", rgb: [31, 42, 68] },
  { name: "blue", hex: "#2D4FA8", rgb: [45, 79, 168] },
  { name: "camel", hex: "#B48A5A", rgb: [180, 138, 90] },
  { name: "beige", hex: "#D9CBB2", rgb: [217, 203, 178] },
  { name: "brown", hex: "#5A3A22", rgb: [90, 58, 34] },
  { name: "mulberry", hex: "#672F40", rgb: [103, 47, 64] },
  { name: "red", hex: "#A4432F", rgb: [164, 67, 47] },
  { name: "pink", hex: "#E8C9C4", rgb: [232, 201, 196] },
  { name: "olive", hex: "#5C6B3F", rgb: [92, 107, 63] },
  { name: "green", hex: "#1F6B4E", rgb: [31, 107, 78] },
  { name: "yellow", hex: "#C99A2E", rgb: [201, 154, 46] },
  { name: "orange", hex: "#C8653A", rgb: [200, 101, 58] },
  { name: "purple", hex: "#5B3A7A", rgb: [91, 58, 122] },
];

function nearestColour(r: number, g: number, b: number) {
  let best = COLOUR_NAMES[0], dist = Infinity;
  for (const c of COLOUR_NAMES) {
    const d = (c.rgb[0] - r) ** 2 + (c.rgb[1] - g) ** 2 + (c.rgb[2] - b) ** 2;
    if (d < dist) {
      dist = d;
      best = c;
    }
  }
  return best;
}

/** Deterministic fallback: dominant colour + shape ratio heuristics. Everything is a guess the client corrects. */
export const heuristicProvider: AiProvider = {
  name: "heuristic",
  async classifyGarment(image) {
    const img = sharp(image);
    const meta = await img.metadata();
    const { data, info } = await img.resize(48, 48, { fit: "inside" }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    // Dominant colour from the centre region to avoid backgrounds
    const buckets = new Map<string, { n: number; r: number; g: number; b: number }>();
    for (let y = Math.floor(info.height * 0.25); y < info.height * 0.75; y++) {
      for (let x = Math.floor(info.width * 0.25); x < info.width * 0.75; x++) {
        const i = (y * info.width + x) * 3;
        const r = data[i], g = data[i + 1], b = data[i + 2];
        const key = `${r >> 5}-${g >> 5}-${b >> 5}`;
        const bkt = buckets.get(key) ?? { n: 0, r: 0, g: 0, b: 0 };
        bkt.n++; bkt.r += r; bkt.g += g; bkt.b += b;
        buckets.set(key, bkt);
      }
    }
    const top = [...buckets.values()].sort((a, b) => b.n - a.n)[0];
    const colour = top ? nearestColour(top.r / top.n, top.g / top.n, top.b / top.n) : null;
    const ratio = (meta.height ?? 1) / (meta.width ?? 1);
    const guess: GarmentGuess = {};
    if (colour) {
      guess.colour = colour.name;
      guess.colourHex = colour.hex;
    }
    // Shape heuristic only (the client confirms): tall images lean dress/trouser, wide lean shoes/bag.
    if (ratio > 1.6) guess.category = "dress";
    else if (ratio < 0.8) guess.category = "shoes";
    guess.pattern = "plain";
    return guess;
  },
  async explainOutfit() {
    return null; // the remix engine already writes deterministic explanations
  },
  async summariseStyle() {
    return null;
  },
  async explainColour() {
    return null;
  },
};
