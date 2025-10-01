// ---------tous les droits sont réservés à Oumaima El Obayid-----------//
// Composant React qui définit un bouton personnalisé réutilisable

import React from "react";
import "./MyButton.css"

export default function Button(props) {
  // Extraction des props reçues pour configurer le bouton
  const classNm = props.classNm;   // classes CSS personnalisées
  const styleNm = props.styleNm;   // styles inline passés en objet
  const typeNm = props.typeNm;     // type du bouton (submit, button, reset)
  const titleNm = props.titleNm;   // texte d’infobulle au survol
  const onClick = props.onClick;   // fonction à exécuter au clic

  return (
    // Bouton avec les propriétés dynamiques et le contenu enfant
    <button
      className={`btnn ${classNm}`}
      style={styleNm}
      type={typeNm}
      title={titleNm}
      onClick={onClick}
    >
      {props.children}
    </button>
  );
};
