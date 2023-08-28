import element from 'ol-ext/util/element'
import story from '../story';
import charte from 'mcutils/charte/macarte'
import InputCollection from 'ol-ext/util/input/Collection'
import editOnglet from './onglet-onglet-edit'

import '../../page/onglet-onglets.css'
import html from '../../page/onglet-onglets.html';

/* Add menu tab */
const ongletOnglets = element.create('DIV', { className: 'onglets', html: html });
charte.addMenuTab('onglet', 'fa fa-map-o', 'Onglets', ongletOnglets);

/* Initialize edition */
editOnglet.init(ongletOnglets);

/* Button: add new tab */ 
const newOnglet = ongletOnglets.querySelector('[data-attr="newOnglet"]');
newOnglet.addEventListener('click', () => {
  // Passer en mode edition
  editOnglet.edit(null, tab => {
    story.addTab(tab);
    if (story.tabs.getLength === 1) {
      iCollection.selectAt(0);
    }
  });
})

/* Tab list */
const iCollection = new InputCollection({
  target: ongletOnglets.querySelector('.list'),
  collection: story.tabs,
  getTitle: (item) => {
    const elem = element.create('DIV', {
      parent : ongletOnglets.querySelector('.list')
    })
    if (item.title) elem.innerText = item.title;
    else elem.innerHTML = '<i>sans titre</i>';
    // Refresh tab
    element.create('I', { 
      className: 'fi-repeat',
      title: 'rafraichir...',
      click: () => {
        const pos = elem.parentNode.dataset.position;
        console.log(pos)
        story.getTab(pos).iframe.src = story.getTab(pos).iframe.src
      },
      parent: elem
    })
    // Remove tab
    element.create('I', { 
      className: 'fi-delete',
      title: 'supprimer...',
      click: () => {
        const pos = elem.parentNode.dataset.position;
        story.removeTab(pos);
      },
      parent: elem
    })
    return elem
  }
})

iCollection.select(story.getSelectTabIndex());

// Tab event listeners
iCollection.on('item:select', e => {
  story.selectTab(e.position);
})
iCollection.on('item:dblclick', (e) => {
  story.selectTab(e.position);
  const isTitle = e.item.showTitle;
  // Update on edit
  editOnglet.edit(e.item, tab => {
    story.setTabTitle(e.position, tab.title, tab.description);
    if (isTitle !== tab.showTitle) {
      story.showTabTitle(e.position, tab.showTitle);
    }
    iCollection.refresh();
  });
});

// reorder list
iCollection.on('item:order', () => {
  story.reorderTabs();
})

/* Input: synchronize tabs */
const inputSync = ongletOnglets.querySelector('[data-attr="synchronize"]')
inputSync.addEventListener('change', () => {
  story.set('synchronize', inputSync.checked);
})

/* Update on load */
story.on('read', ()=> {
  ongletOnglets.setAttribute('data-valid', 'non-valid');
  inputSync.checked = !!story.get('synchronize');
});

story.on('change:tab', (e) => {
  iCollection.select(e.tab);
});
