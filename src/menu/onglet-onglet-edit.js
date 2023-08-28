import openDialog from 'mcutils/dialog/openCarte'

let ongletOnglets;
let hasTitle, inputTitle, storyOnglet;
let carteID;
let currentTab;
let returnFn;

/*Affiche le formulaire*/
function showForm() {
  ongletOnglets.dataset.mode = 'edit';
  if (currentTab.id) ongletOnglets.dataset.valid = '';
  else delete ongletOnglets.dataset.valid;
  inputTitle.className = '';
  inputTitle.focus();
}

/** Cache le formulaire */
function hideForm() {
  ongletOnglets.dataset.mode = 'list';
  delete ongletOnglets.dataset.valid;
  inputTitle.value = "";
}

/** Initialiser le formulaire
 * @param {*} div onglet du menu
 */
function initForm(div) {
  ongletOnglets = div;
  // Show map title
  hasTitle = ongletOnglets.querySelector('[data-attr="displayTitle"]');
  // Input: tab name
  inputTitle = ongletOnglets.querySelector('[data-attr="title"]');
  // Choix de la storymap
  storyOnglet = ongletOnglets.querySelector('[data-attr="storymap"]');

  storyOnglet.addEventListener('click', () => {
    openDialog({ callback: (c) => {
      if (!inputTitle.value) {
        inputTitle.value = c.title || '';
      }
      // Carte valide
      carteID = c.view_id;
      ongletOnglets.dataset.valid = '';
    }});
  })

  // Validation du formulaire
  ongletOnglets.querySelector('.confirm').addEventListener('click', () => {
    if (!inputTitle.value) {
      inputTitle.className = 'invalid';
      inputTitle.focus();
      return;
    }
    currentTab.title = inputTitle.value;
    //currentTab.description = inputDesc.value;
    currentTab.showTitle = hasTitle.checked;
    currentTab.id = carteID;
    hideForm();
    returnFn(currentTab);
  });
  // Annulation du formulaire
  ongletOnglets.querySelector('.cancel').addEventListener('click', hideForm);
}

/** Formulaire d'édition
 * @param {*} [tab] onglet courant
 * @param {*} callback function de retour renvoyant les attributs de l'onglet
 */
function edit(tab, callback) {
  var newstory = ongletOnglets.querySelector(".create .button");
  if(!tab) newstory.className = "new button button-colored";
  else newstory.className = "update button button-colored";
  tab = tab || {
    id: null,
    title: '',
    description: '',
    showTitle: true
  };
  carteID = tab.id;
  inputTitle.value = tab.title;
  // inputDesc.value = tab.description
  hasTitle.checked = tab.showTitle;
  currentTab = tab;
  returnFn = callback;
  showForm();
}

export default {
  init: initForm,
  edit: edit
}
