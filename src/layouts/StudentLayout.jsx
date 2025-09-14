import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

export default function StudentLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <aside className="w-64 bg-gray-100 p-4 hidden md:block">
          <ul className="space-y-2">
            <li>
              <Link to="/etudiant/dashboard" className="block p-2 hover:bg-gray-200 rounded">
                Dashboard
              </Link>
            </li>
              <li>
              <Link to="/etudiant/profil" className="block p-2 hover:bg-gray-200 rounded">
                Profil
              </Link>
            </li>
            <li>
              <Link to="/etudiant/mes-examens" className="block p-2 hover:bg-gray-200 rounded">
                Mes Examens
              </Link>
            </li>          
            <li>
              <Link to="/etudiant/statistiques" className="block p-2 hover:bg-gray-200 rounded">
                Statistiques
              </Link>
            </li>
          
          </ul>
        </aside>
        <main className="flex-1 p-4 container mx-auto">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}
