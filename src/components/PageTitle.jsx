import React from "react";

export default function PageTitle({ children }) {
  return (
    <div className="mb-4">
      {/* Titre principal de la page avec couleur marron clair et texte en gras */}
      <h4 style={{color:"var(--marron-clear)"}} className="fw-bold">{children}</h4>
      
      {/* Ligne horizontale décorative sous le titre */}
      <hr
        className="mb-3"
        style={{
          marginTop: "14px",
          borderTop: "2px solid #8B4513", // couleur marron foncé
        }}
      />
    </div>
  );
}
