import element from 'ol-ext/util/element'
import { layout } from 'mcutils/layout/layout'

import story from '../story';
import charte from 'mcutils/charte/macarte'
import colorPicker from 'ol-ext/util/input/Color'
import _T from 'mcutils/i18n/i18n';

import '../../page/onglet-miseenforme.css'
import html from '../../page/onglet-miseenforme.html';

/* Ajout onglet au Menu */
const ongletMEF = element.create('DIV', { html: html });
charte.addMenuTab('miseenforme', 'fi-formatting', 'Mise en forme', ongletMEF);

/* Gestion des couleurs */
const colorSelect = ongletMEF.querySelector('[data-attr="theme"]');
Object.keys(layout).forEach(k => {
  element.create('OPTION', {
    value: k,
    html: _T('layout_'+k),
    parent: colorSelect
  })
})
element.create('OPTION', {
  value: 'custom',
  html: 'personnalisée',
  parent: colorSelect
})

colorSelect.addEventListener('change', () => {
  const theme = colorSelect.parentNode.dataset.theme = colorSelect.value;
  if (theme==='custom') {
    story.setLayout({ theme: 'custom', colors: [pickerBack.getColor(), pickerTxt.getColor()] });
  } else {
    story.setLayout({ theme: theme });
  }
})

/* Couleurs personnalisees
 *[bgColor, txtColor, darkColor, lightColor, voletColor, voletBgColor] */
const pickerBack = new colorPicker({ 
  pickerLabel: 'sélecteur',
  input: ongletMEF.querySelector('[data-attr="color-back"]'), 
  color: '#fff', 
  position: 'fixed', 
  hastab: true, 
  opacity:false 
});
pickerBack.on('color', () => {
  story.setLayout({ theme: 'custom', colors: [pickerBack.getColor(), pickerTxt.getColor()] });
});

const pickerTxt = new colorPicker({ 
  pickerLabel: 'sélecteur',
  input: ongletMEF.querySelector('[data-attr="color-txt"]'), 
  color: '#369', 
  position: 'fixed', 
  hastab: true, 
  opacity: false
});
pickerTxt.on('color', () => {
  story.setLayout({ theme: 'custom', colors: [pickerBack.getColor(), pickerTxt.getColor()] });
});

/* Divisions de l'onglet, affichage d'un seul à la fois*/
export const divisions = ['color', 'popup', 'position'];
divisions.forEach(v => {
  const input = ongletMEF.querySelector('.' + v);
  input.addEventListener('click', () => { 
    if (ongletMEF.dataset.show != v){
      ongletMEF.setAttribute('data-show', v);
    } 
    else {
      ongletMEF.setAttribute('data-show', ' ');
    } 
  })
})

/* BULLES */
/* Selection du type des bulles */ 
ongletMEF.querySelector('[data-attr="type"]').addEventListener('change', (e) => {
  story.setPopup({ type: e.target.value });
});

/* Changement sur les attributs des bulles */
const popupAttributes = ['anime', 'closeBox', 'shadow'];
popupAttributes.forEach(v => {
  const input = ongletMEF.querySelector('[data-attr="'+v+'"]');
  input.addEventListener('change', (e) => {
    var opt = {};
    opt[v] = e.target.checked; 
    story.setPopup(opt);
  })
});

const popupSize = ['maxHeight', 'maxWidth'];
popupSize.forEach(v => {
  const input = ongletMEF.querySelector('[data-attr="'+v+'"]');
  input.addEventListener('change', (e) => {
    var opt = {};
    opt[v] = e.target.value;
    story.setPopup(opt);
  })
});

/* Position volet */
const voletAttributes = ["voletPosition", "voletWidth"];
voletAttributes.forEach(v => {
  const input = ongletMEF.querySelector('[data-attr="'+v+'"]');
  input.addEventListener('change', (e) => {
    var opt = {};
    opt[v] = e.target.value
    story.setLayout(opt);
  })
});

/* Survol */
const hoverAttributes = ['tips:hover'];
hoverAttributes.forEach(v => {
  const input = ongletMEF.querySelectorAll('[data-attr="'+v+'"]');
  input.forEach(i => i.addEventListener('change', (e) => {
    var opt = {};
    opt[v.replace('tips:', '')] = e.target.checked; 
    story.setTips(opt);
    input.forEach(i2 => {
      i2.checked = e.target.checked;
    })
  }))    
})
 
/* CHARGEMENT */
story.on('read', () => {
  // Layout
  const colors = story.get('colors');
  if (typeof(colors) === 'string'){
    colorSelect.value = colors;
  } else {
    colorSelect.value = 'custom';
    pickerBack.setColor(colors[0])
    pickerTxt.setColor(colors[1])
  }
  colorSelect.parentNode.dataset.theme = colorSelect.value;

  // Type de bulles 
  ongletMEF.querySelector('[data-attr="type"]').value = story.get('popup').type;
	
  //Coche des cases qui sont des attributs présents sur la carte chargee
	popupAttributes.forEach(v => {
		const input = ongletMEF.querySelector('[data-attr="'+v+'"]');
		input.checked = story.get('popup')[v];
	});
	hoverAttributes.forEach(v => {
		const input = ongletMEF.querySelector('[data-attr="'+v+'"]');
		input.checked = story.get('tips')[v.replace('tips:', '')];
	});
	popupSize.forEach(v => {
		const input = ongletMEF.querySelector('[data-attr="'+v+'"]');
		input.value = story.get('popup')[v];
	});
	voletAttributes.forEach(v => {
		const input = ongletMEF.querySelector('[data-attr="'+v+'"]');
		input.value = story.get(v);
	});
})

/* Evenement au changement de modele sur la carte narrative */
story.on('change:modele', () => {
  ongletMEF.setAttribute('data-show', ' ');
})