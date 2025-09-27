import React from "react";
import Navbar from "../components/navbar/Navbar";
import { Outlet } from "react-router-dom";
import "./layout.css"
import Footer from "../components/footer/Footer";
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
      <main className="main-outlet main flex-grow d-flex justify-content-center align-items-center py-3 py-md-4      
      "
      style={{ minHeight:"78vh"}}
      >
        <div className="bg-white border shadow px-2 py-4 p-md-4 w-100" style={{ maxWidth: window.innerWidth >= 768 ? "80%" : "90%" }}>
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
