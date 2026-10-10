import type { Author, Category, Faq } from "./types";

/** Kimbi Rosa founded Virtuous Vogue and edits the magazine; every story carries her byline. */
export const authors: Author[] = [
  {
    slug: "kimbi-rosa",
    name: "Kimbi Rosa",
    role: { en: "Founder & Editor-in-Chief", fr: "Fondatrice & Rédactrice en chef" },
    bio: {
      en: "Kimbi Rosa is the founder of Virtuous Vogue and the Editor-in-Chief of its magazine. She writes from the studio in Douala on personal style, wardrobe intelligence and intentional living, with the same conviction that runs through every consultation: identity informs style, never the other way round.",
      fr: "Kimbi Rosa est la fondatrice de Virtuous Vogue et la rédactrice en chef de son magazine. Elle écrit depuis le studio de Douala sur le style personnel, l'intelligence de garde-robe et la vie intentionnelle, avec la conviction qui traverse chaque consultation : l'identité informe le style, jamais l'inverse.",
    },
    image: "founder-kimbi-rosa",
    isDemo: false,
  },
];

export const categories: Category[] = [
  { slug: "style", name: { en: "Style", fr: "Style" }, description: { en: "Personal style, found from the inside out.", fr: "Le style personnel, trouvé de l'intérieur." } },
  { slug: "wardrobe", name: { en: "Wardrobe", fr: "Garde-robe" }, description: { en: "Wardrobe intelligence: edit, combine, plan.", fr: "Intelligence de garde-robe : trier, combiner, planifier." } },
  { slug: "colour", name: { en: "Colour", fr: "Couleur" }, description: { en: "Colour as a language you already speak.", fr: "La couleur comme une langue que vous parlez déjà." } },
  { slug: "modest-elegance", name: { en: "Modest Elegance", fr: "Élégance Modeste" }, description: { en: "Coverage as a style choice, never a compromise.", fr: "La couverture comme un choix de style, jamais un compromis." } },
  { slug: "work-occasion", name: { en: "Work & Occasion", fr: "Travail & Occasion" }, description: { en: "Dressing for the rooms that matter.", fr: "S'habiller pour les pièces qui comptent." } },
  { slug: "culture", name: { en: "Culture", fr: "Culture" }, description: { en: "Fashion, cities and the way we live now.", fr: "La mode, les villes et notre façon de vivre aujourd'hui." } },
  { slug: "confidence", name: { en: "Confidence & Identity", fr: "Confiance & Identité" }, description: { en: "Who you are before what you wear.", fr: "Qui vous êtes avant ce que vous portez." } },
  { slug: "lifestyle", name: { en: "Lifestyle", fr: "Art de vivre" }, description: { en: "Intentional living, beyond the wardrobe.", fr: "Une vie intentionnelle, au-delà de la garde-robe." } },
];

export const faqs: Faq[] = [
  {
    group: "general",
    q: { en: "Do I need to be in Douala?", fr: "Dois-je être à Douala ?" },
    a: {
      en: "No. Every consultation except accompanied shopping works virtually, with the same preparation and the same deliverables. In-person sessions take place in Douala.",
      fr: "Non. Toutes les consultations, sauf le shopping accompagné, fonctionnent en ligne avec la même préparation et les mêmes livrables. Les séances en personne ont lieu à Douala.",
    },
  },
  {
    group: "general",
    q: { en: "Is Virtuous Vogue only for modest dressers?", fr: "Virtuous Vogue est-il réservé aux femmes qui s'habillent modestement ?" },
    a: {
      en: "No. Modesty is one legitimate preference among many that we respect. We style women across professions, ages and tastes, and we never tell you how much to cover.",
      fr: "Non. La modestie est une préférence légitime parmi d'autres que nous respectons. Nous accompagnons des femmes de toutes professions, de tous âges et de tous goûts, et nous ne vous disons jamais combien couvrir.",
    },
  },
  {
    group: "booking",
    q: { en: "How does payment work?", fr: "Comment fonctionne le paiement ?" },
    a: {
      en: "A deposit confirms your booking. You can pay with MTN Mobile Money, Orange Money or, for international clients, by card where enabled. Pricing is shared before you confirm.",
      fr: "Un acompte confirme votre réservation. Vous pouvez payer par MTN Mobile Money, Orange Money ou, pour les clientes internationales, par carte lorsque c'est activé. Les tarifs sont communiqués avant la confirmation.",
    },
  },
  {
    group: "booking",
    q: { en: "Can I reschedule?", fr: "Puis-je reporter ?" },
    a: {
      en: "Yes, from your confirmation email or your Style Passport, up to 24 hours before the session.",
      fr: "Oui, depuis votre e-mail de confirmation ou votre Style Passport, jusqu'à 24 heures avant la séance.",
    },
  },
  {
    group: "studio",
    q: { en: "Is the Colour Lens a professional colour analysis?", fr: "Le Colour Lens est-il une analyse de couleurs professionnelle ?" },
    a: {
      en: "No. It is a digital colour preview that reads undertone tendency and contrast from a photo under good conditions. It is a starting point; a Colour & Harmony Consultation with real fabric is the professional reading.",
      fr: "Non. C'est un aperçu numérique qui lit la tendance de sous-ton et le contraste à partir d'une photo dans de bonnes conditions. C'est un point de départ ; la Consultation Couleur & Harmonie avec de vrais tissus est la lecture professionnelle.",
    },
  },
  {
    group: "privacy",
    q: { en: "What happens to my photos?", fr: "Que deviennent mes photos ?" },
    a: {
      en: "They are stored privately for your account only, never used to train models, and you can delete any image or your whole account at any time from Privacy settings.",
      fr: "Elles sont stockées en privé pour votre compte uniquement, jamais utilisées pour entraîner des modèles, et vous pouvez supprimer n'importe quelle image ou votre compte entier à tout moment depuis les paramètres de confidentialité.",
    },
  },
];
