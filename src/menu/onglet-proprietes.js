import story from '../story'
import element from 'ol-ext/util/element'
import charte from 'mcutils/charte/macarte'
import MDEditor from 'mcutils/md/MDEditor';
import InputMedia from 'mcutils/control/InputMedia'

import '../../page/onglet-proprietes.css'
import html from '../../page/onglet-proprietes.html'

// Property tab element
const ongletProp = element.create('DIV', { html: html });
charte.addMenuTab('properties', 'fi-properties', 'Propriétés', ongletProp);

// Set place holder Title / subtitle
charte.setInputPlaceholder(ongletProp.querySelector('[data-attr="title"]'));
if(story.get('model') !== 'compare'){
  charte.setInputPlaceholder(ongletProp.querySelector('[data-attr="subTitle"]'));
}
ongletProp.querySelectorAll('[data-attr="subTitle compare"]').forEach(e=>{
  charte.setInputPlaceholder(e);
});

// Show title input / display 
const showtitle = ongletProp.querySelector('[data-attr="displayTitle"]');
showtitle.addEventListener('change', (e) => {
  var opt = e.target.checked; 
  story.showTitle(opt);
  ongletProp.dataset.show = opt ? 'title' : '';
})

// Title attribute element 
const titleAttributes =  ['title', 'subTitle'];
// Display title in the map
titleAttributes.forEach(v => {
  const input = ongletProp.querySelector('[data-attr="'+v+'"]');
  input.addEventListener('keyup', (e) => {
    const opt = {};
    opt[v] = e.target.value;
    story.setTitle(opt);
  })
});

// Subtitle for compare maps
const sousTitres = ongletProp.querySelectorAll("[data-attr = 'subTitle compare']");
sousTitres[0].addEventListener('keyup', e => {
  story.setTitle({ title1: e.target.value });
})
sousTitres[1].addEventListener('keyup', e => {
  story.setTitle({ title2: e.target.value });
})

// Description MD editor
const inputDescription = ongletProp.querySelector('textarea');
const desc = new MDEditor({ input: inputDescription });
desc.on('change', () => {
  story.setDescription(inputDescription.value);
  const model = story.models[story.get('model')] || {};
  if (!/etape/.test(story.get('model')) && model.volet) {
    story.setInfoVolet(inputDescription.value);
  }
})

// Carte logo input
const inputLogo = new InputMedia({ 
  input: ongletProp.querySelector('input.logo'),
  add: true
});
inputLogo.on('load', () => {
  story.setLogo(inputLogo.getValue());
})

// On story load: update inputs value
story.on('read', () => {
  // title and subTitle
  showtitle.checked = story.showTitle();
  titleAttributes.forEach(v => {
    const input = ongletProp.querySelector('[data-attr="'+v+'"]');
    input.value = story.get(v);
    input.dispatchEvent(new Event('change'))
  });

  inputLogo.setValue(story.get('logo'));
  inputDescription.value = story.get('description');
  ongletProp.setAttribute('data-logo', 'link');

  ongletProp.dataset.show = story.showTitle() ? 'title' : '';

  if (story.get('model') === 'compare'){
    sousTitres[0].value = story.get('title1');
    sousTitres[0].dispatchEvent(new Event('change'))
    sousTitres[1].value = story.get('title2');
    sousTitres[1].dispatchEvent(new Event('change'))
  }
})
