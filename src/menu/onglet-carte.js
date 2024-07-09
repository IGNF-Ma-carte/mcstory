import element from 'ol-ext/util/element';
import Carte from 'mcutils/Carte';
import story from '../story';
import dialog from 'mcutils/dialog/dialog';
import _T from 'mcutils/i18n/i18n'
import md2html from 'mcutils/md/md2html';
import charte, { connectDialog } from 'mcutils/charte/macarte'
import openCarteDlg from 'mcutils/dialog/openCarte';
import dialogMessage from 'mcutils/dialog/dialogMessage';

import loadModels from './loadModels.js'
import api from 'mcutils/api/api';

import '../../page/onglet-carte.css';
import ongletcarte from '../../page/onglet-carte.html';
import '../../page/layer-dialog.css';
import layerDlg from '../../page/layer-dialog.html';

const menu = document.querySelector('[data-role="menu-tab"]');

/* Ajout onglet au Menu */
const ongletCarte = element.create('DIV', { className: 'carte',  html: ongletcarte });
charte.addMenuTab('carte', 'fa fa-map-o', 'Carte', ongletCarte);

/** Open carte
 * @param {object} c cart to open
 * @param {number} n carte number
 */
function openCarte(c, n) {
  const carte = new Carte();
  carte.on(['loading', 'read:start'], () => dialogMessage.showWait('Chargement de la carte...'));
  carte.on(['read', 'error'], () => {
    story.dispatchEvent({ type: 'read:carte' })
    dialogMessage.hide();
  });
  carte.load(c);
  if (typeof(c) === 'string') carte.set('id', c);
  story.setCarte(carte, n-1);
}

/** Open carte dialog
 * @param {number} n carte number
 */
function loadCarte(n) {
  if (api.isConnected()) {
    openCarteDlg({ filter :'macarte', callback: c => openCarte(c,n) }); 
  } else {
    dialog.show ({
      className: 'alert no-connect',
      content: ' ',
      buttons: { connect: 'se connecter', cancel: 'annuler' },
      onButton: b => {
        if (b === 'connect') {
          connectDialog(() => {
            openCarteDlg({ filter :'macarte', callback: c => openCarte(c,n) });
          });
        }
      }
    })
    element.create('DIV', {
      html: 'Vous devez être connecté pour accéder à une de vos carte...<br/>'
        + 'Vous pouvez continuer en mode test avec un modèle prédéfini.', 
      parent: dialog.getContentElement(),
    })
    element.create('A', {
      html: 'continuer en mode test',
      className: 'article',
      parent: dialog.getContentElement(),
      click: () => {
        loadModels(id => {
          openCarte(id, n);
          dialog.close();
        });
      }
    })
  }
}

// Display carte title on change
story.on('change:carte', e => {
  const titleInfo = ongletCarte.querySelector('.carte' + (e.index + 1) + ' p')
  const carte = e.carte;
  if (carte) {
    titleInfo.innerText = '...';
    titleInfo.parentNode.dataset.carte = 1;
    // allready loaded
    if (carte.get('id')) {
      if (carte.get('atlas') && carte.get('atlas').title) {
        titleInfo.innerText = carte.get('atlas').title;
      } else {
        api.getMap(carte.get('id'), resp => {
          titleInfo.innerText = resp.title;
        })
      }
    } else {
      // when loaded
      carte.on('read', () => {
        titleInfo.innerText = carte.get('atlas').title || ('carte ' + (e.index + 1));
      })
    }
  } else {
    titleInfo.innerText = '';
    titleInfo.parentNode.dataset.carte = 0;
  }
})

/* Refresh cartes */
ongletCarte.querySelectorAll('i.fi-repeat').forEach((elt, i) => {
  elt.addEventListener('click', () => {
    const carte = story.getCarte(i)
    if (carte) {
      carte.load(carte.get('atlas'))
      story.setCarte(carte, i);
    }
  })
});

/* Bouton pour charger une carte ou deux en mode 'compare' */
const carteBtn = ongletCarte.querySelectorAll('BUTTON.map');

/* Click sur le bouton de la carte 1 */
carteBtn[0].addEventListener('click', () => {
  // Si modele est en etapes alors il faut afficher un message d'alerte (Continuer ou non)
  if (menu.dataset.modele === 'etape' && story.getCarte()) {
    dialog.show({
      title: _T('infoEtapeTitle'),
      content: md2html(_T('infoCarteEtape')),
      buttons: { submit: _T('continue'), cancel: _T('stop')},
      onButton: (b) => { 
        if (b==='submit') {
          loadCarte(1);
        }
      }
   })
  } else {
    loadCarte(1); 
  }
});

/* Carte 2 */
carteBtn[1].addEventListener('click', () => loadCarte(2));

/* Choose carte layers */
const layersBtn = ongletCarte.querySelectorAll('BUTTON.layers');
layersBtn.forEach((b, i) => {
  b.addEventListener('click', () => {
    // Update old maps
    if (!story.get('compareLayer')) story.set('compareLayer', [false, false]);
    // Current carte
    const carte = story.getCarte(i);
    if (carte) {
      const layers = story.get('compareLayer')[i];
      dialog.show({
        title: 'Calques à afficher',
        className: 'layerDialog',
        content: layerDlg,
        buttons: { submit: 'ok', cancel: 'annuler' },
        onButton: (b, inputs) => {
          if (b !== 'submit') return;
          dialog.hide();
          // Update layers
          let layersIds = false;
          if (inputs.custom.checked) {
            layersIds = [];
            content.querySelectorAll('li').forEach(li => {
              if (li.querySelector('input').checked) {
                layersIds.push(parseInt(li.dataset.layerId))
              }
            })
          }
          story.get('compareLayer')[i] = layersIds;
          if (layersIds) {
            carte.getMap().getLayers().forEach(l => {
              l.setVisible(layersIds.indexOf(l.get('id')) > -1)
            })
          }
        }
      })
      const content = dialog.getContentElement()
      // Custom layers
      const check = content.querySelector('input[type="checkbox"]')
      if (layers) {
        check.checked = layers;
        content.classList.add('custom')
      } else {
        content.classList.remove('custom')
      }
      check.addEventListener('change', () => {
        if (check.checked) {
          content.classList.add('custom')
        } else {
          content.classList.remove('custom')
        }
      })
      // Layers
      const ul = content.querySelector('ul')
      carte.getMap().getLayers().getArray().slice().reverse().forEach(l => {
        const li = element.create('LI', {
          parent: ul
        })
        element.createCheck({
          after: l.get('title'),
          checked: layers ? layers.indexOf(l.get('id')) > -1 : l.getVisible(),
          parent: li
        })
        li.dataset.layerId = l.get('id')
      })
    }
  })
})
story.on('change:carte', e => {
  const layers = story.get('compareLayer') || [false, false];
  layers[e.index] = false;
})


/* Mettre a jour lors d'un chargemnt * /
story.on('read', () => {
  console.log('read')
  ongletCarte.querySelector('li p').innerText = '';
  [0,1].forEach(n => {
    const carte = story.getCarte(n);
    if (carte) {
      ongletCarte.querySelector('.carte'+(n+1)+' p').innerText = carte.getMap().get('title')
      ongletCarte.querySelector('.carte'+(n+1)).dataset.carte = 1
      console.log('ok')
    } else {
      ongletCarte.querySelector('.carte'+(n+1)).dataset.carte = 0
    }
  })
})
/**/