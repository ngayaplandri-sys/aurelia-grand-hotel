/* AURELIA GRAND · moteur d'animation
   Une seule boucle requestAnimationFrame pour tout le site : elle ne tourne que lorsqu'il y a du mouvement (défilement, lissage en cours)
   et s'arrête d'elle-même. Les animations n'écrivent que transform, opacity et clip-path : aucune mesure de mise en page pendant le défilement. */
(function () {
  "use strict";
  var A = (window.AURELIA = window.AURELIA || {});
  var tasks = [];
  var resizeFns = [];
  var running = false, lastNow = 0, resizeTimer = 0;

  var frame = { y: 0, dy: 0, dt: 0.016, now: 0, vh: window.innerHeight, vw: window.innerWidth };

  function tick(now) {
    if (document.hidden) { running = false; return; }
    var dt = lastNow ? Math.min(0.1, (now - lastNow) / 1000) : 0.016;
    lastNow = now;
    var y = window.scrollY || window.pageYOffset || 0;
    frame.dy = y - frame.y; frame.y = y; frame.dt = dt; frame.now = now;
    var awake = false;
    for (var i = 0; i < tasks.length; i++) { if (tasks[i](frame) === true) awake = true; }
    if (awake) requestAnimationFrame(tick); else running = false;
  }

  var E = (A.engine = {
    frame: frame,
    /* Ajoute une tâche exécutée à chaque image tant qu'elle renvoie true (sinon la boucle se rendort jusqu'au prochain défilement). */
    add: function (fn) { tasks.push(fn); E.kick(); return fn; },
    remove: function (fn) { var i = tasks.indexOf(fn); if (i >= 0) tasks.splice(i, 1); },
    kick: function () { if (!running && !document.hidden) { running = true; lastNow = 0; requestAnimationFrame(tick); } },
    onResize: function (fn) { resizeFns.push(fn); },
  });

  frame.y = window.scrollY || 0;
  window.addEventListener("scroll", E.kick, { passive: true });
  document.addEventListener("visibilitychange", E.kick);
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      frame.vh = window.innerHeight; frame.vw = window.innerWidth;
      resizeFns.forEach(function (fn) { fn(frame); });
      E.kick();
    }, 120);
  });
  window.addEventListener("load", function () { resizeFns.forEach(function (fn) { fn(frame); }); E.kick(); });
})();
