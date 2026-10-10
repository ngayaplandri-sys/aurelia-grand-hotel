/*
 * RÉSERVATION, CONTACT, GALERIE, PAGES LÉGALES (bilingue).
 * Le moteur de réservation se règle dans data/hotel.js (booking.engineUrl). Ici : textes, champs et messages d'erreur.
 */
(function () {
  var A = (window.AURELIA = window.AURELIA || {});
  A.data = A.data || {};

  A.data.booking = {
    eyebrow: { en: "Reservations", fr: "Réservations" },
    title: { en: "Begin your *stay.*", fr: "Commencez votre *séjour.*" },
    lead: {
      en: "Choose your dates and tell us who is travelling. We will take care of the rest.",
      fr: "Choisissez vos dates et dites-nous qui voyage. Nous nous occupons du reste.",
    },
    demoNotice: {
      en: "Demonstration mode: no booking engine is connected, so availability is not checked and nothing is reserved. Your request is summarised and can be sent to the reservations team.",
      fr: "Mode démonstration : aucun moteur de réservation n'est connecté, la disponibilité n'est donc pas vérifiée et rien n'est réservé. Votre demande est récapitulée et peut être envoyée à l'équipe de réservation.",
    },
    fields: {
      arrival: { en: "Arrival", fr: "Arrivée" },
      departure: { en: "Departure", fr: "Départ" },
      adults: { en: "Adults", fr: "Adultes" },
      children: { en: "Children", fr: "Enfants" },
      rooms: { en: "Rooms", fr: "Chambres" },
      roomType: { en: "Room type", fr: "Type de chambre" },
      promo: { en: "Promotional code (optional)", fr: "Code promotionnel (facultatif)" },
      anyRoom: { en: "Any room or suite", fr: "Toute chambre ou suite" },
      nights: { en: "night", fr: "nuit" },
      nightsPlural: { en: "nights", fr: "nuits" },
      child: { en: "child", fr: "enfant" },
      children_: { en: "children", fr: "enfants" },
      adult: { en: "adult", fr: "adulte" },
      adults_: { en: "adults", fr: "adultes" },
      room: { en: "room", fr: "chambre" },
      rooms_: { en: "rooms", fr: "chambres" },
      offer: { en: "Offer", fr: "Offre" },
    },
    submit: { en: "Check availability", fr: "Vérifier la disponibilité" },
    errors: {
      arrivalRequired: { en: "Please choose your arrival date.", fr: "Veuillez choisir votre date d'arrivée." },
      arrivalPast: { en: "The arrival date cannot be in the past.", fr: "La date d'arrivée ne peut pas être passée." },
      departureRequired: { en: "Please choose your departure date.", fr: "Veuillez choisir votre date de départ." },
      departureOrder: { en: "The departure must be after the arrival (at least one night).", fr: "Le départ doit être postérieur à l'arrivée (au moins une nuit)." },
      tooLong: { en: "For stays of more than {n} nights, please contact the reservations team.", fr: "Pour un séjour de plus de {n} nuits, veuillez contacter l'équipe de réservation." },
      adults: { en: "Each room needs at least one adult.", fr: "Chaque chambre nécessite au moins un adulte." },
      capacity: { en: "This is more guests than the selected rooms can accommodate. Please add a room.", fr: "Ce nombre de personnes dépasse la capacité des chambres choisies. Ajoutez une chambre." },
      promo: { en: "The code may only contain letters, numbers and hyphens.", fr: "Le code ne peut contenir que des lettres, des chiffres et des tirets." },
      summary: { en: "Please correct the highlighted fields.", fr: "Veuillez corriger les champs signalés." },
    },
    result: {
      title: { en: "Your stay request", fr: "Votre demande de séjour" },
      demoLine: { en: "Demonstration mode: availability has not been checked and nothing has been reserved.", fr: "Mode démonstration : la disponibilité n'a pas été vérifiée et rien n'a été réservé." },
      send: { en: "Send this request by email", fr: "Envoyer cette demande par e-mail" },
      edit: { en: "Edit my dates", fr: "Modifier mes dates" },
      redirecting: { en: "Redirecting you to the booking engine…", fr: "Redirection vers le moteur de réservation…" },
      mailSubject: { en: "Stay request — Aurelia Grand (demonstration)", fr: "Demande de séjour — Aurelia Grand (démonstration)" },
      mailIntro: { en: "Hello, I would like to request the following stay:", fr: "Bonjour, je souhaite demander le séjour suivant :" },
      mailOutro: { en: "Thank you. Please confirm availability and rates.", fr: "Merci de me confirmer disponibilités et tarifs." },
    },
    assurances: [
      { en: "Free cancellation window to be confirmed by the hotel", fr: "Fenêtre d'annulation gratuite à confirmer par l'hôtel" },
      { en: "No payment taken on this form", fr: "Aucun paiement n'est demandé sur ce formulaire" },
      { en: "Reply from our team within one working day (demo)", fr: "Réponse de notre équipe sous un jour ouvré (démo)" },
    ],
    photo: "view",
  };

  A.data.contactSection = {
    eyebrow: { en: "Location & Contact", fr: "Accès & Contact" },
    title: { en: "Find *us.*", fr: "Nous *trouver.*" },
    demoBadge: { en: "Demo data", fr: "Données de démonstration" },
    demoText: { en: "Every address, number and timing below is a fictional placeholder.", fr: "Toutes les adresses, tous les numéros et horaires ci-dessous sont fictifs." },
    labels: {
      address: { en: "Address", fr: "Adresse" },
      phone: { en: "Telephone", fr: "Téléphone" },
      email: { en: "Email", fr: "E-mail" },
      hours: { en: "Hours", fr: "Horaires" },
      access: { en: "Getting here", fr: "Accès" },
      airport: { en: "Nearest airport", fr: "Aéroport le plus proche" },
      transport: { en: "Transport", fr: "Transports" },
    },
    map: {
      alt: { en: "Illustrative map: the hotel on its headland, the coast road and the airport", fr: "Carte illustrative : l'hôtel sur son promontoire, la route de la corniche et l'aéroport" },
      hotel: { en: "Aurelia Grand", fr: "Aurelia Grand" },
      airport: { en: "Airport (35 min)", fr: "Aéroport (35 min)" },
      oldTown: { en: "Old town (25 min)", fr: "Centre ancien (25 min)" },
      note: { en: "Illustrative map · fictional location", fr: "Carte illustrative · lieu fictif" },
    },
    form: {
      title: { en: "Write to us", fr: "Écrivez-nous" },
      subjects: [
        { id: "stay", label: { en: "A stay or a room", fr: "Un séjour ou une chambre" } },
        { id: "dining", label: { en: "Dining reservation", fr: "Réservation d'une table" } },
        { id: "wellness", label: { en: "Spa & wellness", fr: "Spa & bien-être" } },
        { id: "experiences", label: { en: "An experience or an event", fr: "Une expérience ou un événement" } },
        { id: "other", label: { en: "Something else", fr: "Autre demande" } },
      ],
      name: { en: "Full name", fr: "Nom complet" },
      email: { en: "Email", fr: "E-mail" },
      phone: { en: "Telephone (optional)", fr: "Téléphone (facultatif)" },
      subject: { en: "Subject", fr: "Objet" },
      message: { en: "Your message", fr: "Votre message" },
      consent: { en: "I agree that my details are used to answer my request.", fr: "J'accepte que mes informations soient utilisées pour répondre à ma demande." },
      submit: { en: "Send message", fr: "Envoyer le message" },
      errors: {
        name: { en: "Please enter your name.", fr: "Veuillez indiquer votre nom." },
        email: { en: "Please enter a valid email address.", fr: "Veuillez saisir une adresse e-mail valide." },
        phone: { en: "This telephone number looks too short.", fr: "Ce numéro de téléphone semble trop court." },
        message: { en: "Please write a few words (at least 10 characters).", fr: "Merci d'écrire quelques mots (10 caractères au minimum)." },
        consent: { en: "Please tick the box to continue.", fr: "Veuillez cocher la case pour continuer." },
        summary: { en: "Please correct the highlighted fields.", fr: "Veuillez corriger les champs signalés." },
      },
      demo: {
        en: "Demonstration mode: your message has not been sent. You can send it from your own email application with the button below.",
        fr: "Mode démonstration : votre message n'a pas été envoyé. Vous pouvez l'envoyer depuis votre messagerie avec le bouton ci-dessous.",
      },
      mailButton: { en: "Open my email application", fr: "Ouvrir ma messagerie" },
    },
  };

  A.data.footer = {
    line: { en: "A house of stone, bronze and light, on the edge of the sea.", fr: "Une maison de pierre, de bronze et de lumière, au bord de la mer." },
    newsletter: {
      title: { en: "Letters from the headland", fr: "Lettres du promontoire" },
      text: { en: "Seasonal news, quiet invitations and the occasional recipe. Never more than once a month.", fr: "Nouvelles de saison, invitations discrètes et parfois une recette. Jamais plus d'une fois par mois." },
      label: { en: "Email address", fr: "Adresse e-mail" },
      placeholder: { en: "you@example.com", fr: "vous@exemple.com" },
      submit: { en: "Subscribe", fr: "S'abonner" },
      error: { en: "Please enter a valid email address.", fr: "Veuillez saisir une adresse e-mail valide." },
      demo: { en: "Demonstration mode: nothing has been stored and no email will be sent.", fr: "Mode démonstration : rien n'a été enregistré et aucun e-mail ne sera envoyé." },
    },
    columns: {
      explore: { en: "Explore", fr: "Explorer" },
      visit: { en: "Visit", fr: "Visiter" },
      follow: { en: "Follow", fr: "Suivre" },
    },
    legal: [
      { id: "privacy", label: { en: "Privacy policy", fr: "Politique de confidentialité" } },
      { id: "legal-notice", label: { en: "Legal notice", fr: "Mentions légales" } },
      { id: "booking-terms", label: { en: "Booking conditions", fr: "Conditions de réservation" } },
    ],
    rights: { en: "All rights reserved.", fr: "Tous droits réservés." },
  };

  /* Pages légales : TEXTES MODÈLES à faire valider par un juriste avant toute mise en ligne réelle. */
  A.data.legal = {
    template: {
      en: "Template text for a fictional concept. It must be replaced by documents validated by your legal adviser before any real use.",
      fr: "Texte modèle pour un concept fictif. Il doit être remplacé par des documents validés par votre conseil juridique avant tout usage réel.",
    },
    pages: {
      "privacy": {
        title: { en: "Privacy policy", fr: "Politique de confidentialité" },
        sections: [
          { h: { en: "What we collect", fr: "Ce que nous collectons" }, p: { en: "When you use the reservation, contact or newsletter forms, we collect only the details you enter (name, email, telephone, dates, message). In this demonstration, no data is transmitted or stored.", fr: "Lorsque vous utilisez les formulaires de réservation, de contact ou de lettre d'information, nous ne collectons que les informations que vous saisissez (nom, e-mail, téléphone, dates, message). Dans cette démonstration, aucune donnée n'est transmise ni conservée." } },
          { h: { en: "How we use it", fr: "Comment nous l'utilisons" }, p: { en: "Details are used to answer your request, prepare your stay and, if you subscribed, send the newsletter. They are never sold.", fr: "Les informations servent à répondre à votre demande, préparer votre séjour et, si vous vous êtes abonné, envoyer la lettre d'information. Elles ne sont jamais vendues." } },
          { h: { en: "Your rights", fr: "Vos droits" }, p: { en: "You may ask to access, correct or delete your data at any time by writing to the address in the legal notice.", fr: "Vous pouvez demander à tout moment l'accès, la rectification ou la suppression de vos données en écrivant à l'adresse indiquée dans les mentions légales." } },
          { h: { en: "Cookies", fr: "Cookies" }, p: { en: "This site sets no tracking cookies. Your language choice is saved in your browser only.", fr: "Ce site ne dépose aucun cookie de suivi. Votre choix de langue est conservé uniquement dans votre navigateur." } },
        ],
      },
      "legal-notice": {
        title: { en: "Legal notice", fr: "Mentions légales" },
        sections: [
          { h: { en: "Publisher", fr: "Éditeur" }, p: { en: "Aurelia Grand Hotel & Resort is a fictional hotel created for a design concept. Company name, registration number, address and publication director are to be completed.", fr: "Aurelia Grand Hotel & Resort est un hôtel fictif créé pour un concept de design. Raison sociale, numéro d'immatriculation, adresse et directeur de la publication sont à compléter." } },
          { h: { en: "Contact", fr: "Contact" }, p: { en: "reservations@aurelia-grand.example (fictional address).", fr: "reservations@aurelia-grand.example (adresse fictive)." } },
          { h: { en: "Images", fr: "Images" }, p: { en: "All photographs were generated with artificial intelligence for this concept. They do not depict a real property. Replace them with your own photography before publication.", fr: "Toutes les photographies ont été générées par intelligence artificielle pour ce concept. Elles ne représentent pas un établissement réel. Remplacez-les par vos propres photographies avant publication." } },
          { h: { en: "Hosting", fr: "Hébergement" }, p: { en: "To be completed with your hosting provider's details.", fr: "À compléter avec les informations de votre hébergeur." } },
        ],
      },
      "booking-terms": {
        title: { en: "Booking conditions", fr: "Conditions de réservation" },
        sections: [
          { h: { en: "Requests and confirmation", fr: "Demandes et confirmation" }, p: { en: "A request sent through this site is not a confirmed booking. A stay is confirmed only when the hotel replies in writing with the rate, the conditions and a reference.", fr: "Une demande envoyée via ce site n'est pas une réservation confirmée. Un séjour n'est confirmé que lorsque l'hôtel répond par écrit avec le tarif, les conditions et une référence." } },
          { h: { en: "Arrival and departure", fr: "Arrivée et départ" }, p: { en: "Check-in from 3:00 pm; check-out until 12:00 noon. Early arrival and late departure on request, subject to availability.", fr: "Arrivée à partir de 15 h ; départ jusqu'à 12 h. Arrivée anticipée et départ tardif sur demande, selon disponibilités." } },
          { h: { en: "Cancellation", fr: "Annulation" }, p: { en: "Cancellation and prepayment terms are to be defined by the hotel and will appear in each confirmation.", fr: "Les conditions d'annulation et de prépaiement sont à définir par l'hôtel et figureront dans chaque confirmation." } },
          { h: { en: "Rates", fr: "Tarifs" }, p: { en: "No rate is published in this demonstration. Rates are communicated on request.", fr: "Aucun tarif n'est publié dans cette démonstration. Les tarifs sont communiqués sur demande." } },
        ],
      },
    },
  };
})();
