import story from '../story';
import charte from 'mcutils/charte/macarte'
import dialogImportFile from 'mcutils/dialog/dialogImportFile'
import ol_ext_element from 'ol-ext/util/element'
import {buffer as buffer_extent, isEmpty } from 'ol/extent'
import {fromExtent} from 'ol/geom/Polygon'
import Feature from 'ol/Feature';
import GeoJSONFormat from 'ol/format/GeoJSON'
import { saveAs } from 'file-saver';

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
  ongletParametres.querySelector('li[data-zone]').dataset.zone = what || 'none';
  if (what === 'custom') {
    dialogImportFile(e => {
      let nb = 0
      let zones = [];
      (e.features || []).forEach((f, i) => {
        let ext = f.getGeometry().getExtent()
        if (ext[0]===ext[2] || ext[1] === ext[3]) {
          ext = buffer_extent(ext, 0.1)
        }
        if (!isEmpty(ext)) {
          nb++;
          zones.push({
            title: f.get('name') || f.get('nom') || 'zone '+i,
            rank: f.get('rank') || 0,
            extent: ext
          })
        }
      })
      zones = zones.sort((a,b) => parseFloat(a.rank) - parseFloat(b.rank))
      if (nb > 0) {
        story.setControl('mapzone', { zones: zones, collapsed: false })
        notification.show('Chargement des zones : ' + nb + ' / ' + (e.features.length || 0))
      } else {
        story.setControl('mapzone', false)
        ongletParametres.querySelector('[data-attr="mapzone"]').value = '';
        notification.show('Pas de zone disponible dans ce fichier...')
      }
    }, {
      title: 'Définir des zones',
      className: 'mc-mapzone',
      readCarte: false,
      projection: 'EPSG:4326'
    })
    dialog.getContentElement().appendChild(ol_ext_element.create('I', { text: "Choisissez un fichier contenant des zones de focalisation." }))
  } else {
    story.setControl('mapzone', { zones: what })
  }
})
// Save zones
ongletParametres.querySelector('li[data-zone] button').addEventListener('click', e => {
  if (!story || !story.getCarte()) return;
  const features = []
  story.getCarte().getControl('mapzone').getMaps().forEach((m,i) => {
    const f = new Feature(fromExtent(m.get('zone').extent))
    f.set('name', m.get('zone').title)
    f.set('rank', i+1)
    features.push(f);
  })
  const gjson = (new GeoJSONFormat).writeFeatures(features)
  saveAs(new Blob([gjson], {type: "text/plain;charset=utf-8"}), 'zones.geojson')
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
  // Controls
  displayAttributes.forEach(v => {
    const input = ongletParametres.querySelector('[data-attr="'+v+'"]');
    if (input) {
      input.checked = story.get('controls')[v];
    }
  })
  // Map zone menu
  if (story.get('controls').mapzone) {
    const zones = (story.get('controls').mapzone.zones);
    ongletParametres.querySelector('[data-attr="mapzone"]').value = Array.isArray(zones) ? 'custom' : (zones || '');
    ongletParametres.querySelector('li[data-zone]').dataset.zone = Array.isArray(zones) ? 'custom' : (zones || 'none');
  } else {
    ongletParametres.querySelector('[data-attr="mapzone"]').value = '';
    ongletParametres.querySelector('li[data-zone]').dataset.zone = 'none';
  }
  // Layer switcher
  ongletParametres.querySelector('[data-attr="switcherModel"]').value = story.get('controls').switcherModel || (story.get('controls').layerSwitcher ? 'default' : 'none');
  // Tools
  tools.forEach(v => {
    const input = ongletParametres.querySelector('[data-attr="'+v+'"]');
    if (input) {
      input.checked = story.get('tools')[v];
    }
  })
});

