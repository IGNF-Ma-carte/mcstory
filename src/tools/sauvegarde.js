import { transformExtent } from 'ol/proj'
import dialog from 'mcutils/dialog/dialog';
import dialogMessage from 'mcutils/dialog/dialogMessage';
import _T from 'mcutils/i18n/i18n'
import saveCarteDialog, { checkShare, checkStoryShare } from 'mcutils/dialog/saveCarte';
import story from '../story';
import notification from 'mcutils/dialog/notification';
import api from 'mcutils/api/api';
import team from 'mcutils/api/team';
import { connectDialog } from 'mcutils/charte/macarte';

/* Sauvegarde carte */
function save(story) {
  dialogMessage.hide();
  dialogMessage.showWait('Enregistrement en cours...');
  // Atlas
  story.get('atlas').type = 'storymap';
  story.get('atlas').premium = api.getPremium();
  // Save maps extent
  if (story.getCarte()) {
    const view = story.getCarte().getMap().getView();
    story.get('atlas').bbox = transformExtent(view.calculateExtent(), view.getProjection(), 'EPSG:4326');
  } else {
    story.get('atlas').bbox = [0,0,0,0];
  }
  // Save
  const data = story.write();
  // get error / data on save
  function onsave(resp) {
    if (resp.error) {
      switch (resp.status) {
        case 401: {
          dialogMessage.hide();
          connectDialog(() => {
            save(story);
          });
          break;
        }
        default: {
          dialogMessage.showAlert('Impossible de sauvegarder la carte...<br/>' + resp.statusText + '<br/>' + resp.xhttp.response)
          break;
        }
      }

    } else {
      dialogMessage.hide();
      notification.show('sauvegarde réussie', 1500);
      // console.log(story.get('atlas').view_id)
      if (resp.view_id) {
        story.set('id', resp.view_id);
      } else {
        story.set('id', story.get('atlas').view_id)
      }
      story.dispatchEvent({ type: 'save' })
      // Check cartes / share
      if (team.getId()) {
        if (story.cartes.length) {
          checkShare(story.get('atlas').share, story.cartes)
        } else {
          checkStoryShare(story)
        }
      }
    }
  }
  // SaveAs
  const edit = story.get('atlas').edit_id;
  if (!edit) {
    api.postMap(story.get('atlas'), data, onsave);
  } else {
    api.updateMapFile(edit, data, onsave)
  }
}

/* Save story map
 */
function saveStory() {
  // No carte!
  if ((story.get('model') === 'onglet' && !story.tabs.getLength) 
    || (story.get('model') !== 'onglet' && !story.getCarte())) {
    dialogMessage.showAlert('Cette narration ne contient pas de carte...');
    return;
  }

  // First save
  if (!story.get('id')) {
    saveCarteDialog(story, save);
    return;
  }

  // Allready saved / save or saveAs
  dialog.show({
    title: _T('saveTitle'),
    content: 'Enregister la carte sur votre compte ou enregistrer une copie',
    buttons: {
      save : _T('save'),
      saveas : _T('saveAs'),
      cancel: _T('stop')
    },
    onButton: (b) => {
      switch(b) {
        case 'save': {
          save(story);
          break;
        }
        case 'saveas': {
          saveCarteDialog(story, save, { saveAs: true });
          break;
        }
      }
    }
  })
}
  
export default saveStory;
