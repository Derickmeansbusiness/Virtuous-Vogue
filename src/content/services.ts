import type { Service } from "./types";

/**
 * Service architecture. Prices are intentionally null: the stylist sets
 * them in the admin cockpit (services table) and nothing here is invented.
 */
export const services: Service[] = [
  {
    slug: "style-clarity",
    number: "01",
    name: { en: "Style Clarity Consultation", fr: "Consultation Clarté de Style" },
    short: {
      en: "A grounded conversation about who you are, what your days ask of you, and how you want to be met.",
      fr: "Une conversation ancrée sur qui vous êtes, ce que vos journées exigent et la manière dont vous voulez être reçue.",
    },
    intro: {
      en: "Most women don't need a new wardrobe. They need a clear sentence about what their style is for. Style Clarity is where that sentence is written together.",
      fr: "La plupart des femmes n'ont pas besoin d'une nouvelle garde-robe. Elles ont besoin d'une phrase claire sur ce à quoi sert leur style. Clarté de Style, c'est là que cette phrase s'écrit ensemble.",
    },
    whoFor: [
      { en: "You feel your wardrobe no longer represents you.", fr: "Vous sentez que votre garde-robe ne vous représente plus." },
      { en: "You are entering a new chapter: a promotion, motherhood, a move, a return to yourself.", fr: "Vous entrez dans un nouveau chapitre : une promotion, la maternité, un déménagement, un retour à vous-même." },
      { en: "You have taste, but dressing each morning still feels like guesswork.", fr: "Vous avez du goût, mais vous habiller chaque matin reste une devinette." },
    ],
    explore: [
      { en: "Your Style Compass results, if you have them, read with a stylist's eye.", fr: "Vos résultats Style Compass, si vous les avez, lus avec l'œil d'une styliste." },
      { en: "The rooms you walk into and how you want to be perceived in each.", fr: "Les pièces où vous entrez et la manière dont vous voulez y être perçue." },
      { en: "Three words for your appearance, three for your personality, and the distance between them.", fr: "Trois mots pour votre apparence, trois pour votre personnalité, et la distance entre les deux." },
      { en: "Silhouettes, proportions and coverage preferences, discussed neutrally.", fr: "Silhouettes, proportions et préférences de couverture, discutées sans jugement." },
    ],
    receive: [
      { en: "A written Style Direction with your style words and outfit formulas.", fr: "Une Direction de Style écrite avec vos mots de style et vos formules de tenues." },
      { en: "A short list of wardrobe priorities: what to keep, what to lean on, what is missing.", fr: "Une courte liste de priorités de garde-robe : quoi garder, sur quoi s'appuyer, ce qui manque." },
      { en: "Notes saved to your Style Passport.", fr: "Des notes enregistrées dans votre Style Passport." },
    ],
    next: {
      en: "Many clients continue with a Wardrobe Edit or a Colour & Harmony Consultation. There is no obligation to.",
      fr: "Beaucoup de clientes poursuivent avec un Tri de Garde-robe ou une Consultation Couleur & Harmonie. Sans aucune obligation.",
    },
    formats: ["virtual", "in_person"],
    durationMinutes: 75,
    priceXaf: null,
    depositPercent: 50,
    capacity: 1,
    image: "service-style-clarity",
    accent: "mulberry",
  },
  {
    slug: "colour-harmony",
    number: "02",
    name: { en: "Colour & Harmony Consultation", fr: "Consultation Couleur & Harmonie" },
    short: {
      en: "Find the colours that quietly do the work for you, and the ones to use with care.",
      fr: "Trouvez les couleurs qui travaillent discrètement pour vous, et celles à utiliser avec soin.",
    },
    intro: {
      en: "Colour is the fastest way to look like yourself. In natural daylight, with real fabric against your skin, we map undertone, contrast and the palette that makes everything you own combine more easily.",
      fr: "La couleur est le moyen le plus rapide de vous ressembler. À la lumière du jour, avec de vrais tissus contre votre peau, nous cartographions sous-ton, contraste et la palette qui rend tout ce que vous possédez plus facile à combiner.",
    },
    whoFor: [
      { en: "You've tried the Colour Lens preview and want a professional reading.", fr: "Vous avez essayé l'aperçu Colour Lens et voulez une lecture professionnelle." },
      { en: "You buy colours you love and then rarely wear them.", fr: "Vous achetez des couleurs que vous aimez puis les portez rarement." },
      { en: "You want a palette that works across work, weekend and occasion.", fr: "Vous voulez une palette qui fonctionne au travail, le week-end et pour les occasions." },
    ],
    explore: [
      { en: "Undertone tendency and contrast, assessed with draped fabric, not a camera.", fr: "Tendance de sous-ton et contraste, évaluées avec des tissus drapés, pas une caméra." },
      { en: "Neutrals that anchor, accents that lift, and metals.", fr: "Les neutres qui ancrent, les accents qui élèvent, et les métaux." },
      { en: "How to use colour you already own more intentionally.", fr: "Comment utiliser plus intentionnellement les couleurs que vous possédez déjà." },
    ],
    receive: [
      { en: "A personal palette saved to your Style Passport.", fr: "Une palette personnelle enregistrée dans votre Style Passport." },
      { en: "Combination examples drawn from your wardrobe.", fr: "Des exemples de combinaisons tirés de votre garde-robe." },
      { en: "A list of colours to test carefully before buying.", fr: "Une liste de couleurs à tester avec soin avant d'acheter." },
    ],
    next: {
      en: "Your palette becomes the reference for every Closet Remix suggestion and every future edit.",
      fr: "Votre palette devient la référence pour chaque suggestion Closet Remix et chaque futur tri.",
    },
    formats: ["in_person", "virtual"],
    durationMinutes: 90,
    priceXaf: null,
    depositPercent: 50,
    capacity: 1,
    image: "service-colour-harmony",
    accent: "satin",
  },
  {
    slug: "wardrobe-edit",
    number: "03",
    name: { en: "Wardrobe Edit", fr: "Tri de Garde-robe" },
    short: {
      en: "We go through what you own, piece by piece, and leave you with a wardrobe that works.",
      fr: "Nous passons en revue ce que vous possédez, pièce par pièce, et vous laissons une garde-robe qui fonctionne.",
    },
    intro: {
      en: "An edit is not a purge. It is a careful reading of what you reach for, what you avoid, and why. Most wardrobes already hold more outfits than their owners can see.",
      fr: "Un tri n'est pas une purge. C'est une lecture attentive de ce vers quoi vous tendez la main, ce que vous évitez, et pourquoi. La plupart des garde-robes contiennent déjà plus de tenues que leurs propriétaires ne le voient.",
    },
    whoFor: [
      { en: "Your wardrobe is full and you still have nothing to wear.", fr: "Votre garde-robe est pleine et vous n'avez toujours rien à porter." },
      { en: "You want to shop less and better.", fr: "Vous voulez acheter moins et mieux." },
      { en: "You are preparing for a season, a trip or a new role.", fr: "Vous vous préparez pour une saison, un voyage ou un nouveau rôle." },
    ],
    explore: [
      { en: "Keep, alter, rest, release: each decision explained.", fr: "Garder, retoucher, mettre en pause, laisser partir : chaque décision expliquée." },
      { en: "Outfit combinations built from the rail in front of us.", fr: "Des combinaisons construites à partir du portant devant nous." },
      { en: "True gaps versus habits of buying.", fr: "Les vrais manques contre les habitudes d'achat." },
    ],
    receive: [
      { en: "A photographed digital wardrobe uploaded to Closet Remix.", fr: "Une garde-robe numérique photographiée et importée dans Closet Remix." },
      { en: "A Lookbook of outfits from what you already own.", fr: "Un Lookbook de tenues à partir de ce que vous possédez déjà." },
      { en: "A short, prioritised shopping list, only if a gap is real.", fr: "Une courte liste d'achats priorisée, uniquement si un manque est réel." },
    ],
    next: {
      en: "Personal Shopping is available afterwards for the few pieces that genuinely complete the picture.",
      fr: "Le Personal Shopping est disponible ensuite pour les quelques pièces qui complètent vraiment l'ensemble.",
    },
    formats: ["in_person", "virtual"],
    durationMinutes: 180,
    priceXaf: null,
    depositPercent: 50,
    capacity: 1,
    image: "service-wardrobe-edit",
    accent: "ink",
  },
  {
    slug: "occasion-styling",
    number: "04",
    name: { en: "Occasion Styling", fr: "Stylisme d'Occasion" },
    short: {
      en: "A wedding, a keynote, a gala, a ceremony. Dressed with intention, and still unmistakably you.",
      fr: "Un mariage, une conférence, un gala, une cérémonie. Habillée avec intention, et toujours résolument vous.",
    },
    intro: {
      en: "Occasions carry expectations. We work out the dress code, the venue, the weather and the photographs, then build a look that honours the moment without costuming you.",
      fr: "Les occasions portent des attentes. Nous décodons le dress code, le lieu, la météo et les photos, puis construisons une silhouette qui honore le moment sans vous déguiser.",
    },
    whoFor: [
      { en: "You have a specific date and want to feel settled well before it.", fr: "Vous avez une date précise et voulez vous sentir sereine bien avant." },
      { en: "You want modest, contemporary options for a formal setting.", fr: "Vous voulez des options modestes et contemporaines pour un cadre formel." },
      { en: "You want to use pieces you own where possible.", fr: "Vous voulez utiliser les pièces que vous possédez quand c'est possible." },
    ],
    explore: [
      { en: "Dress code, venue, climate and time of day.", fr: "Dress code, lieu, climat et moment de la journée." },
      { en: "Silhouette, coverage and movement for the day itself.", fr: "Silhouette, couverture et mouvement pour le jour même." },
      { en: "Accessories, shoes and the small details that photograph well.", fr: "Accessoires, chaussures et les petits détails qui passent bien en photo." },
    ],
    receive: [
      { en: "One complete look with alternatives, saved to your Lookbook.", fr: "Une tenue complète avec des alternatives, enregistrée dans votre Lookbook." },
      { en: "A sourcing plan: what you own, what to borrow, what to buy.", fr: "Un plan d'approvisionnement : ce que vous avez, ce que vous empruntez, ce que vous achetez." },
    ],
    next: {
      en: "Fitting support by message in the week before, if you want it.",
      fr: "Un accompagnement par message la semaine précédente, si vous le souhaitez.",
    },
    formats: ["virtual", "in_person"],
    durationMinutes: 90,
    priceXaf: null,
    depositPercent: 50,
    capacity: 1,
    image: "service-occasion-styling",
    accent: "mulberry",
  },
  {
    slug: "personal-shopping",
    number: "05",
    name: { en: "Personal Shopping", fr: "Personal Shopping" },
    short: {
      en: "Buy the few right things, with someone who already knows your wardrobe.",
      fr: "Achetez les quelques bonnes pièces, avec quelqu'un qui connaît déjà votre garde-robe.",
    },
    intro: {
      en: "Shopping with a stylist is calmer than shopping alone. We arrive with a list, a palette and a budget philosophy, and we leave with pieces that earn their place.",
      fr: "Faire du shopping avec une styliste est plus serein que seule. Nous arrivons avec une liste, une palette et une philosophie de budget, et repartons avec des pièces qui méritent leur place.",
    },
    whoFor: [
      { en: "You've done a Wardrobe Edit and have a clear list of gaps.", fr: "Vous avez fait un Tri de Garde-robe et avez une liste claire de manques." },
      { en: "You dislike shopping or don't have the time.", fr: "Vous n'aimez pas faire les boutiques ou n'avez pas le temps." },
      { en: "You want help navigating Douala's boutiques, tailors and markets.", fr: "Vous voulez de l'aide pour naviguer les boutiques, tailleurs et marchés de Douala." },
    ],
    explore: [
      { en: "Fit, fabric and construction in person.", fr: "Coupe, tissu et construction en personne." },
      { en: "Tailoring and alterations where they make a piece yours.", fr: "Retouches et sur-mesure là où elles rendent une pièce vôtre." },
      { en: "Cost per wear, not price tag.", fr: "Le coût par port, pas l'étiquette." },
    ],
    receive: [
      { en: "A curated shortlist before the day, so nothing is rushed.", fr: "Une sélection restreinte avant le jour J, pour que rien ne soit précipité." },
      { en: "Accompanied shopping, in Douala or by video.", fr: "Shopping accompagné, à Douala ou par visio." },
      { en: "New pieces added to your digital wardrobe.", fr: "Nouvelles pièces ajoutées à votre garde-robe numérique." },
    ],
    next: {
      en: "Closet Remix updates automatically with everything you bring home.",
      fr: "Closet Remix se met à jour automatiquement avec tout ce que vous rapportez.",
    },
    formats: ["in_person", "virtual"],
    durationMinutes: 180,
    priceXaf: null,
    depositPercent: 50,
    capacity: 1,
    image: "service-personal-shopping",
    accent: "satin",
  },
  {
    slug: "signature-private-styling",
    number: "06",
    name: { en: "Signature Private Styling", fr: "Stylisme Privé Signature" },
    short: {
      en: "An ongoing relationship for women whose calendars ask a lot of their wardrobes.",
      fr: "Une relation continue pour les femmes dont les agendas exigent beaucoup de leur garde-robe.",
    },
    intro: {
      en: "For executives, founders and public-facing women who would rather not think about clothes at all, and look as though they have thought about them carefully. Seasonal edits, event looks, travel capsules and a stylist a message away.",
      fr: "Pour les dirigeantes, fondatrices et femmes publiques qui préféreraient ne pas penser aux vêtements, tout en ayant l'air d'y avoir réfléchi avec soin. Tris saisonniers, tenues d'événement, capsules de voyage et une styliste à portée de message.",
    },
    whoFor: [
      { en: "You travel, speak, host or lead, and dressing is a recurring decision.", fr: "Vous voyagez, parlez, recevez ou dirigez, et vous habiller est une décision récurrente." },
      { en: "You want privacy, discretion and continuity.", fr: "Vous voulez intimité, discrétion et continuité." },
    ],
    explore: [
      { en: "A full Style Clarity, Colour and Wardrobe Edit to begin.", fr: "Une Clarté de Style, une Couleur et un Tri complets pour commencer." },
      { en: "Seasonal planning around your calendar.", fr: "Une planification saisonnière autour de votre agenda." },
      { en: "Event-by-event looks with sourcing handled.", fr: "Des tenues événement par événement, approvisionnement compris." },
    ],
    receive: [
      { en: "A private Lookbook that grows with you.", fr: "Un Lookbook privé qui grandit avec vous." },
      { en: "Priority scheduling and message support.", fr: "Prise de rendez-vous prioritaire et accompagnement par message." },
    ],
    next: {
      en: "Begin with a conversation. We take on a small number of signature clients at a time.",
      fr: "Commencez par une conversation. Nous accompagnons un petit nombre de clientes signature à la fois.",
    },
    formats: ["in_person", "virtual"],
    durationMinutes: 120,
    priceXaf: null,
    depositPercent: 30,
    capacity: 1,
    image: "service-signature-private",
    accent: "ink",
  },
];

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}
