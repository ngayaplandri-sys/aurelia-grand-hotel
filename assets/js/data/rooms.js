/*
 * CHAMBRES ET SUITES (bilingue). Les superficies, capacités et équipements sont des données de démonstration.
 * Aucun tarif n'est affiché : tant que l'hôtel n'a pas validé ses prix, le site indique « Tarif sur demande ».
 * photo = image principale ; gallery = images de la fiche détaillée (identifiants de data/photos.js).
 */
(function () {
  var A = (window.AURELIA = window.AURELIA || {});
  A.data = A.data || {};

  A.data.stay = {
    eyebrow: { en: "Rooms & Suites", fr: "Chambres & Suites" },
    title: { en: "Rooms that look to the *sea.*", fr: "Des chambres tournées vers la *mer.*" },
    lead: {
      en: "Five ways to inhabit the coast. Each one is built from fluted oak, honed travertine and bronze, and each has a horizon of its own.",
      fr: "Cinq façons d'habiter la côte. Chacune est faite de chêne cannelé, de travertin poli et de bronze, et chacune a son propre horizon.",
    },
    note: { en: "Sizes, capacities and amenities are demonstration data. Rates are available on request.", fr: "Superficies, capacités et équipements sont des données de démonstration. Les tarifs sont communiqués sur demande." },
    rooms: [
      {
        id: "deluxe-room", photo: "room-deluxe", gallery: ["room-deluxe", "room-breakfast", "detail-linen"],
        name: { en: "Deluxe Room", fr: "Chambre Deluxe" },
        tagline: { en: "A calm, light-filled retreat.", fr: "Un refuge calme et lumineux." },
        size: 38, sleeps: 3,
        view: { en: "Sea view balcony", fr: "Balcon vue mer" },
        bed: { en: "King bed or twin beds", fr: "Lit king size ou lits jumeaux" },
        text: {
          en: ["A fluted-oak headboard, linen the colour of sand and an arched glass door that opens to a small balcony above the sea. The Deluxe Room is quiet by design: soft light, deep silence, and everything within reach.", "Mornings begin on the balcony; evenings end with the shutters half open to the sound of the water."],
          fr: ["Une tête de lit en chêne cannelé, du linge couleur sable et une porte vitrée en arc qui s'ouvre sur un petit balcon au-dessus de la mer. La chambre Deluxe est calme par nature : lumière douce, grand silence, tout à portée de main.", "Les matins commencent sur le balcon ; les soirées se terminent volets entrouverts, au bruit de l'eau."],
        },
        amenities: {
          en: ["Private sea-view balcony", "Rain shower and bath amenities", "Espresso machine and tea service", "Bathrobes and slippers", "Climate control", "High-speed Wi-Fi", "Smart television", "In-room safe"],
          fr: ["Balcon privé vue mer", "Douche à effet pluie et produits de bain", "Machine à espresso et service de thé", "Peignoirs et chaussons", "Climatisation réglable", "Wi-Fi haut débit", "Télévision connectée", "Coffre-fort"],
        },
      },
      {
        id: "executive-room", photo: "room-executive", gallery: ["room-executive", "room-desk", "detail-bronze"],
        name: { en: "Executive Room", fr: "Chambre Executive" },
        tagline: { en: "Room to think, room to rest.", fr: "De l'espace pour penser, de l'espace pour se reposer." },
        size: 46, sleeps: 3,
        view: { en: "Sea view", fr: "Vue mer" },
        bed: { en: "King bed", fr: "Lit king size" },
        text: {
          en: ["A walnut writing desk by the window, a lounge corner with two bouclé armchairs and a bed that faces the light. The Executive Room is composed for those who work a little and rest a lot.", "Evening turndown, a morning press of your choice and access to the Executive Lounge are included."],
          fr: ["Un bureau en noyer près de la fenêtre, un coin salon avec deux fauteuils bouclés et un lit face à la lumière. La chambre Executive est pensée pour ceux qui travaillent un peu et se reposent beaucoup.", "Le service du soir, la presse du matin de votre choix et l'accès au Salon Executive sont inclus."],
        },
        amenities: {
          en: ["Writing desk and ergonomic chair", "Lounge corner", "Access to the Executive Lounge", "Evening turndown", "Espresso machine and tea service", "Rain shower and separate bath", "High-speed Wi-Fi", "In-room safe"],
          fr: ["Bureau et fauteuil ergonomique", "Coin salon", "Accès au Salon Executive", "Service du soir", "Machine à espresso et service de thé", "Douche à effet pluie et baignoire séparée", "Wi-Fi haut débit", "Coffre-fort"],
        },
      },
      {
        id: "junior-suite", photo: "room-junior", gallery: ["room-junior", "room-terrace", "room-bath"],
        name: { en: "Junior Suite", fr: "Junior Suite" },
        tagline: { en: "An open space that follows the sun.", fr: "Un espace ouvert qui suit le soleil." },
        size: 62, sleeps: 3,
        view: { en: "Sea view and terrace", fr: "Vue mer et terrasse" },
        bed: { en: "King bed", fr: "Lit king size" },
        text: {
          en: ["Bed, sofa and a small dining table share one generous room, opened to the terrace by tall arched glass doors. Light travels across the travertine floor from dawn to dusk.", "Outside, two loungers wait on a private terrace; inside, a double vanity and a walk-in dressing room make the day unhurried."],
          fr: ["Lit, canapé et petite table à manger se partagent une même pièce généreuse, ouverte sur la terrasse par de hautes portes vitrées en arc. La lumière traverse le sol de travertin de l'aube au crépuscule.", "Dehors, deux transats attendent sur une terrasse privée ; dedans, une double vasque et un dressing rendent la journée sans hâte."],
        },
        amenities: {
          en: ["Private terrace with loungers", "Separate sitting area", "Walk-in dressing room", "Double vanity bathroom", "Espresso machine and tea service", "Evening turndown", "Climate control", "High-speed Wi-Fi"],
          fr: ["Terrasse privée avec transats", "Coin salon séparé", "Dressing", "Salle de bain à double vasque", "Machine à espresso et service de thé", "Service du soir", "Climatisation réglable", "Wi-Fi haut débit"],
        },
      },
      {
        id: "executive-suite", photo: "suite", gallery: ["suite", "room-bath", "detail-art"],
        name: { en: "Executive Suite", fr: "Suite Executive" },
        tagline: { en: "A living room, a bedroom and the whole horizon.", fr: "Un salon, une chambre et tout l'horizon." },
        size: 95, sleeps: 4,
        view: { en: "Panoramic sea view", fr: "Vue panoramique sur la mer" },
        bed: { en: "King bed + sofa bed", fr: "Lit king size + canapé-lit" },
        text: {
          en: ["A wall of arched glass opens the whole suite to the sea. Curved bouclé sofas, a travertine table and a fluted-oak bed wall compose a room that is as comfortable at breakfast as it is at midnight.", "The bathroom holds a freestanding stone bath beside its own window. A butler is available on request."],
          fr: ["Un mur de verre en arcades ouvre toute la suite sur la mer. Canapés bouclés aux courbes douces, table en travertin et paroi de lit en chêne cannelé composent une pièce aussi confortable au petit-déjeuner qu'à minuit.", "La salle de bain abrite une baignoire en pierre sur pieds, près de sa propre fenêtre. Un majordome est disponible sur demande."],
        },
        amenities: {
          en: ["Separate living room", "Large terrace", "Freestanding stone bath", "Butler on request", "Complimentary minibar (non-alcoholic)", "Evening turndown", "Espresso machine and tea service", "High-speed Wi-Fi"],
          fr: ["Salon séparé", "Grande terrasse", "Baignoire en pierre sur pieds", "Majordome sur demande", "Minibar offert (sans alcool)", "Service du soir", "Machine à espresso et service de thé", "Wi-Fi haut débit"],
        },
      },
      {
        id: "presidential-suite", photo: "room-presidential", gallery: ["room-presidential", "room-pool-terrace", "detail-chandelier"],
        name: { en: "Presidential Suite", fr: "Suite Présidentielle" },
        tagline: { en: "The whole headland, for yourself.", fr: "Tout le promontoire, rien que pour vous." },
        size: 240, sleeps: 6,
        view: { en: "Panoramic sea view, private plunge pool", fr: "Vue panoramique, bassin privé" },
        bed: { en: "Two king bedrooms", fr: "Deux chambres king size" },
        text: {
          en: ["Two bedrooms, a double-height living room and a dining table for eight sit beneath a cluster of amber globes. A private terrace carries a plunge pool whose edge disappears into the sea.", "A dedicated butler, a private entrance and a chauffeur transfer on request complete a suite designed for long, quiet stays."],
          fr: ["Deux chambres, un salon sur double hauteur et une table pour huit sous une grappe de globes d'ambre. Une terrasse privée porte un bassin dont le bord disparaît dans la mer.", "Un majordome dédié, une entrée privée et un transfert avec chauffeur sur demande complètent une suite pensée pour les longs séjours tranquilles."],
        },
        amenities: {
          en: ["Private plunge pool and terrace", "Two king bedrooms", "Dining room for eight", "Dedicated butler", "Private entrance", "Chauffeur transfer on request", "In-suite spa treatments on request", "High-speed Wi-Fi"],
          fr: ["Bassin et terrasse privés", "Deux chambres king size", "Salle à manger pour huit", "Majordome dédié", "Entrée privée", "Transfert avec chauffeur sur demande", "Soins spa en suite sur demande", "Wi-Fi haut débit"],
        },
      },
    ],
  };
})();
