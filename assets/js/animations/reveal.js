/* AURELIA GRAND · apparitions au défilement et parallaxe douce
   - [data-reveal], [data-split] : révélés une fois, par IntersectionObserver (aucun écouteur de défilement).
   - [data-parallax="0.07"]      : léger décalage vertical, calculé depuis des positions mesurées une fois (aucune mesure pendant le défilement).
   Mouvement réduit : tout est affiché tout de suite, sans décalage. */
(function () {
  "use strict";
  var A = (window.AURELIA = window.AURELIA || {});
  var root = document.documentElement;
  var io = null;
  var items = [];
  var vh = window.innerHeight;
  var enabled = root.classList.contains("js-reveal");

  function show(el) { el.classList.add("is-in"); }

  function onIntersect(entries) {
    var batch = entries.filter(function (e) { return e.isIntersecting; }).sort(function (a, b) { return a.boundingClientRect.top - b.boundingClientRect.top || a.boundingClientRect.left - b.boundingClientRect.left; });
    batch.forEach(function (e, k) {
      var el = e.target;
      if (!el.style.getPropertyValue("--d") && !el.hasAttribute("data-split")) el.style.setProperty("--d", Math.min(k, 5) * 90 + "ms");
      show(el);
      io.unobserve(el);
    });
  }

  var R = (A.reveal = {
    /* À appeler après chaque rendu de section : observe les nouveaux éléments. */
    scan: function (scope) {
      var els = A.$$("[data-reveal]:not(.is-in), [data-split]:not(.is-in)", scope || document);
      if (!enabled || !("IntersectionObserver" in window)) { els.forEach(show); return; }
      if (!io) io = new IntersectionObserver(onIntersect, { rootMargin: "0px 0px -8% 0px", threshold: 0.1 });
      els.forEach(function (el) { io.observe(el); });
    },
    /* Mesure les éléments à décaler (au chargement, après rendu et au redimensionnement). */
    measure: function () {
      vh = window.innerHeight;
      var y = window.scrollY;
      items = A.$$("[data-parallax]").map(function (el) {
        var box = el.parentNode.getBoundingClientRect();
        var own = el.getBoundingClientRect();
        var isMove = el.classList.contains("ph__move");
        var h = isMove ? box.height : own.height;
        return {
          el: el, speed: parseFloat(el.getAttribute("data-parallax")) || 0.06,
          top: (isMove ? box.top : own.top) + y, h: h,
          limit: isMove ? h * 0.085 : 9999, last: null,
        };
      });
    },
  });

  function tick(fr) {
    if (!enabled || A.reduceMotion()) return false;
    var y = fr.y, half = vh / 2;
    for (var i = 0; i < items.length; i++) {
      var it = items[i];
      var c = it.top + it.h / 2 - y - half;                      // distance du centre de l'élément au centre de l'écran
      if (c > vh + it.h || c < -vh - it.h) continue;
      var off = A.clamp(-c * it.speed, -it.limit, it.limit);
      off = Math.round(off * 10) / 10;
      if (off !== it.last) { it.last = off; it.el.style.transform = "translate3d(0," + off + "px,0)"; }
    }
    return false;
  }
  if (A.engine) { A.engine.add(tick); A.engine.onResize(R.measure); }
  window.addEventListener("load", R.measure);
})();
