/* Section « Dining » : collage de photographies, parole de la cheffe, puis les trois tables avec aperçu au survol. */
(function () {
  "use strict";
  var A = (window.AURELIA = window.AURELIA || {});
  A.sections = A.sections || {};
  var t = function (v) { return A.esc(A.t(v)); };

  A.sections.dining = {
    render: function () {
      var el = A.$('[data-section="dining"]');
      if (!el) return;
      var D = A.data.dining, ui = A.data.hotel.ui;
      var cols = D.collage.map(function (col, c) {
        return '<div class="dc dc--' + "abc"[c] + '">' + col.map(function (it, k) {
          return A.frame(it[0], { ratio: it[1], parallax: 0.04 + 0.01 * ((c + k) % 3), reveal: "mask", delay: (c * 120 + k * 150), sizes: "(max-width: 767px) 80vw, 34vw" });
        }).join("") + "</div>";
      }).join("");
      el.innerHTML =
        '<div class="wrap">' +
          '<header class="dining__head">' +
            '<p class="eyebrow" data-reveal>' + t(D.eyebrow) + "</p>" +
            A.title(D.title, "h2", "title", "dining-title") +
            '<p class="lead" data-reveal>' + t(D.lead) + "</p>" +
          "</header>" +
          '<div class="dining__collage">' + cols + "</div>" +
          '<figure class="dining__quote" data-reveal><blockquote class="quote"><p>“' + t(D.chefQuote.text) + '”</p></blockquote><figcaption>' + t(D.chefQuote.who) + "</figcaption></figure>" +
          '<div class="dining__spaces">' +
            '<h3 class="eyebrow" data-reveal>' + t(D.spacesTitle) + "</h3>" +
            '<ul class="spaces">' + D.spaces.map(function (s, i) {
              return '<li class="space" data-reveal><a class="space__link" href="#/dining/' + A.esc(s.id) + '">' +
                '<span class="space__n num">' + A.pad2(i + 1) + "</span>" +
                '<span class="space__main"><span class="space__name">' + t(s.name) + '</span><span class="space__kind">' + t(s.kind) + "</span></span>" +
                '<span class="space__short">' + t(s.short) + "</span>" +
                '<span class="space__go">' + t(ui.view) + A.icon("arrow-up-right") + "</span>" +
                '<span class="space__thumb" aria-hidden="true">' + A.frame(s.photo, { ratio: "4 / 3", sizes: "(max-width: 767px) 40vw, 22vw" }) + "</span>" +
                "</a></li>";
            }).join("") + "</ul>" +
          "</div>" +
          '<div class="dining__cta" data-reveal>' + A.btn({ label: A.data.hotel.actions.dining.label, href: A.data.hotel.actions.dining.href, style: "line" }) + "</div>" +
        "</div>";
    },
  };
})();
