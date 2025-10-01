import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  selectIsLoggedIn,
  selectUserInfos,
  removeActiveUser,
} from "../../redux/authSlice";
import "./Navbar.css";

export default function Navbar({ toggleSidebar, sidebarOpen }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const userInfos = useSelector(selectUserInfos); // contient { id, firstname, lastname, TypeMembre, ... }

  // Fonction de déconnexion : supprime l'utilisateur actif du store et du localStorage
  // puis ferme le menu et redirige vers la page de login après une courte transition
  const handleLogout = () => {
    dispatch(removeActiveUser());
    localStorage.removeItem("userinfos");
    handleClose();
    setTimeout(() => {
      navigate("/login");
    }, 300); // 300ms = durée de la transition CSS
  };

  // Fonction pour fermer le menu collapse en mobile avec transition fluide
  const handleClose = () => {
    if (window.innerWidth < 768) {
      const nav = document.getElementById("navbarNav");
      if (nav) {
        // Définir la hauteur actuelle avant de la réduire pour transition
        nav.style.height = nav.scrollHeight + "px";
        requestAnimationFrame(() => {
          nav.style.height = "0"; // transition vers hauteur 0
        });
        setTimeout(() => {
          nav.classList.remove("show");
          nav.style.height = ""; // réinitialisation
        }, 300); // durée de la transition CSS
      }
    }
  };

  // Détermine si le bouton de sidebar doit s'afficher
  // true seulement sur les routes /admin/, /student/ ou /instructor/
  const showSidebarButton =
    location.pathname.startsWith("/admin/") ||
    location.pathname.startsWith("/student/") ||
    location.pathname.startsWith("/instructor/");

  return (
    <nav className="navbar navbar-expand-lg navbar-dark shadow-sm py-2 px-3">
      <div className="container">

        {/* Bouton hamburger pour ouvrir/fermer la sidebar sur mobile */}
        {showSidebarButton && (
          <button
            className="btn d-md-none  me-3 p-0"
            onClick={toggleSidebar}
            style={{ zIndex: 1100, position: "relative" }}
          >
            {sidebarOpen ? (
              <i
                className="bi-layout-sidebar-inset "
                style={{ fontSize: "1.8rem", color: "#b0b3b7ff" }}
              ></i> // icône pour fermer la sidebar
            ) : (
              <i
                className="bi-layout-sidebar-inset-reverse "
                style={{ fontSize: "1.8rem", color: "#b0b3b7ff" }}
              ></i> // icône pour ouvrir la sidebar
            )}
          </button>
        )}

        {/* Logo / marque */}
        <Link
          onClick={handleClose}
          className="nav-link logo navbar-brand fw-bold"
          to="/"
        >
          StudXam
        </Link>

        {/* Bouton pour toggler le menu navbar en mobile */}
        <button
          className="navbar-toggler border-0 shadow-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse " id="navbarNav">
          <ul className="navbar-nav ms-auto pb-4 pb-md-0">

            {/* Liens publics */}
            <li className="nav-item">
              <Link onClick={handleClose} className="nav-link" to="/about">
                A propos
              </Link>
            </li>
            <li className="nav-item">
              <Link onClick={handleClose} className="nav-link" to="/contact">
                Contact
              </Link>
            </li>

            {/* Menu public uniquement si non connecté */}
            {!isLoggedIn && (
              <>
                <li className="nav-item">
                  <Link onClick={handleClose} className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    onClick={handleClose}
                    className="nav-link"
                    to="/register"
                  >
                    Register
                  </Link>
                </li>
              </>
            )}

            {/* Menu utilisateur connecté */}
            {isLoggedIn && userInfos && (
              <li className="nav-item dropdown">
                <span
                  className="nav-link dropdown-toggle"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{ cursor: "pointer" }}
                >
                  {userInfos.Prenom} {/* Affiche prénom de l'utilisateur */}
                </span>
                <ul
                  className="dropdown-menu dropdown-menu-end"
                  aria-labelledby="navbarDropdown"
                >

                  {/* Sous-menu spécifique selon TypeMembre */}
                  {userInfos.TypeMembre === "Admin" && (
                    <>
                      <li>
                        <Link
                          onClick={handleClose}
                          className="dropdown-item"
                          to="/admin/dashboard"
                        >
                          Dashboard
                        </Link>
                      </li>  
                    </>
                  )}

                  {userInfos.TypeMembre === "Instructor" && (
                    <>
                      <li>
                        <Link
                          onClick={handleClose}
                          className="dropdown-item"
                          to="/instructor/dashboard"
                        >
                          Dashboard
                        </Link>
                      </li>
                      <li>
                        <Link
                          onClick={handleClose}
                          className="dropdown-item"
                          to="/instructor/profil-instructor"
                        >
                          Profil
                        </Link>
                      </li>
                       <li>
                        <Link
                          onClick={handleClose}
                          className="dropdown-item"
                          to="/instructor/mes-classes"
                        >
                          Mes classes
                        </Link>
                      </li>
                      <li>
                        <Link
                          onClick={handleClose}
                          className="dropdown-item"
                          to="/instructor/gest-examens"
                        >
                          Gestion des examens
                        </Link>
                      </li>
                    </>
                  )}

                  {userInfos.TypeMembre === "Student" && (
                    <>
                      <li>
                        <Link
                          onClick={handleClose}
                          className="dropdown-item"
                          to="/student/dashboard"
                        >
                          Dashboard
                        </Link>
                      </li>
                      <li>
                        <Link
                          onClick={handleClose}
                          className="dropdown-item"
                          to="/student/profil-student"
                        >
                          Profil
                        </Link>
                      </li>
                      <li>
                        <Link
                          onClick={handleClose}
                          className="dropdown-item"
                          to="/student/mes-examens"
                        >
                          Mes Examens à passer
                        </Link>
                      </li>
                      <li>
                        <Link
                          onClick={handleClose}
                          className="dropdown-item"
                          to="/student/mes-resultats"
                        >
                          Mes résultats
                        </Link>
                      </li>
                    </>
                  )}

                  {/* Séparateur et bouton Déconnexion */}
                  <li>
                    <hr className="mb-2 w-75 mx-auto" />
                  </li>
                  <li>
                    <span
                      className="dropdown-item text-danger"
                      onClick={handleLogout}
                      style={{ cursor: "pointer" }}
                    >
                      Déconnexion
                    </span>
                  </li>

                </ul>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
