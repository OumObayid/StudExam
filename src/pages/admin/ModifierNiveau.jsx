import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { selectNiveaux, updateNiveau } from "../../redux/niveauSlice";
import { modifierNiveau } from "../../services/niveaux";
import MyButton from "../../components/button/MyButton";
import PageTitle from "../../components/PageTitle";
import Card from "../../components/Card";
import { MyAlert } from "../../components/myconfirm/MyAlert";

const ModifierNiveau = () => {
  const { idParams } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const niveaux = useSelector(selectNiveaux);
  const niveauToEdit = niveaux.find((n) => n.IdNiveau.toString() === idParams);

  const [nomNiveau, setNomNiveau] = useState("");

  useEffect(() => {
    if (niveauToEdit) {
      setNomNiveau(niveauToEdit.NomNiveau);
    }
  }, [niveauToEdit]);

  const handleSave = () => {
    if (!nomNiveau.trim()) {
      MyAlert({
            title: "Attention",
            text: "Le nom du niveau est obligatoire !",
            icon: "warning",
          });
      return;
    }

    modifierNiveau(idParams, nomNiveau)
      .then((response) => {
        dispatch(updateNiveau(response.niveau));
        navigate("/admin/gest-niveau");
      })
      .catch((error) =>
        console.error("Erreur lors de la modification :", error)
      );
  };

  if (!niveauToEdit) {
    return <p className="text-center mt-4">Niveau introuvable</p>;
  }

  return (
    <div className=" py-3">
      <PageTitle>Gestion des niveaux</PageTitle>
      <Card
         className="mb-4"
        title="Modifier le niveau"
        icon={<i className="bi bi-bar-chart fs-4 me-3"></i>}
        content={
          <>
            <div className="row d-flex align-items-end g-3">
              <div className="col-9 col-md-10">
                <label className="form-label">Nom du Niveau</label>
                <input
                  type="text"
                  className="form-control"
                  value={nomNiveau}
                  onChange={(e) => setNomNiveau(e.target.value)}
                />
              </div>

              <div className="col-3 col-md-2">
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

export default ModifierNiveau;
