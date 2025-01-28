import element from 'ol-ext/util/element'
import { layout } from 'mcutils/layout/layout'
import dialog from 'mcutils/dialog/dialog';
import { helpData } from 'mcutils/dialog/helpDialog';

import story from '../story';
import charte from 'mcutils/charte/macarte'
import colorPicker from 'ol-ext/util/input/Color'
import _T from 'mcutils/i18n/i18n';
import { i18n } from 'mcutils/i18n/i18n';

import '../../page/onglet-miseenforme.css'
import html from '../../page/onglet-miseenforme.html';
import dlogCSS from '../../page/css-dialog.html';

/* Examples */
i18n.set('fr', {
  cssColor: `/* Titres en rouge sur fond noir + bords blancs */
story .title {
  color: #800;
  text-shadow: 1px 1px #fff, 1px -1px #fff, -1px 1px #fff, -1px -1px #fff;
  background-color: #000;
}
story .title h1,
story .title h2 {
  padding-left: 2px;
}
/* Couleur de fond du logo */
story .title > img {
  color: #000;
}
`,
cssMarianne: `// Font definition
@font-face { font-family: Marianne; font-style: normal; font-weight: 300; src: url(https://ignf-ma-carte.github.io/mcviewer/fonts/Marianne-Light.woff2) format("woff2"),url(https://ignf-ma-carte.github.io/mcviewer/fonts/Marianne-Light.woff) format("woff") }
@font-face { font-family: Marianne; font-style: italic; font-weight: 300; src: url(https://ignf-ma-carte.github.io/mcviewer/fonts/Marianne-Light_Italic.woff2) format("woff2"),url(https://ignf-ma-carte.github.io/mcviewer/fonts/Marianne-Light_Italic.woff) format("woff") }
@font-face { font-family: Marianne; font-style: normal; font-weight: 400; src: url(https://ignf-ma-carte.github.io/mcviewer/fonts/Marianne-Regular.woff2) format("woff2"),url(https://ignf-ma-carte.github.io/mcviewer/fonts/Marianne-Regular.woff) format("woff") }
@font-face { font-family: Marianne; font-style: italic; font-weight: 400; src: url(https://ignf-ma-carte.github.io/mcviewer/fonts/Marianne-Regular_Italic.woff2) format("woff2"),url(https://ignf-ma-carte.github.io/mcviewer/fonts/Marianne-Regular_Italic.woff) format("woff") }
@font-face { font-family: Marianne; font-style: normal; font-weight: 500; src: url(https://ignf-ma-carte.github.io/mcviewer/fonts/Marianne-Medium.woff2) format("woff2"),url(https://ignf-ma-carte.github.io/mcviewer/fonts/Marianne-Medium.woff) format("woff") }
@font-face { font-family: Marianne; font-style: italic; font-weight: 500; src: url(https://ignf-ma-carte.github.io/mcviewer/fonts/Marianne-Medium_Italic.woff2) format("woff2"),url(https://ignf-ma-carte.github.io/mcviewer/fonts/Marianne-Medium_Italic.woff) format("woff") }
@font-face { font-family: Marianne; font-style: normal; font-weight: 700; src: url(https://ignf-ma-carte.github.io/mcviewer/fonts/Marianne-Bold.woff2) format("woff2"),url(https://ignf-ma-carte.github.io/mcviewer/fonts/Marianne-Bold.woff) format("woff") }
@font-face { font-family: Marianne; font-style: italic; font-weight: 700; src: url(https://ignf-ma-carte.github.io/mcviewer/fonts/Marianne-Bold_Italic.woff2) format("woff2"),url(https://ignf-ma-carte.github.io/mcviewer/fonts/Marianne-Bold_Italic.woff) format("woff") }

body {
  font-family: Marianne;
}
`,
cssGFont: `/* Google fonts */
@import url('https://fonts.googleapis.com/css2?family=Kablammo&display=swap');

body {
  font-family: Kablammo;
}
`,
cssRoundButton: `/* Boutons ronds */
story .ol-control,
story .ol-control button {
  border-radius: 1em;
}`
});

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


// Stylesheet
ongletMEF.querySelector('[data-attr="css"] button').addEventListener('click', () => {
  dialog.show({
    content: dlogCSS,
    className: 'dialogCSS',
    buttons: { ok: 'ok', cancel: 'annuler' },
    onButton: (b, inputs) => {
      if (b==='ok') {
        const err = story.setStyleSheet(inputs.css.value);
        if (err) {
          dialog.show();
          const mes = err.message.split('\n')
          mes.pop();
          content.querySelector('.error').innerHTML = mes.join('<br/>')
          content.querySelector('.error').ariaHidden = false;
        }
      }
    }
  })
  const content = dialog.getContentElement()
  helpData(content);
  // Story value
  content.querySelector('.css').value = story.get('css') || '';
  // Examples
  content.querySelectorAll('select option').forEach(o => {
    o.value = _T(o.value)
  })
  content.querySelector('select').addEventListener('change', e => {
    const tarea = content.querySelector('textarea');
    const current = tarea.value;
    const css = e.target.value.replace(/\\n/g,"\n").replace(/\n$/,'');
    tarea.value = css + '\n\n' +current;
    tarea.focus();
    tarea.scrollTop = 0
    tarea.selectionStart = 0;
    tarea.selectionEnd = css.length;
    // reset
    e.target.value = ""
  })
  // Prevent tab
  content.querySelector('textarea').addEventListener('keydown', e => {
    if (e.keyCode == 9) {
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      // set textarea value to: text before caret + tab + text after caret
      e.target.value = e.target.value.substring(0, start) + '\t' + e.target.value.substring(end);
      // put caret at right position again
      e.target.selectionStart = e.target.selectionEnd = start + 1;
  
      e.preventDefault();
    }
  })
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