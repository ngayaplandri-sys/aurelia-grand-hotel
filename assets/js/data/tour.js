/*
 * LA VISITE · CINEMATIC IMAGE SCROLL STORYTELLING
 * ------------------------------------------------
 * Storyboard en 13 plans photographiques (aucune vidéo). Chaque plan est une photographie ; le défilement fait évoluer
 * le cadrage, déclenche la transition vers le plan suivant et révèle les textes.
 *
 * Unité de défilement : « vh » = une hauteur d'écran (100 = un écran). Sur mobile, toutes les durées sont multipliées par mobileScale.
 *
 * scene.photo     identifiant de la photographie (data/photos.js)
 * scene.vh        durée du plan, en vh
 * scene.enter     transition d'entrée depuis le plan précédent, centrée sur la frontière entre les deux plans :
 *                   type : fade | doors | dolly | frame | walk | window | curtain | iris | wipe | lift
 *                   vh   : durée de la transition ; d / m : réglages propres à l'ordinateur / au mobile
 * scene.cam       cadrage au fil du plan : [[u, zoom, x%, y%], ...]  (u de 0 à 1 ; x, y = point de la photo placé au centre ;
 *                 zoom 1 = la photo remplit l'écran ; zoom 0 = la photo entière dans la largeur, en bandeau de cinéma)
 * scene.layers    calques d'avant-plan (photographies à fond transparent) qui bougent plus vite que la photographie :
 *                 [{ photo, pos: [x%, y%] (cadrage), origin: [x%, y%] (point fixe du zoom), opacity, cam: { d: [[u, zoom, dx%, dy%], ...], m: [...] } }]
 * scene.veil      voile sombre au fil du plan : [[u, opacité], ...] (passage d'une photo sombre à une photo lumineuse)
 * chapter.from/to début et fin du texte : "idDuPlan@repère" avec repère = fraction du plan (0 à 1), land (la photo vient d'arriver), leave (la transition suivante commence),
 *                 suivi d'un décalage facultatif en vh : "entrance@land-6", "facade@0+56", "dining@leave+8"
 * chapter.layout  hero | quote | left | right | center | finale
 * chapter.shade   bottom | left | right | center | none : dégradé de lisibilité derrière le texte
 */
