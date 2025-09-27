import { useSelector, useDispatch } from "react-redux";
import { approveUser, deleteUser, selectUsers } from "../../redux/userSlice";
import { approuverUser, supprimerUser } from "../../services/users";
import { selectFilieres } from "../../redux/filiereSlice";
import { selectNiveaux } from "../../redux/niveauSlice";
import { useMemo, useState } from "react";
import MyButton from "../../components/button/MyButton";
import { useNavigate } from "react-router-dom";
import PageTitle from "../../components/PageTitle";
import Card from "../../components/Card";
import { MyConfirm } from "../../components/myconfirm/MyConfirm";
import { MyAlert } from "../../components/myconfirm/MyAlert";

export default function GestionStudent() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const users = useSelector(selectUsers) || [];
  const students = users.filter((u) => u.TypeMembre === "Student");

  const filieres = useSelector(selectFilieres) || [];
  const niveaux = useSelector(selectNiveaux) || [];

  const [selectedFiliere, setSelectedFiliere] = useState("");
  const [selectedNiveau, setSelectedNiveau] = useState("");
  const [selectedApprouve, setSelectedApprouve] = useState("");
  const [searchNom, setSearchNom] = useState("");

  // Students filtrés selon selects ou recherhce
  const filteredStudents = useMemo(
    () =>
      students.filter(
        (s) =>
          (!selectedFiliere || s.IdFiliere === selectedFiliere) &&
          (!selectedNiveau || Number(s.IdNiveau) === Number(selectedNiveau)) &&
          (!selectedApprouve || s.ApprouveM === selectedApprouve) &&
          (!searchNom ||
            s.CinMembre.toLowerCase().includes(searchNom.toLowerCase()) ||
            s.Nom.toLowerCase().includes(searchNom.toLowerCase()) ||
            s.Prenom.toLowerCase().includes(searchNom.toLowerCase()))
      ),
    [students, selectedFiliere, selectedNiveau]
  );
  const handleApprovalChange = async (cin, value) => {
    try {
      const response = await approuverUser(cin, value);
      if (response.success) {
        dispatch(approveUser({ CinMembre: cin, ApprouveM: value }));
      } else {
        console.log(response.message);
      }
    } catch (error) {
      console.error("Erreur d'approbation:", error);
      MyAlert({
        title: "Attention",
        text: "Impossible de mettre à jour l'approbation !",
        icon: "warning",
      });
    }
  };
  const handleDeleteUser = async (cin) => {
    MyConfirm({}).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await supprimerUser(cin);
          if (response.success) {
            dispatch(deleteUser(cin));
            console.log("Utilisateur supprimé avec succès !");
          } else {
            MyAlert({
              title: "Erreur",
              text: `${response.message || "Erreur lors de la suppression"}`,
              icon: "erreur",
            });
          }
        } catch (error) {
          console.error("Erreur suppression:", error);
          MyAlert({
            title: "erreur",
            text: "Impossible de supprimer l'utilisateur !",
            icon: "erreur",
          });
        }
      }
    });
  };

  return (
    <div className=" py-3">
      <PageTitle>Gestion des étudiants</PageTitle>

      <Card
        className="mb-4"
        title="Filtrer les étudiants"
        icon={<i className="bi bi-people fs-4 me-3"></i>}
        content={
          <>
            <div className="row">
              <div className="col-12 col-md-4">
                <select
                  className="form-select px-1 px-md-3"
                  value={selectedFiliere}
                  onChange={(e) => setSelectedFiliere(e.target.value)}
                >
                  <option value="">Toutes les filières</option>
                  {filieres.map((f) => (
                    <option key={f.IdFiliere} value={f.IdFiliere}>
                      {f.NomFiliere}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-12 col-md-4">
                <select
                  className="form-select px-1 px-md-3"
                  value={selectedNiveau}
                  onChange={(e) => setSelectedNiveau(e.target.value)}
                >
                  <option value="">Tous les niveaux</option>
                  {niveaux.map((n) => (
                    <option key={n.IdNiveau} value={n.IdNiveau}>
                      {n.NomNiveau}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-12 col-md-4">
                <select
                  value={selectedApprouve}
                  onChange={(e) => setSelectedApprouve(e.target.value)}
                  className="form-select form-select mb-3"
                >
                  <option value="">Tous les Approbations </option>
                  <option value="oui">Oui</option>
                  <option value="non">Non</option>
                </select>
              </div>
            </div>
            <div className="row d-md-flex justify-content-between align-items-center ">
              <div className="col-12 col-md-10">
                <input
                  type="text"
                  className="form-control px-1 px-md-3"
                  placeholder="Rechercher par cin/nom/prénom"
                  value={searchNom}
                  onChange={(e) => setSearchNom(e.target.value)}
                />
              </div>

              <div className="col-12 col-md-2 py-2    d-flex justify-content-end align-items-center">
                <MyButton
                  titleNm="Réinitialiser les filtres"
                  classNm="p-2 my-0"
                  styleNm={{ padding: "5px" }}
                  onClick={() => {
                    setSearchNom("");
                    setSelectedApprouve("");
                  }}
                >
                  🧹
                </MyButton>
              </div>
            </div>
          </>
        }
      />
      {filteredStudents.length === 0 ? (
        <p className="text-muted">Aucun étudiant trouvé.</p>
      ) : (
        <>
          <h5 className="text-center">
            {filteredStudents.length + " étudiant(es)"}
          </h5>
          {/* Version Desktop */}
          <div className="d-none d-md-block">
            <table
              style={{
                fontSize: "14px",
                borderTopLeftRadius: "10px",
                borderTopRightRadius: "10px",
                overflow: "hidden",
              }}
              className="table  table-bordered  table-hover table-striped shadow-sm mt-3"
            >
              <thead>
                <tr>
                  <th
                    style={{ backgroundColor: "var(--marron)", color: "white" }}
                  >
                    CIN
                  </th>
                  <th
                    style={{ backgroundColor: "var(--marron)", color: "white" }}
                  >
                    Nom
                  </th>
                  <th
                    style={{ backgroundColor: "var(--marron)", color: "white" }}
                  >
                    Prénom
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
                  <th
                    style={{ backgroundColor: "var(--marron)", color: "white" }}
                    width="14%"
                  >
                    Approuvé
                  </th>
                  <th
                    width="10%"
                    style={{ backgroundColor: "var(--marron)", color: "white" }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((i) => (
                  <tr key={i.CinMembre}>
                    <td>{i.CinMembre}</td>
                    <td>{i.Nom}</td>
                    <td>{i.Prenom}</td>
                    <td>{i.IdFiliere}</td>
                    <td>{i.NomNiveau}</td>
                    <td>
                      <select
                        value={i.ApprouveM}
                        onChange={(e) =>
                          handleApprovalChange(i.CinMembre, e.target.value)
                        }
                        className="form-select form-select-sm"
                      >
                        <option value="oui">Oui</option>
                        <option value="non">Non</option>
                      </select>
                    </td>
                    <td>
                      <div className="text-center d-flex justify-content-evenly align-items-center">
                        <MyButton
                          titleNm="Afficher l'instructeur"
                          onClick={() =>
                            navigate(`/admin/aff-stud/${i.CinMembre}`)
                          }
                          classNm="p-1"
                        >
                          👁️
                        </MyButton>

                        <MyButton
                          titleNm="Supprimer l'instructeur"
                          classNm="p-1"
                          styleNm={{ backgroundColor: "var(--danger)" }}
                          onClick={() => handleDeleteUser(i.CinMembre)}
                        >
                          🗑️
                        </MyButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Version Mobile */}
          <div style={{ fontSize: "14px" }} className="d-md-none">
            {filteredStudents.map((i) => (
              <div
                key={i.CinMembre + "-mobile"}
                className="card mb-3 shadow-sm"
              >
                <div className="card-body">
                  <p className="mb-1">
                    <strong>CIN:</strong> {i.CinMembre}
                  </p>
                  <p className="mb-1">
                    <strong>Nom:</strong> {i.Nom} {i.Prenom}
                  </p>
                  <p className="mb-1">
                    <strong>Filière:</strong> {i.NomFiliere}
                  </p>
                  <p className="mb-1">
                    <strong>Niveau:</strong> {i.NomNiveau}
                  </p>
                  <p className="mb-1 d-flex align-items-center mb-4">
                    <strong>Approuvé:</strong>
                    <select
                      value={i.ApprouveM}
                      onChange={(e) =>
                        handleApprovalChange(i.CinMembre, e.target.value)
                      }
                      className="form-select form-select-sm ms-2"
                    >
                      <option value="oui">Oui</option>
                      <option value="non">Non</option>
                    </select>
                  </p>
                  <div className="text-center d-flex justify-content-evenly align-items-center">
                    <MyButton
                      titleNm="Afficher l'instructeur"
                      onClick={() => navigate(`/admin/aff-stud/${i.CinMembre}`)}
                      classNm="p-1"
                    >
                      👁️
                    </MyButton>

                    <MyButton
                      titleNm="Supprimer l'instructeur"
                      classNm="p-1"
                      styleNm={{ backgroundColor: "var(--danger)" }}
                      onClick={() => handleDeleteUser(i.CinMembre)}
                    >
                      🗑️
                    </MyButton>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
