import Navbar from "../components/navbar/Navbar";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";

export default function PublicLayout() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: "url(/images/background.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        flexDirection: "column",
        width: "100%",
      }}
    >
      {/* Navbar */}
      <Navbar />

      {/* Contenu principal */}
      <main className="flex-grow d-flex justify-content-center align-items-center py-5">
        <div className="bg-white border shadow p-5 w-100" style={{ maxWidth: "80%" }}>
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
