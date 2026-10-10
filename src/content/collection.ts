import type { Localized } from "./types";

/**
 * The Signature Edit, Volume 01: twenty original Virtuous Vogue designs from
 * the collection design bible. Every look is a design concept at this stage:
 * nothing is manufactured, priced or for sale. Copy must say "enquiries
 * welcome", never "available now". Looks are shown only when `published`.
 */

export type CollectionStatus = "first-sample" | "concept";

export interface Swatch {
  name: Localized;
  hex: string;
}

export interface CollectionChapter {
  number: 1 | 2 | 3 | 4;
  slug: string;
  title: Localized;
  theme: Localized;
}

export interface Look {
  code: string; // VV01..VV20
  slug: string;
  chapter: 1 | 2 | 3 | 4;
  name: Localized;
  tagline: Localized;
  silhouette: Localized;
  palette: Swatch[];
  signature: Localized;
  construction: Localized;
  materials: Localized;
  fit: Localized;
  occasions: Localized;
  status: CollectionStatus;
  image: string; // asset id
  published: boolean;
}

export const collectionChapters: CollectionChapter[] = [
  { number: 1, slug: "the-essential-woman", title: { en: "The Essential Woman", fr: "La Femme Essentielle" }, theme: { en: "Structure and polish.", fr: "Structure et éclat." } },
  { number: 2, slug: "the-lived-in-wardrobe", title: { en: "The Lived-In Wardrobe", fr: "La Garde-robe Vécue" }, theme: { en: "Practical distinction.", fr: "Distinction pratique." } },
  { number: 3, slug: "after-the-lights", title: { en: "After the Lights", fr: "Après les Lumières" }, theme: { en: "Expression and occasion.", fr: "Expression et occasion." } },
  { number: 4, slug: "the-unforgettable", title: { en: "The Unforgettable", fr: "L'Inoubliable" }, theme: { en: "Signature pieces.", fr: "Pièces signature." } },
];

const L = (en: string, fr: string): Localized => ({ en, fr });
const S = (en: string, fr: string, hex: string): Swatch => ({ name: L(en, fr), hex });

