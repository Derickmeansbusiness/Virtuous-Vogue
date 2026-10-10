import type { ColourReading } from "./colour-analysis";

export type Swatch = { name: string; hex: string };
export type ColourGuidance = {
  summary: string;
  families: Swatch[];
  neutrals: Swatch[];
  accents: Swatch[];
  metals: string;
  combinations: string[];
  testCarefully: Swatch[];
};

type L = "en" | "fr";
const t = (locale: L, en: string, fr: string) => (locale === "fr" ? fr : en);

/**
 * Deterministic guidance from undertone + contrast. Written to be honest:
 * it suggests families to explore and colours to test, never prescriptions.
 */
export function buildColourGuidance(r: ColourReading, locale: L): ColourGuidance {
  const warm = r.undertone === "warm";
  const cool = r.undertone === "cool";

  const neutrals: Swatch[] = warm
    ? [{ name: t(locale, "Ivory", "Ivoire"), hex: "#F4EFE7" }, { name: t(locale, "Camel", "Camel"), hex: "#B48A5A" }, { name: t(locale, "Chocolate", "Chocolat"), hex: "#4A2E22" }, { name: t(locale, "Olive", "Olive"), hex: "#5C6B3F" }]
    : cool
      ? [{ name: t(locale, "Soft white", "Blanc doux"), hex: "#F7F6F2" }, { name: t(locale, "Stone grey", "Gris pierre"), hex: "#A9A6A0" }, { name: t(locale, "Navy", "Marine"), hex: "#1F2A44" }, { name: t(locale, "Charcoal", "Anthracite"), hex: "#2E2C2A" }]
      : [{ name: t(locale, "Ivory", "Ivoire"), hex: "#F4EFE7" }, { name: t(locale, "Taupe", "Taupe"), hex: "#8C7B6B" }, { name: t(locale, "Navy", "Marine"), hex: "#1F2A44" }, { name: t(locale, "Black", "Noir"), hex: "#191816" }];

  const accents: Swatch[] = warm
    ? [{ name: t(locale, "Terracotta", "Terracotta"), hex: "#C8653A" }, { name: t(locale, "Ochre", "Ocre"), hex: "#C99A2E" }, { name: t(locale, "Forest", "Forêt"), hex: "#1F6B4E" }, { name: t(locale, "Coral", "Corail"), hex: "#E27A5F" }]
    : cool
      ? [{ name: t(locale, "Mulberry", "Mûre"), hex: "#672F40" }, { name: t(locale, "Cobalt", "Cobalt"), hex: "#2D4FA8" }, { name: t(locale, "Emerald", "Émeraude"), hex: "#1C7A5B" }, { name: t(locale, "Raspberry", "Framboise"), hex: "#A83A5C" }]
      : [{ name: t(locale, "Mulberry", "Mûre"), hex: "#672F40" }, { name: t(locale, "Teal", "Sarcelle"), hex: "#2A7C7A" }, { name: t(locale, "Brick", "Brique"), hex: "#A4432F" }, { name: t(locale, "Deep green", "Vert profond"), hex: "#1F6B4E" }];

  const families: Swatch[] = r.contrast === "high"
    ? [{ name: t(locale, "Clear, saturated colour", "Couleur claire et saturée"), hex: accents[1].hex }, { name: t(locale, "Strong light-dark pairs", "Paires clair-foncé fortes"), hex: neutrals[3].hex }, ...accents.slice(0, 2)]
    : r.contrast === "low"
      ? [{ name: t(locale, "Tonal, blended colour", "Couleur tonale et fondue"), hex: neutrals[1].hex }, { name: t(locale, "Soft mid-tones", "Demi-teintes douces"), hex: "#C9B8A8" }, ...accents.slice(2, 4)]
      : [{ name: t(locale, "Medium-depth colour", "Couleur de profondeur moyenne"), hex: accents[0].hex }, { name: t(locale, "One deep anchor per outfit", "Un ancrage profond par tenue"), hex: neutrals[2].hex }, ...accents.slice(1, 3)];

  const metals = warm
    ? t(locale, "Gold and warm bronze tend to sit most naturally.", "L'or et le bronze chaud tendent à s'accorder le plus naturellement.")
    : cool
      ? t(locale, "Silver, white gold and cool platinum tend to sit most naturally.", "L'argent, l'or blanc et le platine froid tendent à s'accorder le plus naturellement.")
      : t(locale, "Both gold and silver can work; mixed metals are an option.", "L'or et l'argent peuvent fonctionner ; les métaux mélangés sont une option.");

  const combinations = warm
    ? [t(locale, "Ivory + camel + terracotta accent", "Ivoire + camel + accent terracotta"), t(locale, "Olive + chocolate + gold", "Olive + chocolat + or"), t(locale, "Forest + ivory + ochre scarf", "Forêt + ivoire + foulard ocre")]
    : cool
      ? [t(locale, "Navy + soft white + mulberry", "Marine + blanc doux + mûre"), t(locale, "Charcoal + emerald + silver", "Anthracite + émeraude + argent"), t(locale, "Stone grey + cobalt + black", "Gris pierre + cobalt + noir")]
      : [t(locale, "Ivory + navy + mulberry", "Ivoire + marine + mûre"), t(locale, "Taupe + teal + gold", "Taupe + sarcelle + or"), t(locale, "Black + brick + ivory", "Noir + brique + ivoire")];

  const testCarefully: Swatch[] = warm
    ? [{ name: t(locale, "Icy pastels", "Pastels glacés"), hex: "#D7E3EE" }, { name: t(locale, "Pure black near the face", "Noir pur près du visage"), hex: "#000000" }]
    : cool
      ? [{ name: t(locale, "Orange and mustard", "Orange et moutarde"), hex: "#D9842B" }, { name: t(locale, "Yellowed beige", "Beige jauni"), hex: "#D8C59A" }]
      : [{ name: t(locale, "Very bright neon", "Néons très vifs"), hex: "#CCFF00" }, { name: t(locale, "Muddy khaki", "Kaki boueux"), hex: "#8A8151" }];

  const conf = r.confidence >= 0.75 ? t(locale, "a fairly confident", "une lecture assez confiante") : t(locale, "a tentative", "une lecture prudente");
  const summary = t(
    locale,
    `This is ${conf} digital preview: ${r.undertone} undertone tendency with ${r.contrast} contrast. Treat it as a direction to test with real fabric in daylight, not a verdict.`,
    `Ceci est ${conf} : tendance de sous-ton ${r.undertone === "warm" ? "chaud" : r.undertone === "cool" ? "froid" : "neutre"} avec un contraste ${r.contrast === "high" ? "élevé" : r.contrast === "low" ? "faible" : "moyen"}. Prenez-le comme une direction à tester avec de vrais tissus à la lumière du jour, pas comme un verdict.`,
  );

  return { summary, families, neutrals, accents, metals, combinations, testCarefully };
}
