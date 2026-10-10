/* AURELIA GRAND · visionneuse de photographies
   Dialogue natif (focus piégé, Échap pour fermer), flèches du clavier, Début / Fin, balayage au doigt, préchargement des voisines.
   A.lightbox.open(ids, index, opener) où ids = liste d'identifiants de photographies (data/photos.js). */
(function () {
  "use strict";
  var A = (window.AURELIA = window.AURELIA || {});
  var dlg = A.$("[data-lightbox]");
  if (!dlg) return;
  var ids = [], idx = 0, opener = null, busy = false, touchX = null, touchY = null;

  function ui() { return A.data.hotel.ui; }
  function catLabel(id) {
    var cat = (A.photo(id) || {}).cat;
    var c = (A.data.galleryCategories || []).filter(function (x) { return x.id === cat; })[0];
    return c ? A.t(c.label) : "";
  }

  function shell() {
    dlg.setAttribute("aria-label", A.t(ui().viewer));
    dlg.innerHTML =
      '<div class="lightbox__top"><span class="lightbox__count" data-lb-count aria-live="polite"></span>' +
      '<button class="lightbox__btn" type="button" data-lb-close aria-label="' + A.esc(A.t(ui().close)) + '">' + A.icon("x") + "</button></div>" +
      '<div class="lightbox__stage" data-lb-stage></div>' +
      '<button class="lightbox__nav lightbox__nav--prev" type="button" data-lb-prev aria-label="' + A.esc(A.t(ui().prev)) + '">' + A.icon("chevron-left") + "</button>" +
      '<button class="lightbox__nav lightbox__nav--next" type="button" data-lb-next aria-label="' + A.esc(A.t(ui().next)) + '">' + A.icon("chevron-right") + "</button>" +
      '<p class="lightbox__caption" data-lb-caption></p>';
  }

  function paint(dir) {
    var id = ids[idx], stageEl = A.$("[data-lb-stage]", dlg);
    var p = A.photo(id) || {};
    var fig = document.createElement("figure");
    fig.className = "lightbox__fig" + (dir ? " is-from-" + (dir > 0 ? "right" : "left") : "");
    fig.innerHTML = A.pic(id, { sizes: "100vw", eager: true, art: true }).replace(' fetchpriority="high"', "");
    stageEl.innerHTML = "";
    stageEl.appendChild(fig);
    requestAnimationFrame(function () { fig.classList.add("is-in"); });
    A.$("[data-lb-count]", dlg).textContent = A.pad2(idx + 1) + " / " + A.pad2(ids.length);
    A.$("[data-lb-caption]", dlg).innerHTML = '<span>' + A.esc(catLabel(id)) + "</span>" + A.esc(A.t(p.alt));
    // précharge les voisines
    [idx + 1, idx - 1].forEach(function (k) {
      var n = ids[(k + ids.length) % ids.length]; var m = A.manifest[n];
      if (m) { var im = new Image(); im.src = A.imgPath + n + "-" + m.widths[Math.min(m.widths.length - 1, 2)] + ".webp"; }
    });
  }
  function go(step) { idx = (idx + step + ids.length) % ids.length; paint(step); }

  A.lightbox = {
    open: function (list, index, from) {
      ids = list.slice(); idx = A.clamp(index || 0, 0, ids.length - 1); opener = from || null;
      shell(); paint(0);
      document.documentElement.classList.add("is-locked");
      if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", "");
      A.$("[data-lb-close]", dlg).focus();
    },
    close: function () { if (dlg.open) dlg.close(); },
    isOpen: function () { return dlg.open; },
  };

  dlg.addEventListener("click", function (e) {
    if (e.target.closest("[data-lb-close]") || e.target === dlg || e.target.matches("[data-lb-stage]")) { A.lightbox.close(); return; }
    if (e.target.closest("[data-lb-prev]")) go(-1);
    else if (e.target.closest("[data-lb-next]")) go(1);
  });
  dlg.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
    else if (e.key === "Home") { e.preventDefault(); idx = 0; paint(-1); }
    else if (e.key === "End") { e.preventDefault(); idx = ids.length - 1; paint(1); }
  });
  dlg.addEventListener("close", function () {
    document.documentElement.classList.remove("is-locked");
    dlg.innerHTML = "";
    if (opener && document.contains(opener)) opener.focus();
    opener = null;
  });
  // balayage au doigt
  dlg.addEventListener("touchstart", function (e) { if (e.touches.length === 1) { touchX = e.touches[0].clientX; touchY = e.touches[0].clientY; } }, { passive: true });
  dlg.addEventListener("touchend", function (e) {
    if (touchX == null) return;
    var dx = e.changedTouches[0].clientX - touchX, dy = e.changedTouches[0].clientY - touchY;
    touchX = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4) go(dx < 0 ? 1 : -1);
  }, { passive: true });
  A.onLang(function () { if (dlg.open) { shell(); paint(0); A.$("[data-lb-close]", dlg).focus(); } });
})();
