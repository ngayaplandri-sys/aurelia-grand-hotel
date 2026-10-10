/*
 * EXPÉRIENCES, OFFRES, AVIS, INTRODUCTION (bilingue).
 * Les offres ne mentionnent AUCUN prix ni remise : « Tarif sur demande » tant que l'hôtel n'a pas validé ses conditions.
 * Les témoignages sont des exemples de démonstration, signalés comme tels sur le site : remplacez-les par de vrais avis vérifiés.
 */
(function () {
  var A = (window.AURELIA = window.AURELIA || {});
  A.data = A.data || {};

  A.data.intro = {
    eyebrow: { en: "The Hotel", fr: "L'hôtel" },
    title: { en: "More than a *stay.*", fr: "Plus qu'un *séjour.*" },
    paragraphs: [
      {
        en: "Aurelia Grand rises from a quiet headland as a house of stone, bronze and light. Five terraces of honed travertine step toward the sea; every arch frames a view, every room turns toward the horizon.",
        fr: "Aurelia Grand s'élève sur un promontoire silencieux, maison de pierre, de bronze et de lumière. Cinq terrasses de travertin poli descendent vers la mer ; chaque arche cadre un paysage, chaque chambre se tourne vers l'horizon.",
      },
      {
        en: "Here, luxury makes no noise. It is the weight of a heavy door, the warmth of a lamp at dusk, a table laid before you ask. Time slows. Attention sharpens.",
        fr: "Ici, le luxe ne fait pas de bruit. C'est le poids d'une porte massive, la chaleur d'une lampe au crépuscule, une table dressée avant que vous ne la demandiez. Le temps ralentit. L'attention s'aiguise.",
      },
    ],
    pull: { en: "A house of stone, bronze and light.", fr: "Une maison de pierre, de bronze et de lumière." },
    facts: [
      { value: "112", label: { en: "Rooms & suites", fr: "Chambres & suites" } },
      { value: "3", label: { en: "Tables & bars", fr: "Tables & bars" } },
      { value: "1 800 m²", label: { en: "Spa & pool", fr: "Spa & piscine" } },
      { value: "5", label: { en: "Terraces to the sea", fr: "Terrasses sur la mer" } },
    ],
    factsNote: { en: "Concept figures", fr: "Chiffres de concept" },
    cta: { en: "Explore our rooms", fr: "Découvrir nos chambres" },
    photos: { main: "intro-aerial", side: "intro-loggia" },
  };

  A.data.experiences = {
    eyebrow: { en: "Experiences", fr: "Expériences" },
    title: { en: "Days composed, not *scheduled.*", fr: "Des journées composées, pas *planifiées.*" },
    lead: {
      en: "Tell us what you would like to feel. We will arrange the rest, quietly, with the people who know this coast best.",
      fr: "Dites-nous ce que vous aimeriez ressentir. Nous organisons le reste, discrètement, avec ceux qui connaissent le mieux cette côte.",
    },
    enquire: { en: "Enquire", fr: "Se renseigner" },
    items: [
      {
        id: "private-dinner", photo: "exp-private-dinner", size: "feature",
        name: { en: "Private Dinner", fr: "Dîner privé" },
        text: { en: "A table of your own, set where you choose: the terrace at blue hour, the cellar by candlelight, the garden under the olive trees.", fr: "Une table rien qu'à vous, dressée où vous le souhaitez : la terrasse à l'heure bleue, la cave aux chandelles, le jardin sous les oliviers." },
      },
      {
        id: "excursions", photo: "exp-excursion", size: "tall",
        name: { en: "Excursions", fr: "Excursions" },
        text: { en: "By varnished wooden boat to hidden coves; on foot through olive terraces; by car to hilltop villages, always with a local guide.", fr: "En bateau de bois verni vers des criques secrètes ; à pied à travers les restanques d'oliviers ; en voiture vers les villages perchés, toujours avec un guide local." },
      },
      {
        id: "culture", photo: "exp-culture", size: "square",
        name: { en: "Cultural Experiences", fr: "Expériences culturelles" },
        text: { en: "Meet potters, painters and stonemasons in their studios, and visit museums before they open.", fr: "Rencontrez potiers, peintres et tailleurs de pierre dans leurs ateliers, et visitez des musées avant leur ouverture." },
      },
      {
        id: "events", photo: "exp-events", size: "wide",
        name: { en: "Events", fr: "Événements" },
        text: { en: "Weddings, anniversaries and private gatherings on our terraces, with a dedicated events team.", fr: "Mariages, anniversaires et réceptions privées sur nos terrasses, avec une équipe événementielle dédiée." },
      },
      {
        id: "gastronomy", photo: "exp-gastro", size: "tall",
        name: { en: "Gastronomic Experiences", fr: "Expériences gastronomiques" },
        text: { en: "Cellar tastings, cooking sessions with our chef and market visits at dawn.", fr: "Dégustations en cave, cours de cuisine avec notre cheffe et visites du marché à l'aube." },
      },
      {
        id: "relaxation", photo: "exp-relax", size: "wide",
        name: { en: "Moments of Relaxation", fr: "Moments de détente" },
        text: { en: "Sunrise yoga on the terrace, guided breathing, sound baths and slow afternoons at the infinity edge.", fr: "Yoga au lever du soleil sur la terrasse, respiration guidée, bains sonores et longs après-midis au bord de la piscine." },
      },
      {
        id: "services", photo: "exp-service", size: "square",
        name: { en: "Personalised Services", fr: "Services personnalisés" },
        text: { en: "A butler, a chauffeur, a private shopper: ask, and we will arrange it with discretion.", fr: "Un majordome, un chauffeur, un personal shopper : demandez, nous organisons tout avec discrétion." },
      },
    ],
  };

  A.data.offers = {
    eyebrow: { en: "Special Offers", fr: "Offres spéciales" },
    title: { en: "Reasons to stay a little *longer.*", fr: "Des raisons de rester un peu *plus longtemps.*" },
    lead: {
      en: "Five ways to shape a stay. Terms and rates are confirmed by our reservations team when you send your request.",
      fr: "Cinq façons de composer un séjour. Les conditions et les tarifs sont confirmés par notre équipe de réservation lorsque vous envoyez votre demande.",
    },
    note: { en: "Sample offers. No price or discount is shown: conditions are placeholders until validated by the hotel.", fr: "Offres d'exemple. Aucun prix ni remise n'est affiché : les conditions sont des éléments provisoires, à valider par l'hôtel." },
    items: [
      {
        id: "romantic-escape", photo: "offer-romantic", focus: [50, 45],
        name: { en: "Romantic Escape", fr: "Escapade romantique" },
        text: { en: "Two nights in a Junior Suite or above, a private candlelit dinner and a couples' ritual at the spa.", fr: "Deux nuits en Junior Suite ou supérieur, un dîner privé aux chandelles et un rituel en duo au spa." },
        conditions: { en: ["Minimum two nights", "Subject to availability", "Rate on request"], fr: ["Deux nuits minimum", "Selon disponibilités", "Tarif sur demande"] },
      },
      {
        id: "weekend-retreat", photo: "pool", focus: [60, 55],
        name: { en: "Weekend Retreat", fr: "Week-end de retraite" },
        text: { en: "Friday to Sunday with late check-out, brunch at Mare and unlimited spa access.", fr: "Du vendredi au dimanche avec départ tardif, brunch chez Mare et accès illimité au spa." },
        conditions: { en: ["Friday to Sunday stays", "Subject to availability", "Rate on request"], fr: ["Séjours du vendredi au dimanche", "Selon disponibilités", "Tarif sur demande"] },
      },
      {
        id: "suite-experience", photo: "suite", focus: [60, 50],
        name: { en: "Suite Experience", fr: "Expérience Suite" },
        text: { en: "A suite with breakfast on your terrace, evening turndown and a welcome bottle from a local estate.", fr: "Une suite avec petit-déjeuner sur votre terrasse, service du soir et une bouteille de bienvenue d'un domaine local." },
        conditions: { en: ["Executive Suite or above", "Subject to availability", "Rate on request"], fr: ["Suite Executive ou supérieure", "Selon disponibilités", "Tarif sur demande"] },
      },
      {
        id: "wellness-stay", photo: "spa-treatment", focus: [50, 55],
        name: { en: "Wellness Stay", fr: "Séjour bien-être" },
        text: { en: "Three nights with a daily treatment, the full thermal circuit and a lighter menu at Mare.", fr: "Trois nuits avec un soin par jour, le parcours thermique complet et un menu allégé chez Mare." },
        conditions: { en: ["Minimum three nights", "Treatments by appointment", "Rate on request"], fr: ["Trois nuits minimum", "Soins sur rendez-vous", "Tarif sur demande"] },
      },
      {
        id: "extended-stay", photo: "view", focus: [52, 56],
        name: { en: "Extended Stay", fr: "Long séjour" },
        text: { en: "Stay longer and receive more: laundry, a dinner at Aurelia Table and a private excursion.", fr: "Restez plus longtemps et recevez davantage : blanchisserie, un dîner chez Aurelia Table et une excursion privée." },
        conditions: { en: ["From five nights", "Subject to availability", "Rate on request"], fr: ["À partir de cinq nuits", "Selon disponibilités", "Tarif sur demande"] },
      },
    ],
  };

  A.data.reviews = {
    eyebrow: { en: "Guest Voices", fr: "Voix de nos hôtes" },
    title: { en: "What guests *remember.*", fr: "Ce que nos hôtes *retiennent.*" },
    demoTag: { en: "Sample content · replace with verified guest reviews", fr: "Contenu d'exemple · à remplacer par de vrais avis vérifiés" },
    items: [
      { quote: { en: "We arrived at dusk and the whole building seemed to glow. We did not want to leave.", fr: "Nous sommes arrivés au crépuscule et tout le bâtiment semblait rayonner. Nous ne voulions plus partir." }, who: { en: "Sample guest · Couple, four nights", fr: "Hôte fictif · Couple, quatre nuits" } },
      { quote: { en: "The calm is what stays with you. Every detail has been considered and nothing is announced.", fr: "Ce qui reste, c'est le calme. Chaque détail a été pensé, et rien n'est annoncé." }, who: { en: "Sample guest · Solo traveller", fr: "Hôte fictif · Voyageur seul" } },
      { quote: { en: "Breakfast on the terrace, a swim, a long lunch at Mare. An effortless day, repeated.", fr: "Petit-déjeuner sur la terrasse, une baignade, un long déjeuner chez Mare. Une journée sans effort, répétée." }, who: { en: "Sample guest · Family", fr: "Hôte fictif · Famille" } },
      { quote: { en: "Service that is attentive without ever being visible.", fr: "Un service attentif sans jamais être visible." }, who: { en: "Sample guest · Business stay", fr: "Hôte fictif · Séjour d'affaires" } },
    ],
  };
})();
