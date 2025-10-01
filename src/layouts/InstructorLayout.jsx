import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";
import { useDispatch, useSelector } from "react-redux";
import { removeActiveUser, selectUserInfos } from "../redux/authSlice";
import { getAllUsers } from "../services/users";
import { setUsers } from "../redux/userSlice";
import { getAllExamens } from "../services/examens";
import { setExamens } from "../redux/examenSlice";
import { getAllFilieres } from "../services/filieres";
import { setFilieres } from "../redux/filiereSlice";
import { getAllNiveaux } from "../services/niveaux";
import { setNiveaux } from "../redux/niveauSlice";
import { getAllModules } from "../services/modules";
import { setModules } from "../redux/moduleSlice";
import { getAllPassations } from "../services/passations";
import { setPassations } from "../redux/passationSlice";
import { MyAlert } from "../components/myconfirm/MyAlert";

export default function StudentLayout() {
  // État pour savoir si le sidebar est ouvert ou fermé
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Récupération des informations de l'utilisateur depuis le store Redux
  const user = useSelector(selectUserInfos);

  // Hook pour naviguer entre les pages
  const navigate = useNavigate();

  // Hook pour dispatcher des actions Redux
  const dispatch = useDispatch();

  // Calcul dynamique de la position du sidebar selon la taille de l'écran et son état
  let sidebarLeft;
  if (window.innerWidth >= 768) {
    sidebarLeft = "0"; // Sidebar fixe à gauche sur desktop
  } else if (sidebarOpen) {
    sidebarLeft = "0"; // Sidebar visible sur mobile si ouvert
  } else {
    sidebarLeft = "-260px"; // Sidebar caché sur mobile
  }

  // Fonction de déconnexion de l'utilisateur
  const handleLogout = () => {
    // Supprime l'utilisateur actif du store Redux
    dispatch(removeActiveUser());

    // Supprime les informations utilisateur stockées localement
    localStorage.removeItem("userinfos");

    // Ferme le menu collapse si ouvert (mobile)
    handleClose();

    // Attend la fin de la transition CSS avant de naviguer vers la page login
    setTimeout(() => {
      navigate("/login");
    }, 300); // 300ms = durée de la transition
  };

  // Fonction pour toggler l'ouverture/fermeture du sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Ferme automatiquement le sidebar sur mobile
  const closeSidebar = () => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  // Ferme le menu collapse du navbar avec une transition sur mobile
  const handleClose = () => {
    if (window.innerWidth < 768) {
      const nav = document.getElementById("navbarNav");
      if (nav) {
        nav.style.height = nav.scrollHeight + "px"; // fixe la hauteur actuelle
        requestAnimationFrame(() => {
          nav.style.height = "0"; // transition vers 0
        });
        setTimeout(() => {
          nav.classList.remove("show"); // supprime la classe Bootstrap "show"
          nav.style.height = ""; // reset de la hauteur
        }, 300); // même durée que la transition CSS
      }
    }
  };

  // Fonction pour rafraîchir toutes les données liées à l'utilisateur et aux examens
  const handleRefresh = async () => {
    try {
      // Chargement des filières
      const responseFilieres = await getAllFilieres();
      if (responseFilieres.success)
        dispatch(setFilieres(responseFilieres.filieres));
      else
        console.error(
          responseFilieres.message || "Erreur lors du chargement des filières"
        );

      // Chargement des niveaux
      const responseNiveaux = await getAllNiveaux();
      if (responseNiveaux.success)
        dispatch(setNiveaux(responseNiveaux.niveaux));
      else
        console.error(
          responseNiveaux.message || "Erreur lors du chargement des niveaux"
        );

      // Chargement des modules
      const responseModules = await getAllModules();
      if (responseModules.success)
        dispatch(setModules(responseModules.modules));
      else
        console.error(
          responseModules.message || "Erreur lors du chargement des modules"
        );

      // Chargement des utilisateurs
      await getAllUsers()
        .then(async (response) => {
          if (response.success) dispatch(setUsers(response.users));
          else console.log(response.message);
        })
        .catch((err) => console.log(err));

      // Chargement des examens
      await getAllExamens()
        .then((response) => {
          if (response.success) dispatch(setExamens(response.examens));
          else console.log(response.message);
        })
        .catch((err) => console.log(err));

      // Chargement des passations
      const responsePassations = await getAllPassations();
      if (responsePassations.success)
        dispatch(setPassations(responsePassations.passations));
      else
        console.error(
          responsePassations.message ||
            "Erreur lors du chargement des passations"
        );

      // Notification succès
      MyAlert({
        title: "success",
        text: "Les données utilisateurs et examens sont mises à jour ",
        icon: "success",
      });
    } catch (err) {
      console.error("Erreur lors du chargement des données :", err);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Navbar principale */}
      <Navbar toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />

      <div className="d-flex flex-grow-1">
        {/* Sidebar */}
        <aside
          className="layout py-3 position-fixed h-100"
          style={{
            width: "250px",
            transition: "all 0.3s ease",
            left: sidebarLeft,
            zIndex: 999,
          }}
        >
          {/* Affichage du nom de l'instructeur */}
          <h4 style={{ marginTop: "7px" }} className="text-center">
            Instructeur: <span className="fs-5">{user.Prenom}</span>
          </h4>
          <hr style={{ marginTop: "14px" }} />

          {/* Menu du sidebar */}
          <ul className="nav flex-column">
            <li className="nav-item mb-2">
              <NavLink
                onClick={closeSidebar}
                to="/instructor/dashboard"
                className="nav-link"
              >
                Dashboard
              </NavLink>
            </li>
            <li className="nav-item mb-2">
              <NavLink
                onClick={closeSidebar}
                to="/instructor/profil-instructor"
                className="nav-link"
              >
                Profil
              </NavLink>
            </li>
            <li className="nav-item mb-2">
              <NavLink
                onClick={closeSidebar}
                to="/instructor/mes-classes"
                className="nav-link"
              >
                Mes Classes
              </NavLink>
            </li>
            <li className="nav-item mb-2">
              <NavLink
                onClick={closeSidebar}
                to="/instructor/gest-examens"
                className="nav-link"
              >
                Gestion des examens
              </NavLink>
            </li>
            {/* Bouton pour rafraîchir les données */}
            <li>
              <button
                onClick={() => {
                  closeSidebar();
                  handleRefresh();
                }}
                className="nav-link btn btn-link text-start w-100"
                style={{ textDecoration: "none" }}
              >
                Rafraîchir les données
              </button>
            </li>

            {/* Bouton de déconnexion */}
            <li className="nav-item mb-2">
              <button
                onClick={() => {
                  closeSidebar();
                  handleLogout();
                }}
                className="text-start btn nav-link w-100"
              >
                Deconnexion
              </button>
            </li>
          </ul>
        </aside>

        {/* Overlay pour mobile quand le sidebar est ouvert */}
        {sidebarOpen && (
          <button
            type="button"
            className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-md-none"
            onClick={toggleSidebar}
            style={{ zIndex: 998 }}
            aria-label="Close sidebar"
          />
        )}

        {/* Contenu principal */}
        <main
          className="main-outlet flex-grow-1 px-3 px-md-4"
          style={{
            marginLeft: window.innerWidth >= 768 ? "250px" : "0", // décale le contenu sur desktop
            transition: "margin-left 0.3s ease",
            minWidth: 0,
          }}
        >
          <Outlet />
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
