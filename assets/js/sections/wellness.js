/* Section « Wellness » : parcours plus lent et plus calme. À gauche, une colonne qui reste en place (liste + légende) ;
   à droite, de grandes photographies verticales qui se dévoilent doucement. La légende suit la photographie centrée à l'écran. */
(function () {
  "use strict";
  var A = (window.AURELIA = window.AURELIA || {});
  A.sections = A.sections || {};
  var t = function (v) { return A.esc(A.t(v)); };
  var io = null;

  function activate(el, i) {
    var items = A.$$("[data-w-i]", el), caps = A.$$("[data-w-cap]", el);
    items.forEach(function (li) { var on = +li.getAttribute("data-w-i") === i; li.classList.toggle("is-on", on); if (on) li.setAttribute("aria-current", "true"); else li.removeAttribute("aria-current"); });
    caps.forEach(function (c) { c.classList.toggle("is-on", +c.getAttribute("data-w-cap") === i); });
  }

  A.sections.wellness = {
    render: function () {
      var el = A.$('[data-section="wellness"]');
      if (!el) return;
      var W = A.data.wellness, act = A.data.hotel.actions.wellness;
      el.innerHTML =
        '<div class="wrap wellness__grid">' +
          '<div class="wellness__side"><div class="wellness__sticky">' +
            '<p class="eyebrow" data-reveal>' + t(W.eyebrow) + "</p>" +
            A.title(W.title, "h2", "title", "wellness-title") +
            '<p class="lead" data-reveal>' + t(W.lead) + "</p>" +
            '<ol class="wellness__index" data-reveal>' + W.items.map(function (it, i) {
              return '<li data-w-i="' + i + '"><span class="num">' + A.pad2(i + 1) + "</span><span>" + t(it.name) + "</span></li>";
            }).join("") + "</ol>" +
            '<div class="wellness__caps" aria-hidden="true">' + W.items.map(function (it, i) { return '<p data-w-cap="' + i + '">' + t(it.text) + "</p>"; }).join("") + "</div>" +
            '<div class="wellness__cta" data-reveal>' + A.btn({ label: act.label, href: act.href, style: "ink" }) + "</div>" +
          "</div></div>" +
          '<div class="wellness__frames">' + W.items.map(function (it, i) {
            return '<figure class="wframe" data-w-frame="' + i + '">' +
              A.frame(it.photo, { cls: "wframe__img", ratio: "4 / 5", focus: it.focus, parallax: 0.035, reveal: "veil", sizes: "(max-width: 900px) 100vw, 46vw" }) +
              '<figcaption><span class="num">' + A.pad2(i + 1) + "</span><strong>" + t(it.name) + "</strong><span>" + t(it.text) + "</span></figcaption></figure>";
          }).join("") + "</div>" +
        "</div>";
      activate(el, 0);
      if (io) io.disconnect();
      if ("IntersectionObserver" in window) {
        io = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) { if (e.isIntersecting) activate(el, +e.target.getAttribute("data-w-frame")); });
        }, { rootMargin: "-46% 0px -46% 0px", threshold: 0 });
        A.$$("[data-w-frame]", el).forEach(function (f) { io.observe(f); });
      }
    },
  };
})();
