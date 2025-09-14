import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";

export default function InstructorLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <aside className="w-64 bg-gray-100 p-4 hidden md:block">
          <h2 className="font-bold mb-4">Menu Instructeur</h2>
          <ul className="space-y-2">
            <li><a href="/instructor/dashboard">Dashboard</a></li>
            <li><a href="/instructor/creer-examen">Créer Examen</a></li>
            <li><a href="/instructor/examens-crees">Examens Créés</a></li>
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
