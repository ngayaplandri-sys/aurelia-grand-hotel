/*
 * AURELIA GRAND HOTEL & RESORT · DONNÉES DE L'HÔTEL (bilingue EN / FR)
 * ---------------------------------------------------------------------
 * Identité, navigation, coordonnées, libellés d'interface et réglage de la réservation.
 * Les chambres, restaurants, expériences, offres… sont dans les fichiers voisins (rooms.js, dining.js, …).
 * Les photographies sont référencées par leur identifiant : voir data/photos.js.
 *
 * Règles : un texte traduit s'écrit { en: "...", fr: "..." } ; un champ vide ("") masque l'élément correspondant.
 * TOUTES les coordonnées ci-dessous sont FICTIVES (adresses en .example, numéros factices) et signalées comme telles sur le site.
 */
(function () {
  var A = (window.AURELIA = window.AURELIA || {});
  A.data = A.data || {};

  A.data.hotel = {
    // Passer à false quand adresse, téléphone, chambres, offres et avis seront réels et validés.
    demo: true,
    demoNotice: {
      en: "Concept demonstration. The hotel, its address, contacts, figures, offers and guest quotes are fictional placeholders. Photographs are AI-generated and do not depict a real property.",
      fr: "Démonstration de concept. L'hôtel, son adresse, ses contacts, ses chiffres, ses offres et ses témoignages sont fictifs. Les photographies sont générées par intelligence artificielle et ne représentent pas un établissement réel.",
    },

    brand: {
      name: "AURELIA GRAND",
      full: "Aurelia Grand Hotel & Resort",
      tagline: { en: "An extraordinary stay.", fr: "Un séjour extraordinaire." },
      year: 2026,
    },

    // Navigation principale : chaque lien mène à une section réelle de la page.
    nav: [
      { id: "stay", href: "#stay", label: { en: "Stay", fr: "Séjour" } },
      { id: "dining", href: "#dining", label: { en: "Dining", fr: "Tables" } },
      { id: "wellness", href: "#wellness", label: { en: "Wellness", fr: "Bien-être" } },
      { id: "experiences", href: "#experiences", label: { en: "Experiences", fr: "Expériences" } },
      { id: "gallery", href: "#gallery", label: { en: "Gallery", fr: "Galerie" } },
      { id: "offers", href: "#offers", label: { en: "Offers", fr: "Offres" } },
      { id: "contact", href: "#contact", label: { en: "Contact", fr: "Contact" } },
    ],

    // Boutons réutilisés partout : un seul libellé par intention.
    actions: {
      book: { label: { en: "Book now", fr: "Réserver" }, href: "#book" },
      bookStay: { label: { en: "Book your stay", fr: "Réserver votre séjour" }, href: "#book" },
      discover: { label: { en: "Discover the hotel", fr: "Découvrir l'hôtel" }, href: "#intro" },
      rooms: { label: { en: "Explore our rooms", fr: "Découvrir nos chambres" }, href: "#stay" },
      dining: { label: { en: "Explore dining", fr: "Découvrir nos tables" }, href: "#/dining/aurelia-table" },
      wellness: { label: { en: "Discover wellness", fr: "Découvrir le bien-être" }, href: "#/wellness/aurelia-spa" },
    },

    // Coordonnées FICTIVES (domaine .example, numéros factices).
    contact: {
      addressLines: ["Route du Promontoire 1", "Cap Aurélia", "00000 Aurélia"],
      addressNote: { en: "Fictional address", fr: "Adresse fictive" },
      phone: "+00 000 000 000",
      phoneHref: "",           // ex. "tel:+33123456789" quand le numéro est réel
      email: "reservations@aurelia-grand.example",
      emailHref: "mailto:reservations@aurelia-grand.example",
      hours: [
        [{ en: "Reception", fr: "Réception" }, { en: "Open 24 hours", fr: "Ouverte 24 h / 24" }],
        [{ en: "Check-in", fr: "Arrivée" }, { en: "From 3:00 pm", fr: "À partir de 15 h" }],
        [{ en: "Check-out", fr: "Départ" }, { en: "Until 12:00 noon", fr: "Jusqu'à 12 h" }],
        [{ en: "Reservations desk", fr: "Service réservations" }, { en: "Daily, 8:00 am – 8:00 pm", fr: "Tous les jours, 8 h – 20 h" }],
      ],
      access: {
        en: "By car, 25 minutes from the old town along the coast road. Valet parking and electric-vehicle charging at the main entrance. Arrivals by sea are welcomed at our private jetty (on request).",
        fr: "En voiture, à 25 minutes du centre ancien par la route de la corniche. Voiturier et bornes de recharge électrique à l'entrée principale. Les arrivées par la mer sont accueillies à notre ponton privé (sur demande).",
      },
      airport: {
        name: { en: "Aurelia International Airport (fictional, code AUR)", fr: "Aéroport international d'Aurélia (fictif, code AUR)" },
        text: { en: "35 minutes by car. Private transfers and a helipad are available on request.", fr: "À 35 minutes en voiture. Transferts privés et héliport disponibles sur demande." },
      },
      transport: {
        en: "Complimentary shuttle to the old town (4 departures a day, to be confirmed). Chauffeur service and taxi rank at the hotel entrance.",
        fr: "Navette offerte vers le centre ancien (4 départs par jour, à confirmer). Service de chauffeur et station de taxis à l'entrée de l'hôtel.",
      },
    },

    // Réseaux : liens génériques vers les plateformes (aucun compte inventé). À remplacer par les comptes de l'hôtel.
    social: [
      { name: "Instagram", icon: "instagram", url: "https://www.instagram.com/" },
      { name: "Facebook", icon: "facebook", url: "https://www.facebook.com/" },
      { name: "LinkedIn", icon: "linkedin", url: "https://www.linkedin.com/" },
    ],

    /*
     * RÉSERVATION
     * Tant que engineUrl est vide, le formulaire fonctionne en mode démonstration : il ne vérifie AUCUNE disponibilité,
     * affiche un récapitulatif et prépare un e-mail de demande.
     * Pour brancher un vrai moteur : renseignez engineUrl (ex. "https://book.exemple.com/aurelia") et engineParams,
     * où chaque valeur peut contenir {arrival} {departure} {adults} {children} {rooms} {promo} {room} (dates au format AAAA-MM-JJ).
     */
    booking: {
      engineUrl: "",
      engineParams: { checkin: "{arrival}", checkout: "{departure}", adults: "{adults}", children: "{children}", rooms: "{rooms}", promo: "{promo}", room: "{room}" },
      openInNewTab: false,
      requestEmail: "reservations@aurelia-grand.example",
      maxNights: 30,
      maxRooms: 5,
      maxAdultsPerRoom: 3,
      maxChildrenPerRoom: 2,
    },

    // Libellés d'interface
    ui: {
      skip: { en: "Skip to content", fr: "Aller au contenu" },
      skipTour: { en: "Skip the visit", fr: "Passer la visite" },
      tourLabel: { en: "A visit of Aurelia Grand, in photographs", fr: "Une visite d'Aurelia Grand, en photographies" },
      tourStepsTitle: { en: "The visit, step by step", fr: "La visite, étape par étape" },
      scroll: { en: "Scroll", fr: "Défiler" },
      menuOpen: { en: "Open menu", fr: "Ouvrir le menu" },
      menuClose: { en: "Close menu", fr: "Fermer le menu" },
      language: { en: "Language", fr: "Langue" },
      mainNav: { en: "Main navigation", fr: "Navigation principale" },
      footerNav: { en: "Footer navigation", fr: "Navigation du pied de page" },
      discover: { en: "Discover", fr: "Découvrir" },
      bookThis: { en: "Book this room", fr: "Réserver cette chambre" },
      bookOffer: { en: "Request this offer", fr: "Demander cette offre" },
      enquire: { en: "Enquire", fr: "Se renseigner" },
      reserveTable: { en: "Reserve a table", fr: "Réserver une table" },
      back: { en: "Back to the hotel", fr: "Retour à l'hôtel" },
      close: { en: "Close", fr: "Fermer" },
      next: { en: "Next", fr: "Suivant" },
      prev: { en: "Previous", fr: "Précédent" },
      view: { en: "View", fr: "Voir" },
      photo: { en: "Photograph", fr: "Photographie" },
      of: { en: "of", fr: "sur" },
      demo: { en: "Demo", fr: "Démo" },
      rateOnRequest: { en: "Rate on request", fr: "Tarif sur demande" },
      size: { en: "Size", fr: "Superficie" },
      sleeps: { en: "Sleeps", fr: "Capacité" },
      view_: { en: "View", fr: "Vue" },
      amenities: { en: "Amenities", fr: "Équipements" },
      guests: { en: "guests", fr: "personnes" },
      alsoAt: { en: "Also at Aurelia Grand", fr: "Aussi à Aurelia Grand" },
      conditions: { en: "Conditions", fr: "Conditions" },
      allPhotos: { en: "All photographs", fr: "Toutes les photographies" },
      openPhoto: { en: "Open photograph", fr: "Ouvrir la photographie" },
      viewer: { en: "Photograph viewer", fr: "Visionneuse de photographies" },
      filters: { en: "Gallery categories", fr: "Catégories de la galerie" },
      all: { en: "All", fr: "Tout" },
      demoContent: { en: "Demo content", fr: "Contenu de démonstration" },
      conceptTag: { en: "Concept · AI-generated photographs", fr: "Concept · photographies générées par IA" },
      builtWith: { en: "Photographs generated with AI for this concept — not a real property.", fr: "Photographies générées par IA pour ce concept — établissement fictif." },
    },
  };
})();
