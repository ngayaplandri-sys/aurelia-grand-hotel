/* AURELIA GRAND · noyau
   Espace de noms, langue (EN / FR), outils de rendu partagés : échappement, icônes, <picture> responsive, mots révélés.
   Aucun contenu ici : les textes sont dans assets/js/data/, les photographies dans data/photos.js. */
(function () {
  "use strict";
  var A = (window.AURELIA = window.AURELIA || {});
  A.data = A.data || {};
  var root = document.documentElement;
  var doc = document;

  A.imgPath = "assets/img/";
  A.mobileQuery = "(max-width: 767px), (orientation: portrait)";          // téléphones et écrans verticaux (tablettes en portrait) : compositions verticales

  /* ---------- Langue ---------- */
  // Français par défaut ; l'anglais reste disponible (bouton EN / FR, ?lang=en). Le script en tête d'index.html fixe <html lang> avant le premier rendu : garder les deux identiques.
  A.lang = root.lang === "en" ? "en" : "fr";
  var langListeners = [];
  A.onLang = function (fn) { langListeners.push(fn); };
  A.setLang = function (l) {
    l = l === "en" ? "en" : "fr";
    if (l === A.lang) return;
    A.lang = l;
    root.lang = l;
    try { localStorage.setItem("aurelia-lang", l); } catch (e) {}
    langListeners.forEach(function (fn) { fn(l); });
  };

  // Typographie française appliquée à la lecture : apostrophe courbe, espace insécable avant : ; ! ? » et après « (jamais de signe seul en début de ligne).
  function frTypo(v) {
    if (typeof v === "string") return v.replace(/'/g, "’").replace(/ ([:;!?»])/g, " $1").replace(/« /g, "« ");
    if (Array.isArray(v)) return v.map(frTypo);
    return v;
  }

  // Un texte traduit s'écrit { en: "...", fr: "..." } ; une liste traduite { en: [...], fr: [...] }.
  A.t = function (v) {
    if (v == null) return "";
    if (typeof v === "object" && !Array.isArray(v) && ("en" in v || "fr" in v)) {
      if (A.lang === "fr" && v.fr != null) return frTypo(v.fr);
      return v[A.lang] != null ? v[A.lang] : v.en;
    }
    return v;
  };

  /* ---------- Outils ---------- */
  var ESC = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  A.esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return ESC[c]; }); };
  A.$ = function (sel, scope) { return (scope || doc).querySelector(sel); };
  A.$$ = function (sel, scope) { return Array.prototype.slice.call((scope || doc).querySelectorAll(sel)); };
  A.icon = function (name, cls) { return '<svg class="icon' + (cls ? " " + cls : "") + '" aria-hidden="true" focusable="false"><use href="#i-' + name + '"/></svg>'; };
  A.clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
  A.lerp = function (a, b, k) { return a + (b - a) * k; };
  A.smooth = function (x) { x = A.clamp(x, 0, 1); return x * x * (3 - 2 * x); };
  A.smoother = function (x) { x = A.clamp(x, 0, 1); return x * x * x * (x * (x * 6 - 15) + 10); };
  A.easeOut = function (x) { x = A.clamp(x, 0, 1); return 1 - Math.pow(1 - x, 3); };
  A.easeInOut = function (x) { x = A.clamp(x, 0, 1); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
  A.pad2 = function (n) { return n < 10 ? "0" + n : String(n); };
  A.isMobile = function () { return window.matchMedia(A.mobileQuery).matches; };

  /* Mouvement réduit : version simple et élégante, sans animation guidée par le défilement */
  var mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  A.reduceMotion = function () { return mq.matches; };

  /* ---------- Photographies ---------- */
  A.photo = function (id) { return (A.photos || {})[id]; };

  function srcset(name, ext) {
    var m = (A.manifest || {})[name];
    if (!m) return "";
    return m.widths.map(function (w) { return A.imgPath + name + "-" + w + "." + ext + " " + w + "w"; }).join(", ");
  }
  function midWidth(name) {
    var m = A.manifest[name]; var ws = m.widths;
    return ws[Math.min(ws.length - 1, Math.max(0, ws.length - 2))];
  }
  A.hasPhoto = function (id) { return !!(A.manifest && A.manifest[id]); };
  A.photoColor = function (id) { var m = (A.manifest || {})[id]; return m ? m.c : "#33251a"; };

  /* <picture> responsive : AVIF puis WebP, version verticale dédiée sur mobile quand elle existe.
     o.sizes   : attribut sizes (ordinateur)    o.sizesM : sizes (mobile)
     o.art     : true = utiliser la version verticale (id-m) sur téléphone / écran vertical, pour les photographies plein écran
     o.eager   : chargement immédiat            o.alt    : remplace le texte alternatif ("" = décoratif)
     o.focus   : [x, y] en % (cadrage)          o.cls    : classe de l'image          o.attrs : attributs supplémentaires */
  A.pic = function (id, o) {
    o = o || {};
    var p = A.photo(id) || {}, man = (A.manifest || {})[id];
    if (!man) { if (window.console) console.warn("[AURELIA] photographie absente du manifeste :", id); return ""; }
    var mob = o.art && A.manifest[id + "-m"] ? id + "-m" : null;      // composition verticale dédiée, seulement pour les plans plein écran
    var sizes = o.sizes || "100vw", sizesM = o.sizesM || o.sizes || "100vw";
    var f = o.focus || p.focus || [50, 50], fm = o.focusM || p.focusM || f;
    var alt = o.alt != null ? o.alt : A.t(p.alt);
    var html = "<picture>";
    if (mob) {
      html += '<source media="' + A.mobileQuery + '" type="image/avif" srcset="' + srcset(mob, "avif") + '" sizes="' + sizesM + '">';
      html += '<source media="' + A.mobileQuery + '" type="image/webp" srcset="' + srcset(mob, "webp") + '" sizes="' + sizesM + '">';
    }
    html += '<source type="image/avif" srcset="' + srcset(id, "avif") + '" sizes="' + sizes + '">';
    html += '<source type="image/webp" srcset="' + srcset(id, "webp") + '" sizes="' + sizes + '">';
    html += '<img class="' + A.esc(o.cls || "") + '" src="' + A.imgPath + id + "-" + midWidth(id) + '.webp" width="' + man.w + '" height="' + man.h + '" alt="' + A.esc(alt) + '"' +
      (o.eager ? ' loading="eager" fetchpriority="high"' : ' loading="lazy"') + ' decoding="async" style="--op:' + f[0] + "% " + f[1] + "%;--op-m:" + fm[0] + "% " + fm[1] + '%"' + (o.attrs ? " " + o.attrs : "") + ">";
    return html + "</picture>";
  };

  /* Cadre photo : fond de couleur moyenne, proportion imposée, parallaxe facultative (o.parallax = vitesse) */
  A.frame = function (id, o) {
    o = o || {};
    var c = o.cls ? " " + o.cls : "";
    var inner = A.pic(id, o);
    if (o.parallax) inner = '<div class="ph__move" data-parallax="' + o.parallax + '">' + inner + "</div>";
    var style = "background:" + A.photoColor(id) + (o.ratio ? ";aspect-ratio:" + o.ratio : "") + (o.delay ? ";--d:" + o.delay + "ms" : "");
    return '<div class="ph' + c + '" style="' + style + '"' + (o.reveal ? ' data-reveal="' + o.reveal + '"' : "") + ">" + inner + "</div>";
  };

  /* Titre en mots masqués : « More than a stay. » -> <span class="w"><span style="--i:0">More</span></span> ... ; <em> conservé via *mot* */
  A.words = function (text, start) {
    var i = start || 0;
    return String(text).split(/[ \t\r\n]+/).filter(Boolean).map(function (w) {          // espaces ordinaires seulement : une espace insécable reste collée à son mot
      var em = /^\*.+\*[.,;:!? ]*$/.test(w);
      var clean = A.esc(w.replace(/\*/g, ""));
      return '<span class="w"><span style="--i:' + (i++) + '">' + (em ? "<em>" + clean + "</em>" : clean) + "</span></span>";
    }).join(" ");
  };
  A.title = function (value, tag, cls, id) {
    return "<" + tag + (id ? ' id="' + id + '"' : "") + ' class="' + (cls || "title") + '" data-split aria-label="' + A.esc(String(A.t(value)).replace(/\*/g, "")) + '"><span aria-hidden="true">' + A.words(A.t(value)) + "</span></" + tag + ">";
  };

  /* Boutons et liens */
  A.btn = function (a, cls) {
    var style = a.style || "solid";
    var attrs = a.attrs ? " " + a.attrs : "";
    return '<a class="btn btn--' + style + (cls ? " " + cls : "") + '" href="' + A.esc(a.href) + '"' + attrs + ">" + A.esc(A.t(a.label)) + (a.icon === false ? "" : A.icon("arrow-right")) + "</a>";
  };

  /* Défilement doux vers une ancre, sans animation si l'utilisateur la refuse */
  A.scrollToY = function (y) {
    // Loin (plus de trois écrans) : saut direct, pour ne pas faire défiler toute la visite à toute vitesse.
    var far = Math.abs(y - window.scrollY) > window.innerHeight * 3;
    window.scrollTo({ top: Math.max(0, y), behavior: A.reduceMotion() || far ? "auto" : "smooth" });
  };
  A.scrollToId = function (id) {
    var el = doc.getElementById(id);
    if (!el) return false;
    A.scrollToY(el.getBoundingClientRect().top + window.scrollY - (parseFloat(getComputedStyle(root).getPropertyValue("--header-h")) || 76) + 1);
    return true;
  };

  /* Date locale (démonstration) */
  A.fmtDate = function (iso) {
    try { return new Date(iso + "T12:00:00").toLocaleDateString(A.lang === "fr" ? "fr-FR" : "en-GB", { weekday: "short", day: "numeric", month: "long", year: "numeric" }); } catch (e) { return iso; }
  };
})();
