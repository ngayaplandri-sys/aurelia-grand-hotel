/*
 * LES PHOTOGRAPHIES · registre
 * ----------------------------
 * Chaque photographie du site est désignée par un identifiant. Pour en remplacer une, déposez le nouveau fichier dans
 * production/sources/ sous le même nom (<id>.png ou .jpg ; <id>-m.png pour la version verticale mobile), puis lancez
 * `npm run images` : aucune autre modification n'est nécessaire.
 *
 *  alt    texte alternatif (EN / FR)
 *  focus  [x, y] en % : partie de l'image conservée quand le cadre est plus étroit que la photo (ordinateur)
 *  focusM idem sur mobile (facultatif)
 *  cat    catégorie de la galerie
 *
 * Dimensions, largeurs disponibles et couleur moyenne : data/photos-manifest.js (généré, ne pas modifier).
 * Toutes les photographies ont été générées par IA (Higgsfield) à partir de la bible visuelle production/BIBLE-VISUELLE.md.
 */
(function () {
  var A = (window.AURELIA = window.AURELIA || {});
  var P = (A.photos = {});
  function add(id, cat, alt_en, alt_fr, focus, focusM) {
    P[id] = { cat: cat, alt: { en: alt_en, fr: alt_fr }, focus: focus || [50, 50], focusM: focusM || null };
  }

  A.data.galleryCategories = [
    { id: "architecture", label: { en: "Architecture", fr: "Architecture" } },
    { id: "lobby", label: { en: "Lobby", fr: "Lobby" } },
    { id: "rooms", label: { en: "Rooms", fr: "Chambres" } },
    { id: "suites", label: { en: "Suites", fr: "Suites" } },
    { id: "restaurant", label: { en: "Restaurant", fr: "Restaurant" } },
    { id: "spa", label: { en: "Spa", fr: "Spa" } },
    { id: "pool", label: { en: "Pool", fr: "Piscine" } },
    { id: "rooftop", label: { en: "Rooftop", fr: "Rooftop" } },
    { id: "details", label: { en: "Details", fr: "Détails" } },
    { id: "experiences", label: { en: "Experiences", fr: "Expériences" } },
  ];

  /* ----- La visite (plans principaux) ----- */
  add("facade", "architecture",
    "The arched travertine façade of Aurelia Grand glowing at sunset above a still reflecting pool",
    "La façade en travertin et arcades d'Aurelia Grand, illuminée au coucher du soleil au-dessus d'un bassin miroir", [50, 56]);
  add("entrance", "architecture",
    "The monumental arched entrance with its bronze-and-glass doors open onto the glowing lobby, a doorman waiting beside a lantern",
    "L'entrée monumentale en arc, portes de bronze et de verre ouvertes sur le lobby éclairé, un portier près d'une lanterne", [50, 52]);
  add("lobby", "lobby",
    "The double-height lobby with a sculptural chandelier of amber glass globes, cream sofas and arched doors opening to the sea",
    "Le lobby sur double hauteur, son lustre sculptural de globes d'ambre, ses canapés crème et ses portes en arc ouvertes sur la mer", [50, 46]);
  add("reception", "lobby",
    "A concierge smiling as she hands a key folder to two guests at the travertine and oak reception desk",
    "Une concierge sourit en remettant une pochette de clé à deux hôtes au comptoir de réception en travertin et chêne", [56, 50]);
  add("corridor", "architecture",
    "A hushed guest corridor of arched oak doors, bronze sconces and a glowing window at the far end",
    "Un couloir feutré aux portes de chêne en arc, appliques de bronze et fenêtre lumineuse au fond", [50, 48]);
  add("suite", "suites",
    "A suite with a low king bed, cream bouclé seating and tall arched glass doors opening to the sea",
    "Une suite avec lit bas, assises bouclées crème et hautes portes vitrées en arc ouvertes sur la mer", [50, 52]);
  add("view", "architecture",
    "Sunrise over the sea from a private terrace, with loungers, olive trees and distant headlands",
    "Lever de soleil sur la mer depuis une terrasse privée, avec transats, oliviers et caps lointains", [52, 56]);
  add("dining-terrace", "restaurant",
    "The arched restaurant terrace at golden hour, tables set with ivory linen facing the sea",
    "La terrasse en arcades du restaurant à l'heure dorée, tables dressées de lin ivoire face à la mer", [48, 50]);
  add("dish", "restaurant",
    "A chef's hand placing a herb on a seared sea bass fillet with saffron emulsion and edible flowers",
    "La main d'un chef posant une herbe sur un filet de bar snacké, émulsion au safran et fleurs comestibles", [56, 60]);
  add("dining-room", "restaurant",
    "The dining room at dusk with amber glass pendants, round tables and arched windows over the sea",
    "La salle à manger au crépuscule : suspensions en verre ambré, tables rondes et fenêtres en arc sur la mer", [50, 50]);
  add("spa", "spa",
    "A vaulted travertine spa hall with a shallow candlelit pool and a skylight",
    "Un hall de spa voûté en travertin avec un bassin peu profond à la lueur des bougies et une verrière", [50, 56]);
  add("pool", "pool",
    "The infinity pool at golden hour, with ivory daybeds and the hotel's terraces rising behind",
    "La piscine à débordement à l'heure dorée, lits de repos ivoire et terrasses de l'hôtel en arrière-plan", [50, 55]);
  add("rooftop", "rooftop",
    "The rooftop terrace at blue hour with a bronze pergola, fire bowls and the illuminated hotel below",
    "Le rooftop à l'heure bleue : pergola de bronze, braseros et hôtel illuminé en contrebas", [60, 50]);

  /* ----- Introduction ----- */
  add("intro-loggia", "architecture",
    "Sunlight and long shadows beneath the arches of the travertine loggia",
    "Lumière rasante et longues ombres sous les arcades de la loggia en travertin", [50, 50]);
  add("intro-aerial", "architecture",
    "Aurelia Grand seen from above on its headland, its terraces stepping toward the sea",
    "Aurelia Grand vu d'en haut sur son promontoire, ses terrasses descendant vers la mer", [50, 50]);

  /* ----- Chambres et suites ----- */
  add("room-deluxe", "rooms",
    "A Deluxe Room with a king bed, a fluted oak headboard and an arched glass door to a sea-view balcony",
    "Une chambre Deluxe avec lit king size, tête de lit en chêne cannelé et porte vitrée en arc sur un balcon vue mer", [50, 52]);
  add("room-breakfast", "rooms",
    "Breakfast for two served on a sea-view balcony",
    "Petit-déjeuner pour deux sur un balcon vue mer", [50, 55]);
  add("room-executive", "rooms",
    "An Executive Room with a king bed, a walnut desk and a lounge corner facing the sea",
    "Une chambre Executive avec lit king size, bureau en noyer et coin salon face à la mer", [50, 52]);
  add("room-desk", "rooms",
    "A walnut writing desk with a bronze lamp beside a tall arched window",
    "Un bureau en noyer avec lampe de bronze près d'une haute fenêtre en arc", [50, 50]);
  add("room-junior", "suites",
    "A Junior Suite with an open sitting area, a curved cream sofa and arched glass doors to the terrace",
    "Une Junior Suite avec coin salon ouvert, canapé courbe crème et portes vitrées en arc sur la terrasse", [50, 52]);
  add("room-terrace", "suites",
    "A private travertine terrace with two linen loungers and a view of the sea",
    "Une terrasse privée en travertin avec deux transats en lin et vue sur la mer", [50, 52]);
  add("room-bath", "suites",
    "A freestanding travertine bathtub beside an arched window overlooking the sea",
    "Une baignoire îlot en travertin près d'une fenêtre en arc donnant sur la mer", [50, 52]);
  add("room-presidential", "suites",
    "The Presidential Suite living room, a wall of arched windows opening to a private terrace and the sea",
    "Le salon de la suite Présidentielle, un mur de fenêtres en arc ouvert sur une terrasse privée et la mer", [50, 52]);
  add("room-pool-terrace", "suites",
    "The private terrace of the Presidential Suite with a plunge pool at dusk",
    "La terrasse privée de la suite Présidentielle avec son bassin au crépuscule", [50, 52]);

  /* ----- Tables ----- */
  add("chef", "restaurant",
    "Portrait of the executive chef in a white jacket at the kitchen pass (illustrative, AI-generated)",
    "Portrait de la cheffe exécutive en veste blanche à la passe de la cuisine (illustratif, généré par IA)", [50, 40]);
  add("dish-starter", "restaurant",
    "Raw red prawns with citrus, fennel and olive oil pearls on a stoneware plate",
    "Crevettes rouges crues, agrumes, fenouil et perles d'huile d'olive sur une assiette en grès", [50, 50]);
  add("dish-dessert", "restaurant",
    "A vanilla cream dessert with candied lemon, almond crumble and honey",
    "Un dessert à la crème vanille, citron confit, crumble aux amandes et miel", [50, 50]);
  add("ingredients", "restaurant",
    "Fresh lemons, figs, tomatoes, basil, olive oil and a sea bream on ice on a travertine counter",
    "Citrons, figues, tomates, basilic, huile d'olive et dorade sur glace sur un plan en travertin", [50, 50]);
  add("table-detail", "restaurant",
    "A table setting with ivory linen, bronze cutlery, stoneware and a single candle",
    "Une table dressée : lin ivoire, couverts de bronze, grès et une bougie", [50, 50]);
  add("service", "restaurant",
    "A sommelier pouring white wine at a table by an arched window",
    "Un sommelier servant un vin blanc à une table près d'une fenêtre en arc", [50, 50]);

  /* ----- Bien-être ----- */
  add("spa-treatment", "spa",
    "A treatment room with a linen-dressed massage table, warm stones and candles",
    "Une cabine de soins avec table de massage habillée de lin, galets chauds et bougies", [50, 50]);
  add("sauna", "spa",
    "An oak sauna with a glowing glass door beside an arched travertine steam room",
    "Un sauna en chêne à la porte vitrée lumineuse, près d'un hammam en travertin voûté", [50, 50]);
  add("fitness", "spa",
    "The fitness studio with arched windows over the sea and minimal bronze and black equipment",
    "La salle de fitness aux fenêtres en arc sur la mer, équipements minimalistes noir et bronze", [50, 50]);
  add("relax", "spa",
    "The relaxation lounge with linen daybeds under sheer curtains and a tea service",
    "Le salon de détente avec lits de repos en lin sous des voilages et un service de thé", [50, 50]);

  /* ----- Expériences ----- */
  add("exp-private-dinner", "experiences",
    "A private candlelit dinner for two on a terrace at blue hour",
    "Un dîner privé aux chandelles pour deux sur une terrasse à l'heure bleue", [50, 50]);
  add("exp-excursion", "experiences",
    "A varnished wooden day boat anchored in a clear cove below pale cliffs",
    "Un bateau de bois verni ancré dans une crique limpide au pied de falaises claires", [50, 50]);
  add("exp-culture", "experiences",
    "A master potter's hands shaping a clay vase on the wheel",
    "Les mains d'un maître potier modelant un vase d'argile sur le tour", [50, 50]);
  add("exp-events", "experiences",
    "An elegant outdoor reception at dusk beneath olive trees and string lights",
    "Une réception élégante en plein air au crépuscule sous les oliviers et les guirlandes", [50, 50]);
  add("exp-gastro", "experiences",
    "A private wine tasting in a vaulted travertine cellar",
    "Une dégustation privée dans une cave voûtée en travertin", [50, 50]);
  add("exp-relax", "experiences",
    "Sunrise yoga on the travertine terrace facing the sea",
    "Yoga au lever du soleil sur la terrasse en travertin face à la mer", [50, 88]);
  add("exp-service", "experiences",
    "A personal butler presenting tea and a handwritten note in a suite",
    "Un majordome présentant le thé et un mot manuscrit dans une suite", [50, 50]);

  /* ----- Offres ----- */
  add("offer-romantic", "experiences",
    "Two champagne flutes clinking on a terrace at sunset",
    "Deux flûtes de champagne qui trinquent sur une terrasse au coucher du soleil", [50, 50]);

  /* ----- Détails ----- */
  add("detail-chandelier", "details",
    "The chandelier of hand-blown amber glass globes on bronze rods, seen from below",
    "Le lustre de globes d'ambre soufflés sur tiges de bronze, vu d'en dessous", [50, 50]);
  add("detail-bronze", "details",
    "A bronze door handle on a fluted oak door beside a glowing sconce",
    "Une poignée de bronze sur une porte en chêne cannelé, près d'une applique lumineuse", [50, 50]);
  add("detail-linen", "details",
    "Ivory linen sheets and a champagne wool throw on a suite bed",
    "Draps de lin ivoire et plaid de laine champagne sur le lit d'une suite", [50, 50]);
  add("detail-art", "details",
    "A travertine console with an abstract artwork, a ceramic vase and olive branches",
    "Une console en travertin, une œuvre abstraite, un vase en céramique et des branches d'olivier", [50, 50]);
})();
