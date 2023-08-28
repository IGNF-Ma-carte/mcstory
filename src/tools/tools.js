import '../../page/tools.css'
import story from '../story';
import charte from 'mcutils/charte/macarte'
import dialog from 'mcutils/dialog/dialog';
import _T from 'mcutils/i18n/i18n'
import openCarteDialog from 'mcutils/dialog/openCarte';
import shareCarte from 'mcutils/dialog/shareCarte'
import saveTool from './sauvegarde';
import notification from 'mcutils/dialog/notification'

// Share
charte.addTool('share', 'fi-share-alt', 'Partager ma carte narrative', () => {
  if (!shareCarte({ carte: story })) {
    dialog.showMessage('Vous devez enregistrer la carte avant de pouvoir la partager...');
  }
});

// Separator
charte.addTool();

// Save current storymap
charte.addTool('save', 'fi-save', 'Enregistrer carte narrative',  saveTool);

/* Open new storymap */
charte.addTool('load', 'fi-open', _T('loadCarte'), ()=> {
  function openCarte() {
    openCarteDialog({ 
      filter :'storymap', 
      callback: (c) => {
        charte.showTab();
        story.load(c);
      }
    })
  }
  if (story.hasChanged()) {
    dialog.show({
      title: _T('loadCarte'),
      content: _T('hasChanged'),
      buttons: { ok: _T('continue'), cancel: _T('stop')},
      onButton: (b) => { 
        if (b==='ok') {
          openCarte();
        }
      }
    })
  } else {
    openCarte();
  }
})

/* New empty storymap */
charte.addTool('new', 'fi-new', _T('newCarte'),  () => {
  if (story.hasChanged()) {
    dialog.show({
      title: _T('newCarte'),
      content: _T('hasChanged'),
      buttons: { ok: _T('continue'), cancel: _T('stop') },
      onButton: (b) => { 
        if (b==='ok') {
          story.reset(); 
          notification.show(_T('newCarteNotif'))
        }
      }
    });
  } else {
    story.reset();
    notification.show(_T('newCarteNotif'))
  }
});

charte.addTool();//separateur
