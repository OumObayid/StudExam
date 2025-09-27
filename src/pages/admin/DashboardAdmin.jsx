import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectExamens } from "../../redux/examenSlice";
import { selectUsers } from "../../redux/userSlice"; 
import { Bar, Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import dayjs from "dayjs";
import { getResultats } from "../../services/resultats";
import PageTitle from "../../components/PageTitle";

// ⚡ Enregistrement des composants Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  ArcElement,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function DashboardAdmin() {
  const examens = useSelector(selectExamens);
  const users = useSelector(selectUsers);

  const [resultats, setResultats] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedFiliere, setSelectedFiliere] = useState("");
  const [selectedNiveau, setSelectedNiveau] = useState("");
  const [selectedModule, setSelectedModule] = useState("");

  const instructors = users.filter((u) => u.TypeMembre === "Instructor");
  const students = users.filter((u) => u.TypeMembre === "Student");

  useEffect(() => {
    async function fetchResultats() {
      try {
        const data = await getResultats({});
        if (data.success) setResultats(data.resultats);
        console.log("data.resultats :", data.resultats);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchResultats();
  }, []);

  if (loading) {
    return <p className="text-center mt-5">Chargement des statistiques...</p>;
  }

  // --- Filtrer les résultats selon la "classe" choisie
  const filteredResultats = resultats.filter(
    (r) =>
      (!selectedFiliere || r.IdFiliere === selectedFiliere) &&
      (!selectedNiveau || Number(r.IdNiveau) === Number(selectedNiveau)) &&
      (!selectedModule || Number(r.IdModule) === Number(selectedModule))
  );

  // 📌 Moyenne générale par classe
  const moyenneGenerale =
    filteredResultats.length > 0
      ? filteredResultats.reduce((s, r) => s + parseFloat(r.NoteSur20), 0) /
        filteredResultats.length
      : 0;

  // 📌 Répartition des mentions par classe
  const mentions = { Échec: 0, Passable: 0, "Assez Bien": 0, Bien: 0, "Très Bien": 0 };
  filteredResultats.forEach((r) => {
    const note = parseFloat(r.NoteSur20);
    if (note < 10) mentions["Échec"]++;
    else if (note < 12) mentions["Passable"]++;
    else if (note < 14) mentions["Assez Bien"]++;
    else if (note < 16) mentions["Bien"]++;
    else mentions["Très Bien"]++;
  });

  const dataMentions = {
    labels: Object.keys(mentions),
    datasets: [
      {
        label: "Répartition des mentions",
        data: Object.values(mentions),
        backgroundColor: ["#e74c3c", "#f39c12", "#f1c40f", "#3498db", "#2ecc71"],
      },
    ],
  };

  // 📌 Moyenne par module (uniquement ceux présents dans la classe sélectionnée)
  const moyenneParModule = filteredResultats.reduce((acc, r) => {
    if (!acc[r.NomModule]) acc[r.NomModule] = [];
    acc[r.NomModule].push(parseFloat(r.NoteSur20));
    return acc;
  }, {});

  const dataModules = {
    labels: Object.keys(moyenneParModule),
    datasets: [
      {
        label: "Moyenne par module",
        data: Object.values(moyenneParModule).map(
          (notes) => notes.reduce((a, b) => a + b, 0) / (notes.length || 1)
        ),
        backgroundColor: "#3498db",
      },
    ],
  };

  // 📌 Évolution des moyennes par date pour la classe sélectionnée
  const resultatsParDate = filteredResultats.reduce((acc, r) => {
    const date = dayjs(r.DateResultat).format("YYYY-MM-DD");
    if (!acc[date]) acc[date] = [];
    acc[date].push(parseFloat(r.NoteSur20));
    return acc;
  }, {});

  const dataDates = {
    labels: Object.keys(resultatsParDate),
    datasets: [
      {
        label: "Évolution des moyennes",
        data: Object.values(resultatsParDate).map(
          (notes) => notes.reduce((a, b) => a + b, 0) / (notes.length || 1)
        ),
        borderColor: "#2ecc71",
        tension: 0.3,
      },
    ],
  };

  return (
   
       <div className=" py-3">
            <PageTitle> Dashboard Admin</PageTitle>

      {/* --- Sélecteurs de classe */}
      <div className="row mb-3">
        <div className="col-md-4 mb-2">
          <select
            className="form-select"
            value={selectedFiliere}
            onChange={(e) => setSelectedFiliere(e.target.value)}
          >
            <option value="">Toutes les filières</option>
            {[...new Set(resultats.map((r) => r.IdFiliere))].map((id) => (
              <option key={id} value={id}>
                {resultats.find((r) => r.IdFiliere === id)?.NomFiliere || id}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-4 mb-2">
          <select
            className="form-select"
            value={selectedNiveau}
            onChange={(e) => setSelectedNiveau(e.target.value)}
          >
            <option value="">Tous les niveaux</option>
            {[...new Set(
              resultats
                .filter((r) => !selectedFiliere || r.IdFiliere === selectedFiliere)
                .map((r) => r.IdNiveau)
            )].map((id) => (
              <option key={id} value={id}>
                {resultats.find((r) => Number(r.IdNiveau) === Number(id))?.NomNiveau || id}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-4 mb-2">
          <select
            className="form-select"
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
          >
            <option value="">Tous les modules</option>
            {[...new Set(
              resultats
                .filter(
                  (r) =>
                    (!selectedFiliere || r.IdFiliere === selectedFiliere) &&
                    (!selectedNiveau || Number(r.IdNiveau) === Number(selectedNiveau))
                )
                .map((r) => r.IdModule)
            )].map((id) => (
              <option key={id} value={id}>
                {resultats.find((r) => Number(r.IdModule) === Number(id))?.NomModule || id}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 📌 Statistiques globales */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Examens</h5>
              <p className="card-text fs-4">{examens.length}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Instructeurs</h5>
              <p className="card-text fs-4">{instructors.length}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Étudiants</h5>
              <p className="card-text fs-4">{students.length}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Moyenne Générale</h5>
              <p className="card-text fs-4">{moyenneGenerale.toFixed(2)}/20</p>
            </div>
          </div>
        </div>
      </div>

      {/* 📌 Graphiques */}
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card p-3 shadow-sm">
            <Doughnut data={dataMentions} />
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="card p-3 shadow-sm">
            <Bar data={dataModules} />
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12 mb-4">
          <div className="card p-3 shadow-sm">
            <Line data={dataDates} />
          </div>
        </div>
      </div>
    </div>
  );
}
