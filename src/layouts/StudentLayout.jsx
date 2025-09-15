import { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/Footer";
export default function StudentLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  const closeSidebar = () => {
    if (window.innerWidth < 768) {
      // fermer uniquement en mobile
      setSidebarOpen(false);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
      <div className="d-flex flex-grow-1">
        {/* Sidebar */}
        <aside
          className="bg-light border-end p-3 position-fixed h-100"
          style={{
            width: "250px",
            transition: "all 0.3s ease",
            left: window.innerWidth >= 768 ? "0" : sidebarOpen ? "0" : "-260px",
            zIndex: 999,
          }}
        >
          <ul className="nav flex-column">
            <li className="nav-item mb-2">
              <Link
                onClick={closeSidebar}
                to="/etudiant/dashboard"
                className="nav-link"
              >
                Dashboard
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link
                onClick={closeSidebar}
                to="/etudiant/profil"
                className="nav-link"
              >
                Profil
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link
                onClick={closeSidebar}
                to="/etudiant/mes-examens"
                className="nav-link"
              >
                Mes Examens
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link
                onClick={closeSidebar}
                to="/etudiant/statistiques"
                className="nav-link"
              >
                Statistiques
              </Link>
            </li>
          </ul>
        </aside>

        {/* Overlay pour mobile quand sidebar ouverte */}
        {sidebarOpen && (
          <div
            className="position-fixed  top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-md-none"
            onClick={toggleSidebar}
            style={{ zIndex: 998 }}
          />
        )}

        {/* Main content */}
        <main
          className="flex-grow-1 p-4"
          style={{
            marginLeft: window.innerWidth >= 768 ? "250px" : "0", // décale le contenu seulement sur desktop
            transition: "margin-left 0.3s ease",
            minWidth: 0,
          }}
        >
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}
