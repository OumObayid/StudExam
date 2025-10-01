import React from "react";
import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";
import "./layout.css";
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
  const [sidebarOpen, setSidebarOpen] = useState(false); // État pour le sidebar (ouvert/fermé)
  const user = useSelector(selectUserInfos); // Récupère les infos de l'utilisateur connecté

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Fonction de déconnexion de l'utilisateur
  const handleLogout = () => {
    dispatch(removeActiveUser()); // Supprime l'utilisateur du store Redux
    localStorage.removeItem("userinfos"); // Supprime les infos locales
    handleClose(); // Ferme le menu collapse si nécessaire

    // Attente de la fin de la transition CSS avant de naviguer vers login
    setTimeout(() => {
      navigate("/login");
    }, 300);
  };

  // Fonction pour toggler l'état ouvert/fermé du sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Ferme automatiquement le sidebar sur mobile
  const closeSidebar = () => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  // Ferme le menu collapse de façon animée sur mobile
  const handleClose = () => {
    if (window.innerWidth < 768) {
      const nav = document.getElementById("navbarNav");
      if (nav) {
        nav.style.height = nav.scrollHeight + "px"; // assure que la hauteur est connue
        requestAnimationFrame(() => {
          nav.style.height = "0"; // transition vers 0
        });
        setTimeout(() => {
          nav.classList.remove("show");
          nav.style.height = ""; // reset
        }, 300);
      }
    }
  };

  // Rafraîchit toutes les données importantes (filières, niveaux, modules, users, examens, passations)
  const handleRefresh = async () => {
    try {
      // Récupération et dispatch des filières
      const responseFilieres = await getAllFilieres();
      if (responseFilieres.success) dispatch(setFilieres(responseFilieres.filieres));
      else console.error(responseFilieres.message);

      // Récupération et dispatch des niveaux
      const responseNiveaux = await getAllNiveaux();
      if (responseNiveaux.success) dispatch(setNiveaux(responseNiveaux.niveaux));
      else console.error(responseNiveaux.message);

      // Récupération et dispatch des modules
      const responseModules = await getAllModules();
      if (responseModules.success) dispatch(setModules(responseModules.modules));
      else console.error(responseModules.message);

      // Récupération et dispatch des utilisateurs
      await getAllUsers()
        .then((response) => {
          if (response.success) dispatch(setUsers(response.users));
          else console.log(response.message);
        })
        .catch((err) => console.log(err));

      // Récupération et dispatch des examens
      await getAllExamens()
        .then((response) => {
          if (response.success) dispatch(setExamens(response.examens));
          else console.log(response.message);
        })
        .catch((err) => console.log(err));

      // Récupération et dispatch des passations
      const responsePassations = await getAllPassations();
      if (responsePassations.success) dispatch(setPassations(responsePassations.passations));
      else console.error(responsePassations.message);

      // Alerte succès
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
      {/* Navbar principale avec gestion du sidebar */}
      <Navbar toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />

      <div className="d-flex flex-grow-1">
        {/* Sidebar fixe */}
        <aside
          className="layout py-3 position-fixed h-100"
          style={{
            width: "250px",
            transition: "all 0.3s ease",
            left: window.innerWidth >= 768 ? "0" : sidebarOpen ? "0" : "-260px",
            zIndex: 999,
          }}
        >
          {/* Affichage du nom de l'utilisateur */}
          <h4 style={{ marginTop: "7px" }} className="text-center">
            Admin: <span className="fs-5">{user.Prenom}</span>
          </h4>
          <hr style={{ marginTop: "14px" }} />

          <div className="accordion" id="sidebarAccordion">
            {/* Lien vers Dashboard */}
            <div className="accordion-item border-0">
              <NavLink onClick={closeSidebar} to="/admin/dashboard" className="nav-link">
                Dashboard
              </NavLink>
            </div>

            {/* Organisation académique avec sous-menus */}
            <div className="accordion-item border-0">
              <h2 className="accordion-header" id="headingProgrammes">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseProgrammes"
                  aria-expanded="false"
                  aria-controls="collapseProgrammes"
                >
                  Organisation Académique
                </button>
              </h2>
              <div
                id="collapseProgrammes"
                className="accordion-collapse collapse"
                aria-labelledby="headingProgrammes"
                data-bs-parent="#sidebarAccordion"
              >
                <div className="accordion-body p-0">
                  <NavLink onClick={closeSidebar} to="/admin/gest-filiere" className="nav-link ps-4">
                    Gestion des Filières
                  </NavLink>
                  <NavLink onClick={closeSidebar} to="/admin/gest-niveau" className="nav-link ps-4">
                    Gestion des Niveaux
                  </NavLink>
                  <NavLink onClick={closeSidebar} to="/admin/gest-module" className="nav-link ps-4">
                    Gestion des Modules
                  </NavLink>
                </div>
              </div>
            </div>

            {/* Gestion des utilisateurs */}
            <div className="accordion-item border-0">
              <h2 className="accordion-header" id="headingUsers">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseUsers"
                  aria-expanded="false"
                  aria-controls="collapseUsers"
                >
                  Utilisateurs
                </button>
              </h2>
              <div
                id="collapseUsers"
                className="accordion-collapse collapse"
                aria-labelledby="headingUsers"
                data-bs-parent="#sidebarAccordion"
              >
                <div className="accordion-body p-0">
                  <NavLink onClick={closeSidebar} to="/admin/gest-instructor" className="nav-link ps-4">
                    Gestion des Instructeurs
                  </NavLink>
                  <NavLink onClick={closeSidebar} to="/admin/gest-student" className="nav-link ps-4">
                    Gestion des Étudiants
                  </NavLink>
                </div>
              </div>
            </div>

            {/* Gestion des affectations */}
            <div className="accordion-item border-0">
              <NavLink onClick={closeSidebar} to="/admin/gest-affect" className="nav-link">
                Gestion des affectations
              </NavLink>
            </div>

            {/* Gestion des examens et notes */}
            <div className="accordion-item border-0">
              <h2 className="accordion-header" id="headingExamens">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseExamens"
                  aria-expanded="false"
                  aria-controls="collapseExamens"
                >
                  Examens
                </button>
              </h2>
              <div
                id="collapseExamens"
                className="accordion-collapse collapse"
                aria-labelledby="headingExamens"
                data-bs-parent="#sidebarAccordion"
              >
                <div className="accordion-body p-0">
                  <NavLink onClick={closeSidebar} to="/admin/gest-examen" className="nav-link ps-4">
                    Gestion des Examens
                  </NavLink>
                  <NavLink onClick={closeSidebar} to="/admin/gest-note" className="nav-link ps-4">
                    Gestion des Notes
                  </NavLink>
                </div>
              </div>
            </div>

            {/* Bouton pour rafraîchir les données */}
            <div className="accordion-item border-0">
              <button
                onClick={() => {
                  closeSidebar();
                  handleRefresh();
                }}
                className="nav-link btn btn-link w-100 text-start"
                style={{ textDecoration: "none" }}
              >
                Rafraîchir les données
              </button>
            </div>

            {/* Bouton déconnexion */}
            <div className="accordion-item border-0">
              <button
                onClick={() => {
                  closeSidebar();
                  handleLogout();
                }}
                className="nav-link btn w-100 text-start"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </aside>

        {/* Overlay pour mobile quand le sidebar est ouvert */}
        {sidebarOpen && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-md-none"
            onClick={toggleSidebar}
            style={{ zIndex: 998 }}
          />
        )}

        {/* Contenu principal de la page */}
        <main
          className="main-outlet flex-grow-1 px-3 px-md-4"
          style={{
            marginLeft: window.innerWidth >= 768 ? "250px" : "0", // décale le contenu sur desktop
            transition: "margin-left 0.3s ease",
            minWidth: 0,
          }}
        >
          <Outlet /> {/* Composant pour afficher les routes enfants */}
        </main>
      </div>

      {/* Footer général */}
      <Footer />
    </div>
  );
}

