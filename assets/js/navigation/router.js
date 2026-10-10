/* AURELIA GRAND · navigation : ancres de la page (défilement doux) et fiches détaillées partageables
   #/room/<id> · #/dining/<id> · #/wellness/<id> · #/offer/<id> · #/legal/<id>
   Les fiches s'ouvrent dans un dialogue plein écran ; le bouton « retour » du navigateur les ferme. */
(function () {
  "use strict";
  var A = (window.AURELIA = window.AURELIA || {});
  var ROUTE = /^#\/(room|dining|wellness|offer|legal)\/([\w-]+)$/;
  var pendingAfter = null;

  var R = (A.router = {
    opener: null,

    /* Ferme la fiche ouverte (en revenant à l'entrée d'historique précédente quand elle a été ajoutée par un clic), puis exécute after(). */
    closeDetail: function (after) {
      if (!A.detail.isOpen()) { if (after) after(); return; }
      pendingAfter = after || null;
      var st = history.state;
      if (st && st.detail && !st.deep) history.back();           // ouverte par un clic : on revient à la page
      else { history.replaceState(null, "", location.pathname + location.search); sync(); }   // adresse partagée ouverte directement
    },
    init: function () {
      sync(true);
      window.addEventListener("hashchange", function () { sync(); });
      window.addEventListener("popstate", function () { sync(); });
    },
  });

  function sync(first) {
    var m = ROUTE.exec(location.hash);
    if (m) {
      if (!A.detail.exists(m[1], m[2])) { history.replaceState(null, "", location.pathname + location.search); return; }
      if (!history.state || !history.state.detail) history.replaceState({ detail: true, deep: !!first }, "", location.hash);
      A.detail.open(m[1], m[2]);
    } else {
      if (A.detail.isOpen()) A.detail.close();
      if (pendingAfter) { var fn = pendingAfter; pendingAfter = null; setTimeout(fn, 30); }
    }
  }

  document.addEventListener("click", function (e) {
    var a = e.target.closest("a[href^='#']");
    if (!a) return;
    var h = a.getAttribute("href");
    if (h === "#" || a.hasAttribute("data-tour-start")) return;
    if (ROUTE.test(h)) { R.opener = a; return; }                // la fiche s'ouvre via hashchange
    // présélections : chambre, offre, objet du message
    if (!a.closest("[data-detail]")) {
      if (a.hasAttribute("data-book-room")) A.booking.preselect({ room: a.getAttribute("data-book-room") });
      else if (a.hasAttribute("data-book-offer")) A.booking.preselect({ offer: a.getAttribute("data-book-offer") });
      else if (a.hasAttribute("data-subject") && A.contact) A.contact.preselect(a.getAttribute("data-subject"));
      else if (a.getAttribute("href") === "#book") A.booking.preselect({ offer: "" });
    }
    // ancre interne : défilement doux (saut direct depuis la visite), focus sur la cible
    var id = h.slice(1), target = id === "top" ? A.$("[data-tour]") : document.getElementById(id);
    if (!target || a.closest("[data-detail]")) return;
    e.preventDefault();
    if (id === "top") A.scrollToY(0); else A.scrollToId(id);
    history.replaceState(null, "", h === "#top" ? location.pathname + location.search : h);
    if (target.getAttribute("tabindex") == null) target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
  });
})();
