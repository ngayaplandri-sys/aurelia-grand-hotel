# AURELIA GRAND HOTEL & RESORT : bible visuelle

Référence unique pour toutes les photographies du site. Toutes les images représentent **le même établissement** et doivent se lire comme un seul reportage. Chaque prompt reprend le **bloc canonique** (`bible-block.txt`) mot pour mot, et chaque nouvelle scène reçoit en référence la façade et/ou le lobby déjà validés.

> Établissement fictif. Toutes les photographies sont générées par IA (Higgsfield) pour ce concept : elles ne représentent aucune propriété réelle. Le site le dit (mention « Démo » et pied de page).

## Concept
Un grand hôtel contemporain de luxe sur un promontoire face à la mer, de lumière méditerranéenne. Le luxe vient de la pierre, de la proportion et de la lumière, jamais de l'ornement. Calme, discret, hospitalier.

## Bloc canonique
Voir [`bible-block.txt`](bible-block.txt). Il fixe l'architecture, les matières, le mobilier, les luminaires, le personnel, la palette, la lumière et le style photographique.

## Architecture (extérieur)
- Cinq niveaux en **travertin poli** et calcaire sable, terrasses étagées aux **débords profonds**.
- **Rythme d'arcades** hautes et arrondies : la signature visible sur toutes les vues (façade, loggia, restaurant, piscine, rooftop).
- Menuiseries en **bronze foncé** très fines ; fenêtres chaudes au crépuscule.
- Portail d'entrée en arc, sur double hauteur, portes en bronze et verre, deux **lanternes de bronze** sur socles de pierre.
- **Pergola de bronze** sur le toit, plantée de végétation retombante.
- Jardins : cyprès taillés, vieux oliviers, pins parasols ; la mer en fond.

## Intérieurs
- Sols en travertin poli avec **filets d'incrustation en bronze**.
- Murs en enduit à la chaux **ivoire-crème** (jamais jaune), **chêne fumé cannelé** en panneaux et en tours.
- Mobilier rond et doux : **bouclé ivoire**, lin crème, tables en noyer et travertin.
- **Lustre monumental** de globes en verre soufflé ambré sur tiges de bronze (lobby, repris en suspensions au restaurant, à la réception).
- Appliques et lampes en bronze ; art abstrait dans les tons sable et bronze ; oliviers en pots de pierre.

## Palette
Ivoire `#F4EEE3` · blanc cassé `#FAF7F1` · beige sable `#CDB899` · champagne `#D9C39D` · bronze discret `#8E6B45` · brun chaud `#33251A` · noir profond `#0B0907`.

## Lumière et direction photographique
- Heure dorée pour l'extérieur ; lueur de tungstène chaude pour l'intérieur ; heure bleue pour le finale (rooftop).
- Photographie d'architecture éditoriale, objectif 24 mm à bascule, **verticales strictement droites**, couleurs naturelles, grain léger. Compositions symétriques et calmes.
- Personnes : rares, petites dans le cadre, vêtements neutres. Personnel en veste charbon aux boutons de bronze. Aucune marque, aucun texte lisible.

## Espaces
| Espace | Identifiants des photographies |
|---|---|
| Façade, entrée, loggia, vues aériennes | `facade`, `entrance`, `intro-loggia`, `intro-aerial`, `view` |
| Lobby, réception, couloir | `lobby` (21:9), `reception`, `corridor` |
| Chambres et suites | `room-deluxe`, `room-executive`, `room-junior`, `suite`, `room-presidential` + détails (`room-bath`, `room-terrace`, `room-desk`, `room-breakfast`, `room-pool-terrace`) |
| Tables | `dining-terrace`, `dining-room`, `dish`, `dish-starter`, `dish-dessert`, `ingredients`, `table-detail`, `service`, `chef` |
| Spa, piscine, bien-être | `spa`, `spa-treatment`, `sauna`, `fitness`, `relax`, `pool` |
| Rooftop | `rooftop` |
| Expériences | `exp-private-dinner`, `exp-excursion`, `exp-culture`, `exp-events`, `exp-gastro`, `exp-relax`, `exp-service`, `offer-romantic` |
| Détails | `detail-chandelier`, `detail-bronze`, `detail-linen`, `detail-art` |
| Calques de profondeur (fond transparent) | `fg-olive`, `fg-lights` |

## Versions verticales (mobile)
Les 13 plans de la visite ont une **composition verticale dédiée** (`<id>-m`), recomposée à partir de la version horizontale (même lieu, même lumière, cadrage pensé pour un écran vertical) : ce n'est pas un simple recadrage.

## Interdits
Texte lisible, logos, marques, néons, couleurs saturées criardes, mobilier ou architecture étrangers à la maison (autres hôtels), visages en gros plan répétés, scènes sans lien avec le lieu.

## Cohérence : méthode
1. Façade générée en premier (référence d'architecture et de lumière).
2. Lobby recréé en haute définition à partir d'une première version (référence de matières et de mobilier).
3. Toute scène suivante reçoit la façade et le lobby en `--image-references`, avec la consigne « même hôtel : réutiliser matières, palette et grain, ne jamais copier la composition ».
4. Les photographies secondaires (modèle plus léger) reçoivent la scène principale la plus proche comme référence (par exemple la suite pour les chambres, le spa pour les cabines).
