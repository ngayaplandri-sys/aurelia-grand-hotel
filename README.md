# AURELIA GRAND Hotel & Resort : site cinématographique et photographique

Site d'hôtel de luxe (5 à 6 étoiles) racontant la visite d'un hôtel **uniquement par des photographies animées par le code** : aucune vidéo, aucun canvas. En défilant, le visiteur franchit la façade, l'entrée, le lobby, la réception, le couloir, la suite, la vue, le restaurant, le spa, la piscine et le rooftop. Ensuite viennent les chambres, les tables, le bien-être, les expériences, la galerie, les offres, les avis, la réservation et le contact. Bilingue **français (par défaut) / anglais**.

> **Établissement fictif, photographies générées par IA.** Le nom, l'adresse, les chiffres, les offres, le chef et les témoignages sont des éléments de démonstration, signalés comme tels sur le site. Voir « Avant de publier » plus bas.

## Voir le site

Double-cliquez sur `index.html`, ou, pour un aperçu identique à un hébergement réel :

```bash
npm install
npm run serve
```

Puis ouvrez http://localhost:4180.

- Le site s'ouvre **en français**. Version anglaise : http://localhost:4180/?lang=en (le bouton EN / FR de l'en-tête mémorise le choix du visiteur).
- Changer la langue par défaut : une seule valeur à modifier à deux endroits, le script en tête de `index.html` (`d.lang = lang === "en" ? "en" : "fr"`) et la ligne `A.lang = …` de `assets/js/lib/core.js`. La typographie française (apostrophe courbe, espace insécable avant `: ; ! ?`) est appliquée automatiquement à la lecture des textes `fr`.
- Version sans animation guidée par le défilement (celle des visiteurs qui réduisent les animations ou économisent leurs données) : http://localhost:4180/?fixe
- Adresses partageables des fiches : `#/room/junior-suite`, `#/dining/hesperia`, `#/wellness/aurelia-spa`, `#/offer/romantic-escape`, `#/legal/privacy`.

## La visite (CINEMATIC IMAGE SCROLL STORYTELLING)

