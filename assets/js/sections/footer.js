/* Pied de page : logo, navigation, coordonnées, réseaux, lettre d'information (démo), liens légaux (pages réelles du site). */
(function () {
  "use strict";
  var A = (window.AURELIA = window.AURELIA || {});
  A.sections = A.sections || {};
  var t = function (v) { return A.esc(A.t(v)); };

  A.sections.footer = {
    render: function () {
      var el = A.$("[data-footer]");
      if (!el) return;
      var H = A.data.hotel, F = A.data.footer, K = H.contact, N = F.newsletter;
      el.innerHTML =
        '<div class="wrap footer__top">' +
          '<div class="footer__brand">' +
            '<img src="assets/brand/aurelia-logo-stacked-ivory.svg" alt="AURELIA GRAND, Hotel &amp; Resort" width="260" height="126" loading="lazy">' +
            '<p class="footer__line">' + t(F.line) + "</p>" +
          "</div>" +
          '<nav class="footer__col" aria-label="' + t(H.ui.footerNav) + '"><h2 class="footer__h">' + t(F.columns.explore) + "</h2><ul>" +
            H.nav.map(function (n) { return '<li><a href="' + A.esc(n.href) + '">' + t(n.label) + "</a></li>"; }).join("") +
            '<li><a href="#book">' + t(H.actions.book.label) + "</a></li></ul></nav>" +
          '<div class="footer__col"><h2 class="footer__h">' + t(F.columns.visit) + "</h2>" +
            "<address>" + K.addressLines.map(A.esc).join("<br>") + "</address>" +
            '<p class="muted">' + t(K.addressNote) + "</p>" +
            '<p><a href="' + A.esc(K.emailHref) + '">' + A.esc(K.email) + "</a></p><p>" + A.esc(K.phone) + ' <span class="muted">(' + t(H.ui.demo) + ")</span></p>" +
          "</div>" +
          '<div class="footer__col footer__news"><h2 class="footer__h">' + t(N.title) + "</h2><p class=\"body-sm muted\">" + t(N.text) + "</p>" +
            '<form class="nform" novalidate data-newsletter><div class="nform__row"><label class="sr-only" for="n-email">' + t(N.label) + '</label><input id="n-email" name="email" type="email" autocomplete="email" placeholder="' + t(N.placeholder) + '" required><button class="btn btn--line btn--sm" type="submit">' + t(N.submit) + '</button></div><p class="error" id="n-err" role="alert"></p><div data-news-result role="status" aria-live="polite"></div></form>' +
            '<ul class="social">' + H.social.map(function (s) {
              return '<li><a href="' + A.esc(s.url) + '" target="_blank" rel="noopener noreferrer" aria-label="' + A.esc(s.name) + '">' + A.icon(s.icon) + "</a></li>";
            }).join("") + "</ul>" +
          "</div>" +
        "</div>" +
        '<div class="wrap footer__bottom">' +
          '<p>© ' + H.brand.year + " " + A.esc(H.brand.full) + ". " + t(F.rights) + "</p>" +
          '<ul class="footer__legal">' + F.legal.map(function (l) { return '<li><a href="#/legal/' + l.id + '">' + t(l.label) + "</a></li>"; }).join("") + "</ul>" +
        "</div>" +
        (H.demo ? '<div class="wrap footer__demo"><span class="demo-tag">' + t(H.ui.demo) + "</span><p>" + t(H.demoNotice) + "</p></div>" : "");
    },
    bind: function () {
      var el = A.$("[data-footer]");
      el.addEventListener("submit", function (e) {
        if (!e.target.matches("[data-newsletter]")) return;
        e.preventDefault();
        var f = e.target, N = A.data.footer.newsletter, v = f.email.value.trim(), err = A.$("#n-err", f), res = A.$("[data-news-result]", f);
        res.innerHTML = "";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) {
          err.textContent = A.t(N.error); f.email.setAttribute("aria-invalid", "true"); f.email.setAttribute("aria-describedby", "n-err"); f.email.focus(); return;
        }
        err.textContent = ""; f.email.setAttribute("aria-invalid", "false"); f.email.removeAttribute("aria-describedby");
        res.innerHTML = '<p class="status status--demo">' + A.icon("info") + "<span>" + A.esc(A.t(N.demo)) + "</span></p>";
        f.email.value = "";
      });
    },
  };
})();
