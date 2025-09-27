import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectExamens } from "../../redux/examenSlice";
import { useNavigate, useParams } from "react-router-dom";
import MyButton from "../../components/button/MyButton";
import "./instructor.css";
import PageTitle from "../../components/PageTitle";
import Card from "../../components/Card";

const AffExamen = () => {
  const navigate = useNavigate();
  const { idParams } = useParams();
  const examens = useSelector(selectExamens) || [];
  const examen = examens.find((e) => e.IdExamen === Number(idParams));
  const [showQuestions, setShowQuestions] = useState(false);

  if (!examen)
    return (
      <div className="container mt-4">
        <p className="text-muted">Examen introuvable.</p>
      </div>
    );

  const hasQuestions = examen.questions && examen.questions.length > 0;

  return (
    <div className=" py-3">
      <PageTitle>Gestion des examens</PageTitle>

      <div className=" d-md-flex justify-content-between  align-items-md-center">
        <h5>
          {examen.DescriptionE}
        </h5>
        <div className="text-end">
          <MyButton
            classNm="py-2 mb-3"
            onClick={() => navigate("/instructor/gest-examens")}
          >
            Retour
          </MyButton>
        </div>
      </div>

      <Card
        className="mb-4"
        title="Examen en détail"
        icon={<i className="bi bi-journal-text fs-4 me-3"></i>}
        content={
          <>
            {/* Ligne Desktop: deux colonnes, ligne Mobile: empilée */}
            <div className="row mb-3">
              <div className="col-md-6 mb-2 mb-md-0">
                <p className="mb-1">
                  <strong>Module:</strong> {examen.NomModule} -{" "}
                  {examen.DescriptionModule}
                </p>
                <p className="mb-1">
                  <strong>Filière:</strong> {examen.NomFiliere}
                </p>
                <p className="mb-1">
                  <strong>Niveau:</strong> {examen.NomNiveau}
                </p>
              </div>

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

            {/* Boutons */}
            <div className="text-center mt-4 d-flex gap-2 justify-content-center flex-wrap">
              {hasQuestions ? (
                <>
                  <MyButton
                    styleNm={{ backgroundColor: "var(--gris-fonce)" }}
                    onClick={() => setShowQuestions((prev) => !prev)}
                  >
                    {showQuestions
                      ? "Masquer les questions"
                      : "Afficher les questions"}
                  </MyButton>
                  <MyButton
                    className="btn-info"
                    onClick={() => {
                      navigate(`/instructor/mod-questions/${examen.IdExamen}`);
                    }}
                  >
                    Modifier les questions
                  </MyButton>
                </>
              ) : (
                <MyButton
                  classNm="btn-success"
                  onClick={() =>
                    navigate(`/instructor/creer-questions/${examen.IdExamen}`)
                  }
                >
                  Créer les questions
                </MyButton>
              )}
            </div>
          </>
        }
      />
      {/* Conteneur des questions (toggle avec transition) */}
      {hasQuestions && (
        <div
          className={` mt-4 toggle-container ${showQuestions ? "show" : ""}`}
        >
          <div className="list-group">
            {examen.questions.map((q, idx) => (
              <div key={q.IdQuestion} className="list-group-item">
                <p className="fw-bold mb-1">
                  Q{idx + 1}. {q.TitreQuestion}
                </p>
                <ul className="mb-2">
                  <li>1. {q.Reponse1}</li>
                  <li>2. {q.Reponse2}</li>
                  <li>3. {q.Reponse3}</li>
                </ul>
                <p className="text-success mb-0">
                  Réponse correcte: {q["Reponse" + q.ReponseCorrecte]}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AffExamen;
