import React, { useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { approveUser, deleteUser, selectUsers } from "../../redux/userSlice";
import { approuverUser, supprimerUser } from "../../services/users";
import { selectInstructorModules } from "../../redux/instructorModuleSlice";
import { useNavigate } from "react-router-dom";
import MyButton from "../../components/button/MyButton";
import PageTitle from "../../components/PageTitle";
import Card from "../../components/Card";
import { MyConfirm } from "../../components/myconfirm/MyConfirm";
import { MyAlert } from "../../components/myconfirm/MyAlert";

export default function GestionInstructor() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const users = useSelector(selectUsers) || [];
  const instructorModules = useSelector(selectInstructorModules) || [];

  const instructors = users.filter((u) => u.TypeMembre === "Instructor");

  const [selectedApprouve, setSelectedApprouve] = useState("");
  const [searchNom, setSearchNom] = useState("");

  // Instructors filtrés
  const filteredInstructors = useMemo(
    () =>
      instructors.filter(
        (i) =>
          (!selectedApprouve || i.ApprouveM === selectedApprouve) &&
          (!searchNom ||
            i.CinMembre.toLowerCase().includes(searchNom.toLowerCase()) ||
            i.Nom.toLowerCase().includes(searchNom.toLowerCase()) ||
            i.Prenom.toLowerCase().includes(searchNom.toLowerCase()))
      ),
    [instructors, searchNom, selectedApprouve]
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
        title: "Erreur",
        text: "Impossible de mettre à jour l'approbation !",
        icon: "error",
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
              text: `${response.message} || "Impossible de supprimer l'utilisateur !"`,
              icon: "error",
            });
          }
        } catch (error) {
          console.error("Erreur suppression :", error);
          MyAlert({
            title: "Erreur",
            text: "Erreur lors de la suppression !",
            icon: "error",
          });
        }
      }
    });
  };

  return (
    <div className=" py-3">
      <PageTitle>Gestion des Instructeurs</PageTitle>

      <Card
        className="mb-4"
        title="Filtrer les instructeurs"
        icon={<i className="bi bi-person-lines-fill fs-4 me-3"></i>}
        content={
          <>
            <div className="row d-flex justify-content-center align-items-center">
              <div className="col-12 col-md-5 mb-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Rechercher (par CIN - Nom - Prénom)"
                  value={searchNom}
                  onChange={(e) => setSearchNom(e.target.value)}
                />
              </div>
              <div className="col-12 col-md-5 mb-2">
                <select
                  value={selectedApprouve}
                  onChange={(e) => setSelectedApprouve(e.target.value)}
                  className="form-select"
                >
                  <option value="">Tous les Approbations</option>
                  <option value="oui">Oui</option>
                  <option value="non">Non</option>
                </select>
              </div>
              <div className="col-12 col-md-2  my-2 mt-md-0 d-flex justify-content-end align-items-center">
                <MyButton
                  titleNm="Réinitialiser les filtres"
                  classNm="p-2"
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
      {filteredInstructors.length === 0 ? (
        <p className="text-muted">Aucun instructeur trouvé.</p>
      ) : (
        <>
          <h5 className="text-center">
            {filteredInstructors.length + " instructeur(s)"}
          </h5>
          <div className="d-none d-md-block">
            {/* Desktop Table */}
            <table
              style={{
                fontSize: "14px",
                borderTopLeftRadius: "10px",
                borderTopRightRadius: "10px",
                overflow: "hidden",
              }}
              className=" table  table-bordered  table-hover table-striped shadow-sm mt-3"
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
                    Modules assignés
                  </th>
                  <th
                    style={{ backgroundColor: "var(--marron)", color: "white" }}
                  >
                    Approuvé
                  </th>
                  <th
                    style={{ backgroundColor: "var(--marron)", color: "white" }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredInstructors.map((i) => {
                  const modules = instructorModules
                    .filter((m) => m.CinInstructor === i.CinMembre)
                    .map((m) => `Module ${m.IdModule}`)
                    .join(", ");

                  return (
                    <tr key={i.CinMembre}>
                      <td>{i.CinMembre}</td>
                      <td>{i.Nom}</td>
                      <td>{i.Prenom}</td>
                      <td>{modules || "-"}</td>
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
                      <td className="text-center d-flex justify-content-evenly">
                        <MyButton
                          titleNm="Afficher l'instructeur"
                          onClick={() =>
                            navigate(`/admin/aff-instr/${i.CinMembre}`)
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
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {/* Mobile Cards */}
          <div className="d-md-none">
            {filteredInstructors.map((i) => {
              const modules = instructorModules
                .filter((m) => m.CinInstructor === i.CinMembre)
                .map((m) => `Module ${m.IdModule}`)
                .join(", ");

              return (
                <div key={i.CinMembre} className="card mb-3 shadow-sm">
                  <div className="card-body">
                    <p>
                      <strong>CIN:</strong> {i.CinMembre}
                    </p>
                    <p>
                      <strong>Nom:</strong> {i.Nom} {i.Prenom}
                    </p>
                    <p>
                      <strong>Modules assignés:</strong> {modules || "-"}
                    </p>
                    <p>
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
                    <div className="d-flex justify-content-between">
                      <MyButton
                        onClick={() =>
                          navigate(`/admin/aff-instr/${i.CinMembre}`)
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
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
