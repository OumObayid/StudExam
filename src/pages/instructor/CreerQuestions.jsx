import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { ajouterQuestionsExamen, selectExamens } from "../../redux/examenSlice";
import { ajouterQuestions } from "../../services/questions";
import { addQuestions } from "../../redux/questionSlice";
import MyButton from "../../components/button/MyButton";
import PageTitle from "../../components/PageTitle";
import Card from "../../components/Card";
import { MyAlert } from "../../components/myconfirm/MyAlert";

const CreerQuestions = () => {
  const { IdExamen } = useParams(); // IdExamen
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Récupération de l'examen
  const examens = useSelector(selectExamens) || [];
  const examen = examens.find((e) => Number(e.IdExamen) === Number(IdExamen));
  const nbQuestions = examen?.NbrQuestionsE || 0;

  useEffect(() => {
    console.log("examens :", examens);
  }, [examens]);

  // Initialiser le formulaire avec un tableau de questions vide
  const [questions, setQuestions] = useState(
    Array.from({ length: nbQuestions }, () => ({
      TitreQuestion: "",
      Reponse1: "",
      Reponse2: "",
      Reponse3: "",
      ReponseCorrecte: 1,
      IdExamenQ: Number(IdExamen),
    }))
  );

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
      const response = await ajouterQuestions(questions);
      if (response.success) {
        // Ajouter au store
        // Ajouter au store des questions globales
        dispatch(addQuestions(questions));

        // Mettre à jour l'examen correspondant avec ses questions
        dispatch(
          ajouterQuestionsExamen({
            IdExamen: Number(IdExamen),
            questions: questions,
          })
        );
         MyAlert({
            title: "Success",
            text: "Questions ajoutées avec succès !",
            icon: "success",
          });
        navigate(`/instructor/aff-examen/${IdExamen}`);
      } else {
          MyAlert({
            title: "Erreur",
            text: `${response.message || "Impossible d'ajouter les questions."}`,
            icon: "erreur",
          });
      }
    } catch (error) {
      console.error(error);
       MyAlert({
        title: "Erreur",
        text: "Erreur lors de l'ajout des questions.",
        icon: "erreur",
      });
    }
  };

  if (!examen)
    return (
      <div className=" py-3">
        <PageTitle>Ajouter des questions</PageTitle>
        <p className="alert alert-warning text-muted">Examen introuvable.</p>
      </div>
    );

  return (
    <div className=" py-3">
      <PageTitle>Ajouter des questions</PageTitle>
      <div className=" d-md-flex justify-content-between align-items-center">
        <h5 className="mb-3">{examen.DescriptionE}</h5>
        <div className="text-end">
        <MyButton
          classNm="py-2 mb-3"
          onClick={() => navigate("/instructor/gest-examens")}
        >
          Retour
        </MyButton></div>
      </div>
      <form onSubmit={handleSubmit}>
        {questions.map((q, idx) => (
          <Card
            className="mb-4"
            title={`Question ${idx + 1}`}
            icon={<i className="bi bi-journal-text fs-4 me-3"></i>}
            content={
              <>
                <div className="mb-2">
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
                <div className="mb-2">
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
                <div className="mb-2">
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
                <div className="mb-2">
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
                <div className="mb-2">
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
              </>
            }
          />
        ))}
        <MyButton typeNm="submit" className="">
          Ajouter les questions
        </MyButton>
      </form>
    </div>
  );
};

export default CreerQuestions;
