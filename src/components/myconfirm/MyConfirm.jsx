import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "./MyAlerConf.css"
const MySwal = withReactContent(Swal);

export const MyConfirm = ({
  title = "Êtes-vous sûr ?",
  text = "Vous ne pourrez pas revenir en arrière.",
  icon = "warning",        // icône SweetAlert2 standard
  iconHtml = undefined, 
  confirm = "Supprimer",
  cancel = "Annuler",
  confirmColor = "var(--danger)",
  cancelColor = "var(--gris)",
}) => {
  return MySwal.fire({
    title,
    text,
    icon: iconHtml ? undefined : icon, // si iconHtml est défini, on ignore l’icon standard
    iconHtml,
    showCancelButton: true,
    showConfirmButton:true,
    confirmButtonColor: confirmColor,
    cancelButtonColor: cancelColor,
    confirmButtonText: confirm,
    cancelButtonText: cancel,
  });
};



// // utilisation general

//   MyConfirm({
//     title: "Supprimer .... ?",
//     text: "Vous ne pourrez pas revenir en arrière.",
//     confirm: "Supprimer",
//     cancel: "Annuler",
//   }).then((result) => {
//     if (result.isConfirmed) {
//      console.log(supprimé)
//     } else {
//       console.log("Action annulée ❌");
//     }
//   });

// // outout simplement si tout est personnalisé
//  MyConfirm({}).then((result) => {
//       if (result.isConfirmed) {
         
//       } 
//     });



