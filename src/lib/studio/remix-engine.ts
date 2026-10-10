/**
 * Closet Remix · deterministic outfit composition.
 *
 * Builds outfits only from the client's own pieces. Scores combinations on
 * colour harmony, occasion fit, climate, coverage preference and silhouette
 * balance, then explains each choice in plain language. A purchase is only
 * suggested when a slot genuinely cannot be filled, and it is always labelled
 * "Optional addition".
 */
export type Slot = "top" | "bottom" | "dress" | "layer" | "shoes" | "bag" | "accessory";
export type Category = "top" | "bottom" | "dress" | "outerwear" | "shoes" | "bag" | "accessory" | "other";

export type RemixItem = {
  id: string;
  category: Category;
  subcategory?: string;
  name?: string;
  colour?: string; // family: ivory, black, navy, camel, mulberry, olive, grey, white, brown, red, blue, green, pink, yellow, orange, purple, multi
  colourHex?: string;
  pattern?: "plain" | "stripe" | "check" | "print" | "floral" | "heritage" | "other";
  fabric?: string;
  fit?: "fitted" | "regular" | "relaxed" | "oversized";
  silhouette?: string;
  seasons?: ("hot" | "warm" | "mild" | "cool")[];
  occasions?: string[];
  coverage?: "full" | "mostly" | "balanced" | "light"; // how much it covers
  favourite?: boolean;
};

export type RemixContext = {
  occasion: string;
  climate?: "hot" | "warm" | "mild" | "cool";
  timeOfDay?: "day" | "evening";
  venue?: string;
  dressCode?: "casual" | "smart_casual" | "business" | "formal" | "black_tie" | "none";
  modesty?: "full" | "mostly" | "balanced" | "relaxed";
  shoes?: "flat" | "heel" | "sandal" | "sneaker" | "any";
};

export type Outfit = {
  id: string;
  items: { slot: Slot; item: RemixItem }[];
  score: number;
  reasons: { en: string; fr: string }[];
  gap: { slot: Slot; suggestion: { en: string; fr: string } } | null;
};

const NEUTRALS = new Set(["ivory", "white", "black", "navy", "camel", "grey", "stone", "brown", "beige", "cream", "taupe", "charcoal"]);
const WARM = new Set(["camel", "brown", "beige", "olive", "orange", "yellow", "red", "terracotta", "ochre", "mulberry", "cream", "ivory"]);
const COOL = new Set(["navy", "blue", "grey", "charcoal", "purple", "pink", "white", "black", "emerald", "teal"]);

const FORMALITY: Record<string, number> = { casual: 1, everyday: 1, weekend: 1, travel: 1.5, smart_casual: 2, work: 2.5, church: 2.5, date: 2.5, dinner: 3, presentation: 3, event: 3, formal: 4, wedding: 4, black_tie: 5, custom: 2 };

const ITEM_FORMALITY: Record<string, number> = {
  sneaker: 1, sandal: 1.5, loafer: 2.5, flat: 2.5, heel: 3.5, boot: 2.5,
  tee: 1, knit: 2, shirt: 2.5, blouse: 3, blazer: 3, jacket: 2, coat: 3, trench: 3,
  jeans: 1, trouser: 2.5, skirt: 2.5, dress: 3, gown: 4.5, suit: 3.5, tote: 2, clutch: 4,
};

function formalityOf(item: RemixItem) {
  const key = (item.subcategory ?? item.category).toLowerCase();
  for (const k of Object.keys(ITEM_FORMALITY)) if (key.includes(k)) return ITEM_FORMALITY[k];
  return 2;
}

function colourHarmony(colours: string[]) {
  const c = colours.map((x) => x.toLowerCase()).filter(Boolean);
  const nonNeutral = c.filter((x) => !NEUTRALS.has(x));
  if (nonNeutral.length <= 1) return { score: 1, kind: "anchored" as const };
  const allWarm = nonNeutral.every((x) => WARM.has(x));
  const allCool = nonNeutral.every((x) => COOL.has(x));
  if (allWarm || allCool) return { score: 0.85, kind: "temperature" as const };
  if (nonNeutral.length === 2) return { score: 0.6, kind: "contrast" as const };
  return { score: 0.35, kind: "busy" as const };
}

function fits(item: RemixItem, ctx: RemixContext) {
  let s = 1;
  if (ctx.climate && item.seasons?.length && !item.seasons.includes(ctx.climate)) s -= 0.3;
  if (ctx.occasion && item.occasions?.length && !item.occasions.includes(ctx.occasion)) s -= 0.15;
  const want = ctx.dressCode && ctx.dressCode !== "none" ? FORMALITY[ctx.dressCode] : FORMALITY[ctx.occasion] ?? 2;
  s -= Math.min(0.4, Math.abs(formalityOf(item) - want) * 0.12);
  if (ctx.modesty === "full" && item.coverage === "light") s -= 0.5;
  if (ctx.modesty === "mostly" && item.coverage === "light") s -= 0.25;
  if (ctx.shoes && ctx.shoes !== "any" && item.category === "shoes" && item.subcategory && !item.subcategory.toLowerCase().includes(ctx.shoes)) s -= 0.3;
  if (item.favourite) s += 0.05;
  return Math.max(0, s);
}

