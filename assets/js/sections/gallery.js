/* Section « Gallery » : grille éditoriale asymétrique, filtres par catégorie, visionneuse plein format (clavier, balayage). */
(function () {
  "use strict";
  var A = (window.AURELIA = window.AURELIA || {});
  A.sections = A.sections || {};
  var t = function (v) { return A.esc(A.t(v)); };
  var active = "all";

  /* Ordre de lecture et proportion de chaque photographie (largeur sur 12 colonnes, hauteur en rangées).
     Les rangées sont composées pour se remplir exactement ; avec un filtre, la mise en page est recalculée (voir layout()). */
  var LAYOUT = [
    ["facade", 8, 4], ["intro-loggia", 4, 4],
    ["entrance", 5, 3], ["lobby", 7, 3],
    ["detail-chandelier", 3, 4], ["reception", 5, 4], ["corridor", 4, 4],
    ["suite", 6, 4], ["room-deluxe", 3, 2], ["room-bath", 3, 2], ["room-presidential", 6, 2],
    ["room-executive", 4, 3], ["dining-room", 8, 3],
    ["dish", 5, 4], ["dining-terrace", 7, 4],
    ["spa", 5, 4], ["spa-treatment", 3, 4], ["sauna", 4, 4],
    ["pool", 8, 3], ["detail-linen", 4, 3],
    ["rooftop", 7, 4], ["detail-art", 5, 4],
    ["exp-private-dinner", 5, 3], ["exp-excursion", 3, 3], ["detail-bronze", 4, 3],
    ["view", 8, 3], ["exp-relax", 4, 3],
    ["relax", 4, 3], ["fitness", 4, 3], ["service", 4, 3], ["ingredients", 6, 3], ["table-detail", 3, 3], ["dish-starter", 3, 3], ["dish-dessert", 4, 3],
    ["exp-culture", 4, 3], ["exp-events", 8, 3], ["exp-gastro", 4, 3], ["exp-service", 4, 3], ["room-desk", 4, 3], ["room-terrace", 4, 3], ["room-pool-terrace", 4, 3], ["room-breakfast", 4, 3], ["room-junior", 4, 3],
  ];
  // Photographies de la vue « Tout » : celles qui ont une place dans les rangées composées ci-dessus
  var CURATED = 27;

  /* Avec un filtre : rangées de 12 colonnes recomposées (6+6, 4+4+4, 8+4, 4+8, 3+3+3+3, 5+7…) ; la dernière se complète toute seule. */
  var PATTERNS = [[7, 5], [4, 4, 4], [5, 7], [6, 6], [3, 3, 3, 3], [8, 4], [4, 8]];
  function layout(list) {
    var out = [], i = 0, r = 0;
    while (i < list.length) {
      var left = list.length - i, pat = PATTERNS[r % PATTERNS.length];
      if (pat.length > left) pat = left === 1 ? [12] : left === 2 ? [6, 6] : [4, 4, 4];
      pat.forEach(function (c, k) { out.push([list[i + k][0], c, pat.length >= 4 ? 3 : 4]); });
      i += pat.length; r++;
    }
    return out;
  }

  function items() {
    var all = LAYOUT.filter(function (x) { return A.hasPhoto(x[0]) && (active === "all" || (A.photo(x[0]) || {}).cat === active); });
    if (active === "all") return all.slice(0, CURATED);
    return layout(all);
  }
  function grid() {
    var list = items();
    return list.map(function (x, i) {
      var id = x[0];
      var bucket = x[1] >= 7 ? "w" : x[1] >= 5 ? "m" : "s";
      return '<li class="gi gi--' + bucket + " gi--h" + x[2] + '" data-reveal="fade" style="--c:' + x[1] + ";--r:" + x[2] + ";--d:" + (i % 4) * 90 + 'ms"><button class="gi__btn" type="button" data-gi="' + A.esc(id) + '" aria-label="' + A.esc(A.t(A.data.hotel.ui.openPhoto)) + " : " + A.esc(A.t((A.photo(id) || {}).alt)) + '">' +
        A.frame(id, { cls: "gi__ph", sizes: "(max-width: 767px) 50vw, (max-width: 1100px) 33vw, " + Math.round(x[1] / 12 * 90) + "vw" }) +
        '<span class="gi__cap"><span>' + A.esc(A.pad2(i + 1)) + "</span>" + A.icon("expand") + "</span></button></li>";
    }).join("");
  }

  function paint(el) {
    var host = A.$("[data-gallery-grid]", el);
    host.innerHTML = grid();
    A.reveal.scan(host);
    var count = A.$("[data-gallery-count]", el);
    if (count) count.textContent = items().length + " " + A.t({ en: "photographs", fr: "photographies" });
    A.reveal.measure();
  }

  A.sections.gallery = {
    render: function () {
      var el = A.$('[data-section="gallery"]');
      if (!el) return;
      var cats = A.data.galleryCategories.filter(function (c) { return LAYOUT.some(function (x) { return (A.photo(x[0]) || {}).cat === c.id && A.hasPhoto(x[0]); }); });
      var ui = A.data.hotel.ui;
      el.innerHTML =
        '<div class="wrap">' +
          '<header class="gallery__head">' +
            '<div><p class="eyebrow" data-reveal>' + t({ en: "Gallery", fr: "Galerie" }) + "</p>" +
            A.title({ en: "The house, *in light.*", fr: "La maison, *en lumière.*" }, "h2", "title", "gallery-title") + "</div>" +
            '<p class="gallery__count muted" data-gallery-count aria-live="polite"></p>' +
          "</header>" +
          '<div class="gallery__filters" role="group" aria-label="' + t(ui.filters) + '" data-reveal>' +
            '<button type="button" class="chip" data-cat="all" aria-pressed="' + (active === "all") + '">' + t(ui.all) + "</button>" +
            cats.map(function (c) { return '<button type="button" class="chip" data-cat="' + c.id + '" aria-pressed="' + (active === c.id) + '">' + t(c.label) + "</button>"; }).join("") +
          "</div>" +
          '<ul class="gallery__grid" data-gallery-grid></ul>' +
          (A.data.hotel.demo ? '<p class="section-note"><span class="demo-tag">' + t(ui.demo) + "</span> " + t(ui.builtWith) + "</p>" : "") +
        "</div>";
      paint(el);
    },
    bind: function () {
      var el = A.$('[data-section="gallery"]');
      el.addEventListener("click", function (e) {
        var chip = e.target.closest("[data-cat]");
        if (chip) {
          active = chip.getAttribute("data-cat");
          A.$$("[data-cat]", el).forEach(function (c) { c.setAttribute("aria-pressed", String(c === chip)); });
          paint(el);
          return;
        }
        var b = e.target.closest("[data-gi]");
        if (b) {
          var ids = items().map(function (x) { return x[0]; });
          A.lightbox.open(ids, ids.indexOf(b.getAttribute("data-gi")), b);
        }
      });
    },
  };
})();
