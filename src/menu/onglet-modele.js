import story from '../story'
import html from '../../page/onglet-modele.html'
import charte from 'mcutils/charte/macarte'
import _T from  'mcutils/i18n/i18n'
import md2html from 'mcutils/md/md2html'

import '../../page/onglet-modele.css'
import element from 'ol-ext/util/element'
import notification from 'mcutils/dialog/notification'

/* Menu principal*/
const menu = document.querySelector('[data-role="menu-tab"]');

/*Division onglet modele*/
const ongletModele = element.create('DIV', { html: html });
charte.addMenuTab('model', 'fi-model', 'Modèle', ongletModele);

/** Mettre a jour le modele
 * @param {*} modele modele à appliquer à la carte narrative.
*/
function setModele(modele) {
  story.setModel(modele);
  story.dispatchEvent({ type: 'change:modele' });
  menu.setAttribute('data-modele', modele);
  ongletModele.querySelector("h2 span").innerHTML =story.models[modele].title ;
}

/* Liste des modeles*/
const listModel = Object.keys(story.models);

/* Modele sur lequel on est placé de base a la presentation*/
let currentModel = 0;

/** Actualiser le modele affiché sur l'onglet au clic sur les fleches 
 * @param n numéro du modèle
 */ 
function actualizeModele(n) {
  currentModel = (parseInt(n) + listModel.length) % listModel.length;
  var mod = listModel[currentModel];
  // On affiche l'image du modele
  ongletModele.querySelector('[data-attr="img"]').src = './models/' + mod + '.png';
  ongletModele.querySelector('[data-attr="nom"]').innerHTML = story.models[mod].title;
  ongletModele.querySelector('[data-attr="description"]').innerHTML = md2html(_T(mod));
  // Afficher les points
  const dot = ongletModele.querySelector('.dot');
  dot.innerHTML = '';
  listModel.forEach((m, i) => {
    element.create('DIV', {
      title: story.models[m].title,
      className: i===currentModel ? 'select' : '',
      click: () => actualizeModele(i),
      parent: dot
    })
  })
}

/* bouton v */
/*const list = ongletModele.querySelector('[data-attr="list"]');*/
const select =  ongletModele.querySelector('[data-attr="select"]');

select.addEventListener ('change', () => {
  actualizeModele(select.value);
  select.value = '';
})
listModel.forEach((m, i) => {
  element.create('OPTION' ,{
    value: i,
    html: story.models[m].title,
    parent: select
  })
})

/* Previous button */
ongletModele.querySelector('[data-attr="precedent"]').addEventListener('click', () => actualizeModele(currentModel - 1) );

/* Next button */
ongletModele.querySelector('[data-attr="suivant"]').addEventListener('click', () =>  actualizeModele(currentModel + 1) )

/* Use the model */
ongletModele.querySelector('.use-it').addEventListener('click', () => {
  if (story.get('model') === listModel[currentModel]) return;
  // Reset selection / info
  if (story.getCarte()) story.getCarte().setSelection();
  if (story.getCarte(1)) story.getCarte(1).setSelection();
  story.setInfoVolet('');
  // Change model
  setModele(listModel[currentModel])
});

/* Use the model * /
ongletModele.querySelector('.show-example').addEventListener('click', () => {
  const example = story.models[listModel[currentModel]].example;
  if (!example) {
    notification.show(_T('noExample'))
  } else {
    window.open(example)
  }
})
*/

/* CHARGEMENT*/
story.on('read', () => {
  setModele(story.get('model'));
  actualizeModele(listModel.indexOf(story.get('model')));
});