function slotOf(item: RemixItem): Slot | null {
  switch (item.category) {
    case "top": return "top";
    case "bottom": return "bottom";
    case "dress": return "dress";
    case "outerwear": return "layer";
    case "shoes": return "shoes";
    case "bag": return "bag";
    case "accessory": return "accessory";
    default: return null;
  }
}

export function composeOutfits(items: RemixItem[], ctx: RemixContext, max = 6): Outfit[] {
  const by = (slot: Slot) => items.filter((i) => slotOf(i) === slot);
  const tops = by("top"), bottoms = by("bottom"), dresses = by("dress"), layers = by("layer"), shoes = by("shoes"), bags = by("bag"), accs = by("accessory");
  const bases: { slot: Slot; item: RemixItem }[][] = [];
  for (const t of tops) for (const b of bottoms) bases.push([{ slot: "top", item: t }, { slot: "bottom", item: b }]);
  for (const d of dresses) bases.push([{ slot: "dress", item: d }]);
  if (bases.length === 0) {
    // Only tops or only bottoms: still show what we can and name the gap honestly.
    for (const t of tops) bases.push([{ slot: "top", item: t }]);
    for (const b of bottoms) bases.push([{ slot: "bottom", item: b }]);
  }

  const candidates: Outfit[] = [];
  let n = 0;
  for (const base of bases) {
    const layerOpts: (RemixItem | null)[] = [null, ...layers];
    const shoeOpts: (RemixItem | null)[] = shoes.length ? shoes : [null];
    for (const layer of layerOpts) {
      for (const shoe of shoeOpts) {
        const parts = [...base];
        if (layer) parts.push({ slot: "layer", item: layer });
        if (shoe) parts.push({ slot: "shoes", item: shoe });
        const bag = bags.sort((a, b) => fits(b, ctx) - fits(a, ctx))[0];
        if (bag) parts.push({ slot: "bag", item: bag });
        const acc = accs.sort((a, b) => fits(b, ctx) - fits(a, ctx))[0];
        if (acc) parts.push({ slot: "accessory", item: acc });

        const harmony = colourHarmony(parts.map((p) => p.item.colour ?? ""));
        const fit = parts.reduce((s, p) => s + fits(p.item, ctx), 0) / parts.length;
        const cold = ctx.climate === "cool" || ctx.climate === "mild";
        const layerBonus = layer ? (cold ? 0.1 : ctx.timeOfDay === "evening" ? 0.04 : -0.08) : cold ? -0.1 : 0.02;
        const patternCount = parts.filter((p) => p.item.pattern && p.item.pattern !== "plain").length;
        const patternPenalty = patternCount > 1 ? 0.15 : 0;
        const fitBalance = balanceScore(parts.map((p) => p.item));
        const score = Math.max(0, Math.min(1, 0.4 * harmony.score + 0.4 * fit + 0.1 * fitBalance + layerBonus - patternPenalty));

        const reasons = explain(parts, ctx, harmony.kind, fitBalance, layer);
        const gap = findGap(parts, ctx, { hasShoes: shoes.length > 0, hasLayer: layers.length > 0, hasBase: base.length === 2 || base[0].slot === "dress" });
        candidates.push({ id: `o${n++}`, items: parts, score, reasons, gap });
      }
    }
  }
  // Diversify: avoid returning near-duplicate outfits (same base) back to back.
  candidates.sort((a, b) => b.score - a.score);
  const seen = new Map<string, number>();
  const out: Outfit[] = [];
  for (const c of candidates) {
    const key = c.items.filter((p) => p.slot === "top" || p.slot === "bottom" || p.slot === "dress").map((p) => p.item.id).join("+");
    const count = seen.get(key) ?? 0;
    if (count >= 2) continue;
    seen.set(key, count + 1);
    out.push(c);
    if (out.length >= max) break;
  }
  return out;
}

function balanceScore(items: RemixItem[]) {
  const fitsList = items.filter((i) => i.category === "top" || i.category === "bottom" || i.category === "dress").map((i) => i.fit ?? "regular");
  if (fitsList.length < 2) return 0.8;
  const loose = fitsList.filter((f) => f === "relaxed" || f === "oversized").length;
  const tight = fitsList.filter((f) => f === "fitted").length;
  if (loose && tight) return 1; // proportion play
  if (loose === fitsList.length) return 0.6;
  return 0.85;
}

