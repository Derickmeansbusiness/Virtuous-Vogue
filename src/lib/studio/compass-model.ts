/**
 * Style Compass · deterministic multidimensional style model.
 *
 * Eight style directions. Every answer contributes weighted points to one
 * or more directions; the result is normalised to percentages so a client
 * can be 42% Refined Feminine, 31% Soft Minimalist, 27% Relaxed Tailoring.
 * These are directions, never identities, and the copy says so.
 */
export const DIRECTIONS = [
  "refined_feminine",
  "expressive_classic",
  "soft_minimalist",
  "relaxed_tailoring",
  "modern_romantic",
  "creative_elegance",
  "polished_natural",
  "contemporary_modest",
] as const;
export type Direction = (typeof DIRECTIONS)[number];
export type Weights = Partial<Record<Direction, number>>;

export type Localized = { en: string; fr: string };

export type Option = { value: string; label: Localized; weights: Weights; tags?: string[] };
export type Question =
  | { key: string; kind: "single"; title: Localized; help?: Localized; options: Option[]; optional?: boolean }
  | { key: string; kind: "multi"; title: Localized; help?: Localized; options: Option[]; max?: number; optional?: boolean }
  | { key: string; kind: "words"; title: Localized; help?: Localized; count: 3; optional?: boolean }
  | { key: string; kind: "text"; title: Localized; help?: Localized; optional?: boolean; placeholder?: Localized };

const L = (en: string, fr: string): Localized => ({ en, fr });

