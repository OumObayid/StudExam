import { Link, useNavigate } from "react-router-dom";
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

  const isLoggedIn = useSelector(selectIsLoggedIn);
  const userInfos = useSelector(selectUserInfos); // contient { id, firstname, lastname, TypeMembre, ... }

  // Fonction de déconnexion
  const handleLogout = () => {
    dispatch(removeActiveUser());
    localStorage.removeItem("userinfos");
    handleClose();
    // attendre la fin de la transition avant de naviguer
    setTimeout(() => {
      navigate("/login");
    }, 300); // 300ms = durée de ta transition CSS
  };

  // Fonction pour fermer en transition le menu collapse lors d'un clic sur un menu
  const handleClose = () => {
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
  };
  return (
    <nav className="navbar navbar-expand-lg navbar-dark shadow-sm py-0 py-md-2">
      <div className="container">
        {/* Bouton hamburger sidebar */}
        <button
          className="btn d-md-none  me-3"
          onClick={toggleSidebar}
          style={{ zIndex: 1100, position: "relative" }}
        >
          {sidebarOpen ? (
            <i
              className="bi-layout-sidebar-inset "
              style={{ fontSize: "1.8rem", color: "#b0b3b7ff" }}
            ></i> // icône croix
          ) : (
            <i
              className="bi-layout-sidebar-inset-reverse "
              style={{ fontSize: "1.8rem", color: "#b0b3b7ff" }}
            ></i> // icône menu
          )}
        </button>

        <Link onClick={handleClose} className="navbar-brand fw-bold" to="/">
          StudXam
        </Link>

        {/* Bouton pour toggler le navbar sur mobile */}
        <button
          className="navbar-toggler border-0"
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
            <li className="nav-item">
              <Link onClick={handleClose} className="nav-link" to="/contact">
                Contact
              </Link>
            </li>
            <li className="nav-item">
              <Link onClick={handleClose} className="nav-link" to="#">
                A propos
              </Link>
            </li>
            {/* Menu public */}
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

            {/* Utilisateur connecté */}
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
                  {userInfos.Prenom}
                </span>
                <ul
                  className="dropdown-menu dropdown-menu-end"
                  aria-labelledby="navbarDropdown"
                >
                  {/* Menu spécifique selon TypeMembre */}
                  {userInfos.TypeMembre === "Admin" && (
                    <li>
                      <Link
                        onClick={handleClose}
                        className="dropdown-item"
                        to="/admin/dashboard"
                      >
                        Dashboard Admin
                      </Link>
                    </li>
                  )}
                  {userInfos.TypeMembre === "Instructeur" && (
                    <li>
                      <Link
                        onClick={handleClose}
                        className="dropdown-item"
                        to="/instructeur/dashboard"
                      >
                        Dashboard Instructeur
                      </Link>
                    </li>
                  )}
                  {userInfos.TypeMembre === "Etudiant" && (
                    <>
                      <li>
                        <Link
                          onClick={handleClose}
                          className="dropdown-item"
                          to="/etudiant/dashboard"
                        >
                          Dashboard
                        </Link>
                      </li>
                      <li>
                        <Link
                          onClick={handleClose}
                          className="dropdown-item"
                          to="/etudiant/mes-examens"
                        >
                          Mes Examens
                        </Link>
                      </li>
                      <li>
                        <Link
                          onClick={handleClose}
                          className="dropdown-item"
                          to="/etudiant/statistiques"
                        >
                          Statistiques
                        </Link>
                      </li>
                      <li>
                        <Link
                          onClick={handleClose}
                          className="dropdown-item"
                          to="/etudiant/profil"
                        >
                          Profil
                        </Link>
                      </li>
                    </>
                  )}

                  <li>
                    <hr className="dropdown-divider" />
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
