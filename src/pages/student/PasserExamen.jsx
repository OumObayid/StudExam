import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { submitExamenResult } from "../../services/examens";
import { useSelector, useDispatch } from "react-redux";
import { selectUserInfos } from "../../redux/authSlice";
import { selectExamens, updateUserExamenScore } from "../../redux/examenSlice";
import { ouvrirPassation } from "../../services/passations";
import MyButton from "../../components/button/MyButton";
import PageTitle from "../../components/PageTitle";
import { MyAlert } from "../../components/myconfirm/MyAlert";

export default function PasserExamen() {
  const dispatch = useDispatch();
  const { IdExamen } = useParams();

  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [passationOk, setPassationOk] = useState(false);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);

  const userInfos = useSelector(selectUserInfos);
  const examens = useSelector(selectExamens) || [];

  const examen = examens.find(
    (e) =>
      e.IdExamen === Number(IdExamen) &&
      e.IdFiliere === userInfos.IdFiliere &&
      e.IdNiveau === userInfos.IdNiveau
  );

  // ⚡ Ouvrir passation
  useEffect(() => {
    const initPassation = async () => {
      if (!examen) return;
      try {
        const response = await ouvrirPassation(
          examen.IdExamen,
          userInfos.CinMembre,
          examen.questions
        );
        if (response.success) {
          setPassationOk(true);
          if (examen?.DurationE) {
            setTimeLeft(examen.DurationE * 60); // min → sec
          }
        } else {
          MyAlert({
            title: "Erreur",
            text: `${response.message || "Impossible d’ouvrir la passation"}`,
            icon: "erreur",
          });
          setPassationOk(false);
        }
      } catch (err) {
        console.error(err);
         MyAlert({
            title: "Erreur",
            text:"Erreur lors de l’ouverture de la passation",
            icon: "erreur",
          });
      } finally {
        setLoading(false);
      }
    };
    initPassation();
  }, [examen, userInfos]);

  // Timer
  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft <= 0) {
      handleValidateExamen();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleChange = (idQuestion, value) => {
    setAnswers((prev) => ({
      ...prev,
      [idQuestion]: parseInt(value),
    }));
  };

  const handleValidateExamen = async () => {
    if (!examen?.questions?.length) return;

    const reponses = [];
    let scoreTotal = 0;

    examen.questions.forEach((q) => {
      const reponseEtudiant = answers[q.IdQuestion] ?? null;
      const estCorrecte = reponseEtudiant === q.ReponseCorrecte ? 1 : 0;
      if (estCorrecte) scoreTotal += examen.NotePourQuestion;

      reponses.push({
        IdExamenP: examen.IdExamen,
        IdQuestionP: q.IdQuestion,
        CinMembreP: userInfos.CinMembre,
        ReponseP: reponseEtudiant,
        EstCorrecte: reponseEtudiant !== null ? estCorrecte : null,
      });
    });

    const payload = {
      IdExamen: examen.IdExamen,
      CinMembre: userInfos.CinMembre,
      Score: scoreTotal,
      Reponses: reponses,
    };

    try {
      const response = await submitExamenResult(payload);
      if (response.success) {
         MyAlert({
            title: "Information",
            text:`Examen terminé ! Score obtenu : ${scoreTotal}`,
            icon: "info",
          });
        setScore(scoreTotal);
        dispatch(
          updateUserExamenScore({
            IdExamen: examen.IdExamen,
            ScoreR: scoreTotal,
          })
        );
      } else {
         MyAlert({
            title: "Erreur",
            text: `${response.message || "Erreur lors de la soumission."}`,
            icon: "erreur",
          });
      }
    } catch (error) {
      console.error(error);
      MyAlert({
            title: "Information",
            text:"Erreur lors de l’envoi du score.",
            icon: "info",
          });
    }
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(
      2,
      "0"
    )}:${String(s).padStart(2, "0")}`;
  };

  return (
    <div className=" py-3">
      <PageTitle>Passer Examen</PageTitle>
      {/* Chargement */}
      {loading && <p>Chargement...</p>}

      {/* Aucun examen trouvé */}
      {!loading && !examen && (
        <p className="alert alert-warning">Aucun examen trouvé.</p>
      )}

      {/* Accès refusé */}
      {!loading && examen && !passationOk && (
        <p className="alert alert-danger">Accès refusé à cet examen.</p>
      )}

      {/* Score affiché */}
      {!loading && examen && passationOk && score !== null && (
        <div className="alert alert-info">
          <h4 className="alert-heading">Examen passé</h4>
          <p>
            Vous avez terminé cet examen. <br />
            <strong>Score obtenu :</strong> {score}
          </p>
        </div>
      )}

      {/* Passation examen */}
      {!loading && examen && passationOk && score === null && (
        <>
          {/* Timer */}
          {timeLeft !== null && (
            <div className="alert alert-warning text-center fs-2 fw-bold">
              Temps restant : {formatTime(timeLeft)}
            </div>
          )}

          {/* En-tête examen */}
          <div className="mb-4 p-4 border rounded shadow-sm bg-light">
            <h1 className="h3 mb-3">{examen.DescriptionE}</h1>
            <p>
              <strong>Module :</strong> {examen.NomModule} <br />
              <strong>Filière :</strong> {examen.NomFiliere} <br />
              <strong>Niveau :</strong> {examen.NomNiveau} <br />
              <strong>Nombre de questions :</strong> {examen.NbrQuestionsE}{" "}
              <br />
              <strong>Note par question :</strong> {examen.NotePourQuestion}{" "}
              <br />
              <strong>Durée :</strong> {examen.DurationE} minutes
            </p>
          </div>

          {/* Questions */}
          <div className="list-group">
            {examen.questions?.map((q, idx) => (
              <div key={q.IdQuestion} className="list-group-item mb-3">
                <h5>
                  {idx + 1}. {q.TitreQuestion}
                </h5>
                {[1, 2, 3].map((num) => (
                  <div className="form-check" key={num}>
                    <input
                      type="radio"
                      name={`q${q.IdQuestion}`}
                      className="form-check-input"
                      id={`q${q.IdQuestion}r${num}`}
                      value={num}
                      checked={answers[q.IdQuestion] === num}
                      onChange={(e) =>
                        handleChange(q.IdQuestion, e.target.value)
                      }
                    />
                    <label
                      className="form-check-label"
                      htmlFor={`q${q.IdQuestion}r${num}`}
                    >
                      {q[`Reponse${num}`]}
                    </label>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Bouton validation */}
          <MyButton
            classNm=" mt-3"
            onClick={handleValidateExamen}
            disabledNm={Object.keys(answers).length !== examen.questions.length}
          >
            Valider l'examen
          </MyButton>
        </>
      )}
    </div>
  );
}
