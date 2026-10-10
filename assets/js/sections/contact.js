/* Section « Location & Contact » : coordonnées (fictives, signalées), carte illustrative, formulaire de contact côté interface. */
(function () {
  "use strict";
  var A = (window.AURELIA = window.AURELIA || {});
  A.sections = A.sections || {};
  var t = function (v) { return A.esc(A.t(v)); };
  var el, subject = "";

  /* Carte illustrative : un promontoire fictif, la route de la corniche, la vieille ville, l'aéroport. */
  function mapSvg(M) {
    var waves = "";
    for (var i = 0; i < 9; i++) waves += '<path d="M' + (20 + i * 60) + " " + (470 + (i % 3) * 38) + " q 14 -10 28 0 t 28 0" + '" />';
    return '<svg class="cmap" viewBox="0 0 800 600" role="img" aria-labelledby="cmap-t"><title id="cmap-t">' + t(M.alt) + "</title>" +
      '<rect width="800" height="600" fill="#efe6d6"/>' +
      '<path d="M0 400 C 110 360, 190 430, 300 390 S 470 320, 560 380 S 700 450, 800 410 V600 H0Z" fill="#d6c9b0"/>' +
      '<path d="M440 392 C 450 470, 520 540, 600 520 C 665 500, 690 440, 660 396 C 620 372, 520 360, 440 392Z" fill="#efe6d6" stroke="#8e6b45" stroke-width="1.2"/>' +
      '<path d="M0 400 C 110 360, 190 430, 300 390 S 470 320, 560 380 M660 396 C 700 420, 750 440, 800 410" fill="none" stroke="#8e6b45" stroke-width="1.2"/>' +
      '<g fill="none" stroke="#b8946a" stroke-width="1" opacity=".55" stroke-linecap="round">' + waves + "</g>" +
      '<g fill="none" stroke="#c9b898" stroke-width="1"><path d="M60 60 H 300 M60 120 H 220 M500 80 H 740 M520 150 H 700 M70 250 H 200"/><path d="M180 30 V 200 M620 30 V 250"/></g>' +
      '<path d="M104 96 C 200 140, 262 214, 326 252 S 470 340, 520 420 S 556 462, 566 476" fill="none" stroke="#7a5a3a" stroke-width="2.2" stroke-dasharray="2 8" stroke-linecap="round"/>' +
      '<g fill="#d8cdb8" stroke="#8e6b45" stroke-width="1"><rect x="306" y="232" width="14" height="14"/><rect x="326" y="226" width="12" height="16"/><rect x="342" y="240" width="16" height="12"/><rect x="316" y="254" width="12" height="12"/><rect x="334" y="258" width="18" height="12"/></g>' +
      '<g transform="translate(104 96)"><circle r="16" fill="#faf7f1" stroke="#261d15" stroke-width="1.2"/><path d="M-7 3 L 0 -9 L 7 3 M-5 -1 H 5" fill="none" stroke="#261d15" stroke-width="1.2" stroke-linecap="round"/></g>' +
      '<g transform="translate(566 476)"><circle r="26" fill="#261d15" opacity=".1"/><circle r="15" fill="#261d15"/><path d="M-6 6 V-2 a6 6 0 0 1 12 0 V6" fill="none" stroke="#d9c39d" stroke-width="1.3"/><circle cy="-1" r="1.6" fill="#d9c39d"/></g>' +
      '<g font-family="Hanken Grotesk, system-ui, sans-serif" font-size="14" letter-spacing="2.4" fill="#261d15" font-weight="600">' +
        '<text x="590" y="440" text-anchor="start">' + t(M.hotel).toUpperCase() + "</text>" +
        '<text x="344" y="228" text-anchor="start" font-weight="500" fill="#5b4d3f">' + t(M.oldTown).toUpperCase() + "</text>" +
        '<text x="132" y="102" text-anchor="start" font-weight="500" fill="#5b4d3f">' + t(M.airport).toUpperCase() + "</text>" +
      "</g>" +
      '<g transform="translate(730 70)" fill="none" stroke="#261d15" stroke-width="1.2"><circle r="22" opacity=".5"/><path d="M0 -16 L 5 4 L 0 0 L -5 4Z" fill="#261d15"/><text y="-28" text-anchor="middle" font-size="12" font-family="Hanken Grotesk, sans-serif" fill="#261d15" stroke="none" font-weight="600">N</text></g>' +
      "</svg>";
  }

  function row(icon, label, body) {
    return '<div class="crow">' + A.icon(icon) + '<div><h3 class="crow__h">' + label + "</h3>" + body + "</div></div>";
  }

  function fieldHtml(id, label, control, cls) {
    return '<div class="field' + (cls ? " " + cls : "") + '"><label for="c-' + id + '">' + label + "</label>" + control + '<p class="error" id="c-e-' + id + '"></p></div>';
  }

  A.sections.contact = {
    render: function () {
      el = A.$('[data-section="contact"]');
      if (!el) return;
      var C = A.data.contactSection, H = A.data.hotel, K = H.contact, L = C.labels, FM = C.form, saved = null;
      var old = A.$("[data-contact-form]", el);
      if (old) saved = { name: old.elements.name.value, email: old.email.value, phone: old.phone.value, message: old.message.value };
      el.innerHTML =
        '<div class="wrap">' +
          '<header class="contact__head">' +
            '<div><p class="eyebrow" data-reveal>' + t(C.eyebrow) + "</p>" + A.title(C.title, "h2", "title", "contact-title") + "</div>" +
            (H.demo ? '<p class="contact__demo" data-reveal><span class="demo-tag">' + t(C.demoBadge) + "</span><span>" + t(C.demoText) + "</span></p>" : "") +
          "</header>" +
          '<div class="contact__grid">' +
            '<div class="contact__info" data-reveal>' +
              row("map-pin", t(L.address), "<address>" + K.addressLines.map(A.esc).join("<br>") + '<br><span class="muted">' + t(K.addressNote) + "</span></address>") +
              row("phone", t(L.phone), K.phoneHref ? '<a href="' + A.esc(K.phoneHref) + '">' + A.esc(K.phone) + "</a>" : "<p>" + A.esc(K.phone) + ' <span class="muted">(' + t(H.ui.demo) + ")</span></p>") +
              row("mail", t(L.email), '<a href="' + A.esc(K.emailHref) + '">' + A.esc(K.email) + "</a>") +
              row("clock", t(L.hours), '<dl class="hours">' + K.hours.map(function (h) { return "<dt>" + t(h[0]) + "</dt><dd>" + t(h[1]) + "</dd>"; }).join("") + "</dl>") +
              row("compass", t(L.access), "<p>" + t(K.access) + "</p>") +
              row("map-pin", t(L.airport), "<p><strong>" + t(K.airport.name) + "</strong><br>" + t(K.airport.text) + "</p>") +
              row("arrow-right", t(L.transport), "<p>" + t(K.transport) + "</p>") +
            "</div>" +
            '<div class="contact__side">' +
              '<figure class="contact__map" data-reveal>' + mapSvg(C.map) + "<figcaption>" + t(C.map.note) + "</figcaption></figure>" +
              '<form class="cform" novalidate data-contact-form aria-labelledby="cform-title" data-reveal>' +
                '<h3 class="subtitle" id="cform-title">' + t(FM.title) + "</h3>" +
                '<div class="cform__grid">' +
                  fieldHtml("name", t(FM.name), '<input id="c-name" name="name" type="text" autocomplete="name" required>') +
                  fieldHtml("email", t(FM.email), '<input id="c-email" name="email" type="email" autocomplete="email" required>') +
                  fieldHtml("phone", t(FM.phone), '<input id="c-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel">') +
                  fieldHtml("subject", t(FM.subject), '<select id="c-subject" name="subject">' + FM.subjects.map(function (s) { return '<option value="' + s.id + '"' + (s.id === subject ? " selected" : "") + ">" + t(s.label) + "</option>"; }).join("") + "</select>") +
                  fieldHtml("message", t(FM.message), '<textarea id="c-message" name="message" required></textarea>', "field--full") +
                  '<div class="field field--full"><label class="check"><input type="checkbox" id="c-consent" name="consent" required><span>' + t(FM.consent) + '</span></label><p class="error" id="c-e-consent"></p></div>' +
                  '<p class="status status--error field--full" role="alert" data-cform-error hidden></p>' +
                  '<div class="field--full" data-cform-result role="status" aria-live="polite"></div>' +
                  '<button class="btn btn--ink field--full cform__submit" type="submit">' + t(FM.submit) + A.icon("arrow-right") + "</button>" +
                "</div>" +
              "</form>" +
            "</div>" +
          "</div>" +
        "</div>";
      var f = A.$("[data-contact-form]", el);
      if (saved) Object.keys(saved).forEach(function (k) { f.elements[k].value = saved[k]; });
      if (subject) f.subject.value = subject;
    },
    bind: function () {
      el = A.$('[data-section="contact"]');
      el.addEventListener("submit", function (e) {
        if (!e.target.matches("[data-contact-form]")) return;
        e.preventDefault();
        var f = e.target, FM = A.data.contactSection.form, E = FM.errors, errs = {};
        var name = f.elements.name.value.trim(), email = f.email.value.trim(), phone = f.phone.value.trim(), msg = f.message.value.trim();
        if (name.length < 2) errs.name = A.t(E.name);
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) errs.email = A.t(E.email);
        if (phone && phone.replace(/[^\d]/g, "").length < 7) errs.phone = A.t(E.phone);
        if (msg.length < 10) errs.message = A.t(E.message);
        if (!f.consent.checked) errs.consent = A.t(E.consent);
        var first = null;
        ["name", "email", "phone", "message", "consent"].forEach(function (k) {
          var out = A.$("#c-e-" + k, f), input = f.elements[k];
          out.textContent = errs[k] || "";
          input.setAttribute("aria-invalid", errs[k] ? "true" : "false");
          if (errs[k]) { input.setAttribute("aria-describedby", "c-e-" + k); first = first || input; } else input.removeAttribute("aria-describedby");
        });
        var box = A.$("[data-cform-error]", f), res = A.$("[data-cform-result]", f);
        box.hidden = !first; res.innerHTML = "";
        if (first) { box.innerHTML = A.icon("warning") + "<span>" + A.esc(A.t(E.summary)) + "</span>"; first.focus(); return; }
        var subj = FM.subjects.filter(function (s) { return s.id === f.subject.value; })[0];
        var body = name + " <" + email + ">" + (phone ? " · " + phone : "") + "\n\n" + msg;
        var mail = "mailto:" + A.data.hotel.contact.email + "?subject=" + encodeURIComponent((subj ? A.t(subj.label) : "Contact") + " — Aurelia Grand (demo)") + "&body=" + encodeURIComponent(body);
        res.innerHTML = '<p class="status status--demo">' + A.icon("info") + "<span>" + A.esc(A.t(FM.demo)) + '</span></p><p><a class="btn btn--line-ink btn--sm" href="' + A.esc(mail) + '">' + A.esc(A.t(FM.mailButton)) + A.icon("arrow-right") + "</a></p>";
      });
    },
    preselect: function (id) {
      subject = id || "";
      var f = A.$("[data-contact-form]", el);
      if (f && f.subject) f.subject.value = subject;
    },
  };
  A.contact = A.sections.contact;
})();
