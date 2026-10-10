/* Section « Experiences » : récit éditorial en mosaïque. Chaque expérience a sa photographie, sa taille et son rythme (parallaxe propre). */
(function () {
  "use strict";
  var A = (window.AURELIA = window.AURELIA || {});
  A.sections = A.sections || {};
  var t = function (v) { return A.esc(A.t(v)); };

  A.sections.experiences = {
    render: function () {
      var el = A.$('[data-section="experiences"]');
      if (!el) return;
      var E = A.data.experiences;
      var speeds = [0.05, 0.09, 0.04, 0.06, 0.1, 0.05, 0.07];
      el.innerHTML =
        '<div class="wrap">' +
          '<header class="exp__head">' +
            '<p class="eyebrow" data-reveal>' + t(E.eyebrow) + "</p>" +
            A.title(E.title, "h2", "title", "experiences-title") +
            '<p class="lead" data-reveal>' + t(E.lead) + "</p>" +
          "</header>" +
          '<div class="mosaic">' + [[0, 2, 4, 6], [1, 3, 5]].map(function (ix, c) {
            return '<ul class="mosaic__col mosaic__col--' + (c ? "b" : "a") + '">' + ix.map(function (i) {
              var x = E.items[i];
              return '<li class="mo mo--' + x.size + '" style="--o:' + i + '">' +
                '<article class="mo__card">' +
                  A.frame(x.photo, { cls: "mo__img", parallax: speeds[i % speeds.length], reveal: "mask", delay: (i % 3) * 120, sizes: "(max-width: 767px) 92vw, (max-width: 1100px) 48vw, 40vw" }) +
                  '<div class="mo__text"><span class="mo__n num">' + A.pad2(i + 1) + "</span><h3>" + t(x.name) + "</h3><p>" + t(x.text) + '</p><a class="link" href="#contact" data-subject="experiences"><span>' + t(E.enquire) + '</span><span class="sr-only"> : ' + t(x.name) + "</span>" + A.icon("arrow-right") + "</a></div>" +
                "</article></li>";
            }).join("") + "</ul>";
          }).join("") + "</div>" +
        "</div>";
    },
  };
})();
