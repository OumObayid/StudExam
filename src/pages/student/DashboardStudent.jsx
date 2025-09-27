import { useSelector } from "react-redux";
import { selectUserExamens } from "../../redux/examenSlice";
import { useEffect, useMemo } from "react";
import PageTitle from "../../components/PageTitle";
import { useOutletContext } from "react-router-dom";
import Card from "../../components/Card";

const DashboardStudent = () => {
  const allUserExamens = useSelector(selectUserExamens) || [];
  //contexe envoyé pqr le parent StudentLayout
  const { setExamNumber } = useOutletContext();
  // On filtre les examens encore disponibles
  const examensDisponibles = useMemo(() => {
    const now = new Date();
    return allUserExamens.filter((exam) => {
      const dateDebut = new Date(exam.DateDebutE);
      const dateFin = new Date(exam.DateFinE);
      return now >= dateDebut && now <= dateFin && exam.ScoreR === null;
    });
  }, [allUserExamens]);

  useEffect(() => {
    setExamNumber(examensDisponibles.length);
  }, [setExamNumber, examensDisponibles]);
  return (
    <div className=" py-3">
      <PageTitle>Dashboard</PageTitle>

      {examensDisponibles.length > 0 ? (
        <Card className="mb-4"
          title="Notification"
          icon={<i className="bi bi-bell fs-4 me-3"></i>}
          content={
            <div className="card-body">
              <strong>
                📢 Vous avez {examensDisponibles.length} examen(s) à passer :
              </strong>
              <ul>
                {examensDisponibles.map((exam) => (
                  <li key={exam.IdExamen}>
                    {exam.TitreE} (jusqu’au{" "}
                    {new Date(exam.DateFinE).toLocaleDateString("fr-FR")})
                  </li>
                ))}
              </ul>
            </div>
          }
        />
      ) : (
        <Card className="mb-4"
          title="Notification"
          icon={<i className="bi bi-bell fs-4 me-3"></i>}
          content={
            <p>
            Aucun examen en attente pour l’instant.
            </p>
          }
          bgColor="#f8f9fa"
        />
      )}
    </div>
  );
};

export default DashboardStudent;
