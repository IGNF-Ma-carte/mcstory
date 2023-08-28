import ol_ext_element from 'ol-ext/util/element';
import dialog from "mcutils/dialog/dialog";
import md2html from 'mcutils/md/md2html';

// Model list
let models = [];
// Load models
fetch('./carteModel.json').then(r => r.json()).then(m => models = m)

/** Load from models
 * @param {function} cback return function with the carte ID
 */
function loadModels(cback) {
  let currentId;
  // Ask for connexion
  dialog.show({
    title: 'Choisir un modèle',
    className: 'list-model',
    content: ' ',
    buttons: { submit: 'charger', cancel: 'annuler' },
    onButton: b => {
      if (b==='submit') {
        cback(currentId);
      }
    }
  })
  // List of carte models
  const ul = ol_ext_element.create('UL', { 
    className: 'mc-list',
    parent: dialog.getContentElement() 
  });
  models.forEach(m => {
    const li = ol_ext_element.create('LI', {
      text: m.title,
      title: m.title,
      click: () => {
        currentId = m.id;
        ul.querySelectorAll('li').forEach(l => l.classList.remove('mc-select'));
        li.classList.add('mc-select');
        // Show info
        infoDiv.innerHTML = '';
        ol_ext_element.create('H4', { 
          text: m.title,
          parent: infoDiv
        })
        ol_ext_element.create('IMG', { 
          src: m.img,
          alt: m.title,
          parent: infoDiv
        })
        ol_ext_element.create('DIV', { 
          html: md2html(m.info),
          parent: infoDiv
        });
      },
      on: {
        dblclick: () => {
          cback(m.id);
        }
      },
      parent: ul
    })
  })
  // Info block
  const infoDiv = ol_ext_element.create('DIV', { 
    className: 'mc-list-info md',
    parent: dialog.getContentElement() 
  });
}

export default loadModels