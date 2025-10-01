import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "./MyAlerConf.css"

// Création d'une instance SweetAlert2 compatible avec React
const MySwal = withReactContent(Swal);

/**
 * MyConfirm : fonction utilitaire pour afficher une fenêtre de confirmation
 * @param {Object} param0 - options personnalisables pour l'alerte
 * title : titre de la fenêtre
 * text : description ou avertissement
 * icon : icône standard SweetAlert2 (warning, success, etc.)
 * iconHtml : si défini, remplace l'icône standard par du HTML personnalisé
 * confirm : texte du bouton de confirmation
 * cancel : texte du bouton d'annulation
 * confirmColor / cancelColor : couleurs des boutons
 */
export const MyConfirm = ({
  title = "Êtes-vous sûr ?",
  text = "Vous ne pourrez pas revenir en arrière.",
  icon = "warning",        // icône standard si iconHtml non défini
  iconHtml = undefined, 
  confirm = "Supprimer",
  cancel = "Annuler",
  confirmColor = "var(--danger)",
  cancelColor = "var(--gris)",
}) => {
  return MySwal.fire({
    title,
    text,
    icon: iconHtml ? undefined : icon, // utiliser icon seulement si iconHtml n’est pas défini
    iconHtml,                          // HTML personnalisé si fourni
    showCancelButton: true,            // afficher le bouton annuler
    showConfirmButton:true,            // afficher le bouton confirmer
    confirmButtonColor: confirmColor,  // couleur bouton confirmer
    cancelButtonColor: cancelColor,    // couleur bouton annuler
    confirmButtonText: confirm,        // texte bouton confirmer
    cancelButtonText: cancel,          // texte bouton annuler
  });
};

/* ----- Exemples d'utilisation ----- */

// Exemple 1 : utilisation générale avec titre et texte personnalisés
// MyConfirm({
//   title: "Supprimer .... ?",
//   text: "Vous ne pourrez pas revenir en arrière.",
//   confirm: "Supprimer",
//   cancel: "Annuler",
// }).then((result) => {
//   if (result.isConfirmed) {
//     console.log("Supprimé ✅");
//   } else {
//     console.log("Action annulée ❌");
//   }
// });

// Exemple 2 : utilisation simple avec les valeurs par défaut
// MyConfirm({}).then((result) => {
//   if (result.isConfirmed) {
//     // action à exécuter si confirmé
//   }
// });
