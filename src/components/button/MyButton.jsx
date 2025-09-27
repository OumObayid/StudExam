
// ---------tous les droits sont réservés à Oumaima El Obayid-----------//
// ceci est un bouton personnalisé

import React from "react";
import "./MyButton.css"

export default function Button  (props) {
  const classNm=props.classNm;
  const styleNm=props.styleNm;
  const typeNm=props.typeNm;
  const titleNm=props.titleNm;
  const onClick=props.onClick
  return (
    <button className={`btnn ${classNm}`} style={styleNm} type={typeNm} title={titleNm} onClick={onClick}>
      {props.children}
    </button>
  );
};


