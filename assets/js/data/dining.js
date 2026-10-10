/*
 * TABLES ET GASTRONOMIE (bilingue). Horaires, couverts et menus : données de démonstration.
 * Chaque espace possède sa fiche détaillée (#/dining/<id>) et son lien « Réserver une table » (formulaire de contact).
 */
(function () {
  var A = (window.AURELIA = window.AURELIA || {});
  A.data = A.data || {};

  A.data.dining = {
    eyebrow: { en: "Dining", fr: "Les tables" },
    title: { en: "Tables worth the *journey.*", fr: "Des tables qui valent le *voyage.*" },
    lead: {
      en: "From the first coffee to the last aperitif, three tables celebrate the coast: precise, seasonal and never hurried.",
      fr: "Du premier café au dernier apéritif, trois tables célèbrent la côte : précises, de saison et jamais pressées.",
    },
    spacesTitle: { en: "Three tables, one coast", fr: "Trois tables, une même côte" },
    // trois colonnes décalées : [photographie, proportion]
    collage: [
      [["dining-room", "5 / 6"], ["table-detail", "3 / 2"], ["service", "3 / 2"]],
      [["dish-starter", "4 / 5"], ["dish-dessert", "1 / 1"], ["dining-terrace", "3 / 4"]],
      [["chef", "4 / 5"], ["ingredients", "3 / 2"], ["dish", "4 / 3"]],
    ],
    chefQuote: {
      text: { en: "We cook what the sea gives us in the morning and the garden offers by noon. The rest is patience.", fr: "Nous cuisinons ce que la mer nous donne le matin et ce que le jardin offre à midi. Le reste est affaire de patience." },
      who: { en: "Executive Chef · illustrative portrait", fr: "Cheffe exécutive · portrait illustratif" },
    },
    spaces: [
      {
        id: "aurelia-table", photo: "dining-room", gallery: ["dining-room", "dish", "dish-starter", "table-detail", "service"],
        name: { en: "Aurelia Table", fr: "Aurelia Table" },
        kind: { en: "Gastronomic restaurant", fr: "Restaurant gastronomique" },
        short: { en: "Tasting menus composed around the day's catch and the headland's gardens.", fr: "Des menus dégustation composés autour de la pêche du jour et des jardins du promontoire." },
        facts: [
          [{ en: "Cuisine", fr: "Cuisine" }, { en: "Contemporary Mediterranean", fr: "Méditerranéenne contemporaine" }],
          [{ en: "Service", fr: "Service" }, { en: "Dinner, Tuesday to Saturday · 7:00 – 10:30 pm", fr: "Dîner, du mardi au samedi · 19 h – 22 h 30" }],
          [{ en: "Seats", fr: "Couverts" }, { en: "42 guests", fr: "42 couverts" }],
          [{ en: "Dress", fr: "Tenue" }, { en: "Elegant, jackets welcome", fr: "Élégante, veste appréciée" }],
        ],
        text: {
          en: ["Beneath a cluster of amber globes and tall arched windows, the chef composes tasting menus that follow the sea and the seasons: line-caught sea bass with saffron and fennel, slow-cooked lamb from the hills, citrus and honey to finish.", "The room seats forty-two, so service stays personal. A sommelier chooses wines from small estates along the coast; a non-alcoholic pairing is always offered."],
          fr: ["Sous une grappe de globes d'ambre et de hautes fenêtres en arc, la cheffe compose des menus dégustation qui suivent la mer et les saisons : bar de ligne au safran et fenouil, agneau des collines cuit lentement, agrumes et miel pour finir.", "La salle compte quarante-deux couverts : le service reste personnel. Un sommelier choisit des vins de petits domaines de la côte ; un accord sans alcool est toujours proposé."],
        },
      },
      {
        id: "mare", photo: "dining-terrace", gallery: ["dining-terrace", "ingredients", "dish-dessert", "service"],
        name: { en: "Mare", fr: "Mare" },
        kind: { en: "Terrace restaurant", fr: "Restaurant en terrasse" },
        short: { en: "Grilled fish, shellfish and long lunches in a loggia that opens to the sea.", fr: "Poissons grillés, coquillages et longs déjeuners dans une loggia ouverte sur la mer." },
        facts: [
          [{ en: "Cuisine", fr: "Cuisine" }, { en: "Seafood, grill and garden", fr: "Mer, grill et potager" }],
          [{ en: "Service", fr: "Service" }, { en: "Lunch and dinner, daily · 12:00 – 11:00 pm", fr: "Déjeuner et dîner, tous les jours · 12 h – 23 h" }],
          [{ en: "Seats", fr: "Couverts" }, { en: "90 guests", fr: "90 couverts" }],
          [{ en: "Dress", fr: "Tenue" }, { en: "Relaxed elegance", fr: "Élégance décontractée" }],
        ],
        text: {
          en: ["A long travertine loggia, linen-covered tables and the sea in every arch. Mare cooks simply and generously: the catch of the morning on the grill, shellfish on ice, tomatoes that taste of summer, bread from our own oven.", "At golden hour the whole terrace turns the colour of honey. Reserve ahead for a table at the edge."],
          fr: ["Une longue loggia de travertin, des tables nappées de lin et la mer dans chaque arche. Mare cuisine simplement et généreusement : la pêche du matin au grill, des coquillages sur glace, des tomates qui ont le goût de l'été, du pain de notre four.", "À l'heure dorée, toute la terrasse prend la couleur du miel. Réservez à l'avance une table au bord."],
        },
      },
      {
        id: "hesperia", photo: "rooftop", gallery: ["rooftop", "exp-private-dinner", "detail-chandelier"],
        name: { en: "Hesperia", fr: "Hesperia" },
        kind: { en: "Rooftop bar", fr: "Bar sur le toit" },
        short: { en: "Signature cocktails, fire bowls and the last light of the day.", fr: "Cocktails signature, braseros et dernière lumière du jour." },
        facts: [
          [{ en: "Offer", fr: "Carte" }, { en: "Cocktails, light plates, sunset menu", fr: "Cocktails, petites assiettes, menu du soleil couchant" }],
          [{ en: "Service", fr: "Service" }, { en: "Daily · 5:00 pm – 12:30 am", fr: "Tous les jours · 17 h – 0 h 30" }],
          [{ en: "Seats", fr: "Couverts" }, { en: "70 guests", fr: "70 places" }],
          [{ en: "Dress", fr: "Tenue" }, { en: "Smart casual", fr: "Chic décontracté" }],
        ],
        text: {
          en: ["Under a bronze pergola strung with light, Hesperia watches the sun go down over the sea. Cocktails are built on citrus, herbs and local spirits; fire bowls keep the terrace warm into the night.", "A short menu of light plates, a late-night selection and a quiet corner for two."],
          fr: ["Sous une pergola de bronze piquée de lumières, Hesperia regarde le soleil descendre sur la mer. Les cocktails reposent sur les agrumes, les herbes et des spiritueux locaux ; des braseros gardent la terrasse chaude jusque tard.", "Une courte carte de petites assiettes, une sélection de fin de soirée et un coin tranquille pour deux."],
        },
      },
    ],
  };
})();
