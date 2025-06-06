import story from '../story';
import charte from 'mcutils/charte/macarte'
import dialogImportFile from 'mcutils/dialog/dialogImportFile'
import ol_ext_element from 'ol-ext/util/element'
import {buffer as buffer_extent, isEmpty } from 'ol/extent'

import '../../page/onglet-parametres.css'
import html from '../../page/onglet-parametres.html';
import dialog from 'mcutils/dialog/dialog';
import notification from 'mcutils/dialog/notification';

// New tab
const ongletParametres = charte.addMenuTab('options', 'fi-configuration', 'Paramètres carte', html);

// attributes
const displayAttributes = [
  'searchBar', 
  'zoom',
  'profil',
  'printDlg',
  'scaleLine', 
  'locate',
  'mousePosition', 
  'legend',
  'rotation',
];

// Update attributes
displayAttributes.forEach(v => {
  const input = ongletParametres.querySelector('[data-attr="'+v+'"]');
  if (input) {
    input.addEventListener('change', (e) => {
      story.setControl(v, e.target.checked);
    })
  }
});

// Mapzone
ongletParametres.querySelector('[data-attr="mapzone"]').addEventListener('change', e => {
  // Get zone
  const what = e.target.value;
  if (what === 'custom') {
    dialogImportFile(e => {
      if (story.getCarte()) story.getCarte().setMapZone('custom', false)
      let nb = 0
      e.features.forEach((f, i) => {
        let ext = f.getGeometry().getExtent()
        if (ext[0]===ext[2] || ext[1] === ext[3]) {
          ext = buffer_extent(ext, 0.1)
        }
        if (!isEmpty(ext)) {
          nb++;
          if (story.getCarte()) {
            story.getCarte().getControl('mapzone').addZone({
              title: f.get('name') || f.get('nom') || 'zone '+i,
              extent: ext
            })
          }
        }
      })
      notification.show('Chargement des zones : ' + nb + ' / ' + e.features.length)
    }, {
      title: 'Définir des zones',
      className: 'mc-mapzone',
      readCarte: false,
      projection: 'EPSG:4326'
    })
    dialog.getContentElement().appendChild(ol_ext_element.create('I', { text: "Choisissez un fichier contenant des zones de focalisation." }))
  } else {
    if (story.getCarte()) story.getCarte().setMapZone(what, false)
  }
})
// Layerswitcher
ongletParametres.querySelector('[data-attr="switcherModel"]').addEventListener('change', (e) => {
  story.setControl('layerSwitcher', e.target.value !== 'none');
  story.setControl('switcherModel', e.target.value);
})


// Iframes tools
const tools = ['measure', 'draw', 'import'];

tools.forEach(v => {
  const input = ongletParametres.querySelector('[data-attr="'+v+'"]');
  if (input) {
    input.addEventListener('change', (e) => {
      story.get('tools')[v] = e.target.checked;
    })
  }
})

// Update values on load
story.on('read', () => {
  displayAttributes.forEach(v => {
    const input = ongletParametres.querySelector('[data-attr="'+v+'"]');
    if (input) {
      input.checked = story.get('controls')[v];
    }
  })
  ongletParametres.querySelector('[data-attr="switcherModel"]').value = story.get('controls').switcherModel || (story.get('controls').layerSwitcher ? 'default' : 'none');
  tools.forEach(v => {
    const input = ongletParametres.querySelector('[data-attr="'+v+'"]');
    if (input) {
      input.checked = story.get('tools')[v];
    }
  })
});

