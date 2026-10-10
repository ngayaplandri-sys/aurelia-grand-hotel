# AURELIA GRAND : note de production

## Transformation du projet précédent
Le site LANDRI (restaurant, `site web cinematographiques de landri`) a servi de référence technique : site statique en JavaScript natif piloté par des données, polices Cormorant Garamond et Hanken Grotesk, serveur local, chaîne Higgsfield et conversion d'images, bascule FR / EN, fiche détaillée, formulaire validé, version « mouvement réduit ».

**Retiré** : toute la mécanique vidéo (film maître, extraction d'images, canvas piloté par le défilement, `ffmpeg-static`, `build-frames.mjs`, `flight.js`, manifeste de séquence). **Aucune vidéo, aucun canvas** : chaque plan de la visite est une photographie, animée par le code (transformations, opacité, masques).

**Conservé et adapté** : architecture « données séparées du rendu », bilingue, dialogue natif, serveur, génération par lots avec reprise, polices, validation de formulaire.

## Direction artistique
Luxe discret : noir profond, ivoire, beige sable, champagne, bronze, brun chaud. Titres en Cormorant Garamond (léger, avec italiques), texte en Hanken Grotesk. Boutons rectangulaires fins en capitales espacées, traits fins, très grandes respirations. Le luxe vient de la photographie, de la composition, de la typographie et des transitions ; aucun ornement décoratif, aucun dégradé artificiel. Détail récurrent : l'**arche** (celle de l'architecture), reprise dans l'ouverture de la baie vitrée, l'image d'introduction et la mise en page.

Bible visuelle : [`BIBLE-VISUELLE.md`](BIBLE-VISUELLE.md) (bloc canonique : `bible-block.txt`).

## La visite : storyboard en 13 plans
| # | Plan | Texte | Transition d'entrée | Mouvement de la caméra |
|---|---|---|---|---|
| 1 | Façade | « AURELIA GRAND », « An extraordinary stay. » puis « Some places stay with you. » | (ouverture : la photographie se pose, titre révélé mot à mot) | zoom lent vers le portail |
| 2 | Entrée | « Welcome to a different kind of stay. » | **portes** : la photographie s'ouvre au centre comme deux battants, la façade avance | léger zoom vers le portier |
| 3 | Lobby (21:9) | « Where every detail welcomes you. » | **travelling avant** : la photographie très large apparaît en **bandeau de cinéma**, puis s'ouvre sur tout l'écran | zoom vers le lustre, déplacement latéral |
| 4 | Réception | « Hospitality, thoughtfully reimagined. » | **cadre éditorial** : la photographie glisse dans une fenêtre, le lobby recule et s'assombrit | rapprochement doux |
| 5 | Couloir | (légende seule) | **marche** : fondu par le noir, la caméra avance vers la baie du fond | zoom continu sur le point de fuite |
| 6 | Suite | « Your own world of comfort. » | fondu avec zoom d'arrivée | large → le lit → la baie vitrée |
| 7 | Vue | « Wake up somewhere extraordinary. » | **baie vitrée** : la vue s'ouvre dans l'arche de la porte-fenêtre | recul lent + **calque d'avant-plan** (branche d'olivier) qui passe plus vite |
| 8 | Terrasse du restaurant | « A taste worth travelling for. » | **rideau** : la photographie se lève depuis le bas | lent déplacement latéral |
| 9 | Plat (gros plan) | (même texte) | **iris** : un disque s'ouvre sur l'assiette | recul du cadre serré |
| 10 | Salle | (même texte) | **balayage** de gauche à droite | traversée de la salle |
| 11 | Spa | « Find your stillness. » | fondu très lent | montée tranquille |
| 12 | Piscine | « Make room to unwind. » | **éclaircie** : passage du sombre au lumineux | déplacement vers la mer |
| 13 | Rooftop | « Your next extraordinary stay begins here. » + « EXPLORE OUR ROOMS » / « BOOK YOUR STAY » | fondu par le noir, heure bleue | recul + **calque de guirlandes** (bokeh) qui s'élève |

Puis le site cède la place : la section d'introduction **glisse sur la dernière photographie** (restée épinglée) comme une page que l'on tourne.

Durée : ≈ 1 475 écrans de défilement sur ordinateur (×0,8 sur mobile), tout est réglable dans `assets/js/data/tour.js` (durées, transitions, cadrages, calques, textes). Le visiteur garde toujours la main : défilement natif (aucun faux défilement), lien « Skip the visit », rail cliquable des plans, navigation toujours visible, bouton de réservation toujours accessible.

