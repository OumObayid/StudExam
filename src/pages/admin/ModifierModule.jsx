import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { selectModules, updateModule } from "../../redux/moduleSlice";
import { selectFilieres } from "../../redux/filiereSlice";
import { selectNiveaux } from "../../redux/niveauSlice";
import { modifierModule } from "../../services/modules";
import MyButton from "../../components/button/MyButton";
import PageTitle from "../../components/PageTitle";
import Card from "../../components/Card";
import { MyAlert } from "../../components/myconfirm/MyAlert";

const ModifierModule = () => {
  const { idParams } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const modules = useSelector(selectModules);
  const filieres = useSelector(selectFilieres);
  const niveaux = useSelector(selectNiveaux);

  const moduleToEdit = modules.find((m) => m.IdModule.toString() === idParams);

  const [nomModule, setNomModule] = useState("");
  const [descriptionModule, setDescriptionModule] = useState("");
  const [idFiliere, setIdFiliere] = useState("");
  const [idNiveau, setIdNiveau] = useState("");

  useEffect(() => {
    if (moduleToEdit) {
      setNomModule(moduleToEdit.NomModule);
      setDescriptionModule(moduleToEdit.DescriptionModule);
      setIdFiliere(moduleToEdit.IdFiliere);
      setIdNiveau(moduleToEdit.IdNiveau);
    }
  }, [moduleToEdit]);

  const handleSave = () => {
    if (
      !nomModule.trim() ||
      !descriptionModule.trim() ||
      !idFiliere ||
      !idNiveau
    ) {
       MyAlert({
            title: "Attention",
            text: "Tous les champs doivent être remplis !",
            icon: "warning",
          });
      return;
    }

    modifierModule(idParams, idFiliere, idNiveau, nomModule, descriptionModule)
      .then((response) => {
        dispatch(updateModule(response.module));
        navigate("/admin/gest-module");
      })
      .catch((error) =>
        console.error("Erreur lors de la modification :", error)
      );
  };

  if (!moduleToEdit) {
    return <p className="text-center mt-4">Module introuvable</p>;
  }

  return (
    <div className=" py-3">
      <PageTitle>Gestion des Modules</PageTitle>

      <Card
         className="mb-4"
        title="Modifier le module"
        icon={<i className="bi bi-book fs-4 me-3"></i>}
        content={
          <>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Nom du Module</label>
                <input
                  type="text"
                  className="form-control"
                  value={nomModule}
                  onChange={(e) => setNomModule(e.target.value)}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Description du Module</label>
                <input
                  type="text"
                  className="form-control"
                  value={descriptionModule}
                  onChange={(e) => setDescriptionModule(e.target.value)}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Filière</label>
                <select
                  className="form-select"
                  value={idFiliere}
                  onChange={(e) => setIdFiliere(e.target.value)}
                >
                  <option value="">Sélectionner une filière</option>
                  {filieres.map((f) => (
                    <option key={f.IdFiliere} value={f.IdFiliere}>
                      {f.NomFiliere}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label">Niveau</label>
                <select
                  className="form-select"
                  value={idNiveau}
                  onChange={(e) => setIdNiveau(e.target.value)}
                >
                  <option value="">Sélectionner un niveau</option>
                  {niveaux.map((n) => (
                    <option key={n.IdNiveau} value={n.IdNiveau}>
                      {n.NomNiveau}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-12">
                <MyButton classNm=" float-end mt-3 py-2" onClick={handleSave}>
                  <i
                    style={{ color: "var(--dore-clear)" }}
                    className=" bi bi-floppy2-fill"
                  ></i>
                </MyButton>
              </div>
            </div>
          </>
        }
      />
    </div>
  );
};

export default ModifierModule;
