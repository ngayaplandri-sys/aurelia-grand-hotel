/* AURELIA GRAND · fonctions de réservation (sans interface)
   Validation, récapitulatif, préparation de l'e-mail de demande et branchement d'un futur moteur de réservation.
   L'interface du formulaire est dans sections/booking.js ; les réglages (engineUrl, limites) dans data/hotel.js.
   TANT QU'AUCUN MOTEUR N'EST CONNECTÉ (engineUrl vide), AUCUNE DISPONIBILITÉ N'EST VÉRIFIÉE : le site le dit clairement. */
(function () {
  "use strict";
  var A = (window.AURELIA = window.AURELIA || {});

  function cfg() { return A.data.hotel.booking; }
  function copy() { return A.data.booking; }
  function pad(n) { return n < 10 ? "0" + n : "" + n; }
  function iso(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function parse(s) { var p = String(s).split("-"); return new Date(+p[0], +p[1] - 1, +p[2], 12, 0, 0); }

  var B = (A.booking = {
    state: { room: "", offer: "" },

    today: function () { return iso(new Date()); },
    addDays: function (s, n) { var d = parse(s); d.setDate(d.getDate() + n); return iso(d); },
    nights: function (a, d) { return Math.round((parse(d) - parse(a)) / 86400000); },

    roomById: function (id) { return (A.data.stay.rooms || []).filter(function (r) { return r.id === id; })[0] || null; },
    offerById: function (id) { return (A.data.offers.items || []).filter(function (o) { return o.id === id; })[0] || null; },

    /* Valide les valeurs du formulaire. Renvoie { ok, errors: { champ: texte } }. */
    validate: function (v) {
      var E = copy().errors, c = cfg(), err = {};
      var today = B.today();
      if (!v.arrival) err.arrival = A.t(E.arrivalRequired);
      else if (v.arrival < today) err.arrival = A.t(E.arrivalPast);
      if (!v.departure) err.departure = A.t(E.departureRequired);
      else if (v.arrival && v.departure <= v.arrival) err.departure = A.t(E.departureOrder);
      else if (v.arrival && B.nights(v.arrival, v.departure) > c.maxNights) err.departure = A.t(E.tooLong).replace("{n}", c.maxNights);
      var adults = +v.adults || 0, children = +v.children || 0, rooms = +v.rooms || 1;
      if (adults < rooms) err.adults = A.t(E.adults);
      else {
        var room = B.roomById(v.room), cap = (room ? room.sleeps : c.maxAdultsPerRoom + 0) * rooms;
        if (adults + children > cap) err.adults = A.t(E.capacity);
      }
      if (v.promo && !/^[A-Za-z0-9-]{1,24}$/.test(String(v.promo).trim())) err.promo = A.t(E.promo);
      return { ok: Object.keys(err).length === 0, errors: err };
    },

    /* Récapitulatif lisible : liste de [libellé, valeur]. */
    summary: function (v) {
      var F = copy().fields, n = B.nights(v.arrival, v.departure), rows = [];
      function plural(num, one, many) { return num + " " + A.t(num === 1 ? one : many); }
      rows.push([F.arrival, A.fmtDate(v.arrival)]);
      rows.push([F.departure, A.fmtDate(v.departure) + " · " + plural(n, F.nights, F.nightsPlural)]);
      var guests = plural(+v.adults, F.adult, F.adults_) + (+v.children ? ", " + plural(+v.children, F.child, F.children_) : "");
      rows.push([{ en: "Guests", fr: "Voyageurs" }, guests]);
      rows.push([F.rooms, plural(+v.rooms, F.room, F.rooms_)]);
      var room = B.roomById(v.room); if (room) rows.push([F.roomType, A.t(room.name)]);
      var offer = B.offerById(v.offer); if (offer) rows.push([F.offer, A.t(offer.name)]);
      if (v.promo) rows.push([{ en: "Code", fr: "Code" }, String(v.promo).trim().toUpperCase()]);
      return rows;
    },

    /* Adresse du moteur de réservation, ou "" si aucun n'est connecté. */
    engineUrl: function (v) {
      var c = cfg();
      if (!c.engineUrl) return "";
      var map = { arrival: v.arrival, departure: v.departure, adults: v.adults, children: v.children, rooms: v.rooms, promo: String(v.promo || "").trim(), room: v.room || "" };
      var q = Object.keys(c.engineParams || {}).map(function (k) {
        var val = String(c.engineParams[k]).replace(/\{(\w+)\}/g, function (_, name) { return map[name] != null ? map[name] : ""; });
        return val === "" ? null : encodeURIComponent(k) + "=" + encodeURIComponent(val);
      }).filter(Boolean).join("&");
      return c.engineUrl + (q ? (c.engineUrl.indexOf("?") >= 0 ? "&" : "?") + q : "");
    },

    /* E-mail de demande pré-rempli (mode démonstration). */
    mailto: function (v) {
      var R = copy().result;
      var lines = B.summary(v).map(function (r) { return "- " + A.t(r[0]) + " : " + r[1]; });
      var body = A.t(R.mailIntro) + "\n\n" + lines.join("\n") + "\n\n" + A.t(R.mailOutro);
      return "mailto:" + cfg().requestEmail + "?subject=" + encodeURIComponent(A.t(R.mailSubject)) + "&body=" + encodeURIComponent(body);
    },

    /* Présélection depuis une chambre ou une offre (appelée par les fiches et les boutons). */
    preselect: function (o) {
      if (o.room !== undefined) B.state.room = o.room || "";
      if (o.offer !== undefined) B.state.offer = o.offer || "";
      if (B.onPreselect) B.onPreselect();
    },
  });
})();
