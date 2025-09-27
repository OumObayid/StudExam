import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { removeActiveUser, selectUserInfos } from "../redux/authSlice";
import Footer from "../components/footer/Footer";
export default function StudentLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = useSelector(selectUserInfos);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // setExamNumber envoyé au child DashboardStudent pour recuperer examNumber
  const [examNumber, setExamNumber] = useState(0);

  // Fonction de déconnexion de l'utilisateur
  const handleLogout = () => {
    // Supprime l'utilisateur actif du store Redux
    dispatch(removeActiveUser());

    // Supprime les informations utilisateur stockées localement
    localStorage.removeItem("userinfos");

    // Appelle la fonction handleClose pour fermer le menu collapse (si ouvert)
    handleClose();

    // On attend la fin de la transition CSS avant de naviguer vers la page login
    // Ici 300ms correspond à la durée de la transition définie pour le sidebar/collapse
    setTimeout(() => {
      navigate("/login");
    }, 300);
  };

  // Fonction pour toggler (ouvrir/fermer) le sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Fonction pour fermer le sidebar automatiquement sur mobile
  const closeSidebar = () => {
    if (window.innerWidth < 768) {
      // Vérifie si l'écran est en mode mobile
      setSidebarOpen(false); // Ferme le sidebar uniquement pour mobile
    }
  };

  // Fonction pour fermer en transition le menu collapse lors d'un clic sur un menu
  const handleClose = () => {
    if (window.innerWidth < 768) {
      const nav = document.getElementById("navbarNav");
      if (nav) {
        // Applique la hauteur à 0 avant de retirer show pour la transition
        nav.style.height = nav.scrollHeight + "px"; // assure que la hauteur est connue
        requestAnimationFrame(() => {
          nav.style.height = "0"; // transition vers 0
        });
        setTimeout(() => {
          nav.classList.remove("show");
          nav.style.height = ""; // reset
        }, 300); // même durée que la transition CSS
      }
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
      <div className="d-flex flex-grow-1">
        {/* Sidebar */}
        <aside
          className="layout   py-3 position-fixed h-100"
          style={{
            width: "250px",
            transition: "all 0.3s ease",
            left: window.innerWidth >= 768 ? "0" : sidebarOpen ? "0" : "-260px",
            zIndex: 999,
          }}
        >
          <h4 style={{ marginTop: "7px" }} className="text-center">
            Etudiant: <span className="fs-5">{user.Prenom}</span>
          </h4>
          <hr style={{ marginTop: "14px" }} />
          <ul className="nav flex-column">
            <li className="nav-item mb-2">
              <NavLink
                onClick={closeSidebar}
                to="/student/dashboard"
                className="nav-link"
              >
                Dashboard
              </NavLink>
            </li>
            <li className="nav-item mb-2">
              <NavLink
                onClick={closeSidebar}
                to="/student/profil-student"
                className="nav-link"
              >
                Mon Profil
              </NavLink>
            </li>
            <li className="nav-item mb-2 ">
              <NavLink
                onClick={closeSidebar}
                to="/student/mes-examens"
                className="nav-link d-flex justify-content-between align-items-center"
              >
                Mes Examens à passer
                 {examNumber > 0 && (
                <span className="exam-badge">{examNumber}</span>
              )}
              </NavLink>             
            </li>
         

            <li className="nav-item mb-2">
              <NavLink
                onClick={closeSidebar}
                to="/student/mes-resultats"
                className="nav-link"
              >
                Mes Résultats
              </NavLink>
            </li>
            <li className="nav-item mb-2">
              <button
                onClick={() => {
                  closeSidebar();
                  handleLogout();
                }}
                className="text-start  btn nav-link w-100"
              >
                Deconnexion
              </button>
            </li>
          </ul>
        </aside>

        {/* Overlay pour mobile quand sidebar ouverte */}
        {sidebarOpen && (
          <div
            className="position-fixed  top-0 start-0 w-100 h-100 bg-dark bg-opacity-25 d-md-none"
            onClick={toggleSidebar}
            style={{ zIndex: 998 }}
          />
        )}

        {/* Main content */}
        <main
          className=" main-outlet flex-grow-1 px-3 px-md-4"
          style={{
            marginLeft: window.innerWidth >= 768 ? "250px" : "0", // décale le contenu seulement sur desktop
            transition: "margin-left 0.3s ease",
            minWidth: 0,
          }}
        >
          <Outlet context={{ setExamNumber }}  />
        </main>
      </div>
      <Footer />
    </div>
  );
}
