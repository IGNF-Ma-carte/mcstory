import api from 'mcutils/api/api';
import charte from 'mcutils/charte/charte';
import dialog from 'mcutils/dialog/dialog';
import _T from 'mcutils/i18n/i18n'
import md2html from 'mcutils/md/md2html';
import story from "./story";
import team  from 'mcutils/api/team';

// Prevent unload
let dirty = false;
window.onbeforeunload = function() {
  // console.log('BEFOREUNLOAD', dirty)
  return dirty ? _T('hasChanged') : null;
}


function setDirty(b) {
  if (b === dirty) return;
  if (b) {
    dirty = true;
    if (!/ ⬤$/.test(document.title)) document.title = document.title + ' ⬤';
  } else {
    setTimeout(() => { 
      dirty = false;
      document.title = document.title.replace(/ ⬤$/, '');
    })
  }
}

/* Handle story modifications */
story.on('change', () => setDirty(true));
story.on(['read', 'save'], () => setDirty(false));

/* Disable logout if dirty
 */
charte.canLogout = () => {
  if (dirty) {
    dialog.show({
      title: 'Déconnexion',
      content: md2html(_T('hasChanged')),
      buttons: { ok: 'Quitter la page', cancel: 'Rester sur la page' },
      onButton: (b) => {
        if (b === 'ok') {
          dirty = false;
          api.logout();
          setTimeout(() => {
            location.reload()
          }, 100)
        }
      }
    })
    return false;
  }
  return true
}

/* Check team before changing */
team.canChange = (t) => {
  const atlas = story.get('atlas')
  const current = (atlas || {}).organization_id || '';
  // Test changes 
  if (current !== t.public_id) {
    // Something has changed or reload
    if (dirty) {
      dialog.show({
        className: 'alert',
        content: md2html(_T('hasChanged')),
        buttons: { ok: 'Quitter la page', cancel: 'Rester sur la page' },
        onButton: (b) => {
          if (b === 'ok') {
            dirty = false;
            team.set(t, true);
            setTimeout(() => {
              location.reload()
            }, 100)
          }
        }
      })
    } else {
      setTimeout(() => {
        location.reload()
      }, 100)
      return true;
    }
    return false;
  } else {
    return true;
  }
}

/** Story has changed
 */
story.hasChanged = function() {
  return dirty;
}