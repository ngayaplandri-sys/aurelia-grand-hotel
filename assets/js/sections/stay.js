/* Section « Stay » : chambres et suites en lignes éditoriales alternées (grande photographie, détails, deux actions). */
(function () {
  "use strict";
  var A = (window.AURELIA = window.AURELIA || {});
  A.sections = A.sections || {};
  var t = function (v) { return A.esc(A.t(v)); };

  A.sections.stay = {
    render: function () {
      var el = A.$('[data-section="stay"]');
      if (!el) return;
      var S = A.data.stay, ui = A.data.hotel.ui;
      el.innerHTML =
        '<div class="wrap">' +
          '<header class="stay__head">' +
            '<p class="eyebrow" data-reveal>' + t(S.eyebrow) + "</p>" +
            A.title(S.title, "h2", "title", "stay-title") +
            '<p class="lead" data-reveal>' + t(S.lead) + "</p>" +
          "</header>" +
          '<nav class="stay__nav" aria-label="' + t(S.eyebrow) + '" data-reveal><ul>' + S.rooms.map(function (r, i) {
            return '<li><a href="#room-' + A.esc(r.id) + '"><span class="num">' + A.pad2(i + 1) + "</span>" + t(r.name) + "</a></li>";
          }).join("") + "</ul></nav>" +
          '<ol class="rooms">' + S.rooms.map(function (r, i) {
            return '<li class="room' + (i % 2 ? " room--flip" : "") + '" id="room-' + A.esc(r.id) + '">' +
              '<div class="room__media">' + A.frame(r.photo, { ratio: "4 / 3", parallax: 0.05, reveal: "mask", sizes: "(max-width: 900px) 100vw, 60vw" }) + "</div>" +
              '<div class="room__body">' +
                '<p class="room__index num" data-reveal>' + A.pad2(i + 1) + " <span>/ " + A.pad2(S.rooms.length) + "</span></p>" +
                '<h3 class="room__name" data-reveal>' + t(r.name) + "</h3>" +
                '<p class="room__tag" data-reveal>' + t(r.tagline) + "</p>" +
                '<dl class="room__facts" data-reveal><div><dt>' + t(ui.size) + "</dt><dd>" + r.size + " m²</dd></div><div><dt>" + t(ui.sleeps) + "</dt><dd>" + r.sleeps + "</dd></div><div><dt>" + t(ui.view_) + "</dt><dd>" + t(r.view) + "</dd></div></dl>" +
                '<p class="room__text" data-reveal>' + A.esc(A.t(r.text)[0]) + "</p>" +
                '<p class="room__amen" data-reveal>' + A.esc(A.t(r.amenities).slice(0, 3).join(" · ")) + "</p>" +
                '<p class="room__rate" data-reveal>' + t(ui.rateOnRequest) + "</p>" +
                '<div class="room__actions" data-reveal>' +
                  '<a class="btn btn--line-ink" href="#/room/' + A.esc(r.id) + '"><span>' + t(ui.discover) + '</span><span class="sr-only"> : ' + t(r.name) + "</span>" + A.icon("arrow-right") + "</a>" +
                  '<a class="btn btn--ink" href="#book" data-book-room="' + A.esc(r.id) + '"><span>' + t(ui.bookThis) + '</span><span class="sr-only"> : ' + t(r.name) + "</span>" + A.icon("arrow-right") + "</a>" +
                "</div>" +
              "</div></li>";
          }).join("") + "</ol>" +
          (A.data.hotel.demo ? '<p class="section-note" data-reveal><span class="demo-tag">' + t(ui.demo) + "</span> " + t(S.note) + "</p>" : "") +
        "</div>";
    },
  };
})();
