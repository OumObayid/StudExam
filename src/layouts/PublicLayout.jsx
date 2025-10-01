import React from "react";
import Navbar from "../components/navbar/Navbar";
import { Outlet } from "react-router-dom";
import "./layout.css"
import Footer from "../components/footer/Footer";
export default function PublicLayout() {
  return (
    // Conteneur principal de la mise en page publique
    <div
      className="layout-pub"
      style={{
        minHeight: "100vh", // Hauteur minimale = hauteur de la fenêtre
        backgroundImage: "url(/images/bg4.jpg)", // Image de fond
        backgroundSize: "cover", // L'image couvre tout le conteneur
        backgroundPosition: "center", // Centre l'image
        display: "flex", // Utilisation de flexbox pour aligner le contenu
        flexDirection: "column", // Organisation verticale : navbar, main, footer
        width: "100%", // Largeur totale
      }}
    >
      {/* Navbar visible sur toutes les pages publiques */}
      <Navbar />

      {/* Contenu principal */}
      <main
        className="main-outlet main flex-grow d-flex justify-content-center align-items-center py-3 py-md-4"
        style={{ minHeight: "78vh" }} // Minimum 78% de la hauteur de la fenêtre
      >
        {/* Outlet React Router pour afficher les routes enfants */}
        <Outlet />
      </main>

      {/* Footer visible sur toutes les pages publiques */}
      <Footer />
    </div>
  );
}

