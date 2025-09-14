import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getExamenById, submitExamenResult } from "../../services/examens";
import { useSelector, useDispatch } from "react-redux";
import { selectUserInfos } from "../../redux/authSlice";
import { updateUserExamenScore } from "../../redux/examenSlice";

export default function PasserExamen() {
    const dispatch = useDispatch();
    const { idExamen } = useParams();
    const [examen, setExamen] = useState(null);
    const [loading, setLoading] = useState(true);
    const [score, setScore] = useState(null);
    const userInfos = useSelector(selectUserInfos);

    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(null); // secondes restantes

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await getExamenById(idExamen, userInfos.CinMembre);

                if (response.success) {
                    if (response.score === null) {
                        setExamen(response.examen || null);

                        // Initialiser le timer : DurationE est en heures -> convertir en secondes
                        if (response.examen?.DurationE) {
                            setTimeLeft(response.examen.DurationE  * 60);
                        }
                    } else {
                        setScore(response.score);
                    }
                } else {
                    console.error("Erreur chargement examen:", response.message);
                }
            } catch (error) {
                console.error("Erreur chargement examen:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [idExamen, userInfos.CinMembre]);

    // Timer qui décrémente chaque seconde
    useEffect(() => {
        if (timeLeft === null) return;
        if (timeLeft <= 0) {
            handleValidateExamen(); // auto-soumission
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    if (loading) return <p>Chargement...</p>;

    if (score !== null) {
        return (
            <div className="container mt-4">
                <div className="alert alert-info">
                    <h4 className="alert-heading">Examen passé</h4>
                    <p>
                        Vous avez terminé cet examen. <br />
                        <strong>Score obtenu :</strong> {score}
                    </p>
                </div>
            </div>
        );
    }

    if (!examen) {
        return <p>Aucun examen trouvé.</p>;
    }

    const handleChange = (idQuestion, value) => {
        setAnswers((prev) => ({
            ...prev,
            [idQuestion]: parseInt(value),
        }));
    };

    const handleValidateExamen = async () => {
        let scoreTotal = 0;

        examen.Questions.forEach((q) => {
            const reponseEtudiant = answers[q.IdQuestionP];
            if (parseInt(reponseEtudiant) === q.ReponseCorrecte) {
                scoreTotal += examen.NotePourQuestion;
            }
        });

        try {
            const response = await submitExamenResult(
                userInfos.CinMembre,
                idExamen,
                scoreTotal
            );

            if (response.success) {
                alert(`Examen terminé ! Score obtenu : ${scoreTotal}`);
                setScore(scoreTotal);
                dispatch(updateUserExamenScore({ IdExamen: idExamen, ScoreR: scoreTotal }));
            } else {
                alert("Erreur lors de la soumission du score.");
            }
        } catch (error) {
            alert("Erreur lors de l'envoi du score.");
        }
    };

    // Fonction formatage en HH:MM:SS
    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    };

    return (
        <div className="container mt-4">
            {/* Timer visible */}
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
                    <strong>Nombre de questions :</strong> {examen.NbrQuestionsE} <br />
                    <strong>Note par question :</strong> {examen.NotePourQuestion} <br />
                    <strong>Durée :</strong> {examen.DurationE} heures
                </p>
            </div>

            {/* Questions */}
            <div className="list-group">
                {examen.Questions.map((q, idx) => (
                    <div key={q.IdQuestionP} className="list-group-item mb-3">
                        <h5>{idx + 1}. {q.TitreQuestion}</h5>
                        {[1, 2, 3].map((num) => (
                            <div className="form-check" key={num}>
                                <input
                                    type="radio"
                                    name={`q${q.IdQuestionP}`}
                                    className="form-check-input"
                                    id={`q${q.IdQuestionP}r${num}`}
                                    value={num}
                                    checked={answers[q.IdQuestionP] === num}
                                    onChange={(e) => handleChange(q.IdQuestionP, e.target.value)}
                                />
                                <label className="form-check-label" htmlFor={`q${q.IdQuestionP}r${num}`}>
                                    {q[`Reponse${num}`]}
                                </label>
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            {/* Bouton validation */}
            <button
                className="btn btn-success mt-3"
                onClick={handleValidateExamen}
                disabled={Object.keys(answers).length !== examen.Questions.length}
            >
                Valider l'examen
            </button>
        </div>
    );
}
