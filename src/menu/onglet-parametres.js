import story from '../story';
import charte from 'mcutils/charte/macarte'

import '../../page/onglet-parametres.css'
import html from '../../page/onglet-parametres.html';

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
  story.getCarte().setMapZone(e.target.value, false)
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

