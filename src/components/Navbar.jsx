import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
    selectIsLoggedIn,
    selectUserInfos,
    removeActiveUser,
} from "../redux/authSlice";

export default function Navbar() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const isLoggedIn = useSelector(selectIsLoggedIn);
    const userInfos = useSelector(selectUserInfos); // contient { id, firstname, lastname, TypeMembre, ... }

    const handleLogout = () => {
        dispatch(removeActiveUser());
        localStorage.removeItem("userinfos");
        navigate("/login");
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
            <div className="container">
                <Link className="navbar-brand fw-bold" to="/">
                    ExamenEnLigne
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        {/* Menu public */}
                        {!isLoggedIn && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/login">
                                        Login
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/register">
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
                                                    className="dropdown-item"
                                                    to="/etudiant/dashboard"
                                                >
                                                    Dashboard
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    className="dropdown-item"
                                                    to="/etudiant/mes-examens"
                                                >
                                                    Mes Examens
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    className="dropdown-item"
                                                    to="/etudiant/statistiques"
                                                >
                                                    Statistiques
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
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
