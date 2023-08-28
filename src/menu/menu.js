import '../../page/menu.css'

import './onglet-modele'
import './onglet-carte'
import './onglet-onglets'
import './onglet-proprietes'
import './onglet-miseenforme'
import './onglet-etapes'
import './onglet-differentiel'
import './onglet-parametres'

import charte from 'mcutils/charte/charte'
import helpDialog from 'mcutils/dialog/helpDialog'
import _T from 'mcutils/i18n/i18n'

/**
 * Ajout des boutons d'information sur chaque onglet.
 */
charte.getMenuTabElement().querySelectorAll('[data-help]').forEach((elt) => {
  const help = elt.getAttribute('data-help').split(' ');
  helpDialog(elt, _T(help[0]), { className: help[1] });
})
