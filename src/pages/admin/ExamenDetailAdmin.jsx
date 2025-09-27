import React from "react";
import { useSelector } from "react-redux";
import { selectExamens } from "../../redux/examenSlice";
import { useParams } from "react-router-dom";
import PageTitle from "../../components/PageTitle";
import Card from "../../components/Card";

const ExamenDetailAdmin = () => {
  const { idParams } = useParams();
  const examens = useSelector(selectExamens) || [];
  const examen = examens.find((e) => e.IdExamen === Number(idParams));

  if (!examen)
    return (
      <div className="container mt-4">
        <p className="text-muted">Examen introuvable.</p>
      </div>
    );

  return (
    <div className=" py-3">
      <PageTitle>Gestion des examens</PageTitle>
      <Card
         className="mb-4"
        title={ examen.DescriptionE }  
        icon={<i className="bi bi-bar-chart fs-4 me-3"></i>}
        content={
          <>           
            {/* Ligne Desktop: deux colonnes, ligne Mobile: empilée */}
            <div className="row  mb-3">
              {/* Colonne 1: Module / Filière / Niveau */}
              <div className="col-md-6 mb-2 mb-md-0">
                <p className="mb-1">
                  <strong>Module:</strong> {examen.NomModule} -
                  {examen.DescriptionModule}
                </p>
                <p className="mb-1">
                  <strong>Filière:</strong> {examen.NomFiliere}
                </p>
                <p className="mb-1">
                  <strong>Niveau:</strong> {examen.NomNiveau}
                </p>
              </div>

              {/* Colonne 2: Nombre de questions / Note / Durée */}
              <div className="col-md-6 d-flex flex-column align-items-md-end">
                <p className="mb-1">
                  <strong>Nombre de questions:</strong> {examen.NbrQuestionsE}
                </p>
                <p className="mb-1">
                  <strong>Note par question:</strong> {examen.NotePourQuestion}
                </p>
                <p className="mb-1">
                  <strong>Durée:</strong> {examen.DurationE} min
                </p>
              </div>
            </div>

            {/* Badges Publié / Approuvé */}
            <div className="d-flex gap-2 mb-2 justify-content-center flex-wrap">
              <span
                className={`badge ${
                  examen.ApprouveE === "oui"
                    ? "bg-success"
                    : "bg-warning text-dark"
                }`}
              >
                {examen.ApprouveE === "oui" ? "Approuvé" : "Non Approuvé"}
              </span>
              <span
                className={`badge ${
                  examen.PublieE === "oui" ? "bg-success" : "bg-secondary"
                }`}
              >
                {examen.PublieE === "oui" ? "Publié" : "Non publié"}
              </span>
            </div>

            {/* Dates */}
            <div className="text-muted d-flex flex-column flex-md-row align-items-center justify-content-center gap-md-4 mt-2">
              <span>Date début: {examen.DateDebutE}</span>
              <span>Date fin: {examen.DateFinE}</span>
            </div>
          </>
        }
      />
    </div>
  );
};

export default ExamenDetailAdmin;
