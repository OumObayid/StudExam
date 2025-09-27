import { useSelector, useDispatch } from "react-redux";
import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  approveExamen,
  deleteExamen,
  publieExamen,
  selectExamens,
} from "../../redux/examenSlice";
import {
  supprimerExamen,
  approuverExamen,
  publierExamen,
} from "../../services/examens";
import { selectFilieres } from "../../redux/filiereSlice";
import { selectNiveaux } from "../../redux/niveauSlice";
import { selectModules } from "../../redux/moduleSlice";
import MyButton from "../../components/button/MyButton";
import PageTitle from "../../components/PageTitle";
import Card from "../../components/Card";
import { MyConfirm } from "../../components/myconfirm/MyConfirm";
import { MyAlert } from "../../components/myconfirm/MyAlert";
const GestionExamen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const examens = useSelector(selectExamens) || [];
  const filieres = useSelector(selectFilieres) || [];
  const niveaux = useSelector(selectNiveaux) || [];
  const modules = useSelector(selectModules) || [];

  // États des filtres
  const [selectedFiliere, setSelectedFiliere] = useState("");
  const [selectedNiveau, setSelectedNiveau] = useState("");
  const [selectedModule, setSelectedModule] = useState("");

  // Reset module quand filiere ou niveau est vide
  useEffect(() => {
    if (!selectedFiliere || !selectedNiveau) {
      setSelectedModule("");
    }
    console.log("examens :", examens);
  }, [selectedFiliere, selectedNiveau]);

  // Modules filtrés dynamiquement selon filiere + niveau
  const filteredModules = useMemo(
    () =>
      modules.filter(
        (m) =>
          (!selectedFiliere || m.IdFiliere === selectedFiliere) &&
          (!selectedNiveau || Number(m.IdNiveau) === Number(selectedNiveau))
      ),
    [modules, selectedFiliere, selectedNiveau]
  );

  // Examens filtrés selon selects
  const filteredExamens = useMemo(
    () =>
      examens.filter(
        (e) =>
          (!selectedFiliere || e.IdFiliere === selectedFiliere) &&
          (!selectedNiveau || Number(e.IdNiveau) === Number(selectedNiveau)) &&
          (!selectedModule || Number(e.IdModule) === Number(selectedModule))
      ),
    [examens, selectedFiliere, selectedNiveau, selectedModule]
  );

  const handleDelete = async (idExamen) => {
    MyConfirm({}).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await supprimerExamen(idExamen);
          if (response.success) {
            dispatch(deleteExamen(idExamen));
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
          MyAlert({
            title: "Erreur",
            text: "Erreur lors de la suppression !",
            icon: "erreur",
          });
        }
      }
    });
  };

  const handleViewDetails = (idExamen) => {
    navigate(`/admin/detail-examen-admin/${idExamen}`);
  };

  const handleChangeApprouve = async (IdExamen, ApprouveE) => {
    try {
      const response = await approuverExamen(IdExamen, ApprouveE);
      if (response.success) {
        dispatch(approveExamen({ IdExamen, ApprouveE }));
      } else {
        MyAlert({
          title: "Erreur",
          text: `${
            response.message || "Impossible de mettre à jour l'approbation !"
          }`,
          icon: "erreur",
        });
      }
    } catch (error) {
      console.error("Erreur approbation :", error);
      MyAlert({
        title: "Erreur",
        text: "Erreur lors de la mise à jour de l'approbation !",
        icon: "erreur",
      });
    }
  };

  const handleChangePublie = async (idExamen, PublieE) => {
    try {
      const response = await publierExamen(idExamen, PublieE);
      if (response.success) {
        dispatch(publieExamen({ IdExamen: idExamen, PublieE }));
      } else {
        MyAlert({
          title: "Erreur",
          text: `${response.message} || "Impossible de mettre à jour la publication !"`,
          icon: "erreur",
        });
      }
    } catch (error) {
      console.error("Erreur publication :", error);
      MyAlert({
        title: "Erreur",
        text: "Erreur lors de la mise à jour de publication !",
        icon: "erreur",
      });
    }
  };

  return (
    <div className=" py-3">
      <PageTitle> Gestion des Examens</PageTitle>
      <Card
        className="mb-4"
        title="Filtrer les examens"
        icon={<i className="bi bi-bar-chart fs-4 me-3"></i>}
        content={
          <>
            {/* Filtres */}
            <div className="row g-2">
              <div className="col-12 col-md-3">
                <select
                  className="form-select"
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
              <div className="col-12 col-md-3">
                <select
                  className="form-select"
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
              <div className="col-12 col-md-3">
                <select
                  className="form-select"
                  value={selectedModule}
                  onChange={(e) => setSelectedModule(e.target.value)}
                  disabled={!selectedFiliere || !selectedNiveau}
                >
                  <option value="">Tous les modules</option>
                  {filteredModules.map((m) => (
                    <option key={m.IdModule} value={m.IdModule}>
                      {m.NomModule}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-12 col-md-3  mt-2  d-flex justify-content-end align-items-center">
                <MyButton
                  titleNm="Réinitialiser les filtres"
                  classNm="p-2"
                  onClick={() => {
                    setSelectedNiveau("");
                    setSelectedFiliere("");
                    setSelectedModule("");
                  }}
                >
                  🧹
                </MyButton>
              </div>
            </div>
          </>
        }
      />
      {/* Table Desktop */}
      <div className="d-none d-md-block">
        {filteredExamens.length === 0 ? (
          <p className="text-muted">Aucun examen trouvé.</p>
        ) : (
          <>
            <h5 className="text-center">
              {filteredExamens.length + " examen(s)"}
            </h5>

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
                    width="10%"
                  >
                    Niveau
                  </th>
                  <th
                    style={{ backgroundColor: "var(--marron)", color: "white" }}
                    width="15%"
                  >
                    Filière
                  </th>
                  <th
                    style={{ backgroundColor: "var(--marron)", color: "white" }}
                  >
                    Module
                  </th>
                  <th
                    style={{ backgroundColor: "var(--marron)", color: "white" }}
                  >
                    Description
                  </th>
                  <th
                    style={{ backgroundColor: "var(--marron)", color: "white" }}
                  >
                    Créé par
                  </th>
                  <th
                    style={{ backgroundColor: "var(--marron)", color: "white" }}
                    width="10%"
                  >
                    Approuvé
                  </th>
                  <th
                    style={{ backgroundColor: "var(--marron)", color: "white" }}
                    width="10%"
                  >
                    Publié
                  </th>
                  <th
                    style={{ backgroundColor: "var(--marron)", color: "white" }}
                    width="10%"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredExamens.map((ex) => (
                  <tr key={ex.IdExamen}>
                    <td>{Number(ex.IdNiveau) === 1 ? "1ère année" : "2ème année"}</td>
                    <td>{ex.NomFiliere}</td>

                    <td>{ex.NomModule}</td>
                    <td>{ex.DescriptionE}</td>
                    <td>
                      {ex.NomCreePar} {ex.PrenomCreePar}
                    </td>
                    <td>
                      <select
                        value={ex.ApprouveE || "non"}
                        onChange={(e) =>
                          handleChangeApprouve(ex.IdExamen, e.target.value)
                        }
                        className="form-select form-select-sm"
                      >
                        <option value="oui">Oui</option>
                        <option value="non">Non</option>
                      </select>
                    </td>
                    <td>
                      {ex.ApprouveE === "oui" ? (
                        <select
                          value={ex.PublieE || "non"}
                          onChange={(e) =>
                            handleChangePublie(ex.IdExamen, e.target.value)
                          }
                          className="form-select form-select-sm"
                        >
                          <option value="oui">Oui</option>
                          <option value="non">Non</option>
                        </select>
                      ) : (
                        "non"
                      )}
                    </td>
                    <td>
                      <div className="text-center d-flex justify-content-evenly">
                        <MyButton
                          titleNm="Afficher l'examen"
                          onClick={() => handleViewDetails(ex.IdExamen)}
                          classNm="p-1"
                        >
                          👁️
                        </MyButton>
                        <MyButton
                          titleNm="Supprimer l'examen"
                          classNm="p-1"
                          styleNm={{ backgroundColor: "var(--danger)" }}
                          onClick={() => handleDelete(ex.IdExamen)}
                        >
                          🗑️
                        </MyButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>

      {/* Mobile Cards */}
      <div className="d-block d-md-none">
        {filteredExamens.length === 0 ? (
          <p className="text-center text-muted">Aucun examen trouvé.</p>
        ) : (
          <div className="row">
            {filteredExamens.map((ex) => (
              <div key={ex.IdExamen} className="col-12 mb-3">
                <div className="card shadow-sm">
                  <div className="card-body">
                    <p>
                      <strong>Filière:</strong> {ex.NomFiliere}
                    </p>
                    <p>
                      <strong>Niveau:</strong> {ex.NomNiveau}
                    </p>
                    <p>
                      <strong>Module:</strong> {ex.NomModule}
                    </p>
                    <p>
                      <strong>Description:</strong> {ex.DescriptionE}
                    </p>
                    <p>
                      <strong>Créé par:</strong> {ex.NomCreePar}
                      {ex.PrenomCreePar}
                    </p>
                    <p className="mb-2">
                      <strong>Approuvé:</strong>
                      <select
                        value={ex.ApprouveE || "non"}
                        onChange={(e) =>
                          handleChangeApprouve(ex.IdExamen, e.target.value)
                        }
                        className="form-select form-select-sm"
                      >
                        <option value="oui">Oui</option>
                        <option value="non">Non</option>
                      </select>
                    </p>
                    {ex.ApprouveE === "oui" ? (
                      <p className="mb-2">
                        <strong>Publié:</strong>
                        <select
                          value={ex.PublieE || "non"}
                          onChange={(e) =>
                            handleChangePublie(ex.IdExamen, e.target.value)
                          }
                          className="form-select form-select-sm"
                        >
                          <option value="oui">Oui</option>
                          <option value="non">Non</option>
                        </select>
                      </p>
                    ) : (
                      "non"
                    )}
                    <div className="d-flex justify-content-between gap-2 mt-3">
                      <MyButton
                        titleNm="Afficher l'examen"
                        onClick={() => handleViewDetails(ex.IdExamen)}
                        classNm="p-1"
                      >
                        👁️
                      </MyButton>
                      <MyButton
                        titleNm="Supprimer l'examen"
                        classNm="p-1"
                        styleNm={{ backgroundColor: "var(--danger)" }}
                        onClick={() => handleDelete(ex.IdExamen)}
                      >
                        🗑️
                      </MyButton>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GestionExamen;
