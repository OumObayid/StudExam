import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectExamens, selectUserExamens } from "../../redux/examenSlice";
import { getMoyenneClasse } from "../../services/resultats";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import PageTitle from "../../components/PageTitle";
import Card from "../../components/Card";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const MesResultats = () => {
  const examens = useSelector(selectExamens);
  const allUserExamens = useSelector(selectUserExamens);
  const allUserExamensPassed = allUserExamens.filter((e) => e.ScoreR !== null);
  const [moyennesClasse, setMoyennesClasse] = useState({});

  // Charger les moyennes de la classe
  useEffect(() => {
    allUserExamensPassed.forEach(async (userExamen) => {
      try {
        const resp = await getMoyenneClasse(userExamen.IdExamen);
        if (resp.success) {
          setMoyennesClasse((prev) => ({
            ...prev,
            [userExamen.IdExamen]: resp.MoyenneClasse,
          }));
        }
      } catch (error) {
        console.error("Erreur récupération moyenne classe:", error);
      }
    });
  }, [allUserExamensPassed]);

  // ==== Préparation graphique ====
  const labels = allUserExamensPassed.map(
    (userExamen) =>
      examens.find((e) => e.IdExamen === userExamen.IdExamen)?.DescriptionModule
  );

  const scoresEtudiant = allUserExamensPassed.map((userExamen) => {
    const exam = examens.find((e) => e.IdExamen === userExamen.IdExamen);

    if (!exam) return 0;
    const noteTotale = exam.NbrQuestionsE * exam.NotePourQuestion;
    return noteTotale > 0 ? (userExamen.ScoreR / noteTotale) * 20 : 0;
  });

  const scoresClasse = allUserExamensPassed.map((userExamen) => {
    const exam = examens.find((e) => e.IdExamen === userExamen.IdExamen);
    if (!exam) return 0;
    const moyenne = moyennesClasse[userExamen.IdExamen] || 0;
    const noteTotale = exam.NbrQuestionsE * exam.NotePourQuestion;
    return noteTotale > 0 ? (moyenne / noteTotale) * 20 : 0;
  });

  const data = {
    labels,
    datasets: [
      {
        label: "Votre Score (sur 20)",
        data: scoresEtudiant,
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        tension: 0.4,
      },
      {
        label: "Moyenne de la classe (sur 20)",
        data: scoresClasse,
        borderColor: "rgba(255,99,132,1)",
        backgroundColor: "rgba(255,99,132,0.2)",
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Progression des scores sur 20" },
    },
    scales: {
      y: { beginAtZero: true, max: 20 },
    },
  };

  // ==== Préparation contenu principal ====
  let content;
  if (allUserExamensPassed.length === 0) {
    content = (
      <Card
        className="mb-4"
        title="Examens à passer"
        icon={<i className="bi bi-journal-text fs-4 me-3"></i>}
        content={<p>Aucune note pour l'instant</p>}
      />
    );
  } else {
    content = (
      <>
        <div className="d-md-flex justify-content-evenly">
          {allUserExamensPassed.map((userExamen) => {
            const exam = examens.find(
              (e) => e.IdExamen === userExamen.IdExamen
            );
            if (!exam) return null;

            const noteTotale = exam.NbrQuestionsE * exam.NotePourQuestion;
            const noteObtenue = userExamen.ScoreR || 0;
            const moyenneSur20 =
              noteTotale > 0 ? (noteObtenue / noteTotale) * 20 : 0;

            let mention = "";
            if (moyenneSur20 < 10) mention = "Échoué";
            else if (moyenneSur20 < 12) mention = "Passable";
            else if (moyenneSur20 < 14) mention = "Assez bien";
            else if (moyenneSur20 < 16) mention = "Bien";
            else mention = "Très bien";

            const moyenneClasseBrute =
              moyennesClasse[userExamen.IdExamen] ?? null;
            const moyenneClasseSur20 =
              moyenneClasseBrute && noteTotale > 0
                ? (moyenneClasseBrute / noteTotale) * 20
                : null;

            return (
              <div className="mb-5" key={exam.IdExamen}>
                <Card
                  className="mb-4"
                  title={`${exam.NomModule} – ${exam.DescriptionModule}`}
                  icon={<i className="bi bi-journal-text fs-4 me-3"></i>}
                  content={
                    <>
                      <strong>Note totale de l’examen :</strong>{" "}
                      <span style={{ color: "var(--danger)" }}>
                        {noteTotale}
                      </span>
                      <br />
                      <strong>Note obtenue :</strong>{" "}
                      <span style={{ color: "var(--danger)" }}>
                        {noteObtenue}
                      </span>
                      <br />
                      <strong>Moyenne sur 20 :</strong>{" "}
                      <span style={{ color: "var(--danger)" }}>
                        {moyenneSur20.toFixed(2)}
                      </span>
                      <br />
                      <strong>Moyenne de la classe sur 20 :</strong>{" "}
                      <span style={{ color: "var(--danger)" }}>
                        {moyenneClasseSur20
                          ? moyenneClasseSur20.toFixed(2)
                          : "N/A"}
                      </span>
                      <br />
                      <strong>Mention :</strong>{" "}
                      <span style={{ color: "var(--danger)" }}>{mention}</span>
                    </>
                  }
                />{" "}
              </div>
            );
          })}
        </div>
        <Line data={data} options={options} />
      </>
    );
  }

  // ==== Retour unique ====
  return (
    <div className="py-3">
      <PageTitle>Mes résultats</PageTitle>
      {content}
    </div>
  );
};

export default MesResultats;