13 plans photographiques, une scène épinglée, le défilement natif de la page. Chaque plan change de cadrage au fil du défilement, puis passe au suivant par sa propre transition : **portes** qui s'ouvrent, **travelling** et bandeau de cinéma, **cadre** éditorial, **marche** dans le couloir, **baie vitrée** en arche, **rideau**, **iris** sur le plat, **balayage**, **éclaircie**. Deux **calques d'avant-plan** (une branche d'olivier, des guirlandes en bokeh) défilent plus vite que la photographie pour donner de la profondeur. Les textes restent du HTML réel.

Le visiteur garde toujours la main : lien « Skip the visit », rail cliquable des plans, en-tête et bouton de réservation toujours accessibles, aucune scène ne bloque le défilement.

## Modifier le contenu

Tout le contenu est dans **`assets/js/data/`**, en deux langues : `{ en: "...", fr: "..." }`. Enregistrez, rechargez la page.

| Pour changer | Fichier |
|---|---|
| Nom, navigation, adresse, téléphone, e-mail, horaires, accès, aéroport, réseaux, mention « démonstration », réglage de la réservation | `hotel.js` |
| Les 13 plans de la visite : durées, transitions, cadrages, calques, textes | `tour.js` |
| Chambres et suites (superficie, capacité, vue, équipements, texte) | `rooms.js` |
| Restaurants et bars, parole de la cheffe | `dining.js` |
| Spa, piscine, bien-être | `wellness.js` |
| Introduction, expériences, offres, avis | `experiences.js` |
| Réservation, contact, pied de page, pages légales | `booking.js` |
| Photographies : texte alternatif, cadrage, catégorie | `photos.js` |

### Remplacer une photographie
1. Déposez la nouvelle image dans `production/sources/` **sous le même nom** (`facade.jpg`, `lobby.webp`…). Pour la composition verticale mobile, suffixe `-m` (`facade-m.jpg`).
2. `npm run images` : convertit en AVIF + WebP (plusieurs largeurs), met à jour le manifeste et la balise de chargement prioritaire de l'accueil.

Aucune autre modification : le site retrouve l'image par son identifiant (`data/photos.js`). Pour une nouvelle photographie, ajoutez une ligne dans `photos.js` (identifiant, alt FR / EN, cadrage) puis utilisez son identifiant dans les données.

### Régler le rythme de la visite
Dans `data/tour.js` : `vh` (durée du plan en hauteurs d'écran), `enter` (type et durée de la transition), `cam` (zoom et point visé au fil du plan), `layers` (avant-plans), et les chapitres (`from` / `to`, mise en page, dégradé de lisibilité). La documentation des champs est en tête du fichier. La console du navigateur offre `AURELIA.tour.seek(vh)` et `AURELIA.tour.seekScene("lobby", 0.5)` pour se placer à un instant précis.

### Brancher un moteur de réservation
Tant que `booking.engineUrl` (dans `hotel.js`) est vide, le formulaire fonctionne en **mode démonstration** : il **ne vérifie aucune disponibilité**, le dit clairement, affiche un récapitulatif et prépare un e-mail de demande. Pour connecter un vrai moteur, renseignez `engineUrl` et `engineParams` (les valeurs acceptent `{arrival}`, `{departure}`, `{adults}`, `{children}`, `{rooms}`, `{promo}`, `{room}`) : le visiteur est alors redirigé avec ses dates. La logique est dans `assets/js/booking/booking.js`.

## Aperçus

Treize captures (ordinateur et mobile) dans `production/previews/` : ouverture, portes, bandeau du lobby, cadre de la réception, baie vitrée, iris sur le plat, spa, finale, chambres, tables, version mobile.

## Structure

```
index.html                  page unique (sections rendues depuis les données)
assets/css/                 base (couleurs, typographie, boutons, champs, en-tête), tour, sections, overlays
assets/js/data/             LES DONNÉES : hôtel, visite, chambres, tables, bien-être, expériences, réservation, photographies
assets/js/animations/       LES ANIMATIONS : boucle (engine), transitions, visite (tour), apparitions et parallaxe (reveal)
assets/js/components/       composants : fiche détaillée plein écran, visionneuse de photographies
assets/js/sections/         LES SECTIONS : une par fichier
assets/js/navigation/       en-tête, menu mobile, langue, routage des fiches
assets/js/booking/          LES FONCTIONS DE RÉSERVATION : validation, récapitulatif, moteur externe
assets/js/lib/core.js       noyau : langue, <picture> responsive, outils
assets/img/                 photographies optimisées (AVIF + WebP), générées
assets/brand/               logo (vectoriel) et icônes
assets/fonts/               Cormorant Garamond et Hanken Grotesk (licences OFL incluses)
production/                 bible visuelle, notes, lots de génération Higgsfield, photographies sources
scripts/                    serveur, génération d'images, conversion, logo, contrôles qualité
```

Site statique sans étape de compilation : les fichiers sont chargés tels quels (scripts classiques, compatibles avec l'ouverture directe de `index.html`).

## Production des images (Higgsfield)

Les photographies ont été générées avec Higgsfield (CLI `higgsfield` connectée) à partir de la bible visuelle (`production/BIBLE-VISUELLE.md`), chaque scène recevant la façade et le lobby en référence pour garder le même hôtel. Détails, coûts et prompts : `production/NOTES-PRODUCTION.md`.

```bash
npm run generate production/jobs/03-sections.json   # un lot (reprise automatique)
npm run images                                      # AVIF + WebP + manifeste
npm run compact                                     # allège les PNG d'origine en JPEG / WebP
npm run logo                                        # régénère le logo vectoriel
```

Le journal de reprise `production/sources/_jobs.json` (identifiants de tâches de votre compte) n'est pas publié : il reste sur votre machine et est ignoré par git.

## Contrôles qualité

Avec le serveur lancé (`npm run serve`) :

```bash
npm run qa                       # 30 contrôles automatiques (liens, images, débordements, clavier, mouvement réduit, performance)
node scripts/qa-a11y.mjs         # audit d'accessibilité axe-core (ordinateur) ; ajouter "mobile" pour le téléphone
node scripts/qa-flow.mjs <dossier> [mobile]   # parcours complet fiche → réservation → contact
node scripts/qa-routes.mjs       # adresses des fiches, retour du navigateur
node scripts/qa-cls.mjs [?lang=en]   # décalages de mise en page au chargement (élément, position avant / après)
node scripts/qa-shots.mjs <dossier> desktop land=lobby mid=reception v=300   # captures aux positions de la visite
```

Les outils pilotent Chrome sans interface (`puppeteer-core`, Chrome installé sur la machine).

## Mettre en ligne

```bash
npm run build      # crée dist/ : un seul fichier JS et un seul CSS minifiés + images, polices, logos (≈ 30 Mo)
```

Envoyez le contenu de **`dist/`** chez n'importe quel hébergeur statique (GitHub Pages, Netlify…). Pour l'essayer avant : `SERVE_DIR=dist PORT=4181 npm run serve`. (Sans build, `index.html` et `assets/` fonctionnent aussi tels quels.) N'envoyez ni `node_modules/`, ni `production/`, ni `scripts/`. Cache long recommandé sur `assets/img/` et `assets/fonts/` ; aucun cache sur le HTML, le CSS et le JS.

## Avant de publier

- Remplacer **toutes** les données fictives (`hotel.js`, `rooms.js`…) puis mettre `demo: false` dans `hotel.js` (retire les mentions « Démo »).
- Remplacer les photographies générées par vos propres photographies (même nom, voir plus haut) ou conserver la mention « photographies générées par IA ».
- Remplacer les avis d'exemple par de vrais avis vérifiés ; n'afficher des prix ou des remises qu'une fois validés.
- Faire valider les pages légales (textes modèles) ; renseigner les vrais réseaux sociaux ; brancher le moteur de réservation.
