/* AURELIA GRAND · démarrage : rend les sections depuis les données, branche la navigation, relance le rendu au changement de langue. */
(function () {
  "use strict";
  var A = window.AURELIA;
  var ORDER = ["intro", "stay", "dining", "wellness", "experiences", "gallery", "offers", "reviews", "booking", "contact", "footer"];

  function renderAll() {
    ORDER.forEach(function (k) { var s = A.sections && A.sections[k]; if (s) s.render(); });
    A.reveal.scan();
    A.reveal.measure();
  }

  // écouteurs délégués, posés une seule fois
  ORDER.forEach(function (k) { var s = A.sections && A.sections[k]; if (s && s.bind) s.bind(); });

  A.header.init();
  renderAll();
  A.onLang(function () { renderAll(); });
  A.router.init();
  window.addEventListener("load", function () { A.reveal.measure(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { A.reveal.measure(); });

  // Mouvement réduit activé ou retiré en cours de visite : on recharge pour passer d'un mode à l'autre proprement
  var rm = window.matchMedia("(prefers-reduced-motion: reduce)");
  var cinematicNow = document.documentElement.classList.contains("is-cinematic");
  (rm.addEventListener ? rm.addEventListener.bind(rm, "change") : rm.addListener.bind(rm))(function (e) { if (e.matches === cinematicNow) location.reload(); });

  A.ready = true;
  document.documentElement.classList.add("is-ready");
})();
