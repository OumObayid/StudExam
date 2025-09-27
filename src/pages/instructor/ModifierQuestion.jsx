import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { selectExamens, ajouterQuestionsExamen } from "../../redux/examenSlice";
import { updateQuestions } from "../../redux/questionSlice";
import { modifierQuestions } from "../../services/questions";
import Card from "../../components/Card";
import MyButton from "../../components/button/MyButton";
import PageTitle from "../../components/PageTitle";
import { MyAlert } from "../../components/myconfirm/MyAlert";
const ModifierQuestions = () => {
  const { IdExamen } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Récupération de l'examen
  const examens = useSelector(selectExamens) || [];
  const examen = examens.find((e) => Number(e.IdExamen) === Number(IdExamen));
  const nbQuestions = examen?.NbrQuestionsE || 0;

  // Initialiser le formulaire avec les questions existantes
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    if (examen && examen.questions) {
      // pré-remplir le formulaire avec les questions existantes
      setQuestions(
        examen.questions.map((q) => ({
          IdQuestion: q.IdQuestion,
          TitreQuestion: q.TitreQuestion,
          Reponse1: q.Reponse1,
          Reponse2: q.Reponse2,
          Reponse3: q.Reponse3,
          ReponseCorrecte: q.ReponseCorrecte,
          IdExamenQ: Number(IdExamen),
        }))
      );
    } else {
      // si pas de questions existantes, créer des entrées vides
      setQuestions(
        Array.from({ length: nbQuestions }, () => ({
          TitreQuestion: "",
          Reponse1: "",
          Reponse2: "",
          Reponse3: "",
          ReponseCorrecte: 1,
          IdExamenQ: Number(IdExamen),
        }))
      );
    }
  }, [examen, IdExamen, nbQuestions]);

  // Gestion des inputs
  const handleChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await modifierQuestions(questions); // appel API update
      if (response.success) {
        // Mettre à jour le store des questions globales
        dispatch(updateQuestions(questions));

        // Mettre à jour l'examen correspondant avec ses questions
        dispatch(
          ajouterQuestionsExamen({
            IdExamen: Number(IdExamen),
            questions: questions,
          })
        );

         MyAlert({
            title: "Erreur",
            text:"Questions modifiées avec succès !",
            icon: "erreur",
          });
        navigate(`/instructor/aff-examen/${IdExamen}`);
      } else {
         MyAlert({
            title: "Erreur",
            text: `${response.message || "Impossible de modifier les questions."}`,
            icon: "erreur",
          });
        
      }
    } catch (error) {
      console.error(error);
        MyAlert({
            title: "Erreur",
            text:"Erreur lors de la modification des questions.",
            icon: "erreur",
          });
    }
  };

  if (!examen)
    return (
      <div className="container mt-4">
        <p className="text-muted">Examen introuvable.</p>
      </div>
    );

  return (
    <div className=" py-3">
      <PageTitle>Gestion des examens - Modifier les questions</PageTitle>
      <div className=" d-md-flex justify-content-between  align-items-md-center">
        <h5>{examen.DescriptionE}</h5>
        <div className="text-end">
          <MyButton
            classNm="py-2 mb-3"
            onClick={() => navigate("/instructor/gest-examens")}
          >
            Retour
          </MyButton>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {questions.map((q, idx) => (
          <Card
            key={q.IdQuestion || idx}
            className="mb-4 "
            title={`Question ${idx + 1}`}
            icon={<i className="bi bi-journal-text fs-4 me-3"></i>}
            content={
              <>
                <div key={q.IdQuestion || idx} className="mb-3">
                  <div className="mb-3">
                    <label className="form-label">Titre</label>
                    <input
                      type="text"
                      className="form-control"
                      value={q.TitreQuestion}
                      onChange={(e) =>
                        handleChange(idx, "TitreQuestion", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Réponse 1</label>
                    <input
                      type="text"
                      className="form-control"
                      value={q.Reponse1}
                      onChange={(e) =>
                        handleChange(idx, "Reponse1", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Réponse 2</label>
                    <input
                      type="text"
                      className="form-control"
                      value={q.Reponse2}
                      onChange={(e) =>
                        handleChange(idx, "Reponse2", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Réponse 3</label>
                    <input
                      type="text"
                      className="form-control"
                      value={q.Reponse3}
                      onChange={(e) =>
                        handleChange(idx, "Reponse3", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Réponse correcte</label>
                    <select
                      className="form-select"
                      value={q.ReponseCorrecte}
                      onChange={(e) =>
                        handleChange(
                          idx,
                          "ReponseCorrecte",
                          Number(e.target.value)
                        )
                      }
                    >
                      <option value={1}>Réponse 1</option>
                      <option value={2}>Réponse 2</option>
                      <option value={3}>Réponse 3</option>
                    </select>
                  </div>
                </div>
              </>
            }
          />
        ))}
        <MyButton typeNm="submit" classNm="mb-4">
          Modifier les questions
        </MyButton>
      </form>
    </div>
  );
};

export default ModifierQuestions;