export const questions: Question[] = [
  {
    key: "lifestyle",
    kind: "single",
    title: L("Which of these feels most like your week?", "Laquelle de ces semaines vous ressemble le plus ?"),
    options: [
      { value: "office", label: L("Mostly in an office or meeting rooms", "Surtout au bureau ou en réunion"), weights: { expressive_classic: 2, relaxed_tailoring: 2, polished_natural: 1 } },
      { value: "founder", label: L("Running my own business, every day different", "Je dirige mon entreprise, chaque jour est différent"), weights: { creative_elegance: 2, relaxed_tailoring: 2, expressive_classic: 1 } },
      { value: "campus", label: L("Studying, with a social life around it", "J'étudie, avec une vie sociale autour"), weights: { soft_minimalist: 2, modern_romantic: 1, polished_natural: 1 } },
      { value: "home", label: L("At home, with family and community at the centre", "À la maison, famille et communauté au centre"), weights: { polished_natural: 2, contemporary_modest: 2, refined_feminine: 1 } },
      { value: "public", label: L("Public-facing: events, speaking, hosting", "Face au public : événements, prises de parole, réceptions"), weights: { creative_elegance: 2, refined_feminine: 2, expressive_classic: 1 } },
    ],
  },
  {
    key: "climate",
    kind: "single",
    title: L("What is your climate most of the year?", "Quel est votre climat la majeure partie de l'année ?"),
    options: [
      { value: "hot_humid", label: L("Hot and humid, like Douala", "Chaud et humide, comme Douala"), weights: { polished_natural: 1, soft_minimalist: 1 }, tags: ["breathable"] },
      { value: "hot_dry", label: L("Hot and dry", "Chaud et sec"), weights: { polished_natural: 1 }, tags: ["breathable"] },
      { value: "mixed", label: L("Four seasons", "Quatre saisons"), weights: { relaxed_tailoring: 1, expressive_classic: 1 }, tags: ["layers"] },
      { value: "cool", label: L("Mostly cool", "Surtout frais"), weights: { relaxed_tailoring: 1, refined_feminine: 1 }, tags: ["layers"] },
    ],
  },
  {
    key: "coverage",
    kind: "single",
    title: L("How much coverage do you prefer?", "Quel niveau de couverture préférez-vous ?"),
    help: L("A preference, not a rule. It shapes the silhouettes we suggest.", "Une préférence, pas une règle. Elle guide les silhouettes suggérées."),
    options: [
      { value: "full", label: L("Full: long sleeves, high necklines, long hems", "Complète : manches longues, cols hauts, ourlets longs"), weights: { contemporary_modest: 3, refined_feminine: 1 }, tags: ["modest"] },
      { value: "mostly", label: L("Mostly covered, with some flexibility", "Surtout couverte, avec une certaine souplesse"), weights: { contemporary_modest: 2, polished_natural: 1 }, tags: ["modest"] },
      { value: "balanced", label: L("Balanced: it depends on the day", "Équilibrée : selon le jour"), weights: { expressive_classic: 1, soft_minimalist: 1 } },
      { value: "relaxed", label: L("Relaxed about it", "Plutôt détendue à ce sujet"), weights: { modern_romantic: 1, creative_elegance: 1 } },
    ],
  },
  {
    key: "comfort",
    kind: "multi",
    max: 2,
    title: L("What matters most for comfort?", "Qu'est-ce qui compte le plus pour votre confort ?"),
    options: [
      { value: "ease", label: L("Ease of movement", "Liberté de mouvement"), weights: { relaxed_tailoring: 2, polished_natural: 1 } },
      { value: "structure", label: L("Structure that holds me", "Une structure qui me tient"), weights: { expressive_classic: 2, refined_feminine: 1 } },
      { value: "softness", label: L("Soft fabrics against skin", "Des tissus doux sur la peau"), weights: { soft_minimalist: 2, modern_romantic: 1 } },
      { value: "cool", label: L("Staying cool", "Rester au frais"), weights: { polished_natural: 2 }, tags: ["breathable"] },
      { value: "pockets", label: L("Pockets and practicality", "Poches et praticité"), weights: { relaxed_tailoring: 2 } },
    ],
  },
  {
    key: "silhouettes",
    kind: "multi",
    max: 3,
    title: L("Which silhouettes do you reach for?", "Quelles silhouettes vous attirent ?"),
    options: [
      { value: "wide_leg", label: L("Wide-leg trousers", "Pantalon large"), weights: { relaxed_tailoring: 2, soft_minimalist: 1 } },
      { value: "column", label: L("Long column dresses", "Robes longues colonne"), weights: { contemporary_modest: 2, refined_feminine: 1, soft_minimalist: 1 } },
      { value: "fitted_tailoring", label: L("Fitted blazers and sharp lines", "Blazers ajustés et lignes nettes"), weights: { expressive_classic: 2, creative_elegance: 1 } },
      { value: "flowing", label: L("Flowing skirts and soft volume", "Jupes fluides et volume doux"), weights: { modern_romantic: 2, refined_feminine: 1 } },
      { value: "relaxed_shirt", label: L("Relaxed shirts and easy knits", "Chemises souples et mailles faciles"), weights: { polished_natural: 2, soft_minimalist: 1 } },
      { value: "statement", label: L("A statement shape now and then", "Une forme affirmée de temps en temps"), weights: { creative_elegance: 2, expressive_classic: 1 } },
    ],
  },
  {
    key: "colours",
    kind: "multi",
    max: 3,
    title: L("Which colour families feel like you?", "Quelles familles de couleurs vous ressemblent ?"),
    options: [
      { value: "neutrals", label: L("Ivory, stone, camel, black", "Ivoire, pierre, camel, noir"), weights: { soft_minimalist: 2, relaxed_tailoring: 1 } },
      { value: "deep", label: L("Deep: mulberry, navy, forest, chocolate", "Profondes : mûre, marine, forêt, chocolat"), weights: { expressive_classic: 2, contemporary_modest: 1 } },
      { value: "soft", label: L("Soft: blush, sage, dusty blue", "Douces : rose poudré, sauge, bleu poudré"), weights: { modern_romantic: 2, refined_feminine: 1 } },
      { value: "earth", label: L("Earth: terracotta, olive, ochre", "Terre : terracotta, olive, ocre"), weights: { polished_natural: 2, creative_elegance: 1 } },
      { value: "bold", label: L("Bold: cobalt, emerald, red", "Vives : cobalt, émeraude, rouge"), weights: { creative_elegance: 2, expressive_classic: 1 } },
    ],
  },
  {
    key: "patterns",
    kind: "single",
    title: L("How do you feel about pattern?", "Que pensez-vous des motifs ?"),
    options: [
      { value: "plain", label: L("Mostly plain", "Surtout unis"), weights: { soft_minimalist: 2, relaxed_tailoring: 1 } },
      { value: "subtle", label: L("Subtle: stripes, small checks, texture", "Discrets : rayures, petits carreaux, texture"), weights: { expressive_classic: 1, polished_natural: 1 } },
      { value: "print", label: L("I love a print", "J'adore un imprimé"), weights: { creative_elegance: 2, modern_romantic: 1 } },
      { value: "heritage", label: L("Prints with meaning: wax, heritage weaves", "Des imprimés qui ont du sens : wax, tissages d'héritage"), weights: { creative_elegance: 2, contemporary_modest: 1 } },
    ],
  },
  {
    key: "fabrics",
    kind: "multi",
    max: 2,
    title: L("Fabrics you love to wear", "Tissus que vous aimez porter"),
    options: [
      { value: "linen", label: L("Linen and cotton", "Lin et coton"), weights: { polished_natural: 2 }, tags: ["breathable"] },
      { value: "silk", label: L("Silk and satin", "Soie et satin"), weights: { refined_feminine: 2, modern_romantic: 1 } },
      { value: "wool", label: L("Wool and crisp tailoring cloth", "Laine et draps de tailleur"), weights: { expressive_classic: 2, relaxed_tailoring: 1 } },
      { value: "knit", label: L("Fine knits and jersey", "Mailles fines et jersey"), weights: { soft_minimalist: 2 } },
      { value: "textured", label: L("Texture: bouclé, jacquard, brocade", "Texture : bouclé, jacquard, brocart"), weights: { creative_elegance: 2 } },
    ],
  },
  {
    key: "footwear",
    kind: "single",
    title: L("Your everyday shoe", "Votre chaussure de tous les jours"),
    options: [
      { value: "flat", label: L("Flats and loafers", "Ballerines et mocassins"), weights: { soft_minimalist: 1, relaxed_tailoring: 1, polished_natural: 1 } },
      { value: "low_heel", label: L("A low, elegant heel", "Un talon bas et élégant"), weights: { refined_feminine: 2, expressive_classic: 1 } },
      { value: "sandal", label: L("Sandals", "Sandales"), weights: { polished_natural: 2, modern_romantic: 1 } },
      { value: "sneaker", label: L("A clean sneaker", "Une basket épurée"), weights: { relaxed_tailoring: 2, soft_minimalist: 1 } },
    ],
  },
  {
    key: "accessories",
    kind: "single",
    title: L("Accessories: how much?", "Les accessoires : combien ?"),
    options: [
      { value: "minimal", label: L("One quiet piece", "Une seule pièce discrète"), weights: { soft_minimalist: 2, refined_feminine: 1 } },
      { value: "considered", label: L("A few, chosen with care", "Quelques-uns, choisis avec soin"), weights: { expressive_classic: 1, polished_natural: 1 } },
      { value: "expressive", label: L("They make the outfit", "Ils font la tenue"), weights: { creative_elegance: 2, modern_romantic: 1 } },
      { value: "headwrap", label: L("Headwraps and scarves are part of me", "Foulards et attachés de tête font partie de moi"), weights: { contemporary_modest: 2, creative_elegance: 1 } },
    ],
  },
  {
    key: "budget",
    kind: "single",
    title: L("Your budget philosophy", "Votre philosophie de budget"),
    options: [
      { value: "fewer_better", label: L("Fewer, better pieces", "Moins de pièces, de meilleure qualité"), weights: { soft_minimalist: 1, expressive_classic: 1 } },
      { value: "mix", label: L("Mix of investment and everyday finds", "Un mélange d'investissement et de trouvailles"), weights: { polished_natural: 1, relaxed_tailoring: 1 } },
      { value: "tailor", label: L("I'd rather have things made or altered", "Je préfère faire faire ou retoucher"), weights: { creative_elegance: 1, contemporary_modest: 1 } },
      { value: "value", label: L("Value first, always", "La valeur d'abord, toujours"), weights: { polished_natural: 1 } },
    ],
  },
  {
    key: "shopping",
    kind: "single",
    title: L("How do you usually shop?", "Comment faites-vous vos achats d'habitude ?"),
    options: [
      { value: "rarely", label: L("Rarely, and only when I need to", "Rarement, et seulement par nécessité"), weights: { soft_minimalist: 1 } },
      { value: "impulse", label: L("I fall in love and buy", "Je tombe amoureuse et j'achète"), weights: { modern_romantic: 1, creative_elegance: 1 } },
      { value: "planned", label: L("With a list", "Avec une liste"), weights: { expressive_classic: 1, relaxed_tailoring: 1 } },
      { value: "tailored", label: L("Mostly with my tailor or local boutiques", "Surtout chez mon tailleur ou en boutiques locales"), weights: { creative_elegance: 1, contemporary_modest: 1 } },
    ],
  },
  {
    key: "occasions",
    kind: "multi",
    max: 3,
    title: L("What do you dress for most?", "Pour quoi vous habillez-vous le plus ?"),
    options: [
      { value: "work", label: L("Work", "Travail"), weights: { expressive_classic: 1, relaxed_tailoring: 1 } },
      { value: "church", label: L("Church and community", "Église et communauté"), weights: { contemporary_modest: 1, refined_feminine: 1 } },
      { value: "social", label: L("Dinners and social events", "Dîners et événements"), weights: { creative_elegance: 1, modern_romantic: 1 } },
      { value: "travel", label: L("Travel", "Voyages"), weights: { relaxed_tailoring: 1, polished_natural: 1 } },
      { value: "weekend", label: L("Weekends and family", "Week-ends et famille"), weights: { polished_natural: 1, soft_minimalist: 1 } },
      { value: "ceremony", label: L("Weddings and ceremonies", "Mariages et cérémonies"), weights: { refined_feminine: 1, creative_elegance: 1 } },
    ],
  },
  {
    key: "favourite_outfit",
    kind: "text",
    optional: true,
    title: L("Describe an outfit you felt wonderful in.", "Décrivez une tenue dans laquelle vous vous êtes sentie merveilleusement bien."),
    placeholder: L("The cream trousers and the navy shirt, at my sister's graduation…", "Le pantalon crème et la chemise marine, à la remise de diplôme de ma sœur…"),
  },
  {
    key: "least_worn",
    kind: "text",
    optional: true,
    title: L("What do you own and almost never wear?", "Que possédez-vous sans presque jamais le porter ?"),
    placeholder: L("A printed dress I bought for a wedding…", "Une robe imprimée achetée pour un mariage…"),
  },
  {
    key: "appearance_words",
    kind: "words",
    count: 3,
    title: L("Three words you want your appearance to communicate", "Trois mots que votre apparence doit communiquer"),
  },
  {
    key: "personality_words",
    kind: "words",
    count: 3,
    title: L("Three words that describe your personality", "Trois mots qui décrivent votre personnalité"),
  },
  {
    key: "proportions",
    kind: "single",
    optional: true,
    title: L("Optional: where do you like attention to sit?", "Facultatif : où aimez-vous que l'attention se pose ?"),
    help: L("Asked neutrally. Skip if you prefer.", "Posé sans jugement. Passez si vous préférez."),
    options: [
      { value: "face", label: L("Near the face: collars, necklines, earrings", "Près du visage : cols, encolures, boucles d'oreilles"), weights: { refined_feminine: 1, contemporary_modest: 1 } },
      { value: "waist", label: L("A defined waist", "Une taille définie"), weights: { refined_feminine: 1, expressive_classic: 1 } },
      { value: "line", label: L("One long, unbroken line", "Une longue ligne ininterrompue"), weights: { soft_minimalist: 1, contemporary_modest: 1 } },
      { value: "movement", label: L("Movement and flow", "Mouvement et fluidité"), weights: { modern_romantic: 1, polished_natural: 1 } },
    ],
  },
];

