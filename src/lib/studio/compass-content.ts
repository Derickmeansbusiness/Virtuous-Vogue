import type { Direction } from "./compass-model";
import type { Localized } from "@/content/types";

const L = (en: string, fr: string): Localized => ({ en, fr });

export type DirectionProfile = {
  name: Localized;
  essence: Localized;
  colourMood: Localized;
  silhouette: Localized;
  priorities: Localized[];
  formulas: Localized[];
  experiments: Localized[];
  service: "style-clarity" | "colour-harmony" | "wardrobe-edit" | "occasion-styling" | "personal-shopping" | "signature-private-styling";
  palette: string[];
};

export const directionProfiles: Record<Direction, DirectionProfile> = {
  refined_feminine: {
    name: L("Refined Feminine", "Féminin Raffiné"),
    essence: L("Softness with a spine: clean lines, fluid fabric, nothing shouting.", "De la douceur avec une colonne vertébrale : lignes nettes, tissus fluides, rien qui crie."),
    colourMood: L("Ivory, blush, deep mulberry and a warm neutral base.", "Ivoire, rose poudré, mûre profonde et une base neutre chaude."),
    silhouette: L("Defined waist, midi lengths, a long sleeve that drapes.", "Taille définie, longueurs midi, une manche longue qui tombe."),
    priorities: [L("A silk or satin blouse in your best deep colour", "Une blouse en soie ou satin dans votre meilleure couleur profonde"), L("One midi skirt that moves", "Une jupe midi qui bouge"), L("A low, elegant heel you can walk in", "Un talon bas et élégant dans lequel vous pouvez marcher")],
    formulas: [L("Silk blouse + wide trouser + low heel", "Blouse en soie + pantalon large + talon bas"), L("Knit dress + long coat + one gold piece", "Robe en maille + manteau long + un bijou doré"), L("Column dress + slim belt + flat sandal", "Robe colonne + ceinture fine + sandale plate")],
    experiments: [L("A sharper shoulder than you're used to", "Une épaule plus marquée que d'habitude"), L("Tonal dressing in one colour, head to toe", "Un camaïeu d'une seule couleur, de la tête aux pieds")],
    service: "colour-harmony",
    palette: ["#F4EFE7", "#E8C9C4", "#672F40", "#C5AE96", "#191816"],
  },
  expressive_classic: {
    name: L("Expressive Classic", "Classique Expressif"),
    essence: L("The classics, worn with intent and one unmistakable choice per outfit.", "Les classiques, portés avec intention et un choix affirmé par tenue."),
    colourMood: L("Navy, ivory, camel, with one bold accent you own.", "Marine, ivoire, camel, avec un accent vif que vous assumez."),
    silhouette: L("Structured shoulders, straight lines, crisp collars.", "Épaules structurées, lignes droites, cols nets."),
    priorities: [L("A blazer that fits as if it were made for you", "Un blazer qui vous va comme s'il était fait pour vous"), L("A crisp white or ivory shirt", "Une chemise blanche ou ivoire impeccable"), L("Trousers with a clean front crease", "Un pantalon avec un pli devant net")],
    formulas: [L("Blazer + shirt + straight trouser + loafer", "Blazer + chemise + pantalon droit + mocassin"), L("Knit + midi skirt + pointed flat", "Maille + jupe midi + ballerine pointue"), L("Shirt dress + belt + structured bag", "Robe-chemise + ceinture + sac structuré")],
    experiments: [L("A heritage print as the one bold piece", "Un imprimé d'héritage comme seule pièce audacieuse"), L("Swapping the heel for a clean sneaker on a Friday", "Remplacer le talon par une basket épurée le vendredi")],
    service: "style-clarity",
    palette: ["#1F2A44", "#F4EFE7", "#B48A5A", "#672F40", "#191816"],
  },
  soft_minimalist: {
    name: L("Soft Minimalist", "Minimaliste Doux"),
    essence: L("Fewer pieces, better fabric, and the calm that comes with it.", "Moins de pièces, de meilleurs tissus, et le calme qui va avec."),
    colourMood: L("Ivory, stone, oatmeal, charcoal: a quiet range.", "Ivoire, pierre, avoine, anthracite : une gamme calme."),
    silhouette: L("Long lines, relaxed fit, nothing fussy at the neck.", "Lignes longues, coupe détendue, rien de compliqué au col."),
    priorities: [L("A fine-gauge knit in your best neutral", "Une maille fine dans votre meilleur neutre"), L("Wide trousers that fall straight", "Un pantalon large qui tombe droit"), L("A coat that does the talking", "Un manteau qui parle pour vous")],
    formulas: [L("Knit + wide trouser + flat", "Maille + pantalon large + plat"), L("Long dress + long coat", "Robe longue + manteau long"), L("Shirt + skirt, same colour family", "Chemise + jupe, même famille de couleurs")],
    experiments: [L("One textured piece: bouclé, linen slub, raw silk", "Une pièce texturée : bouclé, lin flammé, soie sauvage"), L("A single deep colour against your neutrals", "Une seule couleur profonde contre vos neutres")],
    service: "wardrobe-edit",
    palette: ["#F4EFE7", "#C9BBA6", "#EDE3D7", "#6F6A63", "#191816"],
  },
  relaxed_tailoring: {
    name: L("Relaxed Tailoring", "Tailoring Détendu"),
    essence: L("Suiting with the stiffness taken out. Ease that still reads polished.", "Du tailleur sans la raideur. Une aisance qui reste soignée."),
    colourMood: L("Camel, olive, ivory, black; earthy and grounded.", "Camel, olive, ivoire, noir ; terreux et ancré."),
    silhouette: L("Unstructured jackets, wide legs, rolled sleeves.", "Vestes déstructurées, jambes larges, manches roulées."),
    priorities: [L("An unlined jacket in linen or soft wool", "Une veste non doublée en lin ou laine souple"), L("Pleated wide-leg trousers", "Un pantalon large à pinces"), L("A loafer or clean sneaker", "Un mocassin ou une basket épurée")],
    formulas: [L("Soft jacket + tee + wide trouser", "Veste souple + t-shirt + pantalon large"), L("Shirt, half-tucked + trouser + loafer", "Chemise à demi rentrée + pantalon + mocassin"), L("Waistcoat + trouser, no jacket", "Gilet + pantalon, sans veste")],
    experiments: [L("A matching set in a colour, not a neutral", "Un ensemble assorti dans une couleur, pas un neutre"), L("A longer length skirt in place of the trouser", "Une jupe longue à la place du pantalon")],
    service: "wardrobe-edit",
    palette: ["#B48A5A", "#5C6B3F", "#F4EFE7", "#191816", "#C5AE96"],
  },
  modern_romantic: {
    name: L("Modern Romantic", "Romantique Moderne"),
    essence: L("Movement, softness and feeling, kept modern by restraint.", "Mouvement, douceur et émotion, maintenus modernes par la retenue."),
    colourMood: L("Blush, sage, dusty blue, ivory, with a deep accent.", "Rose poudré, sauge, bleu poudré, ivoire, avec un accent profond."),
    silhouette: L("Flowing skirts, soft volume at the sleeve, gentle waists.", "Jupes fluides, volume doux à la manche, tailles douces."),
    priorities: [L("A flowing skirt that moves when you walk", "Une jupe fluide qui bouge quand vous marchez"), L("A blouse with a considered sleeve", "Une blouse avec une manche travaillée"), L("A delicate but real shoe: a sandal, a low heel", "Une chaussure délicate mais vraie : une sandale, un talon bas")],
    formulas: [L("Flowing skirt + fitted knit + sandal", "Jupe fluide + maille ajustée + sandale"), L("Soft dress + structured jacket", "Robe douce + veste structurée"), L("Blouse + straight trouser + one soft colour", "Blouse + pantalon droit + une couleur douce")],
    experiments: [L("A hard edge somewhere: a sharp bag, a black belt", "Une touche dure quelque part : un sac net, une ceinture noire"), L("All one soft colour, from collar to hem", "Une seule couleur douce, du col à l'ourlet")],
    service: "colour-harmony",
    palette: ["#E8C9C4", "#B9C4A8", "#A9B8CF", "#F4EFE7", "#672F40"],
  },
  creative_elegance: {
    name: L("Creative Elegance", "Élégance Créative"),
    essence: L("Elegance that isn't afraid of print, texture or a decisive shape.", "Une élégance qui n'a pas peur de l'imprimé, de la texture ou d'une forme décidée."),
    colourMood: L("Terracotta, cobalt, emerald, ochre against ivory and black.", "Terracotta, cobalt, émeraude, ocre contre ivoire et noir."),
    silhouette: L("One strong line per outfit; the rest stays calm.", "Une ligne forte par tenue ; le reste reste calme."),
    priorities: [L("One statement piece you'd wear a hundred times", "Une pièce forte que vous porteriez cent fois"), L("A tailor you trust", "Un tailleur en qui vous avez confiance"), L("Neutral foundations so the statement can speak", "Des bases neutres pour que la pièce forte parle")],
    formulas: [L("Print skirt + plain top + flat", "Jupe imprimée + haut uni + plat"), L("Bold jacket + black trouser + simple shoe", "Veste audacieuse + pantalon noir + chaussure simple"), L("Textured dress + one metal", "Robe texturée + un seul métal")],
    experiments: [L("A week of only neutrals, to see what you miss", "Une semaine de neutres uniquement, pour voir ce qui manque"), L("Heritage fabric cut in a modern shape", "Un tissu d'héritage coupé dans une forme moderne")],
    service: "personal-shopping",
    palette: ["#C8653A", "#2D4FA8", "#1F6B4E", "#F4EFE7", "#191816"],
  },
  polished_natural: {
    name: L("Polished Natural", "Naturel Soigné"),
    essence: L("Easy, breathable, real, and still put together.", "Facile, respirant, vrai, et toujours soigné."),
    colourMood: L("Sand, olive, white, tan leather, with sky or terracotta.", "Sable, olive, blanc, cuir fauve, avec du ciel ou de la terracotta."),
    silhouette: L("Relaxed shirts, straight trousers, a long dress for heat.", "Chemises souples, pantalons droits, une robe longue pour la chaleur."),
    priorities: [L("Linen shirts in two neutrals", "Des chemises en lin dans deux neutres"), L("A long cotton or Tencel dress", "Une robe longue en coton ou Tencel"), L("A leather sandal that reads polished", "Une sandale en cuir qui paraît soignée")],
    formulas: [L("Linen shirt + wide trouser + sandal", "Chemise en lin + pantalon large + sandale"), L("Long dress + tote + hoop earrings", "Robe longue + cabas + créoles"), L("Shirt + midi skirt + flat", "Chemise + jupe midi + plat")],
    experiments: [L("A sharper tailored piece over the linen", "Une pièce de tailleur plus nette sur le lin"), L("One deep colour in the evening", "Une couleur profonde le soir")],
    service: "style-clarity",
    palette: ["#D9CBB2", "#5C6B3F", "#FBF9F5", "#8B5A2B", "#C8653A"],
  },
  contemporary_modest: {
    name: L("Contemporary Modest", "Modeste Contemporain"),
    essence: L("Coverage as design: long lines, high necks, beautiful fabric, zero apology.", "La couverture comme design : lignes longues, cols hauts, beaux tissus, sans aucune excuse."),
    colourMood: L("Deep and rich: mulberry, forest, navy, with ivory for light.", "Profond et riche : mûre, forêt, marine, avec de l'ivoire pour la lumière."),
    silhouette: L("Column and A-line dresses, long sleeves, layered lengths.", "Robes colonne et trapèze, manches longues, longueurs superposées."),
    priorities: [L("A long-sleeved column dress in a deep colour", "Une robe colonne à manches longues dans une couleur profonde"), L("A long duster or light coat for layering", "Un long manteau léger pour superposer"), L("Scarves and headwraps that match your palette", "Des foulards et attachés assortis à votre palette")],
    formulas: [L("Column dress + duster + flat sandal", "Robe colonne + manteau long léger + sandale plate"), L("Long skirt + tucked blouse + belt", "Jupe longue + blouse rentrée + ceinture"), L("Wide trouser + long tunic + loafer", "Pantalon large + tunique longue + mocassin")],
    experiments: [L("Volume at the sleeve instead of the hem", "Du volume à la manche plutôt qu'à l'ourlet"), L("A bold colour head to toe", "Une couleur vive de la tête aux pieds")],
    service: "occasion-styling",
    palette: ["#672F40", "#1F6B4E", "#1F2A44", "#F4EFE7", "#C5AE96"],
  },
};
