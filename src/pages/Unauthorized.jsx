import React from "react";
import { Link } from "react-router-dom";

function Unauthorized() {
  return (
   <div
      className="d-flex justify-content-center  align-items-center p-3  p-md-5"
      style={{
        backgroundImage: "url(/images/background.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
       
      }}
    >
      <div
        className="bg-white border shadow-lg   px-md-5  text-center"
        style={{ maxWidth: "800px" }}
      >
        <h1 className="display-1" style={{ color: "#ff9800", fontWeight: "bold" }}>
          403
        </h1>
        <h2 className="mb-4" style={{ color: "#ff6f00" }}>
          Accès refusé
        </h2>
        <p className="mb-4" style={{ color: "#6d4c41" }}>
          Vous n'avez pas les permissions nécessaires pour accéder à cette page.
        </p>
        <Link to="/login" className="btn btn-warning btn-lg shadow-sm">
          Retour à la connexion
        </Link>
        <div className=" text-muted my-3">
        <small>Si vous pensez que c'est une erreur, contactez l'administrateur.</small>
      </div>
      </div>

      
    </div>
  );
}

export default Unauthorized;
