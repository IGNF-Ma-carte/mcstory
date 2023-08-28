import element from 'ol-ext/util/element'
import InputCollection from 'ol-ext/util/input/Collection'
import charte from 'mcutils/charte/macarte'
import colorPicker from 'ol-ext/util/input/Color'
import story from '../story'

import '../../page/onglet-differentiel.css'
import html from '../../page/onglet-differentiel.html'
import dialog from 'mcutils/dialog/dialog'

/* Add menu tab */
const ongletDiff = element.create('DIV', { className: 'differentiel',  html: html });
charte.addMenuTab('differentiel', 'fi-dossier', 'Différentiel', ongletDiff);
charte.setInputPlaceholder(ongletDiff);

/* Add color picker */
[1,2].forEach((i) => {
  const picker = new colorPicker({ 
    pickerLabel: 'sélecteur',
    input: ongletDiff.querySelector('[data-attr="color-' + i + '"]'), 
    color: '#fff', 
    position: 'fixed', 
    hastab: true, 
    opacity:false 
  });
  picker.on('color', () => {
    story.setSelectColor("select"+i, picker.getColor());
  });
  // Update color on read
  picker.setColor(story.getSelectColor('select'+i))
  story.on('read', ()=> {
    picker.setColor(story.getSelectColor('select'+i))
  });
})

/* Layer options */
const title = ongletDiff.querySelector('[data-attr="title"]');
const displayLayers = ongletDiff.querySelector('[data-attr="displayLayers"]');

function setDisplay() {
  story.setLayerSelection(title.value, displayLayers.checked);
  title.disabled = !displayLayers.checked;
}
displayLayers.addEventListener('change', setDisplay);
title.addEventListener('keyup', setDisplay);

// Indicator list
const indicatorList = new InputCollection({
  target: ongletDiff.querySelector('.list'),
  collection: story.getIndicators(),
  getTitle: (item) => {
    const elem = element.create('DIV', {
      html: item.title
    })
    element.create('I', { 
      className: 'fi-delete',
      title: 'suppr.',
      click: () => {
        let pos = story.getIndicators().getArray().indexOf(item);
        elem.remove();
        story.getIndicators().removeAt(pos);
        story.clearInfoVolet();
      },
      parent: elem
    })
    return elem;
  }
})
indicatorList.on('item:dblclick', updateIndicator)

ongletDiff.querySelector('.indicators button').addEventListener('click', () => {
  updateIndicator();
})

// Add or modify an indicator
function updateIndicator(e) {
  dialog.show({
    title: 'Indicateur',
    className: 'indicator',
    content: `
<ul class="indicators edit">
  <li>
    <label>Identifiant : </label>
    <input type="text" class="id" />
  </li>
  <li>
    <label>Titre : </label>
    <input type="text" class="title" />
  </li>
</ul>`,
    buttons: { submit : 'Ajouter', cancel: 'Annuler' },
    onButton: (b, inputs) => {
      if (b === 'submit') {
        if (inputs.id.value) {
          dialog.hide();
          if (e) {
            e.item.id = inputs.id.value
            e.item.title = inputs.title.value || inputs.id.value
            indicatorList._update()
          } else {
            story.getIndicators().push({
              id: inputs.id.value,
              title: inputs.title.value || inputs.id.value
            })
          }
        } else {
          inputs.id.required = true;
          inputs.id.focus();
        }
        story.clearInfoVolet();
      }
    }
  })
  if (e) {
    dialog.getContentElement().querySelector('.id').value = e.item.id;
    dialog.getContentElement().querySelector('.title').value = e.item.title;
  }
}

// Update on read
story.on(['read','read:carte'], () => {
  displayLayers.checked = !!story.get('layers');
  charte.setInputValue(title, story.get('selectTitle') || '');
  setDisplay();
});
