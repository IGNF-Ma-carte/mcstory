import StoryMap from 'mcutils/StoryMap'
import loader from 'mcutils/dialog/loader'
import dialog from 'mcutils/dialog/dialog';
import { getUrlParameter } from 'mcutils/control/url';
import api from 'mcutils/api/api';
import { connectDialog } from 'mcutils/charte/macarte';
import Carte from 'mcutils/Carte';
import dialogMessage from 'mcutils/dialog/dialogMessage';
import team from 'mcutils/api/team';

/**
 * StoryMap de départ
 */
const story = new StoryMap({ 
//    id: '7675e0fc5332260f4b565ef62201c1db', // Transport Toulouse
  target: document.querySelector('[data-role="map"]'),
  key: '0gd4sx9gxx6ves3hf3hfeyhw'
});

// Reset story (fire read event)
setTimeout(() => story.reset());

// Show loader on read
story.on('read:start', () => loader.show(0));
story.on('read', () => loader.hide());
story.on('error', () => {
  dialog.showAlert('Impossible de charger le carte...')
  loader.hide();
});

/* LOAD current carte */
// Get edit ID in search parameters
let editID = getUrlParameter('id');

// Try to get ID in the url path: path/ID
if (!editID) {
  editID = document.location.pathname.split('/').pop();
  // remove id from history
  try {
    const loc = document.location;
    const path = loc.pathname.split('/');
    path.pop();
    window.history.replaceState('', '', loc.origin + path.join('/') + '/');
  } catch (e) { /* ok */ }
}

// Load map to edit
if (editID) {
  // Load story for edition
  const loadEdit = function() {
    setTimeout(() => {
      api.getEditMap(editID, resp => {
        if (resp.error) {
          dialog.showAlert('Aucune carte à éditer...')
        } else {
          if (team.getId() !== resp.organization_id) {
            api.getTeams(teams => {
              const t = teams.find(e => e.public_id === resp.organization_id)
              // Enable and change team
              const savefn = team.canChange;
              team.canChange = null;
              team.set(t, true);
              team.canChange = savefn;
              // load carte
              story.load(resp);
            })
          } else {
            story.load(resp)
          }
        }
      })
    }, 200)
  }
  // Connect and load story
  if (!api.isConnected()) {
    connectDialog(() => {
      loadEdit()
    });
  } else {
    loadEdit()
  }
} else {
  // Load carte
  const carteId = getUrlParameter('carte');
  if (carteId) {
    api.whoami(user => {
      api.getMap(carteId, e => {
        // Has user id and is me
        if (e.creator_id && user.id === e.creator_id) {
          const carte = new Carte();
          carte.on(['loading', 'read:start'], () => dialogMessage.showWait('Chargement de la carte...'));
          carte.on(['read', 'error'], () => {
            story.dispatchEvent({ type: 'read:carte' })
            dialogMessage.hide();
            story.setCarte(carte, 0);
          });
          carte.load(carteId);
        }
      })
    })
  }
}

export default story
