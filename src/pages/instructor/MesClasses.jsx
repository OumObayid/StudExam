import { useState } from "react";
import { useSelector } from "react-redux";
import { selectUsers } from "../../redux/userSlice";
import PageTitle from "../../components/PageTitle";
import { selectInstructorModules } from "../../redux/instructorModuleSlice";
import { selectUserInfos } from "../../redux/authSlice";
import MyButton from "../../components/button/MyButton";
import Card from "../../components/Card";
export default function MesClasses() {
  const user = useSelector(selectUserInfos);
  const instructorModules = useSelector(selectInstructorModules);
  const allUsers = useSelector(selectUsers);

  // Modules attribués à l’instructeur connecté
  const myModules = instructorModules?.filter(
    (m) => m.CinInstructor === user?.CinMembre
  );

  // Extraire les filières uniques et niveaux uniques
  const filieres = Array.from(new Set(myModules?.map((m) => m.NomFiliere)));
  const niveaux = Array.from(new Set(myModules?.map((m) => m.NomNiveau)));

  const [selectedFiliere, setSelectedFiliere] = useState("");
  const [selectedNiveau, setSelectedNiveau] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Tous les étudiants
  const students = allUsers?.filter((u) => u.TypeMembre === "Student");

  // Étudiants filtrés
  const filteredStudents = students.filter((s) => {
    const moduleInfo = myModules.find((m) => m.IdFiliere === s.IdFiliere);
    if (!moduleInfo) return false;

    const matchFiliere = selectedFiliere
      ? moduleInfo.NomFiliere === selectedFiliere
      : true;
    const matchNiveau = selectedNiveau
      ? moduleInfo.NomNiveau === selectedNiveau
      : true;
    const matchSearch = searchTerm
      ? `${s.Nom} ${s.Prenom} ${s.CinMembre}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      : true;

    return matchFiliere && matchNiveau && matchSearch;
  });

  const handleReset = () => {
    setSelectedFiliere("");
    setSelectedNiveau("");
    setSearchTerm("");
  };

  return (
    <div className="py-3 container">
      <PageTitle>Mes Classes</PageTitle>

      <Card
        className=""
        title="Filtrer les étudiants"
        icon={<i className="bi bi-person-fill fs-4 me-3"></i>} // icône à gauche du titre
        content={
          <>
            <div className="row mb-3 g-2">
              <div className="col-md-6">
                <select
                  className="form-select"
                  value={selectedFiliere}
                  onChange={(e) => setSelectedFiliere(e.target.value)}
                >
                  <option value="">Toutes les filières</option>
                  {filieres.map((filiere, idx) => (
                    <option key={idx} value={filiere}>
                      {filiere}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <select
                  className="form-select"
                  value={selectedNiveau}
                  onChange={(e) => setSelectedNiveau(e.target.value)}
                >
                  <option value="">Tous les niveaux</option>
                  {niveaux.map((niv, idx) => (
                    <option key={idx} value={niv}>
                      {niv}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="row d-md-flex mb-3 g-2">
              <div className="col-md-8">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Rechercher par Nom, Prénom ou CIN"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="col-md-4 d-flex justify-content-end align-items-center">
                <MyButton
                  titleNm="Réinitialiser les filtres"
                  classNm="p-2"
                  onClick={handleReset}
                >
                  🧹
                </MyButton>
              </div>
            </div>
          </>
        }
      />

      <p className="text-center mt-5">
        <strong>Total étudiants : </strong> {filteredStudents.length}
      </p>

      {filteredStudents.length > 0 ? (
        <>
          {/* Table pour desktop */}
          <div className="table-responsive d-none d-md-block mt-3">
            <table
              className="table table-bordered table-hover table-striped shadow-sm "
               style={{
                fontSize: "14px",
                borderTopLeftRadius: "10px",
                borderTopRightRadius: "10px",
                                overflow: "hidden",

              }}
            >
              <thead>
                <tr>
                  <th
                    style={{ backgroundColor: "var(--marron)", color: "white" }}
                  >
                    #
                  </th>
                  <th
                    style={{ backgroundColor: "var(--marron)", color: "white" }}
                  >
                    Nom complet
                  </th>
                  <th
                    style={{ backgroundColor: "var(--marron)", color: "white" }}
                  >
                    CIN
                  </th>
                  <th
                    style={{ backgroundColor: "var(--marron)", color: "white" }}
                  >
                    Email
                  </th>
                  <th
                    style={{ backgroundColor: "var(--marron)", color: "white" }}
                  >
                    Filière
                  </th>
                  <th
                    style={{ backgroundColor: "var(--marron)", color: "white" }}
                  >
                    Niveau
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((s, idx) => {
                  const moduleInfo = myModules.find(
                    (m) => m.IdFiliere === s.IdFiliere
                  );
                  return (
                    <tr key={s.CinMembre}>
                      <td>{idx + 1}</td>
                      <td>
                        {s.Nom} {s.Prenom}
                      </td>
                      <td>{s.CinMembre}</td>
                      <td>{s.Email}</td>
                      <td>{moduleInfo?.NomFiliere || "-"}</td>
                      <td>{moduleInfo?.NomNiveau || "-"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Cards pour mobile */}
          <div className="d-block d-md-none mt-3">
            {filteredStudents.map((s, idx) => {
              const moduleInfo = myModules.find(
                (m) => m.IdFiliere === s.IdFiliere
              );
              return (
                <div key={s.CinMembre} className="card mb-2 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">
                      {s.Nom} {s.Prenom}
                    </h5>
                    <p className="card-text">
                      <strong>#:</strong> {idx + 1}
                    </p>
                    <p className="card-text">
                      <strong>CIN:</strong> {s.CinMembre}
                    </p>
                    <p className="card-text">
                      <strong>Email:</strong> {s.Email}
                    </p>
                    <p className="card-text">
                      <strong>Filière:</strong> {moduleInfo?.NomFiliere || "-"}
                    </p>
                    <p className="card-text">
                      <strong>Niveau:</strong> {moduleInfo?.NomNiveau || "-"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <p className="text-muted">Aucun étudiant à afficher.</p>
      )}
    </div>
  );
}
