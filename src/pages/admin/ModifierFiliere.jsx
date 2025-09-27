import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { selectFilieres, updateFiliere } from "../../redux/filiereSlice";
import { modifierFiliere } from "../../services/filieres";
import MyButton from "../../components/button/MyButton";
import PageTitle from "../../components/PageTitle";
import Card from "../../components/Card";
import { MyAlert } from "../../components/myconfirm/MyAlert";

const ModifierFiliere = () => {
  const { idParams } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const filieres = useSelector(selectFilieres);
  const filiereToEdit = filieres.find((f) => f.IdFiliere === idParams);

  const [nomFiliere, setNomFiliere] = useState("");

  // Initialiser uniquement le NomFiliere car IdFiliere ne doit pas être modifié
  useEffect(() => {
    if (filiereToEdit) {
      setNomFiliere(filiereToEdit.NomFiliere);
    }
  }, [filiereToEdit]);

  const handleSave = () => {
    if (!nomFiliere.trim()) {
       MyAlert({
            title: "Attention",
            text: "Le nom de la filière est obligatoire !",
            icon: "warning",
          });
      return;
    }

    modifierFiliere(idParams, nomFiliere)
      .then((response) => {
        console.log("response :", response);
        dispatch(updateFiliere(response.filiere));
        navigate("/admin/gest-filiere");
      })
      .catch((error) =>
        console.error("Erreur lors de la modification :", error)
      );
  };

  if (!filiereToEdit) {
    return <p className="text-center mt-4">Filière introuvable</p>;
  }

  return (
    <div className=" py-3">
      <PageTitle>Gestion des filières</PageTitle>

      <Card
         className="mb-4"
        title="Modifier la filière"
        icon={<i className="bi bi-diagram-3 fs-4 me-3"></i>}
        content={
          <>
            <div className="row g-3 d-md-flex align-items-end">
              <div className="col-12 col-md-5">
                <label className="form-label">ID de la Filière</label>
                <input
                  type="text"
                  className="form-control"
                  value={filiereToEdit.IdFiliere}
                  readOnly
                />
              </div>

              <div className="col-12 col-md-5">
                <label className="form-label">Nom de la Filière</label>
                <input
                  type="text"
                  className="form-control"
                  value={nomFiliere}
                  onChange={(e) => setNomFiliere(e.target.value)}
                />
              </div>

              <div className="col-12 col-md-2">
                <MyButton titleNm="Enregistrer la filière" classNm=" float-end mt-3 py-2" onClick={handleSave}>
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

export default ModifierFiliere;
