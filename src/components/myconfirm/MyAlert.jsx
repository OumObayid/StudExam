import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "./MyAlerConf.css";

// Création d'une instance SweetAlert2 compatible avec React
const MySwal = withReactContent(Swal);

/**
 * MyAlert : fonction utilitaire pour afficher une alerte simple
 * @param {Object} param0 - options personnalisables pour l'alerte
 * title : titre de l'alerte (par défaut "Attention")
 * text : texte ou message à afficher
 * icon : icône standard SweetAlert2 (success, error, warning, info, question)
 * iconHtml : si défini, remplace l'icône standard par du HTML personnalisé
 * showClose : booléen pour afficher le bouton de fermeture (croix)
 */
export const MyAlert = ({
  title = "Attention",
  text = "",
  icon = "warning", // icône standard si iconHtml non défini
  iconHtml = undefined,
  showClose = true
}) => {
  return MySwal.fire({
    title,
    text,
    icon: iconHtml ? undefined : icon, // utiliser icon seulement si iconHtml n’est pas défini
    iconHtml,                          // HTML personnalisé si fourni
    showCancelButton: false,           // pas de bouton annuler
    showConfirmButton: false,          // pas de bouton confirmer
    showCloseButton: showClose,        // afficher le bouton de fermeture
  });
};

/* ----- Exemples d'utilisation ----- */

// Exemple général avec toutes les options personnalisables
// MyAlert({
//   title:"",
//   text:"",
//   icon:""
// });

// Icônes standard possibles :
// "success" ✅ (icône verte avec check)
// "error" ❌ (icône rouge avec croix)
// "warning" ⚠️ (icône jaune triangle)
// "info" ℹ️ (icône bleue avec “i”)
// "question" ❓ (icône bleue avec point d’interrogation)
