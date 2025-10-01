import PageTitle from "../../components/PageTitle";
import { useSelector } from "react-redux";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { selectExamens } from "../../redux/examenSlice";
import { selectInstructorModules } from "../../redux/instructorModuleSlice";
import { selectUserInfos } from "../../redux/authSlice";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function DashboardInstructor() {
  const user = useSelector(selectUserInfos);
  const examens = useSelector(selectExamens);
  const instructorModules = useSelector(selectInstructorModules);

  // Modules attribués à l’instructeur connecté
  const myModules = instructorModules?.filter(
    (m) => m.CinInstructor === user?.CinMembre
  );

  // Statistiques
  const totalExamens = examens?.length || 0;
  const totalQuestions = examens?.reduce(
    (acc, exam) => acc + (exam.questions?.length || 0),
    0
  );
  const totalModules = myModules?.length || 0;

  // Données pour le graphique : nombre de questions par examen
  const barData = {
    labels: examens.map((e) => e.NomExamen || `Examen ${e.IdExamen}`),
    datasets: [
      {
        label: "Nombre de questions",
        data: examens.map((e) => e.questions?.length || 0),
        backgroundColor: "rgba(0, 123, 255, 0.7)",
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Questions par examen" },
    },
    scales: {
      y: { beginAtZero: true, stepSize: 1 },
    },
  };

  return (
    <div className="py-3 container">
      <PageTitle>Dashboard Instructeur</PageTitle>

      {/* Statistiques rapides */}
      <div className="row text-center mt-4">
        <div className="col-md-4 mb-3">
          <div style={{backgroundColor:"var(--turquois)"}} className="card text-white h-100">
            <div className="card-body">
              <h5 className="card-title">Examens créés</h5>
              <p className="card-text display-5">{totalExamens}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div style={{backgroundColor:"var(--vert-olive)"}} className="card text-white  h-100">
            <div className="card-body">
              <h5 className="card-title">Questions totales</h5>
              <p className="card-text display-5">{totalQuestions}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div style={{backgroundColor:"var(--marron-clear)"}} className="card text-white  h-100">
            <div className="card-body">
              <h5 className="card-title">Modules attribués</h5>
              <p className="card-text display-5">{totalModules}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Graphique : questions par examen */}
      <div className="card mt-4">
        <div className="card-body">
          <Bar data={barData} options={barOptions} />
        </div>
      </div>

      {/* Liste des modules attribués */}
      <div className="mt-4">
        <h4>Mes Modules</h4>
        {myModules?.length > 0 ? (
          <div className="row">
            {myModules.map((mod) => (
              <div key={mod.IdModule} className="col-md-6 mb-3">
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">{mod.NomModule}</h5>
                    <p className="card-text">{mod.DescriptionModule}</p>
                    <p className="text-muted mb-0">
                      Filière : {mod.NomFiliere}
                    </p>
                    <p className="text-muted">Niveau : {mod.NomNiveau}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>Aucun module attribué.</p>
        )}
      </div>
    </div>
  );
}