export type Answers = Record<string, string | string[]>;

export type CompassResult = {
  scores: Record<Direction, number>; // 0..1, sums to 1
  primary: Direction;
  secondary: Direction | null;
  tags: string[];
  styleWords: string[];
  appearanceWords: string[];
  personalityWords: string[];
};

export function scoreAnswers(answers: Answers): CompassResult {
  const raw: Record<Direction, number> = Object.fromEntries(DIRECTIONS.map((d) => [d, 0])) as Record<Direction, number>;
  const tags = new Set<string>();
  for (const q of questions) {
    if (q.kind !== "single" && q.kind !== "multi") continue;
    const a = answers[q.key];
    const values = Array.isArray(a) ? a : a ? [a] : [];
    for (const v of values) {
      const opt = q.options.find((o) => o.value === v);
      if (!opt) continue;
      for (const [d, w] of Object.entries(opt.weights)) raw[d as Direction] += w ?? 0;
      opt.tags?.forEach((t) => tags.add(t));
    }
  }
  const total = Object.values(raw).reduce((s, v) => s + v, 0) || 1;
  const scores = Object.fromEntries(DIRECTIONS.map((d) => [d, raw[d] / total])) as Record<Direction, number>;
  const ranked = [...DIRECTIONS].sort((a, b) => scores[b] - scores[a]);
  const primary = ranked[0];
  const secondary = scores[ranked[1]] >= 0.12 ? ranked[1] : null;
  const words = (k: string) => (Array.isArray(answers[k]) ? (answers[k] as string[]) : []).map((w) => w.trim()).filter(Boolean);
  const appearanceWords = words("appearance_words");
  const personalityWords = words("personality_words");
  return {
    scores,
    primary,
    secondary,
    tags: [...tags],
    styleWords: [...new Set([...appearanceWords.slice(0, 2), ...personalityWords.slice(0, 1)])],
    appearanceWords,
    personalityWords,
  };
}

export function isComplete(answers: Answers) {
  return questions.filter((q) => !q.optional).every((q) => {
    const a = answers[q.key];
    if (q.kind === "words") return Array.isArray(a) && a.filter((w) => w.trim()).length === 3;
    if (q.kind === "multi") return Array.isArray(a) && a.length > 0;
    return typeof a === "string" && a.length > 0;
  });
}
