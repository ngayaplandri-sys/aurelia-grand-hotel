/*
 * SPA, PISCINE ET BIEN-ÊTRE (bilingue). Horaires et surfaces : données de démonstration.
 * La page détaillée (#/wellness/aurelia-spa) présente l'ensemble des espaces.
 */
(function () {
  var A = (window.AURELIA = window.AURELIA || {});
  A.data = A.data || {};

  A.data.wellness = {
    eyebrow: { en: "Wellness", fr: "Bien-être" },
    title: { en: "A sanctuary of *slow* hours.", fr: "Un sanctuaire pour les heures *lentes.*" },
    lead: {
      en: "Water, stone, warmth and silence. The spa of Aurelia Grand is designed to lower the volume of everything.",
      fr: "L'eau, la pierre, la chaleur et le silence. Le spa d'Aurelia Grand est conçu pour baisser le volume de toute chose.",
    },
    detail: {
      id: "aurelia-spa", photo: "spa",
      name: { en: "Aurelia Spa & Pool", fr: "Aurelia Spa & Piscine" },
      kind: { en: "Wellness", fr: "Bien-être" },
      facts: [
        [{ en: "Spa", fr: "Spa" }, { en: "Daily · 8:00 am – 9:00 pm", fr: "Tous les jours · 8 h – 21 h" }],
        [{ en: "Pool", fr: "Piscine" }, { en: "Daily · 7:00 am – sunset", fr: "Tous les jours · 7 h – coucher du soleil" }],
        [{ en: "Fitness", fr: "Fitness" }, { en: "Open 24 hours for guests", fr: "Ouvert 24 h / 24 pour les hôtes" }],
        [{ en: "Treatments", fr: "Soins" }, { en: "By appointment", fr: "Sur rendez-vous" }],
      ],
      text: {
        en: ["The spa unfolds beneath vaulted travertine ceilings and a single skylight. A warm pool, a hammam, an oak sauna and a relaxation lounge make a slow circuit; treatment rooms are lit by candles and the sound of water.", "Outside, the infinity pool opens to the sea. Daybeds, parasols and olive trees keep the afternoon quiet. All spaces are for guests of the hotel."],
        fr: ["Le spa se déploie sous des voûtes de travertin et une unique verrière. Un bassin chaud, un hammam, un sauna en chêne et un salon de détente forment un parcours lent ; les cabines de soin sont éclairées à la bougie et bercées par le bruit de l'eau.", "Dehors, la piscine à débordement s'ouvre sur la mer. Lits de repos, parasols et oliviers préservent le calme de l'après-midi. Tous les espaces sont réservés aux hôtes de l'hôtel."],
      },
      gallery: ["spa", "spa-treatment", "pool", "sauna", "fitness", "relax"],
    },
    items: [
      {
        id: "spa", photo: "spa", focus: [50, 58],
        name: { en: "The Spa", fr: "Le Spa" },
        text: { en: "A vaulted hall of honed travertine around a warm, candlelit pool. Nothing is hurried here.", fr: "Un hall voûté en travertin poli autour d'un bassin chaud, à la lueur des bougies. Rien n'y est pressé." },
      },
      {
        id: "massage", photo: "spa-treatment", focus: [50, 55],
        name: { en: "Massages & Treatments", fr: "Massages & Soins" },
        text: { en: "Signature massages, facials and rituals with warm stones and botanical oils, in rooms lit by candles.", fr: "Massages signature, soins du visage et rituels aux galets chauds et huiles botaniques, dans des cabines éclairées à la bougie." },
      },
      {
        id: "pool", photo: "pool", focus: [60, 55],
        name: { en: "The Infinity Pool", fr: "La piscine à débordement" },
        text: { en: "A long mosaic pool whose edge dissolves into the sea, with linen daybeds and the hotel's terraces behind.", fr: "Un long bassin en mosaïque dont le bord se fond dans la mer, avec lits de repos en lin et les terrasses de l'hôtel en toile de fond." },
      },
      {
        id: "sauna", photo: "sauna", focus: [50, 52],
        name: { en: "Sauna & Hammam", fr: "Sauna & Hammam" },
        text: { en: "An oak sauna, a travertine steam room and cold plunge for a slow thermal circuit.", fr: "Un sauna en chêne, un hammam en travertin et un bassin froid pour un parcours thermique lent." },
      },
      {
        id: "fitness", photo: "fitness", focus: [50, 55],
        name: { en: "Fitness Studio", fr: "Salle de fitness" },
        text: { en: "A bright, quiet studio facing the sea, with minimal equipment, open at all hours.", fr: "Un studio lumineux et calme face à la mer, avec un équipement minimaliste, ouvert à toute heure." },
      },
      {
        id: "relax", photo: "relax", focus: [50, 55],
        name: { en: "Relaxation Lounge", fr: "Salon de détente" },
        text: { en: "Linen daybeds under sheer curtains, a tea service and a bowl of figs. Stay as long as you like.", fr: "Lits de repos en lin sous des voilages, un service de thé et une coupe de figues. Restez aussi longtemps que vous le souhaitez." },
      },
    ],
  };
})();
