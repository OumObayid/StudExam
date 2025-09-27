import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "./MyAlerConf.css";
const MySwal = withReactContent(Swal);

export const MyAlert = ({
  title = "Attention",
  text = "",
  icon = "warning", // icône SweetAlert2 standard
  iconHtml = undefined,
   showClose = true
}) => {
  return MySwal.fire({
    title,
    text,
    icon: iconHtml ? undefined : icon, // si iconHtml est défini, on ignore l’icon standard
    iconHtml,
    showCancelButton: false,
    showConfirmButton: false,
    showCloseButton: showClose,
  });
};

// // utilisation general

//  MyAlert({
//   title:"",
// text:"",
// icon:""
// })

// pour icon, il y a:
// "success" ✅ (icône verte avec check)

// "error" ❌ (icône rouge avec croix)

// "warning" ⚠️ (icône jaune triangle)

// "info" ℹ️ (icône bleue avec “i”)

// "question" ❓ (icône bleue avec un point d’interrogation)