(function () {
  var A = (window.AURELIA = window.AURELIA || {});
  A.data = A.data || {};

  A.data.tour = {
    mobileScale: 0.8,

    scenes: [
      {
        id: "facade", photo: "facade", vh: 175, label: { en: "The Façade", fr: "La façade" },
        cam: { d: [[0, 1.0, 50, 56], [1, 1.2, 50, 58]], m: [[0, 1.0, 50, 60], [1, 1.16, 50, 52]] },
      },
      {
        id: "entrance", photo: "entrance", vh: 115, label: { en: "The Entrance", fr: "L'entrée" },
        enter: { type: "doors", vh: 75, d: { origin: [50, 52] }, m: { origin: [50, 52] } },
        cam: { d: [[0, 1.0, 50, 52], [1, 1.14, 52, 56]], m: [[0, 1.0, 50, 55], [1, 1.12, 52, 58]] },
      },
      {
        id: "lobby", photo: "lobby", vh: 125, label: { en: "The Lobby", fr: "Le lobby" },
        enter: { type: "dolly", vh: 85, d: { band: true, origin: [50, 48] }, m: { origin: [50, 50] } },
        cam: { d: [[0, 0, 50, 46], [0.42, 1.0, 50, 46], [1, 1.32, 56, 46]], m: [[0, 1.0, 50, 62], [1, 1.1, 50, 36]] },
      },
      {
        id: "reception", photo: "reception", vh: 110, label: { en: "Reception", fr: "La réception" },
        enter: { type: "frame", vh: 75, d: { inset: [11, 5, 11, 42] }, m: { inset: [9, 6, 36, 6] } },
        cam: { d: [[0, 1.12, 56, 50], [1, 1.0, 50, 50]], m: [[0, 1.14, 60, 50], [1, 1.02, 52, 50]] },
      },
      {
        id: "corridor", photo: "corridor", vh: 65, label: { en: "The Corridor", fr: "Le couloir" },
        enter: { type: "walk", vh: 60, d: { origin: [50, 48] }, m: { origin: [50, 46] } },
        cam: { d: [[0, 1.0, 50, 48], [1, 1.4, 50, 47]], m: [[0, 1.0, 50, 48], [1, 1.36, 50, 46]] },
      },
      {
        id: "suite", photo: "suite", vh: 120, label: { en: "The Suite", fr: "La suite" },
        enter: { type: "fade", vh: 70, d: { push: 1.14 }, m: { push: 1.12 } },
        cam: { d: [[0, 1.0, 50, 50], [0.45, 1.14, 40, 58], [1, 1.32, 80, 48]], m: [[0, 1.0, 40, 55], [0.5, 1.1, 44, 62], [1, 1.2, 70, 46]] },
      },
      {
        id: "view", photo: "view", vh: 115, label: { en: "The View", fr: "La vue" },
        enter: { type: "window", vh: 85, d: { rect: [66, 8, 6, 10] }, m: { rect: [44, 14, 4, 32] } },
        cam: { d: [[0, 1.16, 50, 62], [1, 1.0, 50, 48]], m: [[0, 1.14, 50, 58], [1, 1.0, 50, 46]] },
        layers: [{ photo: "fg-olive", pos: [100, 0], origin: [100, 0], opacity: 0.92, cam: { d: [[0, 0.7, -1, 6], [0.5, 0.92, 8, -14], [1, 1.15, 16, -26]], m: [[0, 0.8, -1, 4], [0.5, 1.0, 9, -14], [1, 1.2, 16, -24]] } }],
      },
      {
        id: "terrace", photo: "dining-terrace", vh: 85, label: { en: "The Terrace", fr: "La terrasse" },
        enter: { type: "curtain", vh: 65 },
        cam: { d: [[0, 1.1, 36, 52], [1, 1.0, 58, 50]], m: [[0, 1.1, 40, 52], [1, 1.0, 55, 50]] },
      },
      {
        id: "dish", photo: "dish", vh: 70, label: { en: "The Table", fr: "La table" },
        enter: { type: "iris", vh: 60, d: { at: [56, 60] }, m: { at: [50, 52] } },
        cam: { d: [[0, 1.34, 64, 58], [1, 1.14, 62, 56]], m: [[0, 1.2, 50, 52], [1, 1.0, 50, 50]] },
      },
      {
        id: "dining", photo: "dining-room", vh: 100, label: { en: "The Dining Room", fr: "La salle" },
        enter: { type: "wipe", vh: 65 },
        cam: { d: [[0, 1.0, 30, 50], [1, 1.14, 64, 50]], m: [[0, 1.0, 50, 62], [1, 1.1, 50, 40]] },
      },
      {
        id: "spa", photo: "spa", vh: 125, label: { en: "The Spa", fr: "Le spa" },
        enter: { type: "fade", vh: 95, d: { drift: 3 }, m: { drift: 3 } },
        cam: { d: [[0, 1.1, 50, 62], [1, 1.0, 50, 48]], m: [[0, 1.08, 50, 66], [1, 1.0, 50, 44]] },
        veil: [[0, 0.0], [1, 0.0]],
      },
      {
        id: "pool", photo: "pool", vh: 130, label: { en: "The Pool", fr: "La piscine" },
        enter: { type: "lift", vh: 100, d: { veil: 0.55 }, m: { veil: 0.55 } },
        cam: { d: [[0, 1.0, 34, 50], [1, 1.1, 64, 50]], m: [[0, 1.0, 50, 60], [1, 1.08, 50, 42]] },
      },
      {
        id: "rooftop", photo: "rooftop", vh: 140, label: { en: "The Rooftop", fr: "Le rooftop" },
        enter: { type: "fade", vh: 90, dip: true, d: { drift: 5 }, m: { drift: 5 } },
        cam: { d: [[0, 1.16, 62, 54], [0.7, 1.0, 50, 50], [1, 1.0, 50, 50]], m: [[0, 1.14, 50, 52], [0.7, 1.0, 50, 50], [1, 1.0, 50, 50]] },
        layers: [{ photo: "fg-lights", pos: [50, 0], opacity: 0.9, cam: { d: [[0, 1.0, 0, 5], [0.75, 1.22, 2, -18], [1, 1.22, 2, -18]], m: [[0, 1.0, 0, 4], [0.75, 1.3, 2, -22], [1, 1.3, 2, -22]] } }],
      },
    ],

    chapters: [
      {
        id: "hero", from: "facade@0", to: "facade@0+56", layout: "hero", shade: "bottom", still: "facade",
        eyebrow: { en: "Hotel & Resort", fr: "Hôtel & Resort" },
        title: { en: "AURELIA GRAND", fr: "AURELIA GRAND" },
        text: { en: "An extraordinary stay.", fr: "Un séjour extraordinaire." },
        actions: ["discover", "bookStay"],
        alt: { en: "The arched travertine façade of Aurelia Grand glowing at sunset above a still reflecting pool", fr: "La façade en travertin et arcades d'Aurelia Grand, illuminée au coucher du soleil au-dessus d'un bassin miroir" },
      },
      {
        id: "quote", from: "facade@0+84", to: "facade@leave+10", layout: "quote", shade: "bottom", still: "facade",
        title: { en: "Some places stay with *you.*", fr: "Certains lieux ne vous quittent *plus.*" },
        sign: { en: "Aurelia Grand Hotel & Resort", fr: "Aurelia Grand Hotel & Resort" },
      },
      {
        id: "welcome", from: "entrance@land-6", to: "entrance@leave+10", layout: "left", shade: "left", still: "entrance",
        eyebrow: { en: "The Entrance", fr: "L'entrée" },
        title: { en: "Welcome to a different kind of *stay.*", fr: "Bienvenue dans une autre idée du *séjour.*" },
      },
      {
        id: "lobby", from: "lobby@land-6", to: "lobby@leave+10", layout: "bl", shade: "bottom", still: "lobby",
        eyebrow: { en: "The Lobby", fr: "Le lobby" },
        title: { en: "Where every detail *welcomes* you.", fr: "Où chaque détail vous *accueille.*" },
      },
      {
        id: "hospitality", from: "reception@land-6", to: "reception@leave+10", layout: "left", shade: "left", still: "reception",
        eyebrow: { en: "Reception", fr: "La réception" },
        title: { en: "Hospitality, thoughtfully *reimagined.*", fr: "L'hospitalité, repensée avec *soin.*" },
      },
      {
        id: "comfort", from: "suite@land-6", to: "suite@leave+10", layout: "bl", shade: "bottom", still: "suite",
        eyebrow: { en: "The Suite", fr: "La suite" },
        title: { en: "Your own world of *comfort.*", fr: "Votre univers de *confort.*" },
      },
      {
        id: "wake", from: "view@land-6", to: "view@leave+10", layout: "bl", shade: "bottom", still: "view",
        eyebrow: { en: "The View", fr: "La vue" },
        title: { en: "Wake up somewhere *extraordinary.*", fr: "Réveillez-vous dans un lieu *extraordinaire.*" },
      },
      {
        id: "taste", from: "terrace@land-6", to: "dining@leave+8", layout: "right", shade: "right", still: "dining-terrace", extras: ["dish", "dining-room"],
        eyebrow: { en: "Dining", fr: "Les tables" },
        title: { en: "A taste worth *travelling* for.", fr: "Une table qui vaut le *voyage.*" },
      },
      {
        id: "stillness", from: "spa@land-6", to: "spa@leave+10", layout: "center", shade: "center", still: "spa",
        eyebrow: { en: "The Spa", fr: "Le spa" },
        title: { en: "Find your *stillness.*", fr: "Retrouvez votre *sérénité.*" },
      },
      {
        id: "unwind", from: "pool@land-6", to: "pool@leave+10", layout: "center", shade: "center", still: "pool",
        eyebrow: { en: "The Pool", fr: "La piscine" },
        title: { en: "Make room to *unwind.*", fr: "Faites place à la *détente.*" },
      },
      {
        id: "finale", from: "rooftop@land+6", to: "rooftop@1", layout: "finale", shade: "bottom", still: "rooftop",
        eyebrow: { en: "The Rooftop", fr: "Le rooftop" },
        title: { en: "Your next extraordinary stay *begins here.*", fr: "Votre prochain séjour extraordinaire *commence ici.*" },
        actions: [{ use: "rooms", style: "solid" }, { use: "bookStay", style: "line" }],
      },
    ],
  };
})();