function explain(parts: { slot: Slot; item: RemixItem }[], ctx: RemixContext, harmony: string, balance: number, layer: RemixItem | null) {
  const r: { en: string; fr: string }[] = [];
  const name = (p?: { item: RemixItem }) => p?.item.name ?? p?.item.subcategory ?? p?.item.category ?? "";
  const top = parts.find((p) => p.slot === "top"), bottom = parts.find((p) => p.slot === "bottom"), dress = parts.find((p) => p.slot === "dress"), shoe = parts.find((p) => p.slot === "shoes");
  if (harmony === "anchored") r.push({ en: "The palette is anchored by neutrals, so one colour does the talking and nothing competes.", fr: "La palette est ancrée par des neutres : une seule couleur parle et rien ne se dispute l'attention." });
  if (harmony === "temperature") r.push({ en: "The colours share a temperature, which makes the combination feel deliberate rather than accidental.", fr: "Les couleurs partagent une température, ce qui rend la combinaison voulue plutôt qu'accidentelle." });
  if (harmony === "contrast") r.push({ en: "Two colours in contrast: keep the shoe and bag quiet so the pairing stays the point.", fr: "Deux couleurs en contraste : gardez chaussures et sac discrets pour que l'accord reste le sujet." });
  if (harmony === "busy") r.push({ en: "Several colours are competing; swapping one piece for a neutral would calm the look.", fr: "Plusieurs couleurs se disputent ; remplacer une pièce par un neutre calmerait la silhouette." });
  if (top && bottom) {
    if (balance >= 1) r.push({ en: `${capitalize(name(bottom))} gives volume while ${name(top)} keeps the line clean, so the proportions stay balanced.`, fr: `${capitalize(name(bottom))} donne du volume tandis que ${name(top)} garde la ligne nette : les proportions restent équilibrées.` });
    else if (balance < 0.7) r.push({ en: "Both pieces are relaxed; a tuck or a belt would give the eye a waist to rest on.", fr: "Les deux pièces sont amples ; un rentré ou une ceinture donnerait au regard une taille où se poser." });
  }
  if (dress) r.push({ en: `${capitalize(name(dress))} does the work on its own; the rest of the look only needs to agree with it.`, fr: `${capitalize(name(dress))} fait le travail seule ; le reste n'a qu'à s'accorder.` });
  if (layer) r.push({ en: `${capitalize(name({ item: layer }))} adds structure and a second line, useful for ${ctx.occasion.replace("_", " ")}.`, fr: `${capitalize(name({ item: layer }))} ajoute de la structure et une seconde ligne, utile pour ${ctx.occasion.replace("_", " ")}.` });
  if (shoe) r.push({ en: `${capitalize(name(shoe))} keeps the formality where ${ctx.occasion.replace("_", " ")} expects it.`, fr: `${capitalize(name(shoe))} maintient la formalité attendue pour ${ctx.occasion.replace("_", " ")}.` });
  if (ctx.climate === "hot") r.push({ en: "Chosen with heat in mind: breathable layers and nothing that traps warmth.", fr: "Choisi en pensant à la chaleur : des couches respirantes et rien qui retienne la chaleur." });
  return r.slice(0, 3);
}

function findGap(parts: { slot: Slot; item: RemixItem }[], ctx: RemixContext, has: { hasShoes: boolean; hasLayer: boolean; hasBase: boolean }): Outfit["gap"] {
  if (!has.hasBase) {
    const missing = parts.some((p) => p.slot === "top") ? "bottom" : "top";
    return { slot: missing, suggestion: missing === "bottom" ? { en: "A neutral bottom (wide trouser or midi skirt) would unlock every top you uploaded.", fr: "Un bas neutre (pantalon large ou jupe midi) débloquerait tous les hauts téléversés." } : { en: "One plain top in ivory or black would pair with everything here.", fr: "Un haut uni ivoire ou noir s'accorderait avec tout ce qui est ici." } };
  }
  if (!has.hasShoes) return { slot: "shoes", suggestion: { en: "No shoes were uploaded. Add the pair you would actually wear before buying anything.", fr: "Aucune chaussure n'a été téléversée. Ajoutez la paire que vous porteriez vraiment avant d'acheter." } };
  const formal = (ctx.dressCode && ["formal", "black_tie"].includes(ctx.dressCode)) || ["wedding", "formal"].includes(ctx.occasion);
  if (formal && !has.hasLayer && !parts.some((p) => p.slot === "dress")) return { slot: "layer", suggestion: { en: "For a formal setting a tailored layer would lift this; optional, and only if you don't already own one.", fr: "Pour un cadre formel, une pièce tailleur élèverait l'ensemble ; facultatif, et seulement si vous n'en possédez pas déjà." } };
  if ((ctx.climate === "cool" || ctx.climate === "mild") && !has.hasLayer) return { slot: "layer", suggestion: { en: "The weather asks for a layer and none was uploaded. Check your wardrobe first; a coat is an optional addition only if a true gap.", fr: "La météo demande une superposition et aucune n'a été téléversée. Vérifiez d'abord votre garde-robe ; un manteau n'est un ajout facultatif que si le manque est réel." } };
  return null;
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
