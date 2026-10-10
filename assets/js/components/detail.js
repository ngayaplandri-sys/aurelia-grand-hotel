/* AURELIA GRAND · fiches détaillées (« pages ») : chambre, table, bien-être, offre, page légale
   Une fiche s'ouvre en plein écran dans un dialogue natif (focus piégé, Échap), avec une adresse partageable : #/room/<id>, #/dining/<id>, #/wellness/<id>, #/offer/<id>, #/legal/<id>.
   Le routage (historique du navigateur) est dans navigation/router.js. */
(function () {
  "use strict";
  var A = (window.AURELIA = window.AURELIA || {});
  var dlg = A.$("[data-detail]");
  if (!dlg) return;
  var current = null;   // { type, id }

  function H() { return A.data.hotel; }
  function ui(k) { return A.esc(A.t(H().ui[k])); }
  function t(v) { return A.esc(A.t(v)); }
  function para(list) { return A.t(list).map(function (p) { return "<p>" + A.esc(p) + "</p>"; }).join(""); }
  function facts(rows) {
    return '<dl class="facts">' + rows.map(function (r) { return "<div><dt>" + t(r[0]) + "</dt><dd>" + t(r[1]) + "</dd></div>"; }).join("") + "</dl>";
  }
  function ticks(list) { return '<ul class="ticks">' + A.t(list).map(function (x) { return "<li>" + A.icon("check") + "<span>" + A.esc(x) + "</span></li>"; }).join("") + "</ul>"; }
  function titleHtml(v) { return String(A.t(v)).replace(/\*/g, ""); }

  function galleryBlock(photos) {
    return '<section class="detail__gallery wrap" aria-label="' + ui("allPhotos") + '"><div class="dgrid">' + photos.map(function (id, i) {
      return '<button class="dgrid__item dgrid__item--' + (i % 3 === 0 ? "wide" : "std") + '" type="button" data-open-photo="' + A.esc(id) + '" aria-label="' + ui("openPhoto") + ' : ' + A.esc(A.t((A.photo(id) || {}).alt)) + '">' +
        A.frame(id, { sizes: "(max-width: 767px) 100vw, 50vw" }) + "</button>";
    }).join("") + "</div></section>";
  }
  function related(items, type, title) {
    if (!items || !items.length) return "";
    return '<section class="detail__related wrap"><h2 class="subtitle">' + A.esc(title) + '</h2><ul class="rel">' + items.map(function (x) {
      return '<li><a class="rel__card" href="#/' + type + "/" + A.esc(x.id) + '">' + A.frame(x.photo, { ratio: "4 / 3", sizes: "(max-width: 767px) 80vw, 30vw" }) +
        '<span class="rel__name">' + t(x.name) + '</span><span class="rel__meta">' + (x.kind ? t(x.kind) : x.size ? x.size + " m²" : "") + "</span></a></li>";
    }).join("") + "</ul></section>";
  }
  function bar() {
    return '<div class="detail__bar"><button class="detail__back" type="button" data-detail-close>' + A.icon("chevron-left") + "<span>" + ui("back") + "</span></button>" +
      '<span class="detail__brand" aria-hidden="true">AURELIA GRAND</span>' +
      '<button class="detail__x" type="button" data-detail-close aria-label="' + ui("close") + '">' + A.icon("x") + "</button></div>";
  }
  function hero(photoId, eyebrow, title, sub) {
    return '<header class="detail__hero">' + A.frame(photoId, { cls: "detail__heroimg", sizes: "100vw", eager: true, art: true, alt: "" }) +
      '<div class="detail__herotext wrap"><p class="eyebrow">' + eyebrow + '</p><h1 class="display" id="detail-title" tabindex="-1">' + title + "</h1>" + (sub ? '<p class="detail__sub">' + sub + "</p>" : "") + "</div></header>";
  }
  function demoFoot() { return H().demo ? '<p class="detail__demo wrap"><span class="demo-tag">' + ui("demo") + "</span> " + t(H().demoNotice) + "</p>" : ""; }
  function frameWrap(inner) { return bar() + '<div class="detail__page">' + inner + demoFoot() + "</div>"; }

  /* ----- Chambres ----- */
  function roomPage(id) {
    var S = A.data.stay, r = S.rooms.filter(function (x) { return x.id === id; })[0];
    if (!r) return null;
    var others = S.rooms.filter(function (x) { return x.id !== id; }).slice(0, 3);
    return {
      title: titleHtml(r.name),
      html: frameWrap(
        hero(r.photo, t(S.eyebrow), t(r.name), t(r.tagline)) +
        '<div class="wrap detail__body"><div class="detail__main">' + para(r.text) +
          '<h2 class="detail__h">' + ui("amenities") + "</h2>" + ticks(r.amenities) + "</div>" +
        '<aside class="detail__side"><div class="detail__card">' + facts([
          [H().ui.size, r.size + " m²"], [H().ui.sleeps, { en: "Up to " + r.sleeps + " guests", fr: "Jusqu'à " + r.sleeps + " personnes" }], [H().ui.view_, r.view], [{ en: "Bed", fr: "Literie" }, r.bed],
        ]) + '<p class="detail__rate">' + ui("rateOnRequest") + '</p><a class="btn btn--ink btn--block" href="#book" data-book-room="' + A.esc(r.id) + '">' + ui("bookThis") + A.icon("arrow-right") + "</a></div></aside></div>" +
        galleryBlock(r.gallery) + related(others.map(function (x) { return { id: x.id, photo: x.photo, name: x.name, size: x.size }; }), "room", A.t(H().ui.alsoAt))
      ),
    };
  }

  /* ----- Tables ----- */
  function diningPage(id) {
    var D = A.data.dining, s = D.spaces.filter(function (x) { return x.id === id; })[0];
    if (!s) return null;
    var others = D.spaces.filter(function (x) { return x.id !== id; });
    return {
      title: titleHtml(s.name),
      html: frameWrap(
        hero(s.photo, t(s.kind), t(s.name), t(s.short)) +
        '<div class="wrap detail__body"><div class="detail__main">' + para(s.text) + "</div>" +
        '<aside class="detail__side"><div class="detail__card">' + facts(s.facts) +
          '<a class="btn btn--ink btn--block" href="#contact" data-subject="dining">' + ui("reserveTable") + A.icon("arrow-right") + "</a></div></aside></div>" +
        galleryBlock(s.gallery) + related(others.map(function (x) { return { id: x.id, photo: x.photo, name: x.name, kind: x.kind }; }), "dining", A.t(H().ui.alsoAt))
      ),
    };
  }

  /* ----- Bien-être ----- */
  function wellnessPage() {
    var W = A.data.wellness, d = W.detail;
    return {
      title: titleHtml(d.name),
      html: frameWrap(
        hero(d.photo, t(W.eyebrow), t(d.name), t(W.lead)) +
        '<div class="wrap detail__body"><div class="detail__main">' + para(d.text) +
          '<div class="detail__facilities">' + W.items.map(function (it) {
            return '<article class="facility">' + A.frame(it.photo, { ratio: "4 / 3", focus: it.focus, sizes: "(max-width: 767px) 100vw, 34vw" }) + "<h3>" + t(it.name) + "</h3><p>" + t(it.text) + "</p></article>";
          }).join("") + "</div></div>" +
        '<aside class="detail__side"><div class="detail__card">' + facts(d.facts) +
          '<a class="btn btn--ink btn--block" href="#contact" data-subject="wellness">' + ui("enquire") + A.icon("arrow-right") + "</a></div></aside></div>"
      ),
    };
  }

  /* ----- Offres ----- */
  function offerPage(id) {
    var O = A.data.offers, o = O.items.filter(function (x) { return x.id === id; })[0];
    if (!o) return null;
    var others = O.items.filter(function (x) { return x.id !== id; }).slice(0, 3);
    return {
      title: titleHtml(o.name),
      html: frameWrap(
        hero(o.photo, t(O.eyebrow), t(o.name), t(o.text)) +
        '<div class="wrap detail__body"><div class="detail__main"><p>' + t(o.text) + '</p><h2 class="detail__h">' + ui("conditions") + "</h2>" + ticks(o.conditions) +
          (H().demo ? '<p class="detail__note"><span class="demo-tag">' + ui("demo") + "</span> " + t(O.note) + "</p>" : "") + "</div>" +
        '<aside class="detail__side"><div class="detail__card"><p class="detail__rate">' + ui("rateOnRequest") + '</p><a class="btn btn--ink btn--block" href="#book" data-book-offer="' + A.esc(o.id) + '">' + ui("bookOffer") + A.icon("arrow-right") + "</a></div></aside></div>" +
        related(others.map(function (x) { return { id: x.id, photo: x.photo, name: x.name, kind: { en: "Special offer", fr: "Offre spéciale" } }; }), "offer", A.t(H().ui.alsoAt))
      ),
    };
  }

  /* ----- Pages légales ----- */
  function legalPage(id) {
    var L = A.data.legal, p = L.pages[id];
    if (!p) return null;
    return {
      title: titleHtml(p.title),
      html: frameWrap(
        '<header class="detail__legalhead wrap"><p class="eyebrow">' + ui("demo") + '</p><h1 class="title" id="detail-title" tabindex="-1">' + t(p.title) + '</h1><p class="status status--demo">' + A.icon("info") + "<span>" + t(L.template) + "</span></p></header>" +
        '<div class="wrap detail__legal">' + p.sections.map(function (s) { return "<section><h2 class=\"detail__h\">" + t(s.h) + "</h2><p>" + t(s.p) + "</p></section>"; }).join("") + "</div>"
      ),
    };
  }

  var BUILD = { room: roomPage, dining: diningPage, wellness: wellnessPage, offer: offerPage, legal: legalPage };

  function render() {
    if (!current) return false;
    var page = BUILD[current.type] && BUILD[current.type](current.id);
    if (!page) return false;
    dlg.innerHTML = page.html;
    dlg.setAttribute("aria-labelledby", "detail-title");
    document.title = page.title + " · AURELIA GRAND";
    return true;
  }

  A.detail = {
    isOpen: function () { return dlg.open; },
    exists: function (type, id) { return !!(BUILD[type] && BUILD[type](id)); },
    open: function (type, id) {
      if (current && current.type === type && current.id === id && dlg.open) return true;
      current = { type: type, id: id };
      if (!render()) { current = null; return false; }
      document.documentElement.classList.add("is-locked");
      if (!dlg.open) { if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", ""); }
      dlg.scrollTop = 0;
      var h = A.$("#detail-title", dlg); if (h) h.focus({ preventScroll: true });
      if (A.tour && A.tour.mode === "cinematic") A.engine.kick();
      return true;
    },
    close: function () {
      if (dlg.open) dlg.close();
    },
    title: function () { return document.title; },
  };

  dlg.addEventListener("click", function (e) {
    if (e.target.closest("[data-detail-close]")) { e.preventDefault(); A.router.closeDetail(); return; }
    var photo = e.target.closest("[data-open-photo]");
    if (photo) {
      var ids = A.$$("[data-open-photo]", dlg).map(function (b) { return b.getAttribute("data-open-photo"); });
      A.lightbox.open(ids, ids.indexOf(photo.getAttribute("data-open-photo")), photo);
      return;
    }
    var bookRoom = e.target.closest("[data-book-room]"), bookOffer = e.target.closest("[data-book-offer]"), subj = e.target.closest("[data-subject]");
    if (bookRoom || bookOffer || subj) {
      e.preventDefault();
      var link = bookRoom || bookOffer || subj;
      A.router.closeDetail(function () {
        if (bookRoom) A.booking.preselect({ room: bookRoom.getAttribute("data-book-room") });
        else if (bookOffer) A.booking.preselect({ offer: bookOffer.getAttribute("data-book-offer") });
        else A.contact && A.contact.preselect(subj.getAttribute("data-subject"));
        A.scrollToId(link.getAttribute("href").slice(1));
      });
    }
  });
  dlg.addEventListener("cancel", function (e) { e.preventDefault(); A.router.closeDetail(); });
  dlg.addEventListener("close", function () {
    document.documentElement.classList.remove("is-locked");
    dlg.innerHTML = "";
    current = null;
    document.title = A.pageTitle || document.title;
    if (A.router && A.router.opener && document.contains(A.router.opener)) A.router.opener.focus({ preventScroll: true });
  });
  A.onLang(function () { if (dlg.open && current) { var y = dlg.scrollTop; render(); dlg.scrollTop = y; } });
})();
