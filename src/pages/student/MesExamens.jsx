import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectUserExamens } from "../../redux/examenSlice";
import { useEffect } from "react";

export default function MesExamens() {
    const userExamens =
        useSelector(selectUserExamens).filter((exam) => exam.ScoreR == null) ||
        [];

    useEffect(() => {
        console.log("UserExams in store:", userExamens);
    }, [userExamens]);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Mes Examens</h1>

            {userExamens.length === 0 ? (
                <p>Aucun examen à afficher.</p>
            ) : (
                <div className="space-y-4">
                    {userExamens.map((examen) => (
                        <div
                            key={examen.IdExamen}
                            className="p-4 border rounded shadow-sm bg-white"
                        >
                            <h2 className="font-semibold text-lg mb-2">
                                {examen.DescriptionE}
                            </h2>

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
                                <strong>Durée :</strong> {examen.DurationE}{" "}
                                minute(s)
                            </p>
                            <p>
                                <strong>Date début :</strong>{" "}
                                {new Date(examen.DateDebutE).toLocaleDateString("fr-FR")}
                            </p>
                            <p>
                                <strong>Date fin :</strong>{" "}
                                {new Date(examen.DateFinE).toLocaleDateString(
                                    "fr-FR"
                                )}
                            </p>

                            {/* bouton passer examen */}
                            {examen.PublieE === "oui" && (
                                <Link
                                    to={`/etudiant/passer-examen/${examen.IdExamen}`}
                                    className="btn btn-primary mt-3"
                                >
                                    Passer l’examen
                                </Link>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
