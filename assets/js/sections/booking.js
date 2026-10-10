/* Section « Reservations » : module de réservation (dates, voyageurs, chambres, code), validation lisible, récapitulatif.
   Aucune disponibilité n'est vérifiée tant qu'un moteur n'est pas connecté (data/hotel.js > booking.engineUrl) : le formulaire le dit clairement.
   La logique (validation, adresse du moteur, e-mail de demande) est dans booking/booking.js. */
(function () {
  "use strict";
  var A = (window.AURELIA = window.AURELIA || {});
  A.sections = A.sections || {};
  var t = function (v) { return A.esc(A.t(v)); };
  var B, el, submitted = false, last = null;

  function opts(from, to, sel, one, many) {
    var out = "";
    for (var n = from; n <= to; n++) out += '<option value="' + n + '"' + (n === sel ? " selected" : "") + ">" + n + (one ? " " + A.esc(A.t(n === 1 ? one : many)) : "") + "</option>";
    return out;
  }
  function field(id, label, control, cls, hint) {
    return '<div class="field' + (cls ? " " + cls : "") + '"><label for="b-' + id + '">' + label + "</label>" + control + (hint || "") + '<p class="error" id="b-e-' + id + '"></p></div>';
  }

  function values() {
    var f = A.$("[data-booking-form]", el);
    return { arrival: f.arrival.value, departure: f.departure.value, adults: f.adults.value, children: f.children.value, rooms: f.rooms.value, room: f.room.value, promo: f.promo.value.trim(), offer: B.state.offer };
  }
  function showErrors(errs) {
    var f = A.$("[data-booking-form]", el), first = null;
    ["arrival", "departure", "adults", "promo"].forEach(function (k) {
      var input = f.elements[k], out = A.$("#b-e-" + k, el), msg = errs[k] || "";
      out.textContent = msg;
      input.setAttribute("aria-invalid", msg ? "true" : "false");
      if (msg) { input.setAttribute("aria-describedby", "b-e-" + k); first = first || input; } else input.removeAttribute("aria-describedby");
    });
    var box = A.$("[data-bform-error]", el);
    box.hidden = !first;
    if (first) box.innerHTML = A.icon("warning") + "<span>" + A.esc(A.t(A.data.booking.errors.summary)) + "</span>";
    return first;
  }
  function updateNights() {
    var f = A.$("[data-booking-form]", el), out = A.$("[data-nights]", el), F = A.data.booking.fields;
    var a = f.arrival.value, d = f.departure.value;
    if (a && d && d > a) { var n = B.nights(a, d); out.textContent = n + " " + A.t(n === 1 ? F.nights : F.nightsPlural); } else out.textContent = "";
  }
  function syncDates(changed) {
    var f = A.$("[data-booking-form]", el);
    var min = f.arrival.value ? B.addDays(f.arrival.value, 1) : B.addDays(B.today(), 1);
    f.departure.min = min;
    if (changed === "arrival" && f.arrival.value && (!f.departure.value || f.departure.value < min)) f.departure.value = B.addDays(f.arrival.value, 2);
    updateNights();
  }
  function renderChip() {
    var chip = A.$("[data-offer-chip]", el), o = B.offerById(B.state.offer);
    if (!chip) return;
    chip.hidden = !o;
    if (o) chip.innerHTML = '<span>' + t(A.data.booking.fields.offer) + " · " + t(o.name) + '</span><button type="button" data-offer-clear aria-label="' + t(A.data.hotel.ui.close) + '">' + A.icon("x") + "</button>";
  }
  function applyPreselect() {
    var f = A.$("[data-booking-form]", el);
    if (!f) return;
    f.room.value = B.state.room || "";
    renderChip();
    showForm();
  }
  function showForm() { A.$("[data-booking-form]", el).hidden = false; A.$("[data-booking-result]", el).hidden = true; }

  function showResult(v, mode, url) {
    var R = A.data.booking.result, box = A.$("[data-booking-result]", el), rows = B.summary(v);
    box.innerHTML =
      '<h3 class="subtitle">' + t(R.title) + "</h3>" +
      '<dl class="bsum">' + rows.map(function (r) { return "<div><dt>" + t(r[0]) + "</dt><dd>" + A.esc(r[1]) + "</dd></div>"; }).join("") + "</dl>" +
      (mode === "demo"
        ? '<p class="status status--demo">' + A.icon("info") + "<span>" + t(R.demoLine) + "</span></p>" +
          '<div class="bresult__actions"><a class="btn btn--solid" href="' + A.esc(B.mailto(v)) + '">' + t(R.send) + A.icon("arrow-right") + '</a><button class="btn btn--line" type="button" data-bedit>' + t(R.edit) + "</button></div>"
        : '<p class="status status--ok">' + A.icon("check") + "<span>" + t(R.redirecting) + "</span></p>");
    A.$("[data-booking-form]", el).hidden = true;
    box.hidden = false;
    var h = A.$("h3", box); h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true });
    box.scrollIntoView({ block: "nearest", behavior: A.reduceMotion() ? "auto" : "smooth" });
  }

  A.sections.booking = {
    render: function () {
      el = A.$('[data-section="booking"]');
      if (!el) return;
      B = A.booking;
      var D = A.data.booking, F = D.fields, hotel = A.data.hotel, saved = null;
      var old = A.$("[data-booking-form]", el);
      if (old) saved = { arrival: old.arrival.value, departure: old.departure.value, adults: old.adults.value, children: old.children.value, rooms: old.rooms.value, promo: old.promo.value };
      var today = B.today();
      el.innerHTML =
        '<div class="booking__bg" aria-hidden="true">' + A.frame(D.photo, { sizes: "100vw", alt: "", parallax: 0.08 }) + "</div>" +
        '<div class="wrap booking__grid">' +
          '<div class="booking__intro">' +
            '<p class="eyebrow" data-reveal>' + t(D.eyebrow) + "</p>" +
            A.title(D.title, "h2", "display", "book-title") +
            '<p class="lead" data-reveal>' + t(D.lead) + "</p>" +
            '<ul class="assure" data-reveal>' + D.assurances.map(function (a) { return "<li>" + A.icon("check") + "<span>" + t(a) + "</span></li>"; }).join("") + "</ul>" +
            (hotel.booking.engineUrl ? "" : '<p class="status status--demo" data-reveal>' + A.icon("info") + "<span>" + t(D.demoNotice) + "</span></p>") +
          "</div>" +
          '<div class="booking__panel" data-reveal>' +
            '<form class="bform" novalidate data-booking-form aria-labelledby="book-title">' +
              field("arrival", t(F.arrival), '<input id="b-arrival" name="arrival" type="date" min="' + today + '" required autocomplete="off">') +
              field("departure", t(F.departure), '<input id="b-departure" name="departure" type="date" min="' + B.addDays(today, 1) + '" required autocomplete="off">', "", '<output class="bform__nights" data-nights aria-live="polite"></output>') +
              field("adults", t(F.adults), '<select id="b-adults" name="adults">' + opts(1, 8, 2) + "</select>") +
              field("children", t(F.children), '<select id="b-children" name="children">' + opts(0, 6, 0) + "</select>") +
              field("rooms", t(F.rooms), '<select id="b-rooms" name="rooms">' + opts(1, hotel.booking.maxRooms, 1) + "</select>") +
              field("room", t(F.roomType), '<select id="b-room" name="room"><option value="">' + t(F.anyRoom) + "</option>" + A.data.stay.rooms.map(function (r) { return '<option value="' + A.esc(r.id) + '">' + t(r.name) + "</option>"; }).join("") + "</select>", "field--wide") +
              field("promo", t(F.promo), '<input id="b-promo" name="promo" type="text" autocomplete="off" maxlength="24" spellcheck="false" autocapitalize="characters">', "field--wide") +
              '<p class="chip chip--offer field--full" data-offer-chip hidden></p>' +
              '<p class="status status--error field--full" role="alert" data-bform-error hidden></p>' +
              '<button class="btn btn--solid btn--block field--full" type="submit">' + t(D.submit) + A.icon("arrow-right") + "</button>" +
            "</form>" +
            '<div class="bresult" data-booking-result hidden></div>' +
          "</div>" +
        "</div>";
      var f = A.$("[data-booking-form]", el);
      if (saved) { Object.keys(saved).forEach(function (k) { if (f.elements[k]) f.elements[k].value = saved[k]; }); syncDates(); }
      f.room.value = B.state.room || "";
      renderChip();
      if (submitted) f.hidden = false;
    },
    bind: function () {
      el = A.$('[data-section="booking"]');
      B = A.booking;
      B.onPreselect = applyPreselect;
      el.addEventListener("change", function (e) {
        var n = e.target.name;
        if (n === "arrival" || n === "departure") syncDates(n);
        if (n === "room") B.state.room = e.target.value;
        if (submitted) { var v = values(); showErrors(B.validate(v).errors); }
      });
      el.addEventListener("click", function (e) {
        if (e.target.closest("[data-offer-clear]")) { B.state.offer = ""; renderChip(); }
        if (e.target.closest("[data-bedit]")) { showForm(); A.$("#b-arrival", el).focus(); }
      });
      el.addEventListener("submit", function (e) {
        e.preventDefault();
        submitted = true;
        var v = values(), res = B.validate(v);
        var first = showErrors(res.errors);
        if (first) { first.focus(); return; }
        var url = B.engineUrl(v);
        last = v;
        if (url) {
          showResult(v, "engine", url);
          if (A.data.hotel.booking.openInNewTab) window.open(url, "_blank", "noopener"); else window.location.href = url;
        } else showResult(v, "demo");
      });
    },
  };
})();
