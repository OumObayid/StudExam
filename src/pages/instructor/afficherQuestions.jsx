import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectExamens } from "../../redux/examenSlice";
import PageTitle from "../../components/PageTitle";
import MyButton from "../../components/button/MyButton"

const AfficherQuestions = () => {
  const navigate = useNavigate();
  const { IdExamen } = useParams();
  const examens = useSelector(selectExamens) || [];
  const examen = examens.find((e) => Number(e.IdExamen) === Number(IdExamen));

  const [showQuestions, setShowQuestions] = useState(true); // toggle affichage

  if (!examen)
    return (
      <div className="container mt-4">
        <p className="text-muted">Examen introuvable.</p>
      </div>
    );

  const questions = examen.questions || [];

  return (
  
      <div className=" py-3">
                <PageTitle>Questions en détail</PageTitle>
      <div className=" d-md-flex justify-content-between align-items-center">
        <h5 className="mb-3">{examen.DescriptionE}</h5>
        <MyButton
          classNm="py-2 mb-3"
          onClick={() => navigate("/instructor/gest-examens")}
        >
          Retour
        </MyButton>
      </div>

      {questions.length === 0 ? (
        <p className="text-muted">
          Aucune question disponible pour cet examen.
        </p>
      ) : (
        <>
          {showQuestions && (
            <div className="list-group">
              {questions.map((q, idx) => (
                <div
                  key={q.IdQuestion || idx}
                  className="list-group-item mb-2 shadow-sm"
                >
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
          )}
        </>
      )}
    </div>
  );
};

export default AfficherQuestions;