## Techniques d'animation (sans bibliothèque)
- Une seule boucle `requestAnimationFrame` (`engine.js`) qui **se rendort** dès qu'il n'y a plus de mouvement ; le défilement est lissé (indépendant de la fréquence d'affichage).
- Quatre couches par plan (entrée / sortie / caméra / voile) pour que les transitions ne se gênent jamais ; seules `transform`, `opacity` et `clip-path` sont animées, aucune mesure de mise en page pendant le défilement.
- Plans chargés **au fil de l'eau** (le plan courant et les deux suivants), préchargement doux en temps libre, jamais toutes les photographies d'un coup.
- Textes : du vrai HTML par-dessus les photographies (sélectionnable, traduit, accessible) ; mots révélés par masque.
- Reste du site : apparitions par `IntersectionObserver`, parallaxe calculée depuis des positions mesurées une fois.

## Images
- **Modèle maître** : Nano Banana Pro (2k, ≈ 2 750 px de large), choisi après comparaison sur la façade avec Soul Cinematic, Soul Location, GPT Image 2.5 et Seedream 5.0 Pro (les modèles Soul inventaient des détails d'architecture et de personnel peu crédibles ; GPT Image 2.5 était plus saturé).
- **Images secondaires** : Nano Banana 2 Lite (1k, 1 crédit), avec la scène principale la plus proche en référence.
- **Calques d'avant-plan** : GPT Image 2.5 avec fond transparent (`--background transparent`).
- **13 compositions verticales** dédiées (même lieu, même lumière, cadrage pensé pour un écran vertical), servies sur téléphone et écran vertical (`(max-width: 767px), (orientation: portrait)`).
- Conversion : AVIF (qualité 56) + WebP (qualité 76), 3 à 4 largeurs par image, couleur moyenne en fond le temps du chargement, dimensions déclarées ; ≈ 30 Mo pour 61 fichiers sources, première image servie en ≈ 120 Ko (AVIF 1 920 px).
- Sources allégées en JPEG / WebP très haute qualité (`npm run compact`) : 30 Mo au lieu de 280 Mo.

### Lots Higgsfield (`production/jobs/`)
| Lot | Contenu | Modèle | Crédits |
|---|---|---|---|
| comparaison | 5 modèles sur la façade, 3 essais du lobby | divers | 9,74 |
| `01a-lobby` | lobby de référence (recréé en haute définition) | Nano Banana Pro | 2 |
| `01b-hero-desktop` | 10 plans horizontaux | Nano Banana Pro | 20 |
| `02-hero-mobile` | 13 compositions verticales | Nano Banana Pro | 26 |
| `03-sections` | 33 photographies (chambres, tables, bien-être, expériences, détails) | Pro (8) + Lite (25) | 41 |
| `04-foregrounds` | 2 calques à fond transparent | GPT Image 2.5 | 2 |
| reprises | excursion (hôtel visible sur les essais précédents) | Pro + Lite | 3 |
| **Total** | | | **≈ 103,7** |

Relancer un lot : `npm run generate production/jobs/<lot>.json [nom …]` (reprise automatique ; pour refaire une image, supprimer sa ligne dans `production/sources/_jobs.json` et le fichier). Ce journal de reprise contient des identifiants de tâches du compte Higgsfield : il reste local (ignoré par git) et n'est pas publié ; sans lui, un lot relancé régénère toutes ses images.

## Vérifications effectuées
Outils dans `scripts/` (Chrome sans interface via `puppeteer-core`) :
- `npm run qa` : 30 contrôles (liens et ancres, 17 fiches, aucune erreur HTTP, alt et dimensions sur les 79 images, un seul `h1`, aucun défilement horizontal de 320 à 2 560 px, ordre de tabulation et anneaux de focus, mode mouvement réduit, performance : ≈ 310 Ko au chargement, LCP 0,4 s en local, CLS 0, défilement de la visite à 60 i/s en rendu logiciel).
- `qa-a11y.mjs` (axe-core, WCAG 2 A/AA + bonnes pratiques) : **0 problème** sur ordinateur et mobile, dans 7 états (visite, contenu, fiche, visionneuse, menu mobile, version française).
- `qa-flow.mjs` : parcours complet (fiche → visionneuse → réserver cette chambre → erreurs de validation → récapitulatif → langue → contact → page légale), ordinateur et mobile.
- `qa-routes.mjs` : adresses partageables des fiches, bouton retour / avancer, Échap, adresse invalide.
- `qa-shots.mjs`, `qa-hover.mjs`, `qa-gallery.mjs`, `qa-intro.mjs` : captures aux positions exactes de la visite, à tous les formats (320 px à 2 560 px).

## Limites connues (à lire avant publication)
- **Établissement fictif.** Nom, adresse (`.example`), numéros, chiffres (112 chambres, 1 800 m²…), horaires, offres, chef et témoignages sont des éléments de démonstration, signalés « Démo » sur le site. Aucun prix ni remise n'est affiché (« Tarif sur demande »). Les avis sont des exemples étiquetés comme tels.
- **Photographies générées par IA.** Elles ne représentent aucune propriété réelle (mentions dans la visite, la galerie, les mentions légales et le pied de page). Quelques détails d'IA restent possibles à très fort agrandissement (mains, reflets) ; le portrait de la cheffe est un personnage généré : à remplacer.
- **Aucun moteur de réservation connecté** : le module ne vérifie aucune disponibilité et le dit. Il prépare un récapitulatif et un e-mail de demande ; le branchement d'un vrai moteur se règle dans `data/hotel.js` (`booking.engineUrl`).
- **Pages légales** : textes modèles à faire valider par un juriste. **Réseaux sociaux** : liens génériques vers les plateformes, à remplacer.
- **Carte** : illustration fictive (aucun fond de carte réel).
- Testé dans Chrome. Fonctionnalités modernes utilisées (`dialog`, `inert`, `clip-path`, AVIF, unités `svh` / `lvh`) : navigateurs récents ; le mode « fixe » sert de repli.
- La fluidité sur un vrai téléphone reste à valider à la main (les mesures ont été faites en rendu logiciel).