export const looks: Look[] = [
  {
    code: "VV01",
    slug: "the-ivory-testament",
    chapter: 1,
    name: L("The Ivory Testament", "The Ivory Testament"),
    tagline: L("A study in graceful structure.", "Une étude de structure gracieuse."),
    silhouette: L("Day-to-evening two-piece", "Deux-pièces jour et soir"),
    palette: [S("Warm Ivory", "Ivoire chaud", "#F1E9DA"), S("Pearl", "Perle", "#EDE6DC"), S("Oat", "Avoine", "#CBB9A0")],
    signature: L(
      "A clean ivory ensemble that reads as one elongated silhouette: a hip-length wrap-front blouse with an asymmetric folded neckline, discreet side fastening and a soft waist tuck, paired with fluid, high-rise palazzo trousers. The front fold is the recognisable signature; it is not a generic blouse-and-trousers set.",
      "Un ensemble ivoire épuré qui se lit comme une seule silhouette allongée : une blouse cache-cœur à la hanche, encolure asymétrique pliée, fermeture latérale discrète et léger pli à la taille, avec un pantalon palazzo fluide à taille haute. Le pli de devant est la signature reconnaissable ; ce n'est pas un ensemble blouse-pantalon générique.",
    ),
    construction: L(
      "Folded boat-to-V neckline without gaping; concealed side zip or snaps; cuffed bracelet sleeves; tailored waistband; partial lining only where needed; the blouse covers the trouser top when untucked.",
      "Encolure bateau-V pliée sans bâillement ; zip ou pressions latéraux invisibles ; manches bracelet à revers ; ceinture tailleur ; doublure partielle seulement là où nécessaire ; la blouse couvre le haut du pantalon portée hors du pantalon.",
    ),
    materials: L("Matte viscose crepe or a TENCEL-blend suiting; a breathable cotton-viscose alternative. No heavy bridal satin in Douala heat.", "Crêpe de viscose mat ou tissu tailleur en mélange TENCEL ; alternative coton-viscose respirante. Pas de satin lourd sous la chaleur de Douala."),
    fit: L("Relaxed through bust and hip, defined but adjustable at the waist; trousers skim rather than cling. Tested on straight and curvy figures.", "Aisance au buste et aux hanches, taille définie mais ajustable ; le pantalon effleure plutôt qu'il ne moule. Testé sur silhouettes droites et courbes."),
    occasions: L("Business lunch, daytime reception, civil occasion, stylish everyday wear.", "Déjeuner d'affaires, réception de jour, cérémonie civile, quotidien élégant."),
    status: "first-sample",
    image: "collection-vv01-ivory-testament",
    published: true,
  },
  {
    code: "VV02",
    slug: "mulberry-muse",
    chapter: 1,
    name: L("Mulberry Muse", "Mulberry Muse"),
    tagline: L("Quiet drama, unmistakable presence.", "Un drame feutré, une présence sans équivoque."),
    silhouette: L("Signature occasion dress", "Robe d'occasion signature"),
    palette: [S("Signature Mulberry", "Mûre signature", "#672F40"), S("Black Cherry", "Cerise noire", "#3F1A24"), S("Deep Rosewood", "Bois de rose profond", "#8A4A5C")],
    signature: L(
      "A rich mulberry calf-length column dress with curved princess seams and a detachable sculpted shoulder capelet. The capelet falls just below the shoulder blades and creates a strong silhouette without constricting the arms. One piece, styled two ways.",
      "Une robe colonne mi-mollet d'un mûre profond, coutures princesse courbes et capeline sculptée amovible aux épaules. La capeline tombe juste sous les omoplates et crée une silhouette forte sans contraindre les bras. Une pièce, deux façons de la porter.",
    ),
    construction: L("High soft-square neckline; centre-back invisible zip; fitted-but-not-tight waist; rear walking vent; hidden capelet attachment at the shoulder seam; optional narrow self-belt.", "Encolure carrée douce et haute ; zip invisible au dos ; taille ajustée sans serrer ; fente de marche au dos ; attache de capeline cachée à la couture d'épaule ; ceinture fine assortie en option."),
    materials: L("Structured matte stretch crepe for the dress; bonded lightweight crepe for the removable capelet. No glossy costume satin.", "Crêpe stretch mat structuré pour la robe ; crêpe léger contrecollé pour la capeline amovible. Pas de satin brillant de costume."),
    fit: L("Sitting ease, a walking vent and real sleeve mobility. Capelet attachment and bulk tested in movement.", "Aisance assise, fente de marche et vraie mobilité des manches. Attache et volume de la capeline testés en mouvement."),
    occasions: L("Formal lunch, award ceremony, theatre evening, reception.", "Déjeuner formel, remise de prix, soirée au théâtre, réception."),
    status: "first-sample",
    image: "collection-vv02-mulberry-muse",
    published: true,
  },
  {
    code: "VV03",
    slug: "the-soft-sovereign",
    chapter: 1,
    name: L("The Soft Sovereign", "The Soft Sovereign"),
    tagline: L("Authority with nothing to prove.", "L'autorité qui n'a rien à prouver."),
    silhouette: L("Executive tailored set", "Ensemble tailleur de direction"),
    palette: [S("Oat Taupe", "Taupe avoine", "#B8A48C"), S("Warm Graphite", "Graphite chaud", "#5A534D"), S("Soft Stone", "Pierre douce", "#D6CDBF")],
    signature: L(
      "A softly architectural three-piece: an unlined single-button blazer with a distinctive rounded notch lapel, a high-neck shell, and expertly pleated wide-leg trousers. Subtle curving waist darts produce shape without exaggerated hourglass styling.",
      "Un trois-pièces à l'architecture douce : blazer non doublé à un bouton avec un revers cranté arrondi distinctif, top à col haut et pantalon large aux plis experts. De subtiles pinces courbes à la taille donnent de la forme sans sablier exagéré.",
    ),
    construction: L("Blazer to the upper thigh; lightly built shoulders; one large covered button; hand-width lapel; trouser front pleats, side pockets and a concealed zip.", "Blazer à mi-cuisse ; épaules légèrement structurées ; un grand bouton recouvert ; revers d'une largeur de main ; plis devant, poches latérales et zip invisible au pantalon."),
    materials: L("Tropical-weight wool-viscose for international clients, or a breathable linen-viscose twill for Cameroon; cotton-silk shell.", "Laine-viscose poids tropical pour la clientèle internationale, ou sergé lin-viscose respirant pour le Cameroun ; top en coton-soie."),
    fit: L("Broad size approach; the blazer buttons comfortably seated; hems adjustable for different heights.", "Large plage de tailles ; le blazer se boutonne confortablement assise ; ourlets ajustables selon la taille."),
    occasions: L("Executive meeting, speaking appearance, professional portrait, work event.", "Réunion de direction, prise de parole, portrait professionnel, événement de travail."),
    status: "first-sample",
    image: "collection-vv03-soft-sovereign",
    published: true,
  },
  {
    code: "VV04",
    slug: "champagne-reverie",
    chapter: 1,
    name: L("Champagne Reverie", "Champagne Reverie"),
    tagline: L("A luminous occasion, beautifully restrained.", "Une occasion lumineuse, magnifiquement retenue."),
    silhouette: L("Evening gown with draped shoulder", "Robe du soir à épaule drapée"),
    palette: [S("Champagne", "Champagne", "#D8C0A0"), S("Warm Pearl", "Perle chaude", "#EFE4D6"), S("Soft Bronze", "Bronze doux", "#A6805E")],
    signature: L(
      "An ankle-length formal dress with a restrained bateau neckline, sculpted high waist and a one-sided flowing drape anchored at the shoulder, cascading over a softly flared skirt. The drape detaches for an understated formal variation.",
      "Une robe habillée à la cheville, encolure bateau retenue, taille haute sculptée et drapé fluide d'un seul côté ancré à l'épaule, cascadant sur une jupe légèrement évasée. Le drapé se détache pour une version formelle plus sobre.",
    ),
    construction: L("Full-length fitted sleeves; matte-lined underdress; invisible back zip; weighted hem that keeps the shoulder drape controlled. Not transparent, not skin-tight.", "Manches longues ajustées ; sous-robe doublée mate ; zip invisible au dos ; ourlet lesté qui maîtrise le drapé d'épaule. Ni transparente, ni moulante."),
    materials: L("Medium-weight crepe-back satin with a matte face; a fluid crepe alternative for hot climates.", "Satin dos crêpe de poids moyen à face mate ; alternative en crêpe fluide pour les climats chauds."),
    fit: L("Movement without pooling; the drape must not restrict walking, seating or carrying a bag.", "Du mouvement sans traîner ; le drapé ne doit gêner ni la marche, ni la position assise, ni le port d'un sac."),
    occasions: L("Black-tie reception, wedding guest, private formal dinner.", "Réception en tenue de soirée, invitée de mariage, dîner formel privé."),
    status: "concept",
    image: "collection-vv04-champagne-reverie",
    published: true,
  },
  {
    code: "VV05",
    slug: "the-sunday-heirloom",
    chapter: 2,
    name: L("The Sunday Heirloom", "The Sunday Heirloom"),
    tagline: L("Poise for the moments we gather.", "De la tenue pour les moments où l'on se réunit."),
    silhouette: L("Day occasion dress", "Robe d'occasion de jour"),
    palette: [S("Dusty Blush", "Rose poudré", "#C99CA2"), S("Soft Mauve", "Mauve doux", "#A98792"), S("Blue Slate", "Ardoise bleue", "#6E7F8F")],
    signature: L(
      "A mid-calf fit-and-flare dress in a subtly textured fabric. The signature is a long, gently arched seam from the waist into the skirt, and tailored three-quarter sleeves finishing in a folded petal cuff. An optional coordinating headpiece, never obligatory.",
      "Une robe patineuse mi-mollet dans un tissu subtilement texturé. La signature : une longue couture doucement arquée de la taille vers la jupe, et des manches trois-quarts tailleur finies par un poignet pétale plié. Une coiffe coordonnée en option, jamais obligatoire.",
    ),
    construction: L("Modest jewel neckline; fitted lined bodice; clean invisible zip; side-seam pockets; a generous skirt sweep designed to move without excess volume.", "Encolure ras-du-cou modeste ; corsage ajusté doublé ; zip invisible net ; poches dans les coutures ; ampleur de jupe généreuse conçue pour bouger sans excès de volume."),
    materials: L("Breathable cotton jacquard or cotton-viscose faille; no upholstery-weight brocade.", "Jacquard de coton respirant ou faille coton-viscose ; pas de brocart lourd d'ameublement."),
    fit: L("Waist seam grading is critical; multiple bust-cup checks; length options for shorter and taller clients.", "La gradation de la couture de taille est critique ; vérifications multiples de bonnet ; options de longueur pour clientes petites et grandes."),
    occasions: L("Church service, family celebration, school event, afternoon wedding.", "Office religieux, fête de famille, événement scolaire, mariage d'après-midi."),
    status: "first-sample",
    image: "collection-vv05-sunday-heirloom",
    published: true,
  },
  {
    code: "VV06",
    slug: "the-city-devotion",
    chapter: 2,
    name: L("The City Devotion", "The City Devotion"),
    tagline: L("The confident rhythm of everyday life.", "Le rythme assuré du quotidien."),
    silhouette: L("Contemporary shirt dress", "Robe-chemise contemporaine"),
    palette: [S("Deep Olive", "Olive profond", "#4A5236"), S("Espresso", "Espresso", "#3A2A22"), S("Sandstone", "Grès", "#C8B59C")],
    signature: L(
      "A calf-length collared shirt dress with a diagonal chest pocket, softly dropped shoulder and a functional waist belt. The front carries an off-centre covered placket and an inverted back pleat so it moves with the wearer.",
      "Une robe-chemise à col, mi-mollet, avec poche poitrine diagonale, épaule doucement tombante et ceinture fonctionnelle. Le devant porte une patte de boutonnage décentrée et recouverte, le dos un pli creux pour accompagner le mouvement.",
    ),
    construction: L("Generous armhole comfort; sleeve tab for roll-up styling; side-seam pockets; a hidden inside button at the bust to prevent gaping; hem side slits beneath the knee.", "Emmanchure confortable ; patte de manche pour retrousser ; poches dans les coutures ; bouton intérieur caché à la poitrine contre le bâillement ; petites fentes latérales sous le genou."),
    materials: L("Cotton-TENCEL poplin or mid-weight cotton sateen, pre-washed to control shrinkage.", "Popeline coton-TENCEL ou satin de coton de poids moyen, prélavé pour maîtriser le rétrécissement."),
    fit: L("Relaxed shirt-dress cut with an adjustable belt. Length options; bust placket spacing tested.", "Coupe robe-chemise décontractée à ceinture ajustable. Options de longueur ; espacement des boutons à la poitrine testé."),
    occasions: L("Office day, gallery visit, restaurant lunch, casual event.", "Journée au bureau, visite de galerie, déjeuner au restaurant, événement décontracté."),
    status: "first-sample",
    image: "collection-vv06-city-devotion",
    published: true,
  },
  {
    code: "VV07",
    slug: "the-linen-virtue",
    chapter: 2,
    name: L("The Linen Virtue", "The Linen Virtue"),
    tagline: L("Air, movement and the ease of being yourself.", "L'air, le mouvement et l'aisance d'être soi."),
    silhouette: L("Warm-weather coordinated set", "Ensemble coordonné pour temps chaud"),
    palette: [S("Natural Flax", "Lin naturel", "#D9CDB4"), S("Sea-glass Teal", "Sarcelle verre de mer", "#5F9A99"), S("Clay", "Argile", "#B46C5A")],
    signature: L(
      "A summer set pairing a hip-skimming longline sleeveless vest, worn over a removable fitted short-sleeve underlayer, with cropped wide-leg trousers. Contrast binding runs along the vest edges and the trouser pocket openings.",
      "Un ensemble d'été : gilet long sans manches effleurant la hanche, porté sur une sous-couche ajustée à manches courtes amovible, avec un pantalon large raccourci. Un biais contrasté souligne les bords du gilet et les ouvertures de poches."
    ),
    construction: L("Gentle V front with high coverage from the underlayer; shell-button front closure; deep pocket bags; elastic-back trouser waistband with a clean flat front.", "Devant en V doux, couverture haute grâce à la sous-couche ; boutons en nacre ; poches profondes ; ceinture de pantalon élastiquée au dos, plate devant."),
    materials: L("Pre-washed mid-weight linen-viscose with wrinkle tolerance; a cotton-linen alternative.", "Lin-viscose de poids moyen prélavé, tolérant au froissement ; alternative coton-lin."),
    fit: L("Loose, comfortable silhouettes; crop length adjustable to 7/8 for taller clients. Modesty through layering, not hidden assumptions.", "Silhouettes amples et confortables ; longueur ajustable en 7/8 pour les clientes grandes. La modestie par la superposition, sans présupposés cachés."),
    occasions: L("Travel, resort weekend, relaxed business lunch, hot-climate daywear.", "Voyage, week-end balnéaire, déjeuner d'affaires décontracté, journée par temps chaud."),
    status: "first-sample",
    image: "collection-vv07-linen-virtue",
    published: true,
  },
  {
    code: "VV08",
    slug: "rosewood-poise",
    chapter: 2,
    name: L("Rosewood Poise", "Rosewood Poise"),
    tagline: L("Warmth with a point of view.", "La chaleur, avec un point de vue."),
    silhouette: L("Wrap-illusion blouse and skirt", "Blouse effet cache-cœur et jupe"),
    palette: [S("Rosewood", "Bois de rose", "#A0616A"), S("Cinnamon", "Cannelle", "#A86B4E"), S("Dusty Berry", "Baie poudrée", "#9B6B7C")],
    signature: L(
      "A carefully engineered wrap-effect high-neck blouse with diagonal waist panels and a matching midi skirt with a fixed overlapping front panel. The ease of a wrap without the risk of accidental opening.",
      "Une blouse à col haut à effet cache-cœur, soigneusement construite avec des panneaux diagonaux à la taille, et une jupe midi assortie à panneau avant superposé et fixe. L'aisance d'un portefeuille sans le risque d'ouverture."
    ),
    construction: L("Blouse fully sewn at the wrap; slim self-tie above the hip; concealed skirt closure; bias hem panel; sleeve pleats at the cuff.", "Blouse entièrement cousue au croisement ; lien fin au-dessus de la hanche ; fermeture de jupe invisible ; panneau d'ourlet en biais ; plis de manche au poignet."),
    materials: L("Soft matte crepe or washable viscose twill, with an anti-cling lining for the skirt where necessary.", "Crêpe mat souple ou sergé de viscose lavable, avec doublure anti-statique pour la jupe si nécessaire."),
    fit: L("Full bust movement and hip ease; never relying on a true wrap closure for modesty.", "Liberté au buste et aisance aux hanches ; ne repose jamais sur une vraie fermeture portefeuille pour la modestie."),
    occasions: L("Business lunch, daytime occasion, school event, stylish community gathering.", "Déjeuner d'affaires, occasion de jour, événement scolaire, rassemblement élégant."),
    status: "concept",
    image: "collection-vv08-rosewood-poise",
    published: true,
  },
  {
    code: "VV09",
    slug: "the-pearl-discipline",
    chapter: 2,
    name: L("The Pearl Discipline", "The Pearl Discipline"),
    tagline: L("Minimalism with an unmistakable signature.", "Un minimalisme à la signature sans équivoque."),
    silhouette: L("Architectural skirt ensemble", "Ensemble jupe architectural"),
    palette: [S("Porcelain", "Porcelaine", "#F4F1EC"), S("Chalk", "Craie", "#E6E1D8"), S("Cocoa", "Cacao", "#6B4A3B")],
    signature: L(
      "A column midi skirt and a sculpted peplum top. The top has a clean square-ish neckline, broad shoulders without pads and a single asymmetric curved peplum panel. The skirt carries a discreet back walking vent and a high waist.",
      "Une jupe midi colonne et un haut à basque sculptée. Le haut : encolure presque carrée, épaules larges sans épaulettes et un seul panneau de basque courbe asymétrique. La jupe : fente de marche discrète au dos et taille haute."
    ),
    construction: L("Peplum to the hip; subtle side zip; a matching sleeve shell is offered with the top; a lightweight shaping layer without excessive boning.", "Basque à la hanche ; zip latéral discret ; un sur-haut à manches assorti est proposé ; couche de maintien légère sans baleinage excessif."),
    materials: L("Cotton-viscose stretch pique or a lightweight structured crepe; breathable stretch lining.", "Piqué stretch coton-viscose ou crêpe structuré léger ; doublure stretch respirante."),
    fit: L("The peplum curve must work across bust and hip proportions; the skirt must be comfortable seated.", "La courbe de basque doit fonctionner sur toutes les proportions buste-hanches ; la jupe doit rester confortable assise."),
    occasions: L("Design industry gathering, daytime formal event, sophisticated dinner.", "Rencontre du milieu du design, événement formel de jour, dîner raffiné."),
    status: "concept",
    image: "collection-vv09-pearl-discipline",
    published: true,
  },
  {
    code: "VV10",
    slug: "the-evening-psalm",
    chapter: 3,
    name: L("The Evening Psalm", "The Evening Psalm"),
    tagline: L("An evening look that speaks quietly and stays remembered.", "Une tenue du soir qui parle bas et reste en mémoire."),
    silhouette: L("Architectural evening column", "Colonne du soir architecturale"),
    palette: [S("Midnight Indigo", "Indigo de minuit", "#1F2A4A"), S("Garnet", "Grenat", "#7A2E3E"), S("Deep Cocoa", "Cacao profond", "#4A3028")],
    signature: L(
      "A deep indigo evening column dress with an integrated scarf panel released from the left shoulder. The panel can wrap across the forearm or fall free; the dress itself remains a complete, elegant garment.",
      "Une robe colonne du soir d'un indigo profond, avec un panneau-écharpe intégré libéré à l'épaule gauche. Le panneau s'enroule sur l'avant-bras ou tombe librement ; la robe reste un vêtement complet et élégant."
    ),
    construction: L("High curved neckline; slim long sleeves; subtle waist shaping; structured shoulder scarf anchor; back slit concealed by the lining; comfortable hem sweep.", "Encolure haute et courbe ; manches longues fines ; taille subtilement marquée ; ancrage d'écharpe structuré à l'épaule ; fente arrière dissimulée par la doublure ; ampleur d'ourlet confortable."),
    materials: L("Stretch crepe base with a matching crepe georgette scarf; matte under flash.", "Base en crêpe stretch et écharpe en crêpe georgette assortie ; mat sous le flash."),
    fit: L("Scarf security tested in movement; a practical sitting silhouette.", "Tenue de l'écharpe testée en mouvement ; silhouette pratique assise."),
    occasions: L("Gala, formal dinner, awards evening, cultured reception.", "Gala, dîner formel, soirée de remise de prix, réception culturelle."),
    status: "concept",
    image: "collection-vv10-evening-psalm",
    published: true,
  },
  {
    code: "VV11",
    slug: "the-modest-opera",
    chapter: 3,
    name: L("The Modest Opéra", "The Modest Opéra"),
    tagline: L("A sense of theatre. A discipline of elegance.", "Un sens du théâtre. Une discipline de l'élégance."),
    silhouette: L("Statement A-line occasion dress", "Robe d'occasion trapèze affirmée"),
    palette: [S("Black Cherry", "Cerise noire", "#3F1A24"), S("Graphite", "Graphite", "#4F4F52"), S("Pale Rose", "Rose pâle", "#D8B7BC")],
    signature: L("A black-cherry midi A-line dress with softly structured bishop sleeves and a removable flat folded neck bow. Controlled volume comes from deliberate panel seaming rather than oversized ruffles.", "Une robe trapèze midi cerise noire aux manches ballon doucement structurées et nœud plat amovible au col. Le volume maîtrisé vient d'un travail de panneaux, pas de volants surdimensionnés."),
    construction: L("Small stand collar; hidden front opening; four-panel A-line skirt; set-in sleeve with a cuffed, gathered wrist; removable bow fastened at the collar; side pockets.", "Petit col officier ; ouverture devant cachée ; jupe trapèze en quatre panneaux ; manche montée froncée au poignet ; nœud amovible fixé au col ; poches latérales."),
    materials: L("Crisp cotton-silk faille or a light technical taffeta with a matte finish; no noisy, stiff high-shine fabric.", "Faille coton-soie nette ou taffetas technique léger à finition mate ; pas de tissu rigide, bruyant et brillant."),
    fit: L("Sleeve volume kept manageable; the bow is optional for clients who prefer simplicity.", "Volume de manche maîtrisé ; le nœud est optionnel pour les clientes qui préfèrent la simplicité."),
    occasions: L("Evening performance, formal reception, cocktail gathering.", "Spectacle en soirée, réception formelle, cocktail."),
    status: "concept",
    image: "collection-vv11-modest-opera",
    published: false,
  },
  {
    code: "VV12",
    slug: "the-garden-covenant",
    chapter: 3,
    name: L("The Garden Covenant", "The Garden Covenant"),
    tagline: L("An original bloom, never a borrowed print.", "Une floraison originale, jamais un imprimé emprunté."),
    silhouette: L("Art-print day occasion dress", "Robe d'occasion de jour à imprimé d'art"),
    palette: [S("Deep Teal Botanical", "Botanique sarcelle profond", "#1F4F4A"), S("Sage Cream", "Crème sauge", "#D8D9C3"), S("Ink Floral", "Floral encre", "#2B2F33")],
    signature: L("An airy ankle-length shirt dress with a bespoke abstract botanical placement print, drawn in a restrained contemporary style rather than a cliché floral repeat. An inset waist panel and box pleats shape the skirt without needing a belt.", "Une robe-chemise aérienne à la cheville, à imprimé placé botanique abstrait et original, dessiné dans un style contemporain retenu plutôt qu'un motif floral cliché. Un panneau de taille incrusté et des plis creux dessinent la jupe sans ceinture."),
    construction: L("Small point collar; fully lined placket; long sleeves with a single cuff; internal side pockets; original print artwork with its own repeat and placement file.", "Petit col pointu ; patte entièrement doublée ; manches longues à poignet simple ; poches intérieures ; dessin d'imprimé original avec son fichier de raccord et de placement."),
    materials: L("Opaque cotton voile with lining, or a soft cotton poplin; print testing essential for colourfastness.", "Voile de coton opaque doublé ou popeline de coton souple ; test d'imprimé indispensable pour la tenue des couleurs."),
    fit: L("Grading preserves print placement and side pleat volume. No unlicensed pattern is ever used.", "La gradation préserve le placement de l'imprimé et le volume des plis. Aucun motif sous licence tierce n'est jamais utilisé."),
    occasions: L("Garden brunch, cultural event, afternoon wedding, elevated daywear.", "Brunch au jardin, événement culturel, mariage d'après-midi, journée habillée."),
    status: "concept",
    image: "collection-vv12-garden-covenant",
    published: false,
  },
  {
    code: "VV13",
    slug: "the-atelier-grace",
    chapter: 3,
    name: L("The Atelier Grace", "The Atelier Grace"),
    tagline: L("For the woman who thinks in original lines.", "Pour la femme qui pense en lignes originales."),
    silhouette: L("Sculptural tunic and tailored trouser", "Tunique sculpturale et pantalon tailleur"),
    palette: [S("Burnt Clay", "Argile brûlée", "#A4573B"), S("Ink Navy", "Marine encre", "#1F2740"), S("Chalk White", "Blanc craie", "#ECE8E0")],
    signature: L("A sculpted long tunic with an origami-style folded front overlay cut as one controlled panel, an asymmetric hip-length hem, and tapered ankle trousers. Interest comes from pattern engineering, not decoration.", "Une longue tunique sculptée au pan avant plié façon origami, coupé en un seul panneau maîtrisé, ourlet asymétrique à la hanche et pantalon fuselé à la cheville. L'intérêt naît de l'ingénierie du patron, pas de la décoration."),
    construction: L("High gentle boat neckline; three-quarter sleeve; concealed side zipper; the asymmetric panel lies flat when seated; small trouser ankle slit.", "Encolure bateau haute et douce ; manche trois-quarts ; zip latéral invisible ; le panneau asymétrique reste plat assise ; petite fente de cheville au pantalon."),
    materials: L("Structured cotton-silk blend or viscose crepe; trousers in a matching tailored twill.", "Mélange coton-soie structuré ou crêpe de viscose ; pantalon en sergé tailleur assorti."),
    fit: L("Highly dependent on precise drafting and pressing; the fold is sampled in calico first.", "Très dépendant d'un traçage et d'un repassage précis ; le pli est d'abord testé en toile."),
    occasions: L("Art opening, launch event, design leadership gathering.", "Vernissage, lancement, rencontre de direction créative."),
    status: "concept",
    image: "collection-vv13-atelier-grace",
    published: false,
  },
  {
    code: "VV14",
    slug: "the-quiet-aristocrat",
    chapter: 3,
    name: L("The Quiet Aristocrat", "The Quiet Aristocrat"),
    tagline: L("The luxury of being at ease.", "Le luxe d'être à l'aise."),
    silhouette: L("Refined knit day dress", "Robe de jour en maille raffinée"),
    palette: [S("Biscuit", "Biscuit", "#D2B38A"), S("Cocoa Brown", "Brun cacao", "#6A4A3A"), S("Muted Olive", "Olive feutré", "#8B8A62")],
    signature: L("A modern fine-gauge knit polo midi dress with a long clean placket and a gently flared lower skirt, paired with a removable featherweight open cardigan. Everyday elegance, not theatrical styling.", "Une robe polo midi en maille fine, longue patte de boutonnage nette et bas de jupe légèrement évasé, avec un cardigan ouvert ultra-léger amovible. L'élégance du quotidien, sans théâtralité."),
    construction: L("Refined knit collar; mother-of-pearl-style buttons; shaped rib at the waist without compression; small side slit; matching cardigan with a clean edge.", "Col en maille raffiné ; boutons façon nacre ; côtes façonnées à la taille sans compression ; petite fente latérale ; cardigan assorti aux bords nets."),
    materials: L("Cotton-modal compact knit, breathable mid-gauge; no wool requirement for Cameroon.", "Maille compacte coton-modal, jauge moyenne respirante ; pas de laine nécessaire pour le Cameroun."),
    fit: L("Stretch recovery and opacity matter; tested after washing and across bust and hip sizes.", "Récupération du stretch et opacité essentielles ; testé après lavage et sur plusieurs tailles de buste et de hanches."),
    occasions: L("Travel, relaxed professional day, lunch, smart everyday wear.", "Voyage, journée professionnelle détendue, déjeuner, quotidien soigné."),
    status: "concept",
    image: "collection-vv14-quiet-aristocrat",
    published: false,
  },
  {
    code: "VV15",
    slug: "the-orchid-standard",
    chapter: 4,
    name: L("The Orchid Standard", "The Orchid Standard"),
    tagline: L("A precise expression of feminine confidence.", "Une expression précise de la confiance féminine."),
    silhouette: L("Modern peplum skirt suit", "Tailleur-jupe à basque moderne"),
    palette: [S("Dusty Orchid", "Orchidée poudrée", "#B48BB0"), S("Slate Blue", "Bleu ardoise", "#6B7F99"), S("Deep Violet", "Violet profond", "#5C3A6E")],
    signature: L("A tailored lilac-orchid jacket with a diagonal peplum seam, one sculpted covered fastening and a coordinating asymmetric pencil-midi skirt with a clean front and discreet side vent.", "Une veste lilas-orchidée tailleur à couture de basque diagonale, une seule fermeture sculptée recouverte, et une jupe crayon midi asymétrique coordonnée, devant net et fente latérale discrète."),
    construction: L("Gentle shawl lapel; fully covered cap of sleeve; precise diagonal peplum; hidden side pocket on the skirt; back zip; movement vent.", "Col châle doux ; tête de manche entièrement couverte ; basque diagonale précise ; poche latérale cachée à la jupe ; zip au dos ; fente de mouvement."),
    materials: L("Crepe suiting with enough recovery for a fitted silhouette; partial lining.", "Crêpe tailleur avec assez de récupération pour une silhouette ajustée ; doublure partielle."),
    fit: L("Natural seated waist ease; not skin-tight; the diagonal peplum tested across proportions.", "Aisance naturelle à la taille assise ; pas moulant ; basque diagonale testée sur plusieurs proportions."),
    occasions: L("Presentation, event host, client meeting, formal luncheon.", "Présentation, animation d'événement, rendez-vous client, déjeuner formel."),
    status: "concept",
    image: "collection-vv15-orchid-standard",
    published: false,
  },
  {
    code: "VV16",
    slug: "the-covenant-coat",
    chapter: 4,
    name: L("The Covenant Coat", "The Covenant Coat"),
    tagline: L("A considered entrance, in every climate.", "Une entrée réfléchie, sous tous les climats."),
    silhouette: L("Lightweight statement trench and dress", "Trench léger affirmé et robe"),
    palette: [S("Oxblood", "Sang de bœuf", "#5B1F24"), S("Sandshell", "Coquillage", "#DCCDB8"), S("Dark Espresso", "Espresso foncé", "#35241E")],
    signature: L("A dramatic but wearable collarless, ankle-skimming, unlined sleeveless trench worn over a calf-length column dress. A removable narrow belt controls the shape; the open vertical edge gives presence without winter-weight outerwear.", "Un trench sans col ni manches, non doublé, effleurant la cheville, spectaculaire mais portable, sur une robe colonne mi-mollet. Une ceinture fine amovible maîtrise la forme ; le bord vertical ouvert donne de la présence sans manteau d'hiver."),
    construction: L("No heavy wool; clean enclosed seams; side pockets; two concealed near-waist closures; the inner dress neckline stays high enough to be appropriate without the coat.", "Pas de laine lourde ; coutures propres et fermées ; poches latérales ; deux fermetures cachées près de la taille ; l'encolure de la robe reste assez haute pour se porter sans le manteau."),
    materials: L("Washed linen-viscose twill for the trench; lightweight opaque stretch crepe for the inner dress.", "Sergé lin-viscose lavé pour le trench ; crêpe stretch opaque et léger pour la robe."),
    fit: L("Unlined layering that works in Douala heat; coat, dress or set can be ordered independently once sampled.", "Superposition non doublée qui fonctionne sous la chaleur de Douala ; manteau, robe ou ensemble commandables séparément une fois échantillonnés."),
    occasions: L("Travel arrival, business function, gallery reception, cool indoor event.", "Arrivée de voyage, événement professionnel, réception en galerie, événement intérieur climatisé."),
    status: "concept",
    image: "collection-vv16-covenant-coat",
    published: false,
  },
  {
    code: "VV17",
    slug: "the-satin-conviction",
    chapter: 4,
    name: L("The Satin Conviction", "The Satin Conviction"),
    tagline: L("Colour with composure.", "La couleur, avec sang-froid."),
    silhouette: L("Satin blouse and trouser set", "Ensemble blouse satin et pantalon"),
    palette: [S("Deep Sea Green", "Vert de mer profond", "#1F5F57"), S("Bronze", "Bronze", "#9E7B4F"), S("Cocoa Rose", "Rose cacao", "#A66F7A")],
    signature: L("A deep sea-green satin blouse with a folded high scarf collar that closes neatly behind the neck, long bias sleeves, and matching high-rise straight-wide trousers in a matte companion fabric for tonal contrast.", "Une blouse en satin vert de mer profond à col-écharpe haut plié se fermant dans la nuque, manches longues en biais, et un pantalon droit-large taille haute assorti dans un tissu mat compagnon pour un contraste tonal."),
    construction: L("Scarf collar fixed at the shoulder and fastened with a covered back-neck button; blouse worn tucked or untucked; trouser front crease and deep pockets.", "Col-écharpe fixé à l'épaule et fermé par un bouton recouvert dans la nuque ; blouse portée rentrée ou non ; pli devant et poches profondes au pantalon."),
    materials: L("Cupro or viscose satin for the blouse; matte viscose twill or crepe for the trousers. Tested for sweat marks and colour transfer.", "Cupro ou satin de viscose pour la blouse ; sergé de viscose mat ou crêpe pour le pantalon. Testé contre les marques de transpiration et le transfert de couleur."),
    fit: L("Cling and translucent flash minimised; side ease at the blouse chest; no plastic-looking satin.", "Cling et transparence au flash minimisés ; aisance latérale à la poitrine ; pas de satin à l'aspect plastique."),
    occasions: L("Evening dinner, creative business event, holiday gathering.", "Dîner, événement professionnel créatif, réunion de fêtes."),
    status: "concept",
    image: "collection-vv17-satin-conviction",
    published: false,
  },
  {
    code: "VV18",
    slug: "the-heritage-line",
    chapter: 4,
    name: L("The Heritage Line", "The Heritage Line"),
    tagline: L("Timeless codes, newly interpreted.", "Des codes intemporels, réinterprétés."),
    silhouette: L("Contemporary formal skirt suit", "Tailleur-jupe formel contemporain"),
    palette: [S("Warm Cream & Navy", "Crème chaude & marine", "#EFE4D0"), S("Ink & Ivory", "Encre & ivoire", "#1D2432"), S("Soft Charcoal & Pearl", "Anthracite doux & perle", "#6E6B6B")],
    signature: L("A sharply tailored cream-and-navy midi skirt suit with curved contrast piping framing a cropped jacket front and the sleeve edges. The skirt is softly A-line rather than restrictive, and the jacket sits at the natural waist.", "Un tailleur-jupe midi crème et marine à la coupe nette, passepoil contrasté courbe encadrant le devant d'une veste courte et les bords de manches. La jupe est légèrement trapèze plutôt que contraignante, la veste s'arrête à la taille naturelle."),
    construction: L("Crisp round neckline; narrow navy piping; three-quarter sleeves; three fabric-covered buttons; bias-faced seams; skirt concealed zip and functional pocket.", "Encolure ronde nette ; passepoil marine fin ; manches trois-quarts ; trois boutons recouverts ; coutures parementées en biais ; zip invisible et poche fonctionnelle à la jupe."),
    materials: L("Light cotton-viscose jacquard or linen-viscose suiting; no hot wool bouclé.", "Jacquard coton-viscose léger ou tissu tailleur lin-viscose ; pas de bouclé de laine étouffant."),
    fit: L("Cropped jacket length kept generous for comfort; piping placement exact across graded sizes.", "Longueur de veste courte mais généreuse pour le confort ; placement du passepoil exact sur toutes les tailles."),
    occasions: L("High-level daytime meeting, board function, wedding guest, formal social event.", "Réunion de haut niveau, fonction de conseil, invitée de mariage, événement social formel."),
    status: "concept",
    image: "collection-vv18-heritage-line",
    published: false,
  },
  {
    code: "VV19",
    slug: "the-virtue-noir",
    chapter: 4,
    name: L("The Virtue Noir", "The Virtue Noir"),
    tagline: L("A singular silhouette in black.", "Une silhouette singulière, en noir."),
    silhouette: L("Evening tailored jumpsuit", "Combinaison du soir tailleur"),
    palette: [S("Editorial Black", "Noir éditorial", "#141414"), S("Ink Plum", "Prune encre", "#2E1C2B"), S("Graphite", "Graphite", "#4F4F52")],
    signature: L("A black wide-leg tailored jumpsuit with a clean high collar and a crossover bodice panel secured internally; diagonal pleats at the waist create the architecture. The ease of a one-piece with formal polish.", "Une combinaison noire à jambes larges, col haut net et panneau de corsage croisé fixé à l'intérieur ; des plis diagonaux à la taille créent l'architecture. L'aisance d'une pièce unique, avec le poli d'une tenue formelle."),
    construction: L("Invisible back zip plus practical concealed side-zip access where feasible; full sleeves; wide leg with the hem tailored to the shoe; no cut-outs; optional subtle contrast textured belt.", "Zip invisible au dos et accès latéral caché si possible ; manches longues ; jambe large ourlée à la chaussure ; aucune découpe ; ceinture texturée contrastée en option."),
    materials: L("Black matte stretch crepe with breathable lining at the bodice only; no sheer or clingy finish.", "Crêpe stretch noir mat avec doublure respirante au corsage seulement ; aucune finition transparente ou collante."),
    fit: L("Bathroom practicality, torso length, rise and seated comfort tested; multiple torso-length blocks needed.", "Praticité, longueur de buste, hauteur d'entrejambe et confort assis testés ; plusieurs bases de longueur de buste nécessaires."),
    occasions: L("Gallery evening, award dinner, contemporary formal event.", "Soirée en galerie, dîner de remise de prix, événement formel contemporain."),
    status: "first-sample",
    image: "collection-vv19-virtue-noir",
    published: false,
  },
  {
    code: "VV20",
    slug: "the-promise-in-plum",
    chapter: 4,
    name: L("The Promise In Plum", "The Promise In Plum"),
    tagline: L("The signature piece that closes the collection.", "La pièce signature qui clôt la collection."),
    silhouette: L("Flagship convertible occasion dress", "Robe d'occasion convertible, pièce phare"),
    palette: [S("Virtuous Plum", "Prune Virtuous", "#5B2A4B"), S("Deep Mulberry", "Mûre profond", "#672F40"), S("Wine Berry", "Baie de vin", "#8E3A58")],
    signature: L("A signature rich-plum midi sheath dress with a detachable sculptural overskirt anchored at the waist and an optional matching short shoulder cape. Three deliberate ways to wear it: dress alone, dress with overskirt, and the full statement combination.", "Une robe fourreau midi d'un prune riche, sur-jupe sculpturale amovible ancrée à la taille et courte cape d'épaules assortie en option. Trois façons délibérées de la porter : robe seule, robe et sur-jupe, et la combinaison complète."),
    construction: L("Modest high curve neckline; tapered full sleeves; back zip and walking vent; hidden waist anchor; the overskirt clears the floor; the cape fits over the sleeves without strain.", "Encolure haute et courbe ; manches longues fuselées ; zip au dos et fente de marche ; ancrage de taille caché ; la sur-jupe ne touche pas le sol ; la cape passe sur les manches sans tension."),
    materials: L("Premium dense matte crepe for the dress; a lighter structured crepe for the overskirt, from the same dye lot.", "Crêpe mat dense premium pour la robe ; crêpe structuré plus léger pour la sur-jupe, du même bain de teinture."),
    fit: L("First sample in calico before premium cloth; closures and components must withstand real movement.", "Premier échantillon en toile avant le tissu premium ; fermetures et composants doivent résister au mouvement réel."),
    occasions: L("Signature brand campaign, major celebration, important public appearance.", "Campagne signature de la marque, grande célébration, apparition publique importante."),
    status: "concept",
    image: "collection-vv20-promise-in-plum",
    published: false,
  },
];

export const publishedLooks = looks.filter((l) => l.published);
export const getLook = (slug: string) => looks.find((l) => l.slug === slug && l.published) ?? null;
export const looksInChapter = (n: 1 | 2 | 3 | 4) => publishedLooks.filter((l) => l.chapter === n);
