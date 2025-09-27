import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUsers } from "../../redux/userSlice";
import dayjs from "dayjs";
import PageTitle from "../../components/PageTitle";
import Card from "../../components/Card";

const AfficherStudent = () => {
  const { idParams } = useParams(); // CinMembre
  const users = useSelector(selectUsers) || [];

  const student = users.find(
    (u) => u.TypeMembre === "Student" && u.CinMembre === idParams
  );

  if (!student)
    return (
      <div className=" py-3">
        <PageTitle> Gestion des étudiants</PageTitle>
        <Card
        className="mb-4"
          title="Informations de l'étudiant"
          icon={<i className="bi bi-people fs-4 me-3"></i>}
          content={
            <>
              <p>Instructeur non trouvé.</p>
            </>
          }
        />
      </div>
    );

  return (
    <div className=" py-3">
      <PageTitle> Gestion des étudiants</PageTitle>

     <Card
        className="mb-4"
        title="Informations de l'étudiant"
        icon={<i className="bi bi-people fs-4 me-3"></i>}
        content={
          <>
            <div className="row">
              <div className="col-12 col-md-6">
                <p>
                  <strong>CIN :</strong> {student.CinMembre}
                </p>
                <p>
                  <strong>Nom :</strong> {student.Nom}
                </p>
                <p>
                  <strong>Prénom :</strong> {student.Prenom}
                </p>
                <p>
                  <strong>Date de naissance :</strong>
                  {dayjs(student.DateNaissance).format("DD/MM/YYYY")}
                </p>{" "}
                <p>
                  <strong>Adresse :</strong> {student.Adresse}
                </p>
              </div>
              <div className="col-12 col-md-6">
                <p>
                  <strong>Email :</strong> {student.Email}
                </p>
                <p>
                  <strong>Téléphone :</strong> {student.Tel}
                </p>
                <p>
                  <strong>Filière :</strong> {student.NomFiliere}
                </p>
                <p>
                  <strong>Filière :</strong> {student.NomNiveau}
                </p>
                <p>
                  <strong>Approuvé :</strong> {student.ApprouveM}
                </p>
              </div>
            </div>
          </>
        }
      />
    </div>
  );
};

export default AfficherStudent;
