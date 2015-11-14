# ticket-resto-exporter.user.js
Extension pour navigateur web permettant d'exporter les transactions de la carte ticket restaurant.
Ce script insère un bouton "Export" dans la liste des transcations sur le le site web de la carte.
Un clic sur ce bouton permet d'obtenir un fichier au format csv contenant l'ensemble des transactions (crédits et débits)
Le fichier ainsi obtenu est compatible avec le logiciel HomeBank (homebank.free.fr). Vous pouvez le manipuler pour l'utiliser avec tout autre logiciel.

## Version
* 2015-11-14 : 1.0

## Compatibilité
* Ne fonctionne pas encore sous Mozilla firefox avec GreaseMonkey
* Testé avec "Google Chrome 46.0.2490.86 m" avec Tampermonkey
* Testé avec "Google Chrome 46.0.2490.86 m" en tant qu'extension

## Installation dans Mozilla Firefox
1. Télécharger "GreaseMonkey"
2. Naviguer vers le lien : https://gist.github.com/Binnette/9e21c096654639fd07db
3. Cliquer sur le bouton "Raw"
4. Cliquer sur le bouton "Enable and install script"

## [Recommandé] Installation dans Chrome avec Tampermonkey
1. Installer Tampermonkey dans Chrome
2. Télecharger le fichier "ticket-resto-exporter.user.js"
3. Ajouter le script dans Tampermonkey

## Installation dans Chrome comme extension
1. Télecharger le fichier "ticket-resto-exporter.user.js"
2. Ouvrir la liste des extensions de Google Chrome
3. Cocher la case "Mode développeur"
4. Faire un cliquer-déposer du fichier télécharger dans l'onglet extension de Chrome
5. CLiquer sur "Ajouter l'extension"

## Utilisation
1. Connecter vous sur le site https://www.myedenred.fr
2. Naviguer vers la page "Mes débits / Mes chargements" ("Mes transactions")
3. Cliquer sur le bouton "Export" (en haut de la liste des transactions)
4. Le bouton se transforme en bouton "En cours"
5. Après une courte attente, le fichier CSV généré est téléchargé
6. Le fichier est disponible dans votre répertoire de téléchargements
