// src/components/ui/PageTitle.jsx
import React from "react";

export default function PageTitle({ children }) {
  return (
    <div className="mb-4">
      <h4 style={{color:"var(--marron-clear)"}} className="fw-bold">{children}</h4>
      <hr className=" mb-3" style={{marginTop:"14px", borderTop: "2px solid #8B4513" }} />
    </div>
  );
}
