import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUsers } from "../../redux/userSlice";
import { selectInstructorModules } from "../../redux/instructorModuleSlice";
import { selectModules } from "../../redux/moduleSlice"; // si tu as un slice modules
import dayjs from "dayjs";
import PageTitle from "../../components/PageTitle";
import Card from "../../components/Card";

const AfficherInstructor = () => {
  const { idParams } = useParams(); // CinMembre
  const users = useSelector(selectUsers) || [];
  const instructorModules = useSelector(selectInstructorModules) || [];
  const modules = useSelector(selectModules) || [];

  const instructor = users.find(
    (u) => u.TypeMembre === "Instructor" && u.CinMembre === idParams
  );

  if (!instructor) return <p>Instructeur non trouvé.</p>;

  // Filtrer les modules assignés
  const assignedModuleIds = instructorModules
    .filter((im) => im.CinInstructor === idParams)
    .map((im) => Number(im.IdModule));

  const assignedModules = modules.filter((m) =>
    assignedModuleIds.includes(Number(m.IdModule))
  );

  return (
    <div className=" py-3">
      <PageTitle>Gestion des instructeurs </PageTitle>
      
 <Card
  className="mb-4"
  title="Informations de l’instructeur"
  icon={<i className="bi bi-person-lines-fill fs-4 me-3"></i>}
  content={<>
    <div className="p-3 mb-4">
        <div className="row">
          <div className="col-12 col-md-6">
            <p>
              <strong>CIN :</strong> {instructor.CinMembre}
            </p>
            <p>
              <strong>Nom :</strong> {instructor.Nom}
            </p>
            <p>
              <strong>Prénom :</strong> {instructor.Prenom}
            </p>
            <p>
              <strong>Date de naissance :</strong>
              {dayjs(instructor.DateNaissance).format("DD/MM/YYYY")}
            </p>
          </div>
          <div className="col-12 col-md-6">
            <p>
              <strong>Adresse :</strong> {instructor.Adresse}
            </p>
            <p>
              <strong>Email :</strong> {instructor.Email}
            </p>
            <p>
              <strong>Téléphone :</strong> {instructor.Tel}
            </p>
            <p>
              <strong>Approuvé :</strong> {instructor.ApprouveM}
            </p>
          </div>
        </div>
      </div>
   </>
  }
/> 
      <h5>Modules assignés</h5>

      {/* Desktop Table */}
      <table className="table table-bordered table-striped shadow-sm d-none d-md-table">
        <thead className="table-light">
          <tr>
            <th>Nom du module</th>
            <th>Description</th>
            <th>Niveau</th>
            <th>Filière</th>
          </tr>
        </thead>
        <tbody>
          {assignedModules.map((m, index) => (
            <tr key={m.IdModule}>
              <td>{m.NomModule}</td>
              <td>{m.DescriptionModule}</td>
              <td>{m.IdNiveau}</td>
              <td>{m.IdFiliere}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile Cards */}
      <div className="d-md-none">
        {assignedModules.map((m, index) => (
          <div key={m.IdModule} className="card mb-3 shadow-sm">
            <div className="card-body">
              <p>
                <strong>Nom du module:</strong> {m.NomModule}
              </p>
              <p>
                <strong>Description:</strong> {m.DescriptionModule}
              </p>
              <p>
                <strong>Niveau:</strong> {m.IdNiveau}
              </p>
              <p>
                <strong>Filière:</strong> {m.IdFiliere}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AfficherInstructor;
