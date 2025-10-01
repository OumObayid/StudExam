import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { removeActiveUser, selectUserInfos } from "../redux/authSlice";
import Footer from "../components/footer/Footer";
export default function StudentLayout() {
  // État local pour savoir si le sidebar est ouvert ou fermé
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Récupère les informations de l'utilisateur depuis Redux (ex: prénom, type, etc.)
  const user = useSelector(selectUserInfos);

  // Hook React Router pour naviguer vers une autre route
  const navigate = useNavigate();

  // Hook Redux pour dispatcher des actions
  const dispatch = useDispatch();

  // État pour stocker le nombre d'examens à passer, passé au Dashboard via Outlet
  const [examNumber, setExamNumber] = useState(0);

  // Fonction de déconnexion de l'utilisateur
  const handleLogout = () => {
    // Supprime l'utilisateur actif du store Redux
    dispatch(removeActiveUser());

    // Supprime les informations utilisateur stockées localement
    localStorage.removeItem("userinfos");

    // Ferme le menu collapse si ouvert (utile pour mobile)
    handleClose();

    // On attend la fin de la transition CSS avant de naviguer vers la page login
    // 300ms = durée de la transition CSS du sidebar/collapse
    setTimeout(() => {
      navigate("/login");
    }, 300);
  };

  // Fonction pour ouvrir/fermer le sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Fonction pour fermer le sidebar automatiquement sur mobile
  const closeSidebar = () => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false); // ferme le sidebar uniquement si l'écran < 768px
    }
  };

  // Fonction pour fermer le menu collapse avec une transition
  const handleClose = () => {
    if (window.innerWidth < 768) {
      const nav = document.getElementById("navbarNav");
      if (nav) {
        // Fixe la hauteur initiale pour que la transition fonctionne
        nav.style.height = nav.scrollHeight + "px";

        // Animation frame pour déclencher la transition vers 0
        requestAnimationFrame(() => {
          nav.style.height = "0";
        });

        // Après 300ms, retire la classe 'show' et reset la hauteur
        setTimeout(() => {
          nav.classList.remove("show");
          nav.style.height = "";
        }, 300);
      }
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Navbar en haut, reçoit les props pour gérer le sidebar */}
      <Navbar toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />

      <div className="d-flex flex-grow-1">
        {/* Sidebar fixe à gauche */}
        <aside
          className="layout py-3 position-fixed h-100"
          style={{
            width: "250px", // largeur fixe du sidebar
            transition: "all 0.3s ease", // transition pour ouverture/fermeture
            // Position à gauche : 0 pour desktop ou si ouvert sur mobile, sinon -260px
            left: window.innerWidth >= 768 ? "0" : sidebarOpen ? "0" : "-260px",
            zIndex: 999, // au-dessus du contenu principal
          }}
        >
          {/* Titre du sidebar avec prénom de l'étudiant */}
          <h4 style={{ marginTop: "7px" }} className="text-center">
            Etudiant: <span className="fs-5">{user.Prenom}</span>
          </h4>
          <hr style={{ marginTop: "14px" }} />

          {/* Menu vertical */}
          <ul className="nav flex-column">
            {/* Dashboard */}
            <li className="nav-item mb-2">
              <NavLink
                onClick={closeSidebar} // ferme sidebar sur mobile après clic
                to="/student/dashboard"
                className="nav-link"
              >
                Dashboard
              </NavLink>
            </li>

            {/* Profil étudiant */}
            <li className="nav-item mb-2">
              <NavLink
                onClick={closeSidebar}
                to="/student/profil-student"
                className="nav-link"
              >
                Mon Profil
              </NavLink>
            </li>

            {/* Examens à passer avec badge pour le nombre */}
            <li className="nav-item mb-2">
              <NavLink
                onClick={closeSidebar}
                to="/student/mes-examens"
                className="nav-link d-flex justify-content-between align-items-center"
              >
                Mes Examens à passer
                {/* Badge affiché uniquement si examNumber > 0 */}
                {examNumber > 0 && (
                  <span className="exam-badge">{examNumber}</span>
                )}
              </NavLink>
            </li>

            {/* Résultats */}
            <li className="nav-item mb-2">
              <NavLink
                onClick={closeSidebar}
                to="/student/mes-resultats"
                className="nav-link"
              >
                Mes Résultats
              </NavLink>
            </li>

            {/* Bouton de déconnexion */}
            <li className="nav-item mb-2">
              <button
                onClick={() => {
                  closeSidebar(); // ferme le sidebar si mobile
                  handleLogout(); // déconnecte l'utilisateur
                }}
                className="text-start btn nav-link w-100"
              >
                Deconnexion
              </button>
            </li>
          </ul>
        </aside>

        {/* Overlay sombre sur mobile lorsque le sidebar est ouvert */}
        {sidebarOpen && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-25 d-md-none"
            onClick={toggleSidebar} // clic sur l'overlay ferme le sidebar
            style={{ zIndex: 998 }}
          />
        )}

        {/* Contenu principal */}
        <main
          className="main-outlet flex-grow-1 px-3 px-md-4"
          style={{
            // Décale le contenu à droite du sidebar seulement sur desktop
            marginLeft: window.innerWidth >= 768 ? "250px" : "0",
            transition: "margin-left 0.3s ease",
            minWidth: 0,
          }}
        >
          {/* Outlet pour afficher les routes enfants avec passage du setter examNumber */}
          <Outlet context={{ setExamNumber }} />
        </main>
      </div>

      {/* Footer en bas */}
      <Footer />
    </div>
  );
}

