/* Section « More than a stay. » : composition asymétrique (image dominante, texte en retrait, arche en superposition). */
(function () {
  "use strict";
  var A = (window.AURELIA = window.AURELIA || {});
  A.sections = A.sections || {};
  var t = function (v) { return A.esc(A.t(v)); };

  A.sections.intro = {
    render: function () {
      var el = A.$('[data-section="intro"]');
      if (!el) return;
      var D = A.data.intro;
      el.innerHTML =
        '<div class="wrap intro__grid">' +
          '<div class="intro__text">' +
            '<p class="eyebrow" data-reveal>' + t(D.eyebrow) + "</p>" +
            A.title(D.title, "h2", "display intro__title", "intro-title") +
            '<p class="lead intro__lead" data-reveal>' + t(D.paragraphs[0]) + "</p>" +
            '<p class="intro__p" data-reveal>' + t(D.paragraphs[1]) + "</p>" +
            '<div class="intro__cta" data-reveal><a class="link" href="#stay">' + t(D.cta) + A.icon("arrow-right") + "</a></div>" +
          "</div>" +
          '<div class="intro__media">' +
            A.frame(D.photos.main, { cls: "intro__main", ratio: "4 / 3", parallax: 0.07, reveal: "mask", sizes: "(max-width: 900px) 100vw, 64vw" }) +
            '<div class="intro__arch">' + A.frame(D.photos.side, { cls: "arch", ratio: "4 / 5", parallax: 0.12, reveal: "mask", delay: 200, sizes: "(max-width: 900px) 46vw, 24vw" }) + "</div>" +
            '<p class="intro__pull" data-reveal><em>' + t(D.pull) + "</em></p>" +
          "</div>" +
        "</div>" +
        '<div class="wrap intro__facts-wrap"><dl class="intro__facts" data-reveal>' + D.facts.map(function (f) {
          return "<div><dt>" + t(f.label) + '</dt><dd class="num">' + A.esc(f.value) + "</dd></div>";
        }).join("") + '</dl>' + (A.data.hotel.demo ? '<p class="intro__note"><span class="demo-tag">' + t(D.factsNote) + "</span></p>" : "") + "</div>";
    },
  };
})();
