import story from '../story'
import html from '../../page/onglet-etapes.html'
import charte from 'mcutils/charte/macarte'
import InputCollection from 'ol-ext/util/input/Collection'
import MDEditor from 'mcutils/md/MDEditor'
import dialog from 'mcutils/dialog/dialog'
import _T from 'mcutils/i18n/i18n'
import md2html from 'mcutils/md/md2html';
import notification from 'mcutils/dialog/notification'

import '../../page/onglet-etapes.css'
import element from 'ol-ext/util/element'

/* Ajout onglet au Menu */
const ongletEtapes = element.create('DIV', { className: 'etape', html: html });
charte.addMenuTab('steps', 'fi-step', 'Etapes', ongletEtapes);
var anim;

/* bouton animation */
const checkAnim = ongletEtapes.querySelector("[data-attr = 'animation']")
checkAnim.addEventListener('change',(e) => {
  anim = e.target.checked; 
  story.set('animStep', anim);
});

/*Bouton affichage titre*/
const showtitle = ongletEtapes.querySelector('[data-attr="displayTitle"]');

/* Zones de texte */
const inputTitle = ongletEtapes.querySelector('[data-attr="title"]');
const inputContent = ongletEtapes.querySelector('textarea');

/* Description */
const editor = new MDEditor({ input: inputContent })

/* Affichage de l'edition directement dans le volet en meme temps que l'ecriture*/
inputTitle.addEventListener('change', () => {
  visualisation();
});
editor.on('change', () => {
  visualisation();
});
showtitle.addEventListener('change', () => {
  visualisation();
});

/** Visualisation de l'entrée du titre et de la description dans le volet. */
function visualisation(){
  if (ongletEtapes.getAttribute('data-mode') === 'edit') { 
    if (showtitle.checked){
      story.setInfoVolet(
        '## ' + inputTitle.value +'\n' + editor.getValue()
      );
    } else {
      story.setInfoVolet(
        editor.getValue()
      );
    }
  }
}

let currentStep;

/** Ouvre le mode edition d'une étape.
 * @param step étape à ouvrir, null ou existante.
 * */  
function edit (step) {
  // Si on edit une etape existante
  if (step) {
    inputTitle.value = step.title;
    editor.setValue(step.content);
    showtitle.checked = step.showTitle
  } else {
    inputTitle.value = '';
    editor.setValue('')
  }
  currentStep = step;
  // Mode edition
  ongletEtapes.setAttribute('data-mode', 'edit');
  // Focus on the input
  editor.input.focus();
  // Freeze on current step
  if (ongletEtapes.getAttribute('data-mode') == 'edit'){
    story.freezeStep(true);
  }
  // Show layerswitcher
  const carte = story.getCarte();
  carte.showControl('layerSwitcher', true)
}
 
/** Fonction qui met a jour une etape 
 * @param {*} step étape à mettre à jour 
 */
function updateStep(step) {
  // Passer en mode liste
  ongletEtapes.setAttribute('data-mode', 'list');
// story.freezeStep(false);
  // Recuperer les layers
  const layers = [];
  story.getCarte().map.getLayers().forEach((l) => { 
    if (l.getVisible()) layers.push(l.get('id'));
  })

  /* Position de la carte */
  const center = story.getCarte().map.getView().getCenter();
  const zoom = story.getCarte().map.getView().getZoom();

  /* Placement a la position de l'etape sur la story */
  let position;
  if (!step) {
    step = {}
    story.getSteps().push(step);
    position = story.getSteps().getLength() -1;
  } else {
    position = story.getSteps().getArray().indexOf(step);
  }

  /* Update value */
  if (inputTitle.value == ""){
    step.title = "Sans Titre " + (position+1);
  } else {
    step.title = inputTitle.value;
  }
  
  step.showTitle = showtitle.checked;
  step.content = inputContent.value;
  step.layerIds = layers;
  step.center = center;
  step.zoom = zoom;

  stepsInput.refresh();
  setTimeout(() => story.setStep(position, anim))
  story.freezeStep(false);
  story.getCarte().showControl('layerSwitcher', story.getProperties().controls.layerSwitcher)
  return position;
}

/* Bouton ajouter une etape */ 
ongletEtapes.querySelector('[data-attr="newStep"]').addEventListener('click', () => {
  if (story.cartes.length > 0) {
    // Passer en mode edition
    edit();
  } else {
    dialog.show({
      title: _T('stepsWarningTitle'),
      content: md2html(_T('stepsWarningContent')),
    });
  }
})

/* Bouton validation ajout etape */
ongletEtapes.querySelector('[data-attr="confirm"]').addEventListener('click', () => {
  currentStep = updateStep(currentStep);
  //console.log(currentStep);
  stepsInput.select(story.getSteps().getArray().at(currentStep));
  story.setStep(currentStep);
});

/* Bouton annulation ajout etape */
ongletEtapes.querySelector('[data-attr="annule"]').addEventListener('click', () => {
  ongletEtapes.setAttribute('data-mode', 'list');
  story.freezeStep(false);
  story.getCarte().showControl('layerSwitcher', story.getProperties().controls.layerSwitcher)
  story.setStep(story.getSteps().getArray().indexOf(currentStep));
});

/* Liste interactive des etapes branchee sur les etapes de la story */
const stepsInput = new InputCollection({
  target: ongletEtapes.querySelector('.list'),
  collection: story.getSteps(),
  getTitle: (item) => {
    const elem = element.create('DIV', {
      html: item.title
    })
    element.create('I', { 
      className: 'fi-delete',
      title: 'suppr.',
      click: () => {
        let pos = story.getSteps().getArray().indexOf(item);
        elem.remove();
        story.getSteps().removeAt(pos);
        if (pos === story.currentStep) story.setStep(pos-1, anim);
        if(story.getSteps().getLength() == 0) story.setStep();

        notification.cancel('Une étape à été supprimée...', () => {
          story.getSteps().insertAt(pos, item);
          story.currentStep = pos;
          notification.hide();
          story.setStep(pos, anim);
        });
      },
      parent: elem
    })
    return elem;
  }
})

/* Evenements sur la liste interactive */
stepsInput.on('item:select', (e) => {
  if(e.position >= 0){
   // console.log(e.position)
    story.setStep(e.position, anim);
  }
});
stepsInput.on('item:order', (e) => {
  console.log(e.position)
  story.setStep(e.position, anim);
});
stepsInput.on('item:dblclick', (e) => {
  story.setStep(e.position, false);
  edit(e.item);
});

// Update list on step change
story.on('change:step', (e) => {
  stepsInput.select(e.step);
});

/* CHARGEMENT */
story.on('read', () => {
  checkAnim.checked = anim = story.get('animStep');
  showtitle.checked = true;
  ongletEtapes.setAttribute('data-show', 'title');
  // Show first step
  setTimeout(() => story.setStep(0, false));
})

/* Evenement à l'ouverture d'un onglet */
charte.on('tab:show', e => {
  // reset steps
  ongletEtapes.setAttribute('data-mode', 'list');
  story.freezeStep(false);
  const carte = story.getCarte();
  if (carte) carte.showControl('layerSwitcher', story.getProperties().controls.layerSwitcher)

  //if(e.position >= 0){
   // story.setStep(story.getSteps().currentStep);
  //}
})
