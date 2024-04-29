import './mcversion'
import './i18n'
import charte from  'mcutils/charte/macarte'
import story from './story'
import './unload'

import './index.css'

import './tools/tools'
import './menu/menu'

charte.setApp('narration', 'Ma carte', ['editor', 'owner']);

/* DEBUG */
  window.story = story;
  window.charte = charte;

  import FileSaver from 'file-saver'
  window.storysave = function() {
    const data = JSON.stringify(story.write(), null, ' ');
    const blob = new Blob([data], {type: "text/plain;charset=utf-8"});
    FileSaver.saveAs(blob, (story.get('title') || story.get('atlas').title || 'map') + '.story');
  }
  // Drop file
  const zone = document.querySelector('[data-role="toolBar"] .fi-save');
  zone.addEventListener('dragenter', onstop)
  zone.addEventListener('dragover', onstop)
  zone.addEventListener('dragleave', onstop)
  zone.addEventListener('drop', function (e) { 
    e.preventDefault()
    if (e.dataTransfer && e.dataTransfer.files.length) {
      var file = e.dataTransfer.files[0]
      var reader = new FileReader()
      reader.onload = function (e) {
        var result = e.target.result
        story.read(JSON.parse(result))
      }
      reader.readAsText(file)
    }
  })
  function onstop(e) {
    e.preventDefault()
    e.stopPropagation()
    return false
  }

/**/