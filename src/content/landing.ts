import type { Localized } from "./types";

/**
 * SEO landing pages: one considered page per real search intent. Each
 * reuses the same design system and points to the most relevant service.
 */
export interface LandingPage {
  slug: string;
  title: Localized;
  h1: Localized;
  intro: Localized;
  body: Localized[];
  service: string;
  image: string;
  faq: { q: Localized; a: Localized }[];
}

const L = (en: string, fr: string): Localized => ({ en, fr });

export const landingPages: LandingPage[] = [
  {
    slug: "personal-stylist-douala",
    title: L("Personal Stylist in Douala", "Styliste personnelle à Douala"),
    h1: L("A personal stylist in Douala, for the life you actually live.", "Une styliste personnelle à Douala, pour la vie que vous vivez vraiment."),
    intro: L("In-person consultations across Douala: style clarity, colour, wardrobe edits and accompanied shopping, with a philosophy that starts with you rather than the trend.", "Des consultations en personne à Douala : clarté de style, couleur, tri de garde-robe et shopping accompagné, avec une philosophie qui commence par vous plutôt que par la tendance."),
    body: [
      L("Douala asks a lot of a wardrobe: heat, humidity, long days that move from the office to a dinner, and a city that notices how you present yourself. A good stylist here does more than suggest outfits. She reads your week and builds a wardrobe that keeps its composure in it.", "Douala demande beaucoup à une garde-robe : chaleur, humidité, de longues journées qui passent du bureau à un dîner, et une ville qui remarque la façon dont vous vous présentez. Une bonne styliste ici fait plus que suggérer des tenues. Elle lit votre semaine et construit une garde-robe qui garde sa tenue."),
      L("Sessions take place in your home or at the studio, and most begin with a Style Clarity Consultation. From there, a Wardrobe Edit or accompanied Personal Shopping in Douala's boutiques, tailors and markets, only when a true gap exists.", "Les séances ont lieu chez vous ou au studio, et la plupart commencent par une Consultation Clarté de Style. Ensuite, un Tri de Garde-robe ou un Personal Shopping accompagné dans les boutiques, chez les tailleurs et sur les marchés de Douala, uniquement lorsqu'un vrai manque existe."),
    ],
    service: "style-clarity",
    image: "philosophy-city-walk",
    faq: [
      { q: L("Where do in-person sessions happen?", "Où ont lieu les séances en personne ?"), a: L("At your home for wardrobe work, at the studio for consultations, and in Douala's boutiques for shopping.", "Chez vous pour la garde-robe, au studio pour les consultations, et dans les boutiques de Douala pour le shopping.") },
      { q: L("Can I pay with Mobile Money?", "Puis-je payer par Mobile Money ?"), a: L("Yes. MTN Mobile Money and Orange Money are accepted for deposits and balances.", "Oui. MTN Mobile Money et Orange Money sont acceptés pour les acomptes et les soldes.") },
    ],
  },
  {
    slug: "personal-styling-cameroon",
    title: L("Personal Styling in Cameroon", "Stylisme personnel au Cameroun"),
    h1: L("Personal styling for women across Cameroon.", "Du stylisme personnel pour les femmes de tout le Cameroun."),
    intro: L("Virtual consultations from Yaoundé to Bafoussam to Buea, with the same preparation and deliverables as an in-person session.", "Des consultations en ligne de Yaoundé à Bafoussam en passant par Buea, avec la même préparation et les mêmes livrables qu'une séance en personne."),
    body: [L("Distance is not a barrier to being styled well. A virtual consultation uses your Style Compass, your Closet Remix uploads and a video call to do the same work: understand you first, then make dressing easier.", "La distance n'empêche pas d'être bien conseillée. Une consultation en ligne utilise votre Style Compass, vos pièces Closet Remix et un appel vidéo pour faire le même travail : vous comprendre d'abord, puis rendre l'habillement plus facile.")],
    service: "style-clarity",
    image: "hero-01-woman-before-wardrobe",
    faq: [{ q: L("What do I need for a virtual session?", "De quoi ai-je besoin pour une séance en ligne ?"), a: L("A phone or laptop with a camera, daylight, and your wardrobe within reach.", "Un téléphone ou un ordinateur avec caméra, la lumière du jour et votre garde-robe à portée de main.") }],
  },
  {
    slug: "virtual-personal-stylist",
    title: L("Virtual Personal Stylist", "Styliste personnelle en ligne"),
    h1: L("A virtual personal stylist, wherever you are.", "Une styliste personnelle en ligne, où que vous soyez."),
    intro: L("For women in the diaspora and international clients: timezone-aware booking, card payment where enabled, and a Style Passport that travels with you.", "Pour les femmes de la diaspora et les clientes internationales : réservation selon votre fuseau horaire, paiement par carte lorsque activé, et un Style Passport qui voyage avec vous."),
    body: [L("Every consultation except accompanied shopping works beautifully online. Your Style Passport keeps the notes, palette and lookbooks, so the relationship continues between sessions.", "Toutes les consultations, sauf le shopping accompagné, fonctionnent parfaitement en ligne. Votre Style Passport conserve les notes, la palette et les lookbooks, pour que la relation se poursuive entre les séances.")],
    service: "style-clarity",
    image: "hero-04-column-dress",
    faq: [{ q: L("Which time zones do you serve?", "Quels fuseaux horaires couvrez-vous ?"), a: L("Any. The calendar shows times in your own zone.", "Tous. Le calendrier affiche les heures dans votre propre fuseau.") }],
  },
  {
    slug: "wardrobe-consultation",
    title: L("Wardrobe Consultation", "Consultation garde-robe"),
    h1: L("A wardrobe consultation that starts with what you own.", "Une consultation garde-robe qui commence par ce que vous possédez."),
    intro: L("Edit, combine and plan. Most wardrobes already hold more outfits than their owners can see.", "Trier, combiner, planifier. La plupart des garde-robes contiennent déjà plus de tenues que leurs propriétaires ne le voient."),
    body: [L("A Wardrobe Edit reads every piece for fit, fabric, colour and use, builds outfits from the rail in front of us, and leaves you with a digital wardrobe inside Closet Remix.", "Un Tri de Garde-robe lit chaque pièce pour la coupe, le tissu, la couleur et l'usage, construit des tenues depuis le portant devant nous, et vous laisse une garde-robe numérique dans Closet Remix.")],
    service: "wardrobe-edit",
    image: "service-wardrobe-edit",
    faq: [{ q: L("Do I have to throw things away?", "Dois-je jeter des choses ?"), a: L("No. We keep, alter, rest or release, and the decision is always yours.", "Non. Nous gardons, retouchons, mettons en pause ou laissons partir, et la décision vous appartient toujours.") }],
  },
  {
    slug: "colour-consultation-cameroon",
    title: L("Colour Consultation in Cameroon", "Consultation couleur au Cameroun"),
    h1: L("Colour analysis built for deep, medium and light skin alike.", "Une analyse de couleurs conçue pour les peaux foncées, médium et claires."),
    intro: L("Real fabric, natural daylight and a palette you'll actually use. Preview online with the Colour Lens, then refine with a stylist.", "De vrais tissus, la lumière du jour et une palette que vous utiliserez vraiment. Aperçu en ligne avec le Colour Lens, puis affinage avec une styliste."),
    body: [L("Most colour advice was written for a narrow range of skin. Ours reads undertone and contrast on their own terms and gives you neutrals, accents and metals that make your wardrobe combine more easily.", "La plupart des conseils couleur ont été écrits pour une gamme étroite de peaux. Les nôtres lisent sous-ton et contraste pour ce qu'ils sont et vous donnent neutres, accents et métaux qui rendent votre garde-robe plus facile à combiner.")],
    service: "colour-harmony",
    image: "service-colour-harmony",
    faq: [{ q: L("Is the online Colour Lens enough?", "Le Colour Lens en ligne suffit-il ?"), a: L("It is a preview. The consultation with draped fabric is the professional reading.", "C'est un aperçu. La consultation avec tissus drapés est la lecture professionnelle.") }],
  },
  {
    slug: "modest-fashion-styling",
    title: L("Modest Fashion Styling", "Stylisme mode modeste"),
    h1: L("Modest styling that is contemporary, elegant and entirely yours.", "Un stylisme modeste, contemporain, élégant et entièrement vôtre."),
    intro: L("Coverage as a design choice. Long lines, high necks, beautiful fabric, no apology.", "La couverture comme choix de design. Lignes longues, cols hauts, beaux tissus, sans excuse."),
    body: [L("We style modest dressers across faiths and preferences without ever telling you how much to cover. The Style Compass asks about coverage neutrally and every Closet Remix suggestion respects it.", "Nous accompagnons les femmes qui s'habillent modestement, toutes croyances et préférences confondues, sans jamais vous dire combien couvrir. Le Style Compass pose la question de la couverture sans jugement et chaque suggestion Closet Remix la respecte.")],
    service: "style-clarity",
    image: "mag-modest-elegance",
    faq: [{ q: L("Is Virtuous Vogue only for modest dressers?", "Virtuous Vogue est-il réservé aux femmes qui s'habillent modestement ?"), a: L("No. Modesty is one preference among many that we respect.", "Non. La modestie est une préférence parmi d'autres que nous respectons.") }],
  },
  {
    slug: "executive-womens-styling",
    title: L("Executive Women's Styling", "Stylisme pour femmes dirigeantes"),
    h1: L("Styling for executives, founders and women who lead.", "Du stylisme pour les dirigeantes, fondatrices et femmes qui mènent."),
    intro: L("For calendars that ask a lot of a wardrobe: boardrooms, keynotes, travel, and the ordinary Tuesday in between.", "Pour les agendas qui exigent beaucoup d'une garde-robe : conseils d'administration, conférences, voyages, et le mardi ordinaire entre les deux."),
    body: [L("Signature Private Styling gives you an ongoing relationship: seasonal edits, event looks with sourcing handled, travel capsules and a stylist a message away.", "Le Stylisme Privé Signature vous offre une relation continue : tris saisonniers, tenues d'événement avec approvisionnement géré, capsules de voyage et une styliste à portée de message.")],
    service: "signature-private-styling",
    image: "philosophy-city-walk",
    faq: [{ q: L("How discreet is it?", "Quelle discrétion ?"), a: L("Entirely. Your Style Passport is private, and we never publish client names without written consent.", "Totale. Votre Style Passport est privé, et nous ne publions jamais de noms de clientes sans consentement écrit.") }],
  },
  {
    slug: "occasion-styling",
    title: L("Occasion Styling", "Stylisme d'occasion"),
    h1: L("Dressed for the occasion, and still unmistakably you.", "Habillée pour l'occasion, et toujours résolument vous."),
    intro: L("Weddings, galas, ceremonies, keynotes. One complete look with alternatives, built where possible from what you own.", "Mariages, galas, cérémonies, conférences. Une tenue complète avec alternatives, construite autant que possible à partir de ce que vous possédez."),
    body: [L("We decode the dress code, venue, climate and photographs, then build a look that honours the moment without costuming you.", "Nous décodons le dress code, le lieu, le climat et les photos, puis construisons une silhouette qui honore le moment sans vous déguiser.")],
    service: "occasion-styling",
    image: "service-occasion-styling",
    faq: [{ q: L("How far ahead should I book?", "Combien de temps à l'avance réserver ?"), a: L("Two to four weeks is comfortable; sooner is possible.", "Deux à quatre semaines est confortable ; plus tôt est possible.") }],
  },
  {
    slug: "wardrobe-edit",
    title: L("Wardrobe Edit", "Tri de garde-robe"),
    h1: L("The Wardrobe Edit: fewer pieces, more outfits.", "Le Tri de Garde-robe : moins de pièces, plus de tenues."),
    intro: L("A careful reading of what you reach for, what you avoid and why.", "Une lecture attentive de ce vers quoi vous tendez la main, ce que vous évitez, et pourquoi."),
    body: [L("Keep, alter, rest, release: each decision explained. You leave with a photographed digital wardrobe and a lookbook of outfits from what you already own.", "Garder, retoucher, mettre en pause, laisser partir : chaque décision expliquée. Vous repartez avec une garde-robe numérique photographiée et un lookbook de tenues à partir de ce que vous possédez déjà.")],
    service: "wardrobe-edit",
    image: "mag-planned-wardrobe",
    faq: [{ q: L("How long does it take?", "Combien de temps cela prend-il ?"), a: L("About three hours for a typical wardrobe.", "Environ trois heures pour une garde-robe typique.") }],
  },
  {
    slug: "personal-shopper-cameroon",
    title: L("Personal Shopper in Cameroon", "Personal shopper au Cameroun"),
    h1: L("A personal shopper who already knows your wardrobe.", "Une personal shopper qui connaît déjà votre garde-robe."),
    intro: L("Accompanied shopping in Douala's boutiques, tailors and markets, with a list, a palette and a budget philosophy.", "Du shopping accompagné dans les boutiques, chez les tailleurs et sur les marchés de Douala, avec une liste, une palette et une philosophie de budget."),
    body: [L("We arrive with a shortlist and leave with pieces that earn their place. Tailoring is part of the plan where it makes a piece yours.", "Nous arrivons avec une sélection et repartons avec des pièces qui méritent leur place. La retouche fait partie du plan là où elle rend une pièce vôtre.")],
    service: "personal-shopping",
    image: "service-personal-shopping",
    faq: [{ q: L("Do you take commissions from boutiques?", "Prenez-vous des commissions des boutiques ?"), a: L("No. Recommendations are made for you, not for a retailer.", "Non. Les recommandations sont faites pour vous, pas pour un commerçant.") }],
  },
];
