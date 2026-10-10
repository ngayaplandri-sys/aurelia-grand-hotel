/* AURELIA GRAND · navigation : en-tête, menu mobile plein écran, langue, section active, bouton de réservation mobile.
   L'en-tête est transparent sur la photographie d'ouverture et prend un fond discret une fois la visite terminée. */
(function () {
  "use strict";
  var A = (window.AURELIA = window.AURELIA || {});
  var root = document.documentElement;
  var header = A.$("[data-header]"), burger = A.$("[data-burger]"), menu = A.$("[data-menu]"), bar = A.$("[data-book-bar]");
  var tourEnded = false, menuOpen = false, bookVisible = false, endMarker = A.$("[data-tour-end]");
  var t = function (v) { return A.esc(A.t(v)); };

  function render() {
    var H = A.data.hotel;
    A.$("[data-nav]").innerHTML = H.nav.map(function (n) { return '<li><a href="' + A.esc(n.href) + '" data-nav-id="' + A.esc(n.id) + '">' + t(n.label) + "</a></li>"; }).join("");
    A.$("[data-menu-list]").innerHTML = H.nav.map(function (n, i) {
      return '<li><a href="' + A.esc(n.href) + '" style="--i:' + i + '"><small>' + A.pad2(i + 1) + "</small>" + t(n.label) + "</a></li>";
    }).join("");
    A.$$("[data-book-cta]").forEach(function (a, i) { a.textContent = A.t(i === 0 ? H.actions.book.label : { en: "Book", fr: "Réserver" }); });
    A.$("[data-menu-book]").textContent = A.t(H.actions.book.label);
    A.$$("[data-lang-switch],[data-lang-switch-menu]").forEach(function (g) {
      g.setAttribute("aria-label", A.t(H.ui.language));
      A.$$("button", g).forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-lang") === A.lang)); });
    });
    A.$("[data-nav-wrap]").setAttribute("aria-label", A.t(H.ui.mainNav));
    A.$("[data-burger-label]").textContent = A.t(menuOpen ? H.ui.menuClose : H.ui.menuOpen);
    A.$(".skip-link").textContent = A.t(H.ui.skip);
    var bb = A.$("[data-book-bar]"); if (bb) bb.setAttribute("aria-label", A.t(H.actions.bookStay.label));
    A.$(".tour").setAttribute("aria-label", A.t(H.ui.tourLabel));
    A.$(".brand").setAttribute("aria-label", "AURELIA GRAND, Hotel & Resort — " + (A.lang === "fr" ? "haut de page" : "top of page"));
    var title = A.lang === "fr" ? "AURELIA GRAND · Hôtel & Resort · Un séjour extraordinaire" : "AURELIA GRAND · Hotel & Resort · An extraordinary stay";
    A.pageTitle = title;
    if (!A.detail || !A.detail.isOpen()) document.title = title;
    var meta = A.$('meta[name="description"]');
    if (meta) meta.setAttribute("content", A.lang === "fr"
      ? "Aurelia Grand Hotel & Resort : une visite cinématographique et photographique d'un hôtel de luxe de travertin, de bronze et de lumière, au bord de la mer. Démonstration de concept, détails fictifs."
      : "Aurelia Grand Hotel & Resort: a cinematic, photographic visit of a luxury hotel of travertine, bronze and light on the edge of the sea. Concept demonstration with fictional details.");
  }

  /* ----- Menu mobile ----- */
  function setMenu(open, focusFirst) {
    if (open === menuOpen) return;
    menuOpen = open;
    burger.setAttribute("aria-expanded", String(open));
    A.$("[data-burger-label]").textContent = A.t(open ? A.data.hotel.ui.menuClose : A.data.hotel.ui.menuOpen);
    root.classList.toggle("menu-open", open);
    root.classList.toggle("is-locked", open);
    ["main", "[data-footer]"].forEach(function (s) { var n = A.$(s); if (n) n.inert = open; });
    if (open) {
      menu.hidden = false;
      void menu.offsetWidth;
      menu.classList.add("is-open");
      // au clavier, le focus passe au premier lien ; à la souris ou au doigt, il reste sur le bouton (pas d'anneau parasite)
      var first = A.$("a", menu); if (first && focusFirst) setTimeout(function () { first.focus({ preventScroll: true }); }, 350);
    } else {
      menu.classList.remove("is-open");
      setTimeout(function () { if (!menuOpen) menu.hidden = true; }, 900);
    }
    updateBar();
  }

  /* ----- État de l'en-tête et bouton flottant ----- */
  function updateHeader() {
    var y = window.scrollY;
    if (endMarker) tourEnded = endMarker.getBoundingClientRect().top < window.innerHeight * 0.5;     // lu directement : un saut d'ancre ne déclenche aucune observation
    var solid = A.tour && A.tour.mode === "cinematic" ? tourEnded : y > 60;
    header.classList.toggle("is-solid", solid);
    updateBar();
  }
  function updateBar() {
    if (!bar) return;
    // pendant la visite, les boutons de réservation sont déjà dans l'image et dans l'en-tête : le bouton flottant n'apparaît qu'après
    var tourDone = A.tour && A.tour.mode === "cinematic" ? tourEnded : window.scrollY > window.innerHeight * 0.9;
    var show = tourDone && !bookVisible && !menuOpen && !(A.detail && A.detail.isOpen());
    if (show && bar.hidden) bar.hidden = false;
    requestAnimationFrame(function () { bar.classList.toggle("is-visible", show); });
    if (!show) setTimeout(function () { if (!bar.classList.contains("is-visible")) bar.hidden = true; }, 600);
  }

  A.header = {
    render: render,
    init: function () {
      render();
      burger.addEventListener("click", function (e) { setMenu(!menuOpen, e.detail === 0); });
      menu.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
      document.addEventListener("keydown", function (e) { if (e.key === "Escape" && menuOpen) { setMenu(false); burger.focus(); } });
      window.matchMedia("(min-width: 1240px)").addEventListener("change", function (e) { if (e.matches) setMenu(false); });
      // langue
      A.$$("[data-lang-switch],[data-lang-switch-menu]").forEach(function (g) {
        g.addEventListener("click", function (e) {
          var b = e.target.closest("[data-lang]");
          if (!b || b.getAttribute("data-lang") === A.lang) return;
          A.setLang(b.getAttribute("data-lang"));
          b.focus();
        });
      });
      A.onLang(render);
      // fin de la visite : l'en-tête prend son fond discret
      window.addEventListener("scroll", updateHeader, { passive: true });
      window.addEventListener("resize", updateHeader);
      // la réservation est déjà à l'écran : le bouton flottant s'efface
      var book = A.$("#book");
      if (book && "IntersectionObserver" in window) new IntersectionObserver(function (en) { bookVisible = en[0].isIntersecting; updateBar(); }, { rootMargin: "0px 0px -20% 0px" }).observe(book);
      // section active dans la navigation
      if ("IntersectionObserver" in window) {
        var links = {};
        var spy = new IntersectionObserver(function (en) {
          en.forEach(function (x) {
            if (!x.isIntersecting) return;
            Object.keys(links).forEach(function (k) { links[k].removeAttribute("aria-current"); });
            var l = links[x.target.id]; if (l) l.setAttribute("aria-current", "true");
          });
        }, { rootMargin: "-45% 0px -50% 0px" });
        A.$$("[data-nav-id]").forEach(function (a) { links[a.getAttribute("data-nav-id")] = a; });
        Object.keys(links).forEach(function (id) { var s = document.getElementById(id); if (s) spy.observe(s); });
        A.onLang(function () { A.$$("[data-nav-id]").forEach(function (a) { links[a.getAttribute("data-nav-id")] = a; }); });
      }
      updateHeader();
    },
    closeMenu: function () { setMenu(false); },
  };
})();
