export default {
	infoEtapeTitle: 'Mise à jour',
	infoCarteEtape: `**Attention**, changer la carte de référence peut entraîner des incohérences dans les étapes existantes. 
Pour un bon fonctionnement la nouvelle carte doit contenir les mêmes calques.`,
	infodescriptionTitle: ``,
	infoDescriptionSyntaxe: ``,
	continue: 'Continuer',
	stop: 'Abandonner...',
	/* Modeles */
	standard: `Le mode **standard** présente une carte via une interface utilisateur simplifiée. 
A l'exception de la barre de titre et d'une légende facultative, la carte remplit l'écran. 
Une bulle s’affiche lors du clic ou du survol d’un objet. Idéal pour une présentation simple et rapide de votre carte en plein écran.`,
	volet: `Le mode **volet** présente une carte avec des descriptifs importants, inadaptés à un affichage dans une bulle. Les informations
sur les objets s’affichent dans un volet latéral (gauche ou droit). Idéal pour une carte où le contenu est important.`,
	photo: `Le mode **photo** est identique au mode volet, mais ajoute un bandeau en bas de la carte pour afficher les photos
présentes sur la carte. Les informations sur les objets s’affichent dans un volet latéral. Idéal pour présenter une carte avec des photos.`,
	diapo: `Le mode **diapo** est identique au mode photo, mais au lieu d’afficher la photo dans un volet, elle s’affiche en plein écran. 
Il est possible de lancer un diaporama qui affiche les photos parmi les objets présents sur la carte.
Idéal pour présenter vos photos de vacances.`,
	etape: `Le mode **étapes** permet de créer un parcours constitué de différentes étapes.
Chaque étape est définie par un niveau de zoom, le centrage de la carte et des couches visibles ainsi que par une description de l'étape.`,
	onglet: `Le mode **onglets** permet de créer plusieurs onglets avec pour contenu une carte narrative.`,
	compare: `Le mode **comparaison** permet de visualiser parallèlement deux cartes.`,
	compareRLT: `Le mode **remonter le temps** permet de comparer deux cartes côte à côte et de choisir simplement les fonds à comparer.`,
	differentiel: `Le mode **différentiel** permet de sélectionner deux objets à comparer sur une carte.
Leurs fiches s'affichent côte à côte pour permettre la comparaison.`,
	/* Layout colors */
  layout_default: 'thème par défaut',
  layout_gray: 'thème gris',
  layout_green: 'thème vert',
  layout_braun: 'thème brun',
  layout_blue: 'thème bleu',
  layout_purple: 'thème violet',
	/* Info */
	infoMarkdown: `Aide pour le markdown`,
infoCarte: `# Ajouter une carte
----
Choisissez ici la ou les cartes sur lesquelles vous voulez raconter une histoire.

:fa-warning:2x left:#f18345: Vous devez au préalable avoir créer une carte avec le module d'édition (choisir les fonds et ajouté des données).
C'est cette carte qui servira de support à votre histoire.
`,
infoModele: `# Raconter une histoire
----
Vous pouvez choisir une mode de narration parmis un pannel de modèles proposant chacun une expérience interactive différente.
Afficher une carte simple, placer les informations dans une bulle sur la carte ou dans un volet, afficher des photos, raconter une histoire pas à pas ou comparer deux cartes côte à côtes sont autant de possibilité offerte pour présenter vos information sur la carte et raconter votre histoire.
`,
infoProperties: `# Propriétés
---
*Donnez un titre à cotre carte*

Vous pouvez modifier les propriétés de la carte, son titre ou son logo et proposer une description pour introduire votre démarche.
La description s'affichera dans une boite de dialogue ou sur le volet au chargement de la carte.
`,
infoMiseEnForme: `# Outils de mise en forme
----
*Donnez du style à votre carte*

C'est ici que vous pouvez choisir les couleurs de votre carte, la forme des bulles qui s'affichera sur la carte ou la position du volet.`,
infoSteps: `# Les étapes
----
*Définissez ici les étapes de votre récit.*

Pour chaque étape choisissez le contenu qui s'affichera dans le volet et donner lui un titre.
La position, le zoom de la carte ainsi que la liste des couches visible seront enregistré lors de la validation de l'étape.
`,
infoPopup: `# Les bulles
----
Lorsqu'un objet est sélectionné sur la carte, une information s'affichera dans une bulle sur la carte.
Vous pouvez choisir le type de bulleet ses propriétés (case de fermeture, taille, etc.).
`,
infoDisplay: `# Paramètres
----
Choisissez ici les outils et les contrôles à afficher sur la carte.
`,
infoSwitcher: `# :fg-layer-stack-o: Gestionnaire de couche
----
Le gestionnaire de couche permet à l'utilisateur de modifier l'affichage des couches sur la carte.
- Le **gestionnaire par défaut** permet de choisir l'ordre de couches et l'opacité de celles-ci.
- Le **gestionnaire thématique** n'affiche que les couches visibles à l'ouverture et propose à l'utilisateur d'ajouter les autres couches à la demande. Cette option est particulièrement pratique si la carte propose un grand nombre de couches pour ne pas surcharger la liste des couches disponibles.
NB: cette dernière option n'est effective que lors de l'affichage finale de la carte.
`,
infoITools: `# Outils (visualisation)
----
Vous pouvez proposer des outils sur la page de visualisation pour prendre mesurer des distances ou des surface sur la carte ou des outils de dessin.
Vous pouvez également permettre aux utilisateur d'ajouter leurs propres données sur votre carte (co-visualiser).
`,
infoOnglets: `# Onglets
----
Utilisez le mode onglet pour présenter les cartes dans des onglets.
Chaque onglet contient une carte différentes qui peuvent être synchronisées entre elles.
`,
infoDifferentiel: `# Différentiel
----
Le mode différentiel permet de sélectionner deux objets à comparer sur une carte.
Leurs fiches s'affichent côte à côte pour permettre la comparaison.
Vous pouvez choisir d'afficher une liste de couches sur lesquelles faire la sélection.

Vous pouvez également définir des attributs (indicateurs) qui sera transmis à la fiche pour conditionner son affichage.
Les indicateurs sont des valeurs séparées par des virgules. Vous pouvez alors accéder à la valeur de l'indicateur dans la fiche via la variable \`%INDICATOR%\` ou \`%INDICATOR=valeur%\`.
`,
	infoShare: `# Partage`,
	loadCarte: `Charger une carte`,
	newCarte: `Créer une nouvelle carte`,
	saveTitle: `Enregistrer`,
	save: `Enregistrer`,
	saveAs: `Enregistrer sous`,
	hasChanged: `Une carte est en cours d'édition. 
Si vous continuez les mises à jour ne seront pas enregistrées.`,
	newCarteNotif: `Nouvelle carte créée...`,
	noExample: `Pas d'exemple pour l'instant...`,
	onlineHelp: `Aide en ligne`,
	stepsWarningTitle: `Attention!`,
	stepsWarningContent: `Vous ne pouvez pas ajouter une étape sans avoir chargé une carte`,
	ok: 'OK'
}