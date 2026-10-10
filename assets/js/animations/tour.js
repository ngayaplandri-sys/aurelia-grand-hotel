/* AURELIA GRAND · la visite (CINEMATIC IMAGE SCROLL STORYTELLING)
   Une scène épinglée (sticky) de photographies, pilotée par le défilement natif : la page reste libre, aucune vidéo, aucun faux défilement.
   Le défilement fait varier le cadrage de chaque photographie (zoom, déplacement), déclenche les transitions (transitions.js) et révèle les textes.
   Les textes restent du HTML réel (sélectionnable, accessible). Mode fixe (mouvement réduit, économie de données) : photographies et textes à la suite. */
(function () {
  "use strict";
  var A = (window.AURELIA = window.AURELIA || {});
  var D = A.data && A.data.tour;
  var root = document.documentElement;
  var section = A.$("[data-tour]");
  if (!section || !D) return;

  var stage = A.$("[data-stage]", section);
  var scenesEl = A.$("[data-scenes]", stage);
  var chaptersEl = A.$("[data-chapters]", stage);
  var uiEl = A.$("[data-tour-ui]", stage);
  var shadeEls = { bottom: A.$("[data-shade-bottom]", stage), left: A.$("[data-shade-left]", stage), right: A.$("[data-shade-right]", stage), center: A.$("[data-shade-center]", stage) };
  var T = (A.tour = { mode: root.classList.contains("is-cinematic") ? "cinematic" : "static" });
  var css = A.transitionCss;
  var clamp = A.clamp, lerp = A.lerp, smooth = A.smooth;

  function f(n, d) { return (+n).toFixed(d == null ? 3 : d); }

  /* ---------- Textes d'un chapitre ---------- */
  function actionHTML(a) {
    var key = typeof a === "string" ? a : a.use;
    var act = A.data.hotel.actions[key];
    if (!act) return "";
    return A.btn({ label: act.label, href: act.href, style: (typeof a === "object" && a.style) || "line" });
  }
  function chapterHTML(def, tag) {
    return '<div class="chapter__inner">' +
      (def.eyebrow ? '<p class="eyebrow chapter__eyebrow" data-fx>' + A.esc(A.t(def.eyebrow)) + "</p>" : "") +
      "<" + tag + ' class="chapter__title" aria-label="' + A.esc(String(A.t(def.title)).replace(/\*/g, "")) + '"><span aria-hidden="true">' + A.words(A.t(def.title)) + "</span></" + tag + ">" +
      (def.text ? '<p class="chapter__text" data-fx>' + A.esc(A.t(def.text)) + "</p>" : "") +
      (def.sign ? '<p class="chapter__sign" data-fx>' + A.esc(A.t(def.sign)) + "</p>" : "") +
      (def.actions && def.actions.length ? '<div class="chapter__actions" data-fx>' + def.actions.map(actionHTML).join("") + "</div>" : "") +
      "</div>";
  }

  /* ---------- Réglages communs ---------- */
  var heroEl = A.$('[data-chapter="hero"]', chaptersEl);
  function wrapHeroWords() {
    A.$$(".hero-word", heroEl).forEach(function (w) {
      if (w.parentNode.classList.contains("w")) return;
      var mask = document.createElement("span"); mask.className = "w";
      w.parentNode.insertBefore(mask, w); mask.appendChild(w);
    });
  }

  /* ---------- Description textuelle complète (lecteurs d'écran) ---------- */
  function renderStepsList() {
    var el = A.$("[data-tour-steps]", section);
    if (!el) { el = document.createElement("div"); el.className = "sr-only"; el.setAttribute("data-tour-steps", ""); section.insertBefore(el, section.firstChild); }
    el.innerHTML = "<h2>" + A.esc(A.t(A.data.hotel.ui.tourStepsTitle)) + "</h2><ol>" + D.chapters.map(function (c) {
      var p = A.photo(c.still) || {};
      return "<li>" + (c.eyebrow ? A.esc(A.t(c.eyebrow)) + " — " : "") + A.esc(String(A.t(c.title)).replace(/\*/g, "")) + (c.text ? ". " + A.esc(A.t(c.text)) : "") + ". " + A.esc(A.t(p.alt)) + "</li>";
    }).join("") + "</ol>";
  }

  /* =====================================================================================
     MODE FIXE : photographies et textes à la suite, sans mouvement guidé par le défilement
     ===================================================================================== */
  function mountStatic() {
    T.mode = "static";
    var host = A.$("[data-tour-panels]", section);
    if (!host) { host = document.createElement("div"); host.className = "tour__panels"; host.setAttribute("data-tour-panels", ""); section.insertBefore(host, A.$("[data-tour-end]", section)); }
    function render() {
      var prevStill = "facade";
      host.innerHTML = D.chapters.filter(function (c) { return c.id !== "hero"; }).map(function (c) {
        // même photographie que le panneau précédent (la citation de la façade) : un bandeau de texte, sans répéter l'image
        if (c.still === prevStill) {
          return '<article class="tpanel tpanel--quote tpanel--text" data-chapter="' + c.id + '">' + chapterHTML(c, "h2").replace('class="chapter__inner"', 'class="chapter__inner tpanel__inner"') + "</article>";
        }
        prevStill = c.still;
        var extras = (c.extras || []).map(function (id) { return '<div class="tpanel__extra">' + A.pic(id, { sizes: "(max-width: 767px) 50vw, 24vw", art: true }) + "</div>"; }).join("");
        return '<article class="tpanel tpanel--' + c.layout + '" data-chapter="' + c.id + '"><div class="tpanel__media" style="background:' + A.photoColor(c.still) + '">' + A.pic(c.still, { sizes: "100vw", art: true }) + "</div>" +
          chapterHTML(c, "h2").replace('class="chapter__inner"', 'class="chapter__inner tpanel__inner"') + (extras ? '<div class="tpanel__extras">' + extras + "</div>" : "") + "</article>";
      }).join("");
      // texte de lecture : les mots ne sont pas masqués
      A.$$(".w > span", host).forEach(function (s) { s.style.transform = "none"; });
    }
    render();
    A.onLang(render);
    var start = A.$("[data-tour-start]", section);
    if (start) start.setAttribute("href", "#intro");
  }

  if (T.mode === "static") { wrapHeroWords(); mountStatic(); return; }

  /* =====================================================================================
     MODE CINÉMATIQUE
     ===================================================================================== */
  var mobileQ = window.matchMedia(A.mobileQuery);
  var scenes = [], chapters = [], byId = {};
  var total = 0, vhPx = 8, stageW = 1280, stageH = 720, sectionTop = 0, scaleK = 1, mobile = false;
  var shown = 0, target = 0, introT = 0, introStart = 0, ready = false, running = false;
  var lastIdx = -1;

  /* ----- Construction des scènes ----- */
  function sceneAspect(def) {
    var id = mobile && A.manifest[def.photo + "-m"] ? def.photo + "-m" : def.photo;
    var m = A.manifest[id] || A.manifest[def.photo];
    return m ? m.w / m.h : 16 / 9;
  }
  function buildScenes() {
    D.scenes.forEach(function (def, i) {
      var el, media;
      if (i === 0) {
        el = A.$('[data-scene="' + def.id + '"]', scenesEl);
        media = A.$("[data-media]", el);
        var out = document.createElement("div"); out.className = "scene__out";
        var inn = document.createElement("div"); inn.className = "scene__in";
        el.insertBefore(out, media); out.appendChild(inn); inn.appendChild(media);
      } else {
        el = document.createElement("div");
        el.className = "scene"; el.setAttribute("data-scene", def.id);
        el.innerHTML = '<div class="scene__out"><div class="scene__in"><div class="scene__media" data-media></div></div></div>';
        scenesEl.appendChild(el);
        media = A.$("[data-media]", el);
      }
      var veil = document.createElement("div"); veil.className = "scene__veil"; el.appendChild(veil);
      media.style.backgroundColor = A.photoColor(def.photo);
      var s = {
        def: def, i: i, el: el, out: A.$(".scene__out", el), inn: A.$(".scene__in", el), media: media, veil: veil,
        type: i === 0 ? null : def.enter.type, band: false, loaded: i === 0, live: i === 0, vIn: 0, vOut: 0,
      };
      // calques de profondeur : éléments d'avant-plan (branche, guirlande) qui défilent plus vite que la photographie, pour la parallaxe
      s.layers = (def.layers || []).map(function (L) {
        var le = document.createElement("div"); le.className = "scene__layer"; le.setAttribute("aria-hidden", "true");
        if (L.origin) le.style.transformOrigin = L.origin[0] + "% " + L.origin[1] + "%";
        if (L.opacity != null) le.style.opacity = L.opacity;
        s.inn.appendChild(le);
        return { def: L, el: le };
      });
      if (s.type === "frame") {
        s.frameEl = document.createElement("div"); s.frameEl.className = "scene__frame"; s.frameEl.setAttribute("aria-hidden", "true"); s.inn.appendChild(s.frameEl);
      }
      scenes.push(s); byId[def.id] = s;
    });
  }

  function ensure(i) {
    var s = scenes[i];
    if (!s || s.loaded) return;
    s.loaded = true;
    s.media.insertAdjacentHTML("afterbegin", A.pic(s.def.photo, { sizes: "100vw", art: true, attrs: 'data-tour-img', alt: A.t((A.photo(s.def.photo) || {}).alt) }).replace('loading="lazy"', 'loading="eager"'));
    var img = A.$("img", s.media);
    if (img && img.decode) img.decode().catch(function () {});
    s.layers.forEach(function (L) {
      if (!A.hasPhoto(L.def.photo)) return;
      L.el.innerHTML = A.pic(L.def.photo, { sizes: "100vw", alt: "", focus: L.def.pos || [50, 50], focusM: L.def.posM || L.def.pos || [50, 50] }).replace('loading="lazy"', 'loading="eager"');
      L.loaded = true;
    });
  }
  function relabelImages() {
    scenes.forEach(function (s) { var img = A.$("img", s.media); if (img) img.alt = A.t((A.photo(s.def.photo) || {}).alt); });
  }

  /* ----- Chapitres ----- */
  function buildChapters() {
    D.chapters.forEach(function (def) {
      var el;
      if (def.id === "hero") { el = heroEl; wrapHeroWords(); }
      else {
        el = document.createElement("article");
        el.className = "chapter chapter--" + def.layout; el.setAttribute("data-chapter", def.id); el.setAttribute("data-layout", def.layout);
        el.innerHTML = chapterHTML(def, "h2");
        chaptersEl.appendChild(el);
      }
      chapters.push({ def: def, el: el, words: [], fx: [], f: -1, live: null, hasActions: !!(def.actions && def.actions.length) || def.id === "hero" });
    });
    collectChapterParts();
  }
  function collectChapterParts() {
    chapters.forEach(function (c) {
      c.words = A.$$(".w > span", c.el);
      c.fx = A.$$("[data-fx]", c.el);
      c.key = null;
      if (c.def.id !== "hero" && !c.hasActions) c.el.setAttribute("aria-hidden", "true");
    });
  }
  function refreshText() {
    chapters.forEach(function (c) {
      if (c.def.id === "hero") return;
      c.el.innerHTML = chapterHTML(c.def, "h2");
    });
    collectChapterParts();
    relabelImages();
    renderStepsList();
    renderUI();
    A.engine.kick(); render(true);
  }

  /* ----- Interface : compteur, rail, barre de progression ----- */
  var numEl, labelEl, barEl, railEl, cueEl;
  function renderUI() {
    var ui = A.data.hotel.ui;
    uiEl.removeAttribute("aria-hidden");
    uiEl.innerHTML =
      '<div class="tour__count" aria-hidden="true"><span class="tour__num" data-num>01</span><span class="tour__label" data-label></span>' + (A.data.hotel.demo ? '<span class="tour__demo">' + A.esc(A.t(ui.conceptTag)) + "</span>" : "") + "</div>" +
      '<nav class="tour__rail" aria-label="' + A.esc(A.t(ui.tourStepsTitle)) + '"><ol>' + scenes.map(function (s, i) {
        return '<li><button type="button" data-go="' + i + '" aria-label="' + A.esc(A.pad2(i + 1) + " · " + A.t(s.def.label)) + '"><span></span></button></li>';
      }).join("") + "</ol></nav>" +
      '<div class="tour__bar" aria-hidden="true"><span data-bar></span></div>' +
      '<div class="tour__cue" aria-hidden="true" data-cue><span>' + A.esc(A.t(ui.scroll)) + '</span><i></i></div>';
    numEl = A.$("[data-num]", uiEl); labelEl = A.$("[data-label]", uiEl); barEl = A.$("[data-bar]", uiEl); railEl = A.$(".tour__rail", uiEl); cueEl = A.$("[data-cue]", uiEl);
    lastIdx = -1;
  }
  uiEl.addEventListener("click", function (e) {
    var b = e.target.closest("[data-go]");
    if (b) T.goTo(+b.getAttribute("data-go"));
  });

  /* ----- Mesure et frise temporelle ----- */
  function ref(str) {
    var m = /^([\w-]+)@(land|leave|[\d.]+)([+-]\d+(?:\.\d+)?)?$/.exec(str), s = byId[m[1]], base;
    if (m[2] === "land") base = s.i === 0 ? 0 : s.eEnd;                         // la photographie vient d'arriver
    else if (m[2] === "leave") { var n = scenes[s.i + 1]; base = n ? n.eStart : total; }   // la transition suivante commence
    else base = s.start + clamp(+m[2], 0, 1) * s.len;
    return base + (m[3] ? +m[3] * scaleK : 0);
  }
  function measure() {
    mobile = mobileQ.matches;
    scaleK = mobile ? D.mobileScale : 1;
    stageW = stage.clientWidth || window.innerWidth;
    stageH = stage.clientHeight || window.innerHeight;
    vhPx = stageH / 100;
    var acc = 0;
    scenes.forEach(function (s) {
      s.len = s.def.vh * scaleK; s.start = acc; acc += s.len;
    });
    total = acc;
    scenes.forEach(function (s, i) {
      var raw = s.def.enter || {};
      s.cfg = Object.assign({}, raw, raw[mobile ? "m" : "d"] || {});
      s.cfg.w = stageW; s.cfg.h = stageH; s.cfg.mobile = mobile;
      var dur = i === 0 ? 0 : (raw.vh || 90) * scaleK;
      s.eStart = i === 0 ? 0 : s.start - dur / 2;
      s.eEnd = i === 0 ? 0 : s.start + dur / 2;
      s.aspect = sceneAspect(s.def);
      // cadre éditorial : la photographie occupe une fenêtre (haut, droite, bas, gauche en % de l'écran)
      s.w = stageW; s.h = stageH;
      if (s.type === "frame") {
        var I = s.cfg.inset || [11, 5, 11, 42];
        css(s.out, "inset", I[0] + "% " + I[1] + "% " + I[2] + "% " + I[3] + "%");
        s.w = stageW * (100 - I[1] - I[3]) / 100; s.h = stageH * (100 - I[0] - I[2]) / 100;
      }
    });
    scenes.forEach(function (s, i) {
      var next = scenes[i + 1];
      s.lifeStart = i === 0 ? 0 : s.eStart;
      s.lifeEnd = next ? next.eEnd : total;
      // lobby en bandeau : photo très large, visible en entier avant de s'ouvrir sur tout l'écran
      var fit = stageW / (stageH * s.aspect);
      s.fit = clamp(fit, 0.5, 1);
      s.band = !!(s.cfg.band) && !mobile && fit < 0.98;
    });
    chapters.forEach(function (c) {
      c.from = ref(c.def.from); c.to = ref(c.def.to);
    });
    // la section suivante glisse sur la dernière image (recouvrement de 14 % de l'écran, voir sections.css) : on prolonge d'autant l'épinglage
    section.style.height = Math.round(total * vhPx + stageH + stageH * 0.14) + "px";
    sectionTop = section.getBoundingClientRect().top + window.scrollY;
  }
  function vNow() { return clamp((window.scrollY - sectionTop) / vhPx, 0, total); }

  /* ----- Caméra : zoom + point de la photo placé au centre ----- */
  function camAt(s, u) {
    var keys = (s.def.cam && (s.def.cam[mobile ? "m" : "d"] || s.def.cam.d)) || [[0, 1, 50, 50], [1, 1, 50, 50]];
    // léger adoucissement global : la caméra démarre et s'arrête en douceur
    u = lerp(u, smooth(u), 0.55);
    var a = keys[0], b = keys[keys.length - 1];
    for (var i = 0; i < keys.length - 1; i++) {
      if (u <= keys[i + 1][0]) { a = keys[i]; b = keys[i + 1]; break; }
    }
    var k = b[0] === a[0] ? 1 : clamp((u - a[0]) / (b[0] - a[0]), 0, 1);
    var z0 = a[1] === 0 ? s.fit : a[1], z1 = b[1] === 0 ? s.fit : b[1];   // zoom 0 = photo visible en entier dans la largeur (bandeau)
    return { z: lerp(z0, z1, k), x: lerp(a[2], b[2], k), y: lerp(a[3], b[3], k) };
  }
  function applyCamera(s, u) {
    var c = camAt(s, u), z = c.z;
    if (s.i === 0) z *= 1 + 0.09 * (1 - A.easeOut(introT));                       // arrivée : la façade se pose
    var tx = 0, ty = 0;
    if (z >= 1) {
      tx = clamp(-(c.x / 100 - 0.5) * s.w * z, -(z - 1) * s.w / 2, (z - 1) * s.w / 2);
      ty = clamp(-(c.y / 100 - 0.5) * s.h * z, -(z - 1) * s.h / 2, (z - 1) * s.h / 2);
    }
    css(s.media, "transform", "translate3d(" + f(tx, 2) + "px," + f(ty, 2) + "px,0) scale(" + f(z, 4) + ")");
    s.layers.forEach(function (L) {
      if (!L.loaded) return;
      var keys = (L.def.cam[mobile ? "m" : "d"] || L.def.cam.d), k = lerp(u, smooth(u), 0.55), a = keys[0], b = keys[keys.length - 1];
      for (var i = 0; i < keys.length - 1; i++) if (k <= keys[i + 1][0]) { a = keys[i]; b = keys[i + 1]; break; }
      var m = b[0] === a[0] ? 1 : clamp((k - a[0]) / (b[0] - a[0]), 0, 1);
      css(L.el, "transform", "translate3d(" + f(lerp(a[2], b[2], m) / 100 * s.w, 2) + "px," + f(lerp(a[3], b[3], m) / 100 * s.h, 2) + "px,0) scale(" + f(lerp(a[1], b[1], m), 4) + ")");
    });
    if (s.band) {
      var b = z < 1 ? (1 - z) / 2 * 100 : 0;
      css(s.el, "clipPath", b > 0.05 ? "inset(" + f(b, 2) + "% 0 " + f(b, 2) + "% 0)" : "none");
    }
  }

  function setLive(s, on) {
    if (s.live === on) return;
    s.live = on;
    s.el.classList.toggle("is-live", on);
  }

  /* ----- Image d'un instant donné ----- */
  function render(force) {
    var v = shown;
    // une scène arrivée en plein écran masque celles du dessous (sauf les cadres éditoriaux, qui laissent voir la scène précédente)
    var top = 0;
    scenes.forEach(function (s, i) { if (i > 0 && s.type !== "frame" && v >= s.eEnd) top = i; });
    var cur = 0;
    scenes.forEach(function (s, i) { s.vIn = 0; s.vOut = 0; if (i > 0 && v >= s.start) cur = i; });

    scenes.forEach(function (s, i) {
      var on = i >= top && (i === 0 || v > s.eStart);
      setLive(s, on);
      if (on) ensure(i);
      if (!on) {
        // la scène n'est pas (encore) visible : la précédente retrouve son état normal (retour en arrière)
        if (i > 0 && v <= s.eStart) css(scenes[i - 1].out, "transform", "none");
        return;
      }
      var p = i === 0 ? 1 : clamp((v - s.eStart) / (s.eEnd - s.eStart), 0, 1);
      if (i > 0) {
        var tr = A.transitions[s.type] || A.transitions.fade;
        tr.enter(s, p, s.cfg);
        var prev = scenes[i - 1];
        if (prev.live) { (A.transitions[s.type] || A.transitions.fade).exit(prev, p, s.cfg); }
      } else {
        css(s.el, "opacity", "1");
      }
      applyCamera(s, clamp((v - s.lifeStart) / (s.lifeEnd - s.lifeStart || 1), 0, 1));
    });
    scenes.forEach(function (s) {
      if (!s.live) return;
      css(s.veil, "opacity", f(Math.max(s.vIn, s.vOut), 3));
      if (s.i > 0 && v >= s.eEnd && s.type !== "frame" && s.vOut === 0) { /* rien : transition terminée */ }
    });

    // voisines à charger
    for (var k = 1; k <= 2; k++) ensure(cur + k);

    updateChapters(v);
    updateUI(v, cur);
  }

  /* ----- Chapitres : apparition par mots masqués, sortie vers le haut ----- */
  function wordProgress(x, i, n) { return clamp(x * (1 + 0.075 * n) - 0.075 * i, 0, 1); }
  function updateChapters(v) {
    var sh = { bottom: 0, left: 0, right: 0, center: 0 };
    chapters.forEach(function (c) {
      var def = c.def, last = def.id === "finale", first = def.id === "hero";
      var len = c.to - c.from;
      var fi = Math.min(22 * scaleK, len * 0.4), fo = Math.min(20 * scaleK, len * 0.35);
      var a = first ? A.smoother(introT) : smooth((v - c.from) / fi);
      var b = last ? 1 : smooth((c.to - v) / fo);
      var fv = Math.min(a, b);
      if (def.shade && sh[def.shade] != null) sh[def.shade] = Math.max(sh[def.shade], fv);
      var key = f(a, 3) + "|" + f(b, 3);
      if (key === c.key) return;
      c.key = key;
      var n = c.words.length;
      c.words.forEach(function (w, i) {
        var up = (1 - wordProgress(a, i, n)) * 108 - (1 - wordProgress(b, i, n)) * 108;
        css(w, "transform", up === 0 ? "none" : "translate3d(0," + f(up, 2) + "%,0)");
      });
      var dir = v > (c.from + c.to) / 2 ? -1 : 1;
      c.fx.forEach(function (el, i) {
        var o = clamp((fv - 0.12 * i) / (1 - 0.12 * i), 0, 1);
        css(el, "opacity", f(o, 3));
        css(el, "transform", o >= 1 ? "none" : "translate3d(0," + f((1 - o) * 18 * dir, 2) + "px,0)");
      });
      var live = fv > 0.4;
      if (c.live !== live) {
        c.live = live;
        c.el.classList.toggle("is-on", live);
        // un texte masqué ne capte ni clics ni tabulation ; le titre principal (h1) reste dans l'arbre d'accessibilité
        if (c.def.id === "hero") { var act = A.$(".chapter__actions", c.el); if (act) act.inert = !live; }
        else c.el.inert = !live;
      }
    });
    for (var kind in sh) css(shadeEls[kind], "opacity", f(sh[kind], 3));
  }

  /* ----- Compteur, rail, barre ----- */
  function updateUI(v, cur) {
    if (!numEl) return;
    if (cur !== lastIdx) {
      lastIdx = cur;
      numEl.textContent = A.pad2(cur + 1);
      labelEl.textContent = A.t(scenes[cur].def.label);
      A.$$("[data-go]", railEl).forEach(function (b, i) { b.classList.toggle("is-on", i === cur); if (i === cur) b.setAttribute("aria-current", "step"); else b.removeAttribute("aria-current"); });
    }
    css(barEl, "transform", "scaleX(" + f(v / total, 4) + ")");
    css(cueEl, "opacity", f(clamp(1 - v / 18, 0, 1) * smooth(introT * 1.4 - 0.4)));
  }

  /* ----- Boucle ----- */
  function tick(fr) {
    var dt = fr.dt;
    if (introStart && introT < 1) introT = clamp((fr.now - introStart) / 2400, 0, 1);
    target = vNow();
    var gap = target - shown;
    if (Math.abs(gap) > 220) shown = target;                       // grand saut (ancre, touche Fin) : pas de rembobinage
    else shown += gap * (1 - Math.exp(-dt * 7.5));                 // lissage indépendant de la fréquence d'affichage
    if (Math.abs(target - shown) < 0.015) shown = target;
    var sig = f(shown, 3) + "|" + f(introT, 3);
    if (sig !== tick.sig) { tick.sig = sig; render(); }
    return shown !== target || introT < 1;
  }

  /* ----- API ----- */
  T.goTo = function (i) {
    i = clamp(i, 0, scenes.length - 1);
    var s = scenes[i];
    var y = sectionTop + (i <= 0 ? 0 : s.eEnd + 6 * scaleK) * vhPx;
    ensure(i); ensure(i + 1);
    // loin : saut direct (un défilement doux traverserait toute la visite) ; près : défilement doux
    window.scrollTo({ top: y, behavior: A.reduceMotion() || Math.abs(y - window.scrollY) > stageH * 4 ? "auto" : "smooth" });
  };
  T.start = function () { A.scrollToY(sectionTop + ref("facade@0+112") * vhPx); };
  T.state = function () {
    var cur = 0; scenes.forEach(function (s, i) { if (i > 0 && shown >= s.start) cur = i; });
    return { mode: T.mode, v: +shown.toFixed(1), total: +total.toFixed(1), scene: scenes[cur].def.id, index: cur, vhPx: vhPx, mobile: mobile };
  };
  T.seek = function (v) { window.scrollTo(0, sectionTop + clamp(v, 0, total) * vhPx); shown = target = vNow(); render(); return T.state(); };
  T.scenes = scenes; T.chapters = chapters;
  T.seekScene = function (id, k) { var s = byId[id]; return T.seek(s.start + (k == null ? 0.5 : k) * s.len); };

  /* ----- Démarrage ----- */
  function init() {
    buildScenes();
    buildChapters();
    renderStepsList();
    measure();
    renderUI();
    shown = target = vNow();
    render(true);
    A.engine.add(tick);
    A.engine.onResize(function () {
      var keep = vNow();
      measure();
      // même position dans la visite quand la hauteur d'écran change
      if (window.scrollY > sectionTop - 4 && window.scrollY < sectionTop + total * vhPx + stageH) window.scrollTo(0, sectionTop + keep * vhPx);
      shown = target = vNow(); tick.sig = null; render(true);
    });
    mobileQ.addEventListener("change", function () { measure(); tick.sig = null; render(true); });
    A.onLang(refreshText);
    // premier plan : on attend la photographie (ou 700 ms) pour lancer l'ouverture
    var first = A.$("img", scenes[0].media);
    var go = function () { if (!introStart) { introStart = performance.now(); A.engine.kick(); } };
    if (first && !first.complete) { first.addEventListener("load", go, { once: true }); first.addEventListener("error", go, { once: true }); setTimeout(go, 1400); } else go();
    // préchargement doux, en temps libre : seulement les deux plans suivants (les autres se chargent au fil du défilement, jamais toutes les photographies d'un coup)
    var c = navigator.connection, slow = c && /(^|-)2g|3g/.test(c.effectiveType || "");
    var idle = window.requestIdleCallback || function (fn) { return setTimeout(fn, 400); };
    var next = 1, limit = slow ? 1 : 2;
    function prefetch() { if (next <= limit) { ensure(next++); setTimeout(function () { idle(prefetch); }, 900); } }
    window.addEventListener("load", function () { idle(prefetch); });
    // « Découvrir l'hôtel » lance la visite plutôt que de la sauter
    var start = A.$("[data-tour-start]", section);
    if (start) start.addEventListener("click", function (e) { e.preventDefault(); T.start(); });
    ready = true;
  }
  init();
})();
