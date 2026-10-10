/* Section « Guest Voices » : mise en page typographique, une citation à la fois. Contenu d'exemple, signalé comme tel :
   aucun faux témoignage n'est présenté comme un avis authentique. */
(function () {
  "use strict";
  var A = (window.AURELIA = window.AURELIA || {});
  A.sections = A.sections || {};
  var t = function (v) { return A.esc(A.t(v)); };
  var index = 0;

  function show(el, i) {
    var n = A.data.reviews.items.length;
    index = (i + n) % n;
    A.$$("[data-rv]", el).forEach(function (q) {
      var on = +q.getAttribute("data-rv") === index;
      q.classList.toggle("is-on", on);
      q.setAttribute("aria-hidden", String(!on));
    });
    A.$("[data-rv-count]", el).textContent = A.pad2(index + 1) + " / " + A.pad2(n);
  }

  A.sections.reviews = {
    render: function () {
      var el = A.$('[data-section="reviews"]');
      if (!el) return;
      var R = A.data.reviews, ui = A.data.hotel.ui;
      el.innerHTML =
        '<div class="wrap reviews__inner">' +
          '<header class="reviews__head"><p class="eyebrow" data-reveal>' + t(R.eyebrow) + "</p>" + A.title(R.title, "h2", "title", "reviews-title") +
          (A.data.hotel.demo ? '<p data-reveal><span class="demo-tag">' + t(R.demoTag) + "</span></p>" : "") + "</header>" +
          '<div class="reviews__stage" role="group" aria-roledescription="carousel" aria-label="' + t(R.eyebrow) + '" data-reveal="fade">' + R.items.map(function (r, i) {
            return '<figure class="rv" data-rv="' + i + '" aria-hidden="true"><blockquote class="quote"><p>“' + t(r.quote) + '”</p></blockquote><figcaption>' + t(r.who) + "</figcaption></figure>";
          }).join("") + "</div>" +
          '<div class="reviews__ctrl" data-reveal><button class="round round--ink" type="button" data-rv-prev aria-label="' + t(ui.prev) + '">' + A.icon("chevron-left") + '</button><span class="num" data-rv-count aria-live="polite"></span><button class="round round--ink" type="button" data-rv-next aria-label="' + t(ui.next) + '">' + A.icon("chevron-right") + "</button></div>" +
        "</div>";
      show(el, index);
    },
    bind: function () {
      var el = A.$('[data-section="reviews"]');
      el.addEventListener("click", function (e) {
        if (e.target.closest("[data-rv-prev]")) show(el, index - 1);
        else if (e.target.closest("[data-rv-next]")) show(el, index + 1);
      });
    },
  };
})();
