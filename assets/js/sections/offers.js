/* Section « Special Offers » : cinq offres sur un rail horizontal (défilement tactile, flèches, clavier). Aucun prix ni remise inventé. */
(function () {
  "use strict";
  var A = (window.AURELIA = window.AURELIA || {});
  A.sections = A.sections || {};
  var t = function (v) { return A.esc(A.t(v)); };

  function updateButtons(el) {
    var rail = A.$("[data-rail]", el), prev = A.$("[data-rail-prev]", el), next = A.$("[data-rail-next]", el);
    if (!rail) return;
    var max = rail.scrollWidth - rail.clientWidth - 2;
    prev.disabled = rail.scrollLeft <= 2;
    next.disabled = rail.scrollLeft >= max;
  }

  A.sections.offers = {
    render: function () {
      var el = A.$('[data-section="offers"]');
      if (!el) return;
      var O = A.data.offers, ui = A.data.hotel.ui;
      el.innerHTML =
        '<div class="wrap offers__head">' +
          '<div><p class="eyebrow" data-reveal>' + t(O.eyebrow) + "</p>" +
          A.title(O.title, "h2", "title", "offers-title") +
          '<p class="lead" data-reveal>' + t(O.lead) + "</p></div>" +
          '<div class="rail-ctrl" data-reveal><button class="round" type="button" data-rail-prev aria-label="' + t(ui.prev) + '">' + A.icon("chevron-left") + '</button><button class="round" type="button" data-rail-next aria-label="' + t(ui.next) + '">' + A.icon("chevron-right") + "</button></div>" +
        "</div>" +
        '<div class="offers__railwrap"><div class="offers__rail" data-rail tabindex="0" role="region" aria-label="' + t(O.eyebrow) + '"><ul class="offers__track">' + O.items.map(function (o, i) {
          return '<li class="offer">' +
            '<a class="offer__media" href="#/offer/' + A.esc(o.id) + '" tabindex="-1" aria-hidden="true">' + A.frame(o.photo, { ratio: "4 / 5", focus: o.focus, sizes: "(max-width: 767px) 78vw, 28vw" }) + "</a>" +
            '<div class="offer__body">' +
              '<p class="eyebrow eyebrow--plain"><span class="num">' + A.pad2(i + 1) + "</span> · " + t(A.data.hotel.demo ? { en: "Sample offer", fr: "Offre d'exemple" } : { en: "Special offer", fr: "Offre spéciale" }) + "</p>" +
              '<h3 class="offer__name"><a href="#/offer/' + A.esc(o.id) + '">' + t(o.name) + "</a></h3>" +
              '<p class="offer__text">' + t(o.text) + "</p>" +
              '<ul class="offer__cond">' + A.t(o.conditions).map(function (c) { return "<li>" + A.esc(c) + "</li>"; }).join("") + "</ul>" +
              '<div class="offer__actions"><a class="link" href="#/offer/' + A.esc(o.id) + '"><span>' + t(ui.discover) + '</span><span class="sr-only"> : ' + t(o.name) + "</span></a>" +
              '<a class="btn btn--line btn--sm" href="#book" data-book-offer="' + A.esc(o.id) + '"><span>' + t(ui.bookOffer) + '</span><span class="sr-only"> : ' + t(o.name) + "</span></a></div>" +
            "</div></li>";
        }).join("") + "</ul></div></div>" +
        (A.data.hotel.demo ? '<div class="wrap"><p class="section-note" data-reveal><span class="demo-tag">' + t(ui.demo) + "</span> " + t(O.note) + "</p></div>" : "");
      var rail = A.$("[data-rail]", el);
      rail.addEventListener("scroll", function () { updateButtons(el); }, { passive: true });
      rail.addEventListener("keydown", function (e) {
        if (e.key === "ArrowRight") { rail.scrollBy({ left: rail.clientWidth * 0.5, behavior: "smooth" }); e.preventDefault(); }
        if (e.key === "ArrowLeft") { rail.scrollBy({ left: -rail.clientWidth * 0.5, behavior: "smooth" }); e.preventDefault(); }
      });
      updateButtons(el);
    },
    bind: function () {
      var el = A.$('[data-section="offers"]');
      el.addEventListener("click", function (e) {
        var p = e.target.closest("[data-rail-prev]"), n = e.target.closest("[data-rail-next]");
        if (!p && !n) return;
        var rail = A.$("[data-rail]", el);
        rail.scrollBy({ left: rail.clientWidth * 0.8 * (p ? -1 : 1), behavior: A.reduceMotion() ? "auto" : "smooth" });
      });
    },
  };
})();
