import { useDispatch, useSelector } from "react-redux";
import {
  deleteExamen,
  deleteQuestionsExamen,
  selectExamens,
} from "../../redux/examenSlice";
import { selectUserInfos } from "../../redux/authSlice";
import { useNavigate } from "react-router-dom";
import { selectFilieres } from "../../redux/filiereSlice";
import { selectNiveaux } from "../../redux/niveauSlice";
import { selectModules } from "../../redux/moduleSlice";
import { supprimerExamen } from "../../services/examens";
import MyButton from "../../components/button/MyButton";
import { useState } from "react";
import PageTitle from "../../components/PageTitle";
import Card from "../../components/Card";
import { MyConfirm } from "../../components/myconfirm/MyConfirm";
import { supprimerQuestions } from "../../services/questions";
import { MyAlert } from "../../components/myconfirm/MyAlert";

export default function GestionExamens() {
  const userInfos = useSelector(selectUserInfos) || null;
  const examens = useSelector(selectExamens) || [];
  const myexamens = examens.filter(
    (e) => e.CreeParCinMembre === userInfos.CinMembre
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const filieres = useSelector(selectFilieres);
  const niveaux = useSelector(selectNiveaux);
  const modules = useSelector(selectModules);

  // Filtres
  const [search, setSearch] = useState("");
  const [filiere, setFiliere] = useState("");
  const [niveau, setNiveau] = useState("");
  const [module, setModule] = useState("");
  const [approuve, setApprouve] = useState("");
  const [publie, setPublie] = useState("");

  // Application des filtres
  const filteredExamens = myexamens.filter((ex) => {
    return (
      (search === "" ||
        ex.NomFiliere.toLowerCase().includes(search.toLowerCase()) ||
        ex.NomNiveau.toLowerCase().includes(search.toLowerCase()) ||
        ex.NomModule.toLowerCase().includes(search.toLowerCase())) &&
      (filiere === "" || ex.NomFiliere === filiere) &&
      (niveau === "" || ex.NomNiveau === niveau) &&
      (module === "" || ex.NomModule === module) &&
      (approuve === "" || ex.ApprouveE === approuve) &&
      (publie === "" || ex.PublieE === publie)
    );
  });

  const handleDeleteExamen = async (IdExamen) => {
    MyConfirm({}).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await supprimerExamen(IdExamen);
          if (response.success) {
            dispatch(deleteExamen(IdExamen));
            console.log("Examen supprimé avec succès !");
          } else {
            MyAlert({
              title: "Erreur",
              text: `${
                response.message || "Impossible de supprimer l'examen !"
              }`,
              icon: "erreur",
            });
          }
        } catch (error) {
          console.error("Erreur suppression :", error);
          MyAlert({
            title: "Erreur",
            text: "Erreur lors de la suppression !",
            icon: "erreur",
          });
        }
      }
    });
  };

  const handleDeleteQuestions = (IdExamen) => {
    MyConfirm({}).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await supprimerQuestions(IdExamen);
          if (response.success) {
            dispatch(deleteQuestionsExamen(IdExamen));
            console.log("Examen supprimé avec succès !");
          } else {
            MyAlert({
              title: "Erreur",
              text: `${
                response.message || "Impossible de supprimer l'examen !"
              }`,
              icon: "erreur",
            });
          }
        } catch (error) {
          console.error("Erreur suppression :", error);
           MyAlert({
            title: "Erreur",
            text: "Erreur lors de la suppression !",
            icon: "erreur",
          });
        }
      }
    });
  };

  return (
    <div className=" py-3">
      <PageTitle>Gestion des Examens</PageTitle>

      <Card
        className="mb-4"
        title="Ajouter un examen | Filtrer les examens "
        icon={<i className="bi bi-journal-text fs-4 me-3"></i>}
        content={
          <>
            <div className="d-flex justify-content-end ">
              <MyButton
                titleNm="Ajouter un examen"
                onClick={() => navigate("/instructor/creer-examen")}
                classNm="p-2"
              >
                ➕
              </MyButton>
            </div>

            {/* Zone Filtres */}
            <div className=" mt-3 ">
              <div className="row g-2">
                <div className="col-md-4">
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    className="form-control"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                <div className="col-md-4">
                  <select
                    className="form-select"
                    value={filiere}
                    onChange={(e) => setFiliere(e.target.value)}
                  >
                    <option value="">Toutes Filières</option>
                    {filieres.map((f) => (
                      <option key={f.IdFiliere} value={f.NomFiliere}>
                        {f.NomFiliere}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-4">
                  <select
                    className="form-select"
                    value={niveau}
                    onChange={(e) => setNiveau(e.target.value)}
                  >
                    <option value="">Tous Niveaux</option>
                    {niveaux.map((n) => (
                      <option key={n.IdNiveau} value={n.NomNiveau}>
                        {n.NomNiveau}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-4">
                  <select
                    className="form-select"
                    value={module}
                    onChange={(e) => setModule(e.target.value)}
                  >
                    <option value="">Tous Modules</option>
                    {modules.map((m) => (
                      <option key={m.IdModule} value={m.NomModule}>
                        {m.NomModule} - {m.DescriptionModule}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-4">
                  <select
                    className="form-select"
                    value={approuve}
                    onChange={(e) => setApprouve(e.target.value)}
                  >
                    <option value="">Tous Approuvés</option>
                    <option value="oui">Oui</option>
                    <option value="non">Non</option>
                  </select>
                </div>

                <div className="col-md-4">
                  <select
                    className="form-select"
                    value={publie}
                    onChange={(e) => setPublie(e.target.value)}
                  >
                    <option value="">Tous Publiés</option>
                    <option value="oui">Oui</option>
                    <option value="non">Non</option>
                  </select>
                </div>
              </div>
              <div className="d-flex justify-content-end">
                <MyButton
                  titleNm="Réinitialiser les filtres"
                  classNm="p-2 mt-3"
                  onClick={() => {
                    setSearch("");
                    setFiliere("");
                    setNiveau("");
                    setModule("");
                    setApprouve("");
                    setPublie("");
                  }}
                >
                  🧹
                </MyButton>
              </div>
            </div>
          </>
        }
      />
      {/* Liste filtrée */}
      <div className="mb-3">
        {filteredExamens.length === 0 ? (
          <p className="text-muted">Aucun examen trouvé.</p>
        ) : (
          <>
          <h5 className="text-center">{filteredExamens.length + " examen(s)"}</h5>
            {/* Desktop */}
            <table
              style={{
                fontSize: "14px",
                borderTopLeftRadius: "10px",
                borderTopRightRadius: "10px",
                overflow: "hidden",
              }}
              className="d-none d-md-block table  table-bordered  table-hover table-striped shadow-sm mt-3"
            >
              <thead>
                <tr>
                  <th
                    style={{ backgroundColor: "var(--marron)", color: "white" }}
                    width="3%"
                  >
                    Id
                  </th>
                  <th
                    style={{ backgroundColor: "var(--marron)", color: "white" }}
                    width="20%"
                  >
                    Filière
                  </th>
                  <th
                    style={{ backgroundColor: "var(--marron)", color: "white" }}
                    width="10%"
                  >
                    Niveau
                  </th>
                  <th
                    style={{ backgroundColor: "var(--marron)", color: "white" }}
                    width="14%"
                  >
                    Module
                  </th>
                  <th
                    style={{ backgroundColor: "var(--marron)", color: "white" }}
                    width="8%"
                  >
                    Approuvé
                  </th>
                  <th
                    style={{ backgroundColor: "var(--marron)", color: "white" }}
                    width="8%"
                  >
                    Publié
                  </th>
                  <th
                    style={{ backgroundColor: "var(--marron)", color: "white" }}
                    className="text-center"
                    width="15%"
                  >
                    Examen
                  </th>
                  <th
                    style={{ backgroundColor: "var(--marron)", color: "white" }}
                    className="text-center"
                    width="15%"
                  >
                    Questions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredExamens.map((ex) => (
                  <tr key={`desktop-${ex.IdExamen}`}>
                    <td>{ex.IdExamen}</td>
                    <td>{ex.NomFiliere}</td>
                    <td>{ex.NomNiveau}</td>
                    <td>
                      {ex.NomModule} - {ex.DescriptionModule}
                    </td>
                    <td>{ex.ApprouveE}</td>
                    <td>{ex.PublieE}</td>
                    {/* groupe examen */}
                    <td>
                      <div className="d-flex justify-content-center">
                        <MyButton
                          titleNm=" Voir l'examen"
                          styleNm={{ backgroundColor: "var(--marron-clear)" }}
                          classNm="p-1 me-1"
                          onClick={() =>
                            navigate(`/instructor/aff-examen/${ex.IdExamen}`)
                          }
                        >
                          👁️
                        </MyButton>
                        {ex.ApprouveE === "non" && (
                          <MyButton
                            titleNm="Modifier l'examen"
                            styleNm={{ backgroundColor: "var(--dore)" }}
                            classNm="p-1 me-3"
                            onClick={() =>
                              navigate(`/instructor/mod-examen/${ex.IdExamen}`)
                            }
                          >
                            <i
                              style={{ fontSize: "15px" }}
                              className="bi bi-pencil mx-1"
                            ></i>
                          </MyButton>
                        )}

                        {ex.ApprouveE === "non" && (
                          <MyButton
                            titleNm="Supprimer l'examen"
                            classNm="p-1"
                            styleNm={{ backgroundColor: "var(--danger)" }}
                            onClick={() => handleDeleteExamen(ex.IdExamen)}
                          >
                            🗑️
                          </MyButton>
                        )}
                      </div>
                    </td>
                    {/* groupe questions */}
                    <td>
                      <div className="d-flex justify-content-center">
                        {ex.ApprouveE === "non" &&
                          ex.questions?.length === 0 && (
                            <MyButton
                              titleNm="Ajouter des questions"
                              styleNm={{ backgroundColor: "var(--gris)" }}
                              classNm="p-1 me-1"
                              onClick={() =>
                                navigate(
                                  `/instructor/creer-questions/${ex.IdExamen}`
                                )
                              }
                            >
                              ➕
                            </MyButton>
                          )}
                        {ex.questions?.length !== 0 && (
                          <MyButton
                            titleNm="Voir les questions"
                            styleNm={{ backgroundColor: "var(--marron-clear)" }}
                            classNm="p-1 me-1 "
                            onClick={() =>
                              navigate(
                                `/instructor/aff-questions/${ex.IdExamen}`
                              )
                            }
                          >
                            👁️
                          </MyButton>
                        )}
                        {ex.ApprouveE === "non" &&
                          ex.questions?.length !== 0 && (
                            <>
                              <MyButton
                                titleNm="Modifier les questions"
                                styleNm={{ backgroundColor: "var(--dore)" }}
                                classNm="p-1 me-3"
                                onClick={() =>
                                  navigate(
                                    `/instructor/mod-questions/${ex.IdExamen}`
                                  )
                                }
                              >
                                <i
                                  style={{ fontSize: "15px" }}
                                  className="bi bi-pencil mx-1"
                                ></i>
                              </MyButton>

                              <MyButton
                                titleNm="Supprimer les questions"
                                styleNm={{ backgroundColor: "var(--danger)" }}
                                classNm="p-1"
                                onClick={() =>
                                  handleDeleteQuestions(ex.IdExamen)
                                }
                              >
                                🗑️
                              </MyButton>
                            </>
                          )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile */}
            <div className="d-md-none">
              {filteredExamens.map((ex) => (
                <div
                  key={`mobile-${ex.IdExamen}`}
                  className="card mb-3 shadow-sm"
                >
                  <div className="card-body">
                    <p className="mb-1">
                      <strong>IdExamen:</strong> {ex.IdExamen}
                    </p>
                    <p className="mb-1">
                      <strong>Filière:</strong> {ex.NomFiliere}
                    </p>
                    <p className="mb-1">
                      <strong>Niveau:</strong> {ex.NomNiveau}
                    </p>
                    <p className="mb-1">
                      <strong>Module:</strong> {ex.DescriptionModule}
                    </p>

                    <p className="mb-1">
                      <strong>Créé par:</strong> {ex.NomCreePar}{" "}
                      {ex.PrenomCreePar}
                    </p>

                    <p className="mb-1 d-flex align-items-center">
                      <strong>Approuvé:</strong>
                      <select
                        value={ex.ApprouveE || "non"}
                        onChange={(e) =>
                          handleChangeApprouve(ex.IdExamen, e.target.value)
                        }
                        className="form-select form-select-sm ms-2"
                      >
                        <option value="oui">Oui</option>
                        <option value="non">Non</option>
                      </select>
                    </p>
                    {/* Groupe Examen */}
                    <div className="mt-3">
                      <strong className="d-block text-center mb-2">
                        Examen
                      </strong>
                      <div className="d-flex justify-content-evenly gap-2">
                        <MyButton
                          styleNm={{ backgroundColor: "var(--marron-clear)" }}
                          classNm="p-1"
                          onClick={() =>
                            navigate(`/instructor/aff-examen/${ex.IdExamen}`)
                          }
                        >
                          👁️
                        </MyButton>
                        {ex.ApprouveE === "non" && (
                          <MyButton
                            styleNm={{ backgroundColor: "var(--dore)" }}
                            classNm="p-1"
                            onClick={() =>
                              navigate(`/instructor/mod-examen/${ex.IdExamen}`)
                            }
                          >
                            <i
                              style={{ fontSize: "15px" }}
                              className="bi bi-pencil mx-1"
                            ></i>
                          </MyButton>
                        )}
                        {ex.ApprouveE === "non" && (
                          <MyButton
                            classNm="p-1"
                            styleNm={{ backgroundColor: "var(--danger)" }}
                            onClick={() => handleDeleteExamen(ex.IdExamen)}
                          >
                            🗑️
                          </MyButton>
                        )}
                      </div>
                    </div>

                    {/* Groupe Questions */}
                    <div className="mt-4">
                      <strong className="d-block text-center mb-2">
                        Questions
                      </strong>
                      <div className="d-flex justify-content-evenly gap-2">
                        {ex.ApprouveE === "non" &&
                          ex.questions?.length === 0 && (
                            <MyButton
                              styleNm={{ backgroundColor: "var(--gris)" }}
                              classNm="p-1"
                              onClick={() =>
                                navigate(
                                  `/instructor/creer-questions/${ex.IdExamen}`
                                )
                              }
                            >
                              ➕
                            </MyButton>
                          )}
                        {ex.questions?.length !== 0 && (
                          <MyButton
                            styleNm={{ backgroundColor: "var(--marron-clear)" }}
                            classNm="p-1 me-1 "
                            onClick={() =>
                              navigate(
                                `/instructor/aff-questions/${ex.IdExamen}`
                              )
                            }
                          >
                            👁️
                          </MyButton>
                        )}
                        {ex.ApprouveE === "non" &&
                          ex.questions?.length !== 0 && (
                            <>
                              <MyButton
                                styleNm={{ backgroundColor: "var(--dore)" }}
                                classNm="p-1 me-1 "
                                onClick={() =>
                                  navigate(
                                    `/instructor/mod-questions/${ex.IdExamen}`
                                  )
                                }
                              >
                                <i
                                  style={{ fontSize: "15px" }}
                                  className="bi bi-pencil mx-1"
                                ></i>
                              </MyButton>

                              <MyButton
                                styleNm={{ backgroundColor: "var(--danger)" }}
                                classNm="p-1 me-1 "
                                onClick={() =>
                                  handleDeleteQuestions(ex.IdExamen)
                                }
                              >
                                🗑️
                              </MyButton>
                            </>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
