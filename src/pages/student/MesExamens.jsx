import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { selectUserExamens } from "../../redux/examenSlice";
import MyButton from "../../components/button/MyButton";
import PageTitle from "../../components/PageTitle";
import Card from "../../components/Card";
import { div } from "framer-motion/client";

export default function MesExamens() {
  const navigate = useNavigate();
  // 1. Récupérer tous les examens de l'utilisateur depuis Redux
  const allUserExamens = useSelector(selectUserExamens);
  console.log("allUserExamens :", allUserExamens);

  // 2. Vérifier si la valeur existe (parfois Redux peut renvoyer undefined au début)
  const safeUserExamens = allUserExamens || [];

  // 3. Filtrer uniquement les examens dont le score est encore null
  const userExamens = safeUserExamens.filter((exam) => exam.ScoreR == null);

  return (
    <div className=" py-3">
      <PageTitle>Mes examens à passer</PageTitle>
      {userExamens.length === 0 ? (
        <Card
          className="mb-4"
          title="Examens à passer"
          icon={<i className="bi bi-journal-text fs-4 me-3"></i>}
          content={
            <>
              <p>Aucun examen à passer pour l'instant</p>
            </>
          }
        />
      ) : (
        <div className="space-y-4">
          {userExamens.map((examen) =>
            examen.PublieE === "oui" ? (
              <Card
                className="mb-4"
                title={examen.DescriptionE}
                icon={<i className="bi bi-pencil-square fs-4 me-3"></i>}
                content={
                  <>
                    <div key={examen.IdExamen}>
                      <p>
                        <strong>Module :</strong> {examen.NomModule} (
                        {examen.DescriptionModule})
                      </p>
                      <p>
                        <strong>Filière :</strong> {examen.Filiere}
                      </p>
                      <p>
                        <strong>Niveau :</strong> {examen.Niveau}
                      </p>
                      <p>
                        <strong>Durée :</strong> {examen.DurationE} minute(s)
                      </p>
                      <p>
                        <strong>Date début :</strong>{" "}
                        {new Date(examen.DateDebutE).toLocaleDateString(
                          "fr-FR"
                        )}
                      </p>
                      <p>
                        <strong>Date fin :</strong>{" "}
                        {new Date(examen.DateFinE).toLocaleDateString("fr-FR")}
                      </p>
                      {/* bouton passer examen */}
                      {!examen.IsPassed ? (
                        <div className="text-center">
                          <MyButton
                            onClick={() =>
                              navigate(
                                `/student/passer-examen/${examen.IdExamen}`
                              )
                            }
                            className="btn btn-primary mt-3"
                          >
                            Passer l’examen
                          </MyButton>
                        </div>
                      ) : (
                        <div>
                          <strong className="text-danger">Examen raté</strong>
                        </div>
                      )}
                    </div>
                  </>
                }
              />
            ) : null
          )}
        </div>
      )}
    </div>
  );
}
