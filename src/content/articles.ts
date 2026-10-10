import type { Article } from "./types";

/**
 * DEMO seed articles. Marked isDemo so the CMS can replace them. The
 * writing is original and reflects the Virtuous Vogue philosophy.
 */
const p = (en: string, fr: string) => ({ type: "paragraph" as const, text: { en, fr } });
const h = (en: string, fr: string) => ({ type: "heading" as const, text: { en, fr } });
const q = (en: string, fr: string) => ({ type: "quote" as const, text: { en, fr } });
const list = (items: [string, string][]) => ({ type: "list" as const, items: items.map(([en, fr]) => ({ en, fr })) });
const img = (image: string, en: string, fr: string) => ({ type: "image" as const, image, caption: { en, fr } });
const callout = (c: "shop-your-closet" | "book-consultation" | "virtuous-edit") => ({ type: "callout" as const, callout: c });

export const articles: Article[] = [
  {
    slug: "why-more-clothes-dont-mean-more-style",
    issue: "01",
    title: { en: "Why More Clothes Don't Always Mean More Style", fr: "Pourquoi plus de vêtements ne signifie pas toujours plus de style" },
    dek: {
      en: "A full wardrobe and nothing to wear is not a contradiction. It is a symptom. Here is what it usually means, and what to do instead of shopping.",
      fr: "Une garde-robe pleine et rien à porter n'est pas une contradiction. C'est un symptôme. Voici ce que cela signifie généralement, et quoi faire au lieu d'acheter.",
    },
    category: "wardrobe",
    type: "wardrobe-intelligence",
    authorSlug: "kimbi-rosa",
    publishedAt: "2026-09-02",
    readingMinutes: 6,
    hero: "mag-edited-rail",
    heroAlt: { en: "A woman stands beside a small brass rail holding eight carefully chosen garments.", fr: "Une femme debout près d'un petit portant en laiton avec huit vêtements soigneusement choisis." },
    featured: true,
    editorsPick: true,
    relatedService: "wardrobe-edit",
    related: ["seven-ways-to-rework-pieces-you-already-own", "the-quiet-power-of-a-well-planned-wardrobe"],
    isDemo: true,
    blocks: [
      p(
        "The first thing I do in a wardrobe edit is count. Not to shame anyone; the number is usually between eighty and two hundred pieces, and almost nobody is wearing more than thirty of them. The rest sit there, taking up visual space, making the thirty harder to find.",
        "La première chose que je fais lors d'un tri de garde-robe, c'est compter. Pas pour culpabiliser qui que ce soit ; le chiffre se situe généralement entre quatre-vingts et deux cents pièces, et presque personne n'en porte plus de trente. Le reste reste là, occupe l'espace visuel et rend les trente plus difficiles à trouver.",
      ),
      p(
        "More clothes don't give you more style for a simple reason: style is a relationship between pieces, not a count of them. Ten garments that speak to each other produce more outfits than fifty that don't. The maths is on your side if the pieces are.",
        "Plus de vêtements ne donnent pas plus de style pour une raison simple : le style est une relation entre les pièces, pas leur nombre. Dix vêtements qui se parlent produisent plus de tenues que cinquante qui ne se parlent pas. Les mathématiques sont de votre côté si les pièces le sont.",
      ),
      h("The three kinds of pieces that fill a wardrobe without dressing you", "Les trois types de pièces qui remplissent une garde-robe sans vous habiller"),
      list([
        ["The occasion that never came. Bought for a wedding, a holiday, a version of your life that didn't happen yet.", "L'occasion qui n'est jamais venue. Acheté pour un mariage, des vacances, une version de votre vie qui n'est pas encore arrivée."],
        ["The almost. Right colour, wrong fabric. Right shape, half a size off. You keep it because it was nearly perfect.", "Le presque. Bonne couleur, mauvais tissu. Bonne forme, une demi-taille en trop. Vous le gardez parce qu'il était presque parfait."],
        ["The someone else. It looked wonderful on a woman you admire. It was never going to be yours.", "Le quelqu'un d'autre. C'était magnifique sur une femme que vous admirez. Ça n'allait jamais être à vous."],
      ]),
      q("You give what you wear relevance. What you wear does not give you relevance.", "C'est vous qui donnez de la pertinence à ce que vous portez. Ce que vous portez ne vous donne pas de pertinence."),
      p(
        "So before you buy anything, try this. Put the thirty pieces you actually wear on one rail, and leave everything else where it is. Live from that rail for two weeks. Notice what you miss. That short list, and only that, is your shopping list.",
        "Alors, avant d'acheter quoi que ce soit, essayez ceci. Mettez les trente pièces que vous portez vraiment sur un seul portant, et laissez tout le reste où il est. Vivez de ce portant pendant deux semaines. Notez ce qui vous manque. Cette courte liste, et seulement elle, est votre liste d'achats.",
      ),
      callout("shop-your-closet"),
      p(
        "Most women discover that the thing they miss is not a garment at all. It is a combination they hadn't tried, or a tailor's twenty-minute alteration. That is good news. It means your style was already in the room.",
        "La plupart des femmes découvrent que ce qui leur manque n'est pas du tout un vêtement. C'est une combinaison qu'elles n'avaient pas essayée, ou vingt minutes de retouche chez un tailleur. C'est une bonne nouvelle. Cela signifie que votre style était déjà dans la pièce.",
      ),
      callout("book-consultation"),
    ],
  },
  {
    slug: "how-to-discover-your-style-without-copying-someone-else",
    issue: "01",
    title: { en: "How to Discover Your Style Without Copying Someone Else", fr: "Comment découvrir votre style sans copier quelqu'un d'autre" },
    dek: {
      en: "Inspiration is a starting point, not a destination. A practical way to turn what you admire into something that is unmistakably yours.",
      fr: "L'inspiration est un point de départ, pas une destination. Une méthode pratique pour transformer ce que vous admirez en quelque chose de résolument vôtre.",
    },
    category: "style",
    type: "how-to",
    authorSlug: "kimbi-rosa",
    publishedAt: "2026-09-09",
    readingMinutes: 7,
    hero: "mag-swatch-wall",
    heroAlt: { en: "A woman considers plain fabric swatches pinned to a sunlit studio wall.", fr: "Une femme observe des échantillons de tissu épinglés sur un mur d'atelier ensoleillé." },
    editorsPick: true,
    relatedService: "style-clarity",
    related: ["from-inspiration-to-identity", "dressing-for-the-life-you-actually-live"],
    isDemo: true,
    blocks: [
      p(
        "Every woman I've worked with arrived with a reference. A sister, a colleague, a woman on a screen. There is nothing wrong with that. The trouble starts when the reference becomes a costume: when you dress like her and still don't feel like you.",
        "Chaque femme avec qui j'ai travaillé est arrivée avec une référence. Une sœur, une collègue, une femme sur un écran. Il n'y a rien de mal à cela. Le problème commence quand la référence devient un costume : quand vous vous habillez comme elle et ne vous sentez toujours pas vous-même.",
      ),
      h("Admire the principle, not the outfit", "Admirez le principe, pas la tenue"),
      p(
        "Take three images you keep coming back to and write one sentence each about why. Not what she's wearing; why it works. 'She looks calm.' 'Nothing is competing.' 'The colour is doing all the talking.' Those sentences are your style principles. The outfits were only carrying them.",
        "Prenez trois images vers lesquelles vous revenez sans cesse et écrivez une phrase sur chacune : pourquoi. Pas ce qu'elle porte ; pourquoi ça fonctionne. « Elle a l'air calme. » « Rien ne se dispute l'attention. » « La couleur fait tout le travail. » Ces phrases sont vos principes de style. Les tenues ne faisaient que les porter.",
      ),
      h("Three words for how you want to be met", "Trois mots pour la manière dont vous voulez être reçue"),
      p(
        "Then three words for how you actually are. If the lists are the same, you are closer than you think. If they differ, the gap is the brief. A woman who is warm and wants to be read as authoritative does not need to stop being warm. She needs structure around the warmth: a cleaner line, a firmer fabric, one strong colour.",
        "Puis trois mots pour ce que vous êtes vraiment. Si les listes sont identiques, vous êtes plus proche que vous ne le pensez. Si elles diffèrent, l'écart est le brief. Une femme chaleureuse qui veut être perçue comme ayant de l'autorité n'a pas besoin de cesser d'être chaleureuse. Elle a besoin de structure autour de la chaleur : une ligne plus nette, un tissu plus ferme, une couleur forte.",
      ),
      q("I'm not here to tell you to dress like me. I'm here to help you discover how to dress like you.", "Je ne suis pas là pour vous dire de vous habiller comme moi. Je suis là pour vous aider à découvrir comment vous habiller comme vous."),
      p(
        "The Style Compass asks these questions in a few minutes. It won't give you an identity, because you already have one. It gives you a direction, in words, that you can hold a garment up against.",
        "Le Style Compass pose ces questions en quelques minutes. Il ne vous donnera pas une identité, parce que vous en avez déjà une. Il vous donne une direction, en mots, à laquelle confronter un vêtement.",
      ),
      callout("virtuous-edit"),
    ],
  },
  {
    slug: "seven-ways-to-rework-pieces-you-already-own",
    issue: "01",
    title: { en: "7 Ways to Rework Pieces You Already Own", fr: "7 façons de retravailler des pièces que vous possédez déjà" },
    dek: {
      en: "Small moves, large difference. The techniques a stylist reaches for before anyone goes shopping.",
      fr: "Petits gestes, grande différence. Les techniques qu'une styliste utilise avant que quiconque n'aille faire du shopping.",
    },
    category: "wardrobe",
    type: "how-to",
    authorSlug: "kimbi-rosa",
    publishedAt: "2026-09-16",
    readingMinutes: 5,
    hero: "mag-rework-shirt",
    heroAlt: { en: "A woman in a white shirt and mulberry skirt ties a silk scarf beside a window.", fr: "Une femme en chemise blanche et jupe mûre noue un foulard en soie près d'une fenêtre." },
    relatedService: "wardrobe-edit",
    related: ["why-more-clothes-dont-mean-more-style", "the-quiet-power-of-a-well-planned-wardrobe"],
    isDemo: true,
    blocks: [
      p("None of these costs money. All of them change the way a piece reads.", "Aucune de ces idées ne coûte d'argent. Toutes changent la manière dont une pièce se lit."),
      list([
        ["Change the tuck. A full tuck, a front tuck and no tuck are three different silhouettes from one shirt.", "Changez le rentré. Entièrement rentré, rentré devant ou pas rentré : trois silhouettes différentes pour une seule chemise."],
        ["Move the waist. A belt placed where the garment doesn't expect one redraws your proportions.", "Déplacez la taille. Une ceinture placée là où le vêtement ne l'attend pas redessine vos proportions."],
        ["Wear the blazer as a shirt. Buttoned, over a fine knit, with sleeves pushed slightly.", "Portez le blazer comme une chemise. Boutonné, sur une maille fine, manches légèrement relevées."],
        ["Layer the dress. A long dress over slim trousers, or under a long coat, becomes two new pieces.", "Superposez la robe. Une robe longue sur un pantalon slim, ou sous un manteau long, devient deux nouvelles pièces."],
        ["Let one colour repeat. Match the scarf to the shoe, or the belt to the bag, and the outfit looks decided.", "Laissez une couleur se répéter. Accordez le foulard aux chaussures, ou la ceinture au sac, et la tenue semble décidée."],
        ["Take the sleeve seriously. Rolled, pushed, cuffed or straight changes the formality more than you think.", "Prenez la manche au sérieux. Roulée, relevée, à revers ou droite change la formalité plus que vous ne le pensez."],
        ["Visit a tailor. A hem, a waist, a shoulder: twenty minutes of alteration is the cheapest new garment you will ever own.", "Allez chez un tailleur. Un ourlet, une taille, une épaule : vingt minutes de retouche, c'est le vêtement neuf le moins cher que vous aurez jamais."],
      ]),
      callout("shop-your-closet"),
    ],
  },
  {
    slug: "the-quiet-power-of-a-well-planned-wardrobe",
    issue: "01",
    title: { en: "The Quiet Power of a Well-Planned Wardrobe", fr: "Le pouvoir discret d'une garde-robe bien pensée" },
    dek: {
      en: "Planning is not the opposite of spontaneity. It is what makes the morning calm enough to be spontaneous in.",
      fr: "Planifier n'est pas le contraire de la spontanéité. C'est ce qui rend le matin assez calme pour y être spontanée.",
    },
    category: "wardrobe",
    type: "style-notes",
    authorSlug: "kimbi-rosa",
    publishedAt: "2026-09-23",
    readingMinutes: 5,
    hero: "mag-planned-wardrobe",
    heroAlt: { en: "An open oak wardrobe with garments arranged from ivory to black in morning light.", fr: "Une armoire en chêne ouverte, vêtements rangés de l'ivoire au noir dans la lumière du matin." },
    relatedService: "wardrobe-edit",
    related: ["why-more-clothes-dont-mean-more-style", "dressing-for-the-life-you-actually-live"],
    isDemo: true,
    blocks: [
      p(
        "The women who look most effortless are, almost without exception, the ones who did the thinking earlier. They know which trousers go with which shoes because they decided once, on a Sunday, and never had to decide again.",
        "Les femmes qui semblent les plus naturelles sont, presque sans exception, celles qui ont réfléchi plus tôt. Elles savent quel pantalon va avec quelles chaussures parce qu'elles l'ont décidé une fois, un dimanche, et n'ont plus jamais eu à y penser.",
      ),
      h("Plan by week, not by outfit", "Planifiez par semaine, pas par tenue"),
      p(
        "Look at the week ahead. Two client meetings, a school run, a dinner, a long day at the desk. Choose a palette for the week, say ivory, olive and black, and pull only the pieces in it. Now every outfit you build from that rail already agrees with the others.",
        "Regardez la semaine à venir. Deux rendez-vous clients, l'école, un dîner, une longue journée au bureau. Choisissez une palette pour la semaine, disons ivoire, olive et noir, et ne sortez que les pièces qui en font partie. Désormais, chaque tenue construite depuis ce portant est déjà en accord avec les autres.",
      ),
      q("A planned wardrobe gives you back the one thing fashion keeps taking: your attention.", "Une garde-robe planifiée vous rend la seule chose que la mode ne cesse de prendre : votre attention."),
      callout("book-consultation"),
    ],
  },
  {
    slug: "what-does-modest-elegance-actually-mean",
    issue: "01",
    title: { en: "What Does Modest Elegance Actually Mean?", fr: "Que signifie vraiment l'élégance modeste ?" },
    dek: {
      en: "Not a rulebook, not a uniform. A way of dressing that puts the woman first and lets the clothes follow.",
      fr: "Ni un règlement, ni un uniforme. Une façon de s'habiller qui met la femme en premier et laisse les vêtements suivre.",
    },
    category: "modest-elegance",
    type: "style-notes",
    authorSlug: "kimbi-rosa",
    publishedAt: "2026-09-30",
    readingMinutes: 6,
    hero: "mag-modest-elegance",
    heroAlt: { en: "A woman in a long-sleeved olive dress walks along a sunlit street lined with palms.", fr: "Une femme en robe olive à manches longues marche dans une rue ensoleillée bordée de palmiers." },
    featured: false,
    editorsPick: true,
    relatedService: "style-clarity",
    related: ["how-to-discover-your-style-without-copying-someone-else", "colour-without-rules"],
    isDemo: true,
    blocks: [
      p(
        "People hear 'modest' and picture something shapeless. They hear 'elegant' and picture something expensive. Neither is true. Modest elegance is simply dressing so that the first thing anyone notices is you.",
        "Les gens entendent « modeste » et imaginent quelque chose d'informe. Ils entendent « élégant » et imaginent quelque chose de cher. Ni l'un ni l'autre n'est vrai. L'élégance modeste, c'est simplement s'habiller pour que la première chose que l'on remarque soit vous.",
      ),
      h("Coverage is a design decision", "La couverture est une décision de design"),
      p(
        "A long sleeve is a line. A high neck is a frame for the face. A midi length is a proportion. Treated as design, coverage gives you more to work with, not less: more fabric to drape, more line to draw, more surface for colour.",
        "Une manche longue est une ligne. Un col haut est un cadre pour le visage. Une longueur midi est une proportion. Traitée comme du design, la couverture vous donne plus de matière, pas moins : plus de tissu à draper, plus de ligne à dessiner, plus de surface pour la couleur.",
      ),
      p(
        "It is also a preference, and preferences are allowed. Some clients cover for faith, some for culture, some for comfort, some because they simply like the look. Our job is the same in every case: make it beautiful, make it yours, make it easy.",
        "C'est aussi une préférence, et les préférences sont permises. Certaines clientes se couvrent par foi, d'autres par culture, par confort, ou simplement parce qu'elles aiment ce look. Notre travail est le même dans tous les cas : le rendre beau, le rendre vôtre, le rendre facile.",
      ),
      q("Decency and style were never in competition. Only in lazy wardrobes.", "La décence et le style n'ont jamais été en concurrence. Seulement dans les garde-robes paresseuses."),
      callout("book-consultation"),
    ],
  },
  {
    slug: "dressing-for-the-life-you-actually-live",
    issue: "02",
    title: { en: "Dressing for the Life You Actually Live", fr: "S'habiller pour la vie que vous vivez vraiment" },
    dek: {
      en: "The wardrobe that works is the one built for your Tuesday, not your imaginary gala.",
      fr: "La garde-robe qui fonctionne est celle construite pour votre mardi, pas pour votre gala imaginaire.",
    },
    category: "lifestyle",
    type: "the-virtuous-woman",
    authorSlug: "kimbi-rosa",
    publishedAt: "2026-10-07",
    readingMinutes: 5,
    hero: "mag-real-life",
    heroAlt: { en: "A woman in relaxed linen laughs at a shaded café table in Douala.", fr: "Une femme en lin décontracté rit à une table de café ombragée à Douala." },
    featured: false,
    relatedService: "style-clarity",
    related: ["the-quiet-power-of-a-well-planned-wardrobe", "city-style-douala"],
    isDemo: true,
    blocks: [
      p(
        "Open your calendar and count the kinds of days you have. Most women have four, maybe five. A desk day. A meeting day. A home day. A social evening. Occasionally, an occasion. Now open your wardrobe and count what each kind of day has to choose from.",
        "Ouvrez votre agenda et comptez les types de journées que vous avez. La plupart des femmes en ont quatre, peut-être cinq. Une journée bureau. Une journée réunions. Une journée maison. Une soirée. Parfois, une occasion. Ouvrez maintenant votre garde-robe et comptez ce que chaque type de journée a pour choisir.",
      ),
      p(
        "The imbalance is usually dramatic. Six evening options, two days a year. One good desk outfit, two hundred days a year. Rebalancing is not glamorous, and it is the single most effective thing you can do for how you feel on an ordinary morning.",
        "Le déséquilibre est généralement spectaculaire. Six options de soirée, deux jours par an. Une bonne tenue de bureau, deux cents jours par an. Rééquilibrer n'est pas glamour, et c'est la chose la plus efficace que vous puissiez faire pour ce que vous ressentez un matin ordinaire.",
      ),
      callout("shop-your-closet"),
    ],
  },
  {
    slug: "colour-without-rules",
    issue: "02",
    title: { en: "Colour Without Rules: Finding Shades That Feel Like You", fr: "La couleur sans règles : trouver les teintes qui vous ressemblent" },
    dek: {
      en: "Seasons and systems can help. They can also get in the way. A gentler approach to colour, built around skin, light and feeling.",
      fr: "Les saisons et les systèmes peuvent aider. Ils peuvent aussi gêner. Une approche plus douce de la couleur, construite autour de la peau, de la lumière et du ressenti.",
    },
    category: "colour",
    type: "colour-notes",
    authorSlug: "kimbi-rosa",
    publishedAt: "2026-10-14",
    readingMinutes: 7,
    hero: "mag-colour-joy",
    heroAlt: { en: "A laughing woman in an ivory top with a cobalt and terracotta silk scarf.", fr: "Une femme riant en haut ivoire avec un foulard en soie cobalt et terracotta." },
    editorsPick: true,
    relatedService: "colour-harmony",
    related: ["what-does-modest-elegance-actually-mean", "how-to-discover-your-style-without-copying-someone-else"],
    isDemo: true,
    blocks: [
      p(
        "Most colour advice was written for a narrow range of skin. If you have ever been told that deep skin 'can wear anything', you have been given a compliment instead of an answer. Deep skin has undertones, contrast and preferences like any other. It deserves the same precision.",
        "La plupart des conseils sur la couleur ont été écrits pour une gamme étroite de peaux. Si l'on vous a déjà dit qu'une peau foncée « peut tout porter », on vous a fait un compliment au lieu d'une réponse. La peau foncée a des sous-tons, du contraste et des préférences comme toute autre. Elle mérite la même précision.",
      ),
      h("Three things to notice before any chart", "Trois choses à remarquer avant tout nuancier"),
      list([
        ["Undertone tendency: in daylight, does your skin lean warm, cool, or sit between? Uncertain is an honest answer.", "Tendance de sous-ton : à la lumière du jour, votre peau tire-t-elle vers le chaud, le froid, ou entre les deux ? Incertain est une réponse honnête."],
        ["Contrast: how different are your hair, skin and eyes from one another? High contrast carries bold combinations; low contrast sings in tonal ones.", "Contraste : à quel point vos cheveux, votre peau et vos yeux diffèrent-ils ? Un contraste élevé porte les combinaisons audacieuses ; un contraste faible chante dans les tons sur tons."],
        ["Feeling: the colour you reach for when nobody is watching is data. Trust it.", "Ressenti : la couleur vers laquelle vous allez quand personne ne regarde est une donnée. Faites-lui confiance."],
      ]),
      p(
        "The Colour Lens gives you a digital preview of the first two. It will tell you plainly when the light in your photo isn't good enough to say anything useful, because a confident wrong answer is worse than none.",
        "Le Colour Lens vous donne un aperçu numérique des deux premières. Il vous dira franchement quand la lumière de votre photo n'est pas suffisante pour dire quoi que ce soit d'utile, parce qu'une mauvaise réponse confiante est pire qu'aucune.",
      ),
      callout("book-consultation"),
    ],
  },
  {
    slug: "from-inspiration-to-identity",
    issue: "02",
    title: { en: "From Inspiration to Identity: How to Use Pinterest Without Becoming a Copy", fr: "De l'inspiration à l'identité : utiliser Pinterest sans devenir une copie" },
    dek: {
      en: "A board of a thousand images will not dress you. A board of twelve, read properly, might.",
      fr: "Un tableau de mille images ne vous habillera pas. Un tableau de douze, bien lu, peut-être.",
    },
    category: "confidence",
    type: "how-to",
    authorSlug: "kimbi-rosa",
    publishedAt: "2026-10-21",
    readingMinutes: 6,
    hero: "mag-inspiration-desk",
    heroAlt: { en: "Hands arrange a linen notebook and fabric swatches on an oak desk.", fr: "Des mains disposent un carnet en lin et des échantillons de tissu sur un bureau en chêne." },
    relatedService: "style-clarity",
    related: ["how-to-discover-your-style-without-copying-someone-else", "colour-without-rules"],
    isDemo: true,
    blocks: [
      p(
        "Save less. That is the whole method, and it is harder than it sounds. Keep a board of twelve images and make yourself remove one for every one you add. Scarcity forces a decision, and decisions are where identity lives.",
        "Enregistrez moins. C'est toute la méthode, et c'est plus difficile qu'il n'y paraît. Gardez un tableau de douze images et obligez-vous à en retirer une pour chaque ajout. La rareté force la décision, et c'est dans les décisions que vit l'identité.",
      ),
      p(
        "Then do what a stylist does: cover the face in each image with your thumb. If you still like it, it's about the clothes. If you don't, you were admiring the woman, and that is worth knowing too.",
        "Puis faites ce qu'une styliste fait : cachez le visage de chaque image avec votre pouce. Si vous l'aimez toujours, c'est à propos des vêtements. Sinon, vous admiriez la femme, et cela vaut aussi la peine d'être su.",
      ),
      callout("virtuous-edit"),
    ],
  },
  {
    slug: "city-style-douala",
    issue: "02",
    title: { en: "City Style: Dressing for Douala's Heat Without Losing the Line", fr: "City Style : s'habiller pour la chaleur de Douala sans perdre la ligne" },
    dek: {
      en: "Humidity is not an excuse for shapelessness. Fabrics, cuts and colours that keep their composure at thirty degrees.",
      fr: "L'humidité n'est pas une excuse pour l'informe. Tissus, coupes et couleurs qui gardent leur tenue à trente degrés.",
    },
    category: "culture",
    type: "city-style",
    authorSlug: "kimbi-rosa",
    publishedAt: "2026-10-28",
    readingMinutes: 5,
    hero: "mag-city-douala",
    heroAlt: { en: "A woman in an ivory coat and camel trousers stands on a balcony above Douala's rooftops.", fr: "Une femme en manteau ivoire et pantalon camel sur un balcon au-dessus des toits de Douala." },
    relatedService: "personal-shopping",
    related: ["dressing-for-the-life-you-actually-live", "what-does-modest-elegance-actually-mean"],
    isDemo: true,
    blocks: [
      p(
        "Linen creases, and that is fine; it creases elegantly. Cotton poplin holds a collar. Tencel drapes and dries. Silk breathes but shows the day. Knowing this, you can keep a tailored silhouette in weather that pushes everyone else into shapeless jersey.",
        "Le lin se froisse, et c'est très bien ; il se froisse avec élégance. La popeline de coton tient un col. Le Tencel tombe bien et sèche vite. La soie respire mais garde les traces de la journée. En sachant cela, vous pouvez garder une silhouette structurée par un temps qui pousse tout le monde vers le jersey informe.",
      ),
      list([
        ["Wide leg over slim: air moves, the line stays long.", "Jambe large plutôt que slim : l'air circule, la ligne reste longue."],
        ["Long sleeves in light fabric protect better than bare arms in the sun, and read more polished at the office.", "Des manches longues en tissu léger protègent mieux que des bras nus au soleil, et paraissent plus soignées au bureau."],
        ["Pale neutrals in the day, deep colour in the evening when the light softens.", "Neutres pâles le jour, couleurs profondes le soir quand la lumière s'adoucit."],
      ]),
      callout("shop-your-closet"),
    ],
  },
];

export function getArticle(slug: string) {
  return articles.find((a) => a.slug === slug);
}
