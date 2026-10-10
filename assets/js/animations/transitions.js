/* AURELIA GRAND · bibliothèque de transitions photographiques
   Chaque transition relie deux photographies. Elle reçoit la progression p (0 à 1) et ne touche qu'à transform, opacity et clip-path.

   Une scène (s) est composée de quatre couches indépendantes, pour que l'entrée, la sortie et le cadrage ne se gênent jamais :
     s.el     clip-path / opacité de l'entrée      s.inn    mouvement d'entrée (zoom d'arrivée, glissement)
     s.out    mouvement de sortie (zoom, recul)    s.media  cadrage de la caméra (voir tour.js)
   s.vIn / s.vOut : voiles sombres (entrée / sortie), combinés par tour.js.

   enter(s, p, c)  : appliquée à la scène qui arrive.   exit(prev, p, c) : appliquée à la scène précédente pendant ce temps.
   c = réglages de la transition (data/tour.js) + { w, h, mobile }. */
(function () {
  "use strict";
  var A = (window.AURELIA = window.AURELIA || {});
  var T = (A.transitions = {});
  var ease = A.easeInOut, smooth = A.smooth, lerp = A.lerp;

  function css(el, prop, val) {
    var k = "_" + prop;
    if (el[k] !== val) { el[k] = val; el.style[prop] = val; }
  }
  function f(n, d) { return (+n).toFixed(d == null ? 3 : d); }
  function origin(el, o) { css(el, "transformOrigin", f(o[0], 1) + "% " + f(o[1], 1) + "%"); }
  A.transitionCss = css;

  /* Fondu enchaîné : la nouvelle photographie se pose doucement (léger zoom d'arrivée ou dérive verticale) */
  T.fade = {
    enter: function (s, p, c) {
      var e = ease(p);
      css(s.el, "opacity", f(c.dip ? smooth((p - 0.3) / 0.7) : e));
      css(s.el, "clipPath", "none");
      css(s.inn, "transform", "translate3d(0," + f((c.drift || 0) * (1 - e), 2) + "%,0) scale(" + f(1 + ((c.push || 1) - 1) * (1 - e), 4) + ")");
    },
    exit: function (prev, p, c) { var e = ease(p); css(prev.out, "transform", "scale(" + f(1 + 0.03 * e, 4) + ")"); prev.vOut = Math.max(prev.vOut, c.dip ? 0.92 * smooth(p / 0.6) : 0.3 * e); },
  };

  /* Portes : la nouvelle photographie s'ouvre au centre comme deux battants, la façade avance vers l'entrée */
  T.doors = {
    enter: function (s, p, c) {
      var e = ease(p), o = 50 * (1 - e);
      css(s.el, "opacity", "1");
      css(s.el, "clipPath", "inset(0 " + f(o, 2) + "% 0 " + f(o, 2) + "%)");
      css(s.inn, "transform", "scale(" + f(1 + 0.18 * (1 - e), 4) + ")");
    },
    exit: function (prev, p, c) {
      var e = ease(p);
      origin(prev.out, c.origin || [50, 52]);
      css(prev.out, "transform", "scale(" + f(1 + 0.55 * e, 4) + ")");
      prev.vOut = Math.max(prev.vOut, 0.62 * e);
    },
  };

  /* Travelling avant : on franchit le seuil, la salle arrive de plus près pendant que l'entrée s'efface en grossissant */
  T.dolly = {
    enter: function (s, p, c) {
      var e = ease(p);
      css(s.el, "opacity", f(smooth(p / 0.62)));
      css(s.inn, "transform", "scale(" + f(1 + 0.24 * (1 - e), 4) + ")");
    },
    exit: function (prev, p, c) {
      var e = ease(p);
      origin(prev.out, c.origin || [50, 50]);
      css(prev.out, "transform", "scale(" + f(1 + 0.4 * e, 4) + ")");
      prev.vOut = Math.max(prev.vOut, 0.7 * e);
    },
  };

  /* Cadre éditorial : la photographie glisse depuis le bord droit dans une fenêtre (son cadrage est celui de la fenêtre),
     l'image précédente s'assombrit et recule. La position de la fenêtre est réglée par tour.js (couche s.out). */
  T.frame = {
    enter: function (s, p, c) {
      var e = ease(p);
      css(s.el, "opacity", "1");
      css(s.el, "clipPath", "none");
      css(s.inn, "transform", "translate3d(" + f(112 * (1 - e), 2) + "%,0,0)");
      css(s.inn, "opacity", f(smooth(p / 0.45)));
      if (s.frameEl) css(s.frameEl, "opacity", f(smooth((p - 0.4) / 0.6)));
    },
    exit: function (prev, p, c) {
      var e = ease(p);
      origin(prev.out, [30, 50]);
      css(prev.out, "transform", "scale(" + f(1 - 0.07 * e, 4) + ")");
      prev.vOut = Math.max(prev.vOut, 0.68 * e);
    },
  };

  /* Marche : le couloir arrive en fondu, caméra qui avance (le zoom continu est dans le cadrage de la scène) */
  T.walk = {
    enter: function (s, p, c) {
      var e = ease(p);
      origin(s.inn, c.origin || [50, 48]);
      css(s.el, "opacity", f(smooth((p - 0.3) / 0.7)));
      css(s.el, "clipPath", "none");
      css(s.inn, "transform", "scale(" + f(1 + 0.3 * (1 - e), 4) + ")");
    },
    exit: function (prev, p) { var e = ease(p); css(prev.out, "transform", "scale(" + f(1 + 0.1 * e, 4) + ")"); prev.vOut = Math.max(prev.vOut, 0.92 * smooth(p / 0.6)); },
  };

  /* Baie vitrée : la vue s'ouvre dans l'arche de la porte-fenêtre de la suite, puis envahit tout l'écran */
  T.window = {
    enter: function (s, p, c) {
      var e = ease(p), R = c.rect || [66, 8, 6, 10];
      var l = lerp(R[0], 0, e), t = lerp(R[1], 0, e), r = lerp(R[2], 0, e), b = lerp(R[3], 0, e);
      var rad = 1400 * Math.pow(1 - e, 1.6);
      css(s.el, "opacity", "1");
      css(s.el, "clipPath", "inset(" + f(t, 2) + "% " + f(r, 2) + "% " + f(b, 2) + "% " + f(l, 2) + "% round " + f(rad, 1) + "px " + f(rad, 1) + "px 0 0)");
      css(s.inn, "transform", "scale(" + f(1 + 0.16 * (1 - e), 4) + ")");
    },
    exit: function (prev, p, c) {
      var e = ease(p), R = c.rect || [66, 8, 6, 10];
      origin(prev.out, [(R[0] + 100 - R[2]) / 2, (R[1] + 100 - R[3]) / 2]);
      css(prev.out, "transform", "scale(" + f(1 + 0.45 * e, 4) + ")");
      prev.vOut = Math.max(prev.vOut, 0.5 * e);
    },
  };

  /* Rideau : la nouvelle photographie se lève depuis le bas de l'écran, l'image arrive un peu plus lentement que son bord */
  T.curtain = {
    enter: function (s, p) {
      var e = ease(p);
      css(s.el, "opacity", "1");
      css(s.el, "clipPath", "inset(" + f(100 * (1 - e), 2) + "% 0 0 0)");
      css(s.inn, "transform", "translate3d(0," + f(12 * (1 - e), 2) + "%,0)");
    },
    exit: function (prev, p) { var e = ease(p); css(prev.out, "transform", "translate3d(0," + f(-3 * e, 2) + "%,0)"); prev.vOut = Math.max(prev.vOut, 0.5 * e); },
  };

  /* Iris : un disque s'ouvre sur l'assiette et révèle le gros plan */
  T.iris = {
    enter: function (s, p, c) {
      var e = ease(p), at = c.at || [50, 55];
      css(s.el, "opacity", "1");
      css(s.el, "clipPath", "circle(" + f(lerp(0, 150, Math.pow(e, 0.9)), 2) + "% at " + f(at[0], 1) + "% " + f(at[1], 1) + "%)");
      origin(s.inn, at);
      css(s.inn, "transform", "scale(" + f(1 + 0.34 * (1 - e), 4) + ")");
    },
    exit: function (prev, p) { var e = ease(p); css(prev.out, "transform", "scale(" + f(1 + 0.05 * e, 4) + ")"); prev.vOut = Math.max(prev.vOut, 0.45 * e); },
  };

  /* Balayage : la photographie se dévoile de gauche à droite, l'image suit son bord avec un léger retard */
  T.wipe = {
    enter: function (s, p) {
      var e = ease(p);
      css(s.el, "opacity", "1");
      css(s.el, "clipPath", "inset(0 " + f(100 * (1 - e), 2) + "% 0 0)");
      css(s.inn, "transform", "translate3d(" + f(-9 * (1 - e), 2) + "%,0,0)");
    },
    exit: function (prev, p) { var e = ease(p); css(prev.out, "transform", "translate3d(" + f(3 * e, 2) + "%,0,0)"); prev.vOut = Math.max(prev.vOut, 0.45 * e); },
  };

  /* Éclaircie : passage d'une photographie sombre à une photographie lumineuse, voile qui se lève */
  T.lift = {
    enter: function (s, p, c) {
      var e = ease(p);
      css(s.el, "opacity", f(smooth(p / 0.85)));
      css(s.el, "clipPath", "none");
      css(s.inn, "transform", "translate3d(0," + f(4 * (1 - e), 2) + "%,0) scale(" + f(1 + 0.04 * (1 - e), 4) + ")");
      s.vIn = (c.veil == null ? 0.5 : c.veil) * (1 - smooth(p / 0.9));
    },
    exit: function (prev, p) { var e = ease(p); css(prev.out, "transform", "scale(" + f(1 + 0.03 * e, 4) + ")"); prev.vOut = Math.max(prev.vOut, 0.25 * e); },
  };
})();
