import React from "react";
import { Link, useNavigate } from "react-router-dom";
import MyButton from "../../components/button/MyButton"
function Unauthorized() {
  const navigate=useNavigate();
  return (
   <div
      className="home d-flex justify-content-center  align-items-center mx-3 p-3  p-md-5"
      style={{
        backgroundImage: "url(/images/bg.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className=" px-md-5  text-center"
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
        <MyButton onClick={()=>navigate("/login")}  className="btn btn-warning btn-lg shadow-sm">
          Retour à la connexion
        </MyButton>
        <div className=" text-muted my-3">
        <small>Si vous pensez que c'est une erreur, contactez l'administrateur.</small>
      </div>
      </div>

      
    </div>
  );
}

export default Unauthorized;
