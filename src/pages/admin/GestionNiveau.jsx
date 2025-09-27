import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectNiveaux,
  deleteNiveau,
  addNiveau,
} from "../../redux/niveauSlice";
import { useNavigate } from "react-router-dom";
import { ajouterNiveau, supprimerNiveau } from "../../services/niveaux";
import MyButton from "../../components/button/MyButton";
import PageTitle from "../../components/PageTitle";
import Card from "../../components/Card";
import { MyConfirm } from "../../components/myconfirm/MyConfirm";
import { MyAlert } from "../../components/myconfirm/MyAlert";

const GestionNiveau = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const niveaux = useSelector(selectNiveaux);

  // Nouveau niveau
  const [selectedNiveau, setSelectedNiveau] = useState("");

  // Liste des niveaux proposés
  const niveauOptions = [
    { id: 1, nom: "1ère année" },
    { id: 2, nom: "2ème année" },
    { id: 3, nom: "3ème année" },
    { id: 4, nom: "4ème année" },
    { id: 5, nom: "5ème année" },
  ];

  // Supprimer niveau
  const handleDelete = (id) => {
    MyConfirm({}).then(async (result) => {
      if (result.isConfirmed) {
       await supprimerNiveau(id)
          .then(() => {
            dispatch(deleteNiveau(id));
          })
          .catch((error) => {
            console.error("Erreur lors de la suppression :", error);
          });
      }
    });
  };

  // Ajouter niveau
  const handleAdd = async () => {
    if (!selectedNiveau) {
      MyAlert({
            title: "Attention",
            text:"Veuillez sélectionner un niveau !",
            icon: "warning",
          });
      return;
    }
    const { id: IdNiveau, nom: NomNiveau } = niveauOptions.find(
      (n) => n.id === parseInt(selectedNiveau)
    );

    await ajouterNiveau(IdNiveau, NomNiveau)
      .then((response) => {
        if (response.success) {
          dispatch(addNiveau(response.niveau)); // objet niveau reçu
          setSelectedNiveau(""); // reset select
        } else {
          console.log(response.message);
        }
      })
      .catch((error) => {
        console.error("Erreur lors de l'ajout :", error);
      });
  };

  return (
    <div className=" py-3">
      <PageTitle>Gestion des Niveaux</PageTitle>

      <Card
        className="mb-4"
        title="Ajouter un niveau"
        icon={<i className="bi bi-bar-chart fs-4 me-3"></i>}
        content={
          <>
            {/* Formulaire d'ajout */}
            <div className="row d-md-flex align-items-center">
              <div className=" col-10 ">
                <select
                  className="form-select"
                  value={selectedNiveau}
                  onChange={(e) => setSelectedNiveau(e.target.value)}
                >
                  <option value="">-- Choisir un niveau --</option>
                  {niveauOptions.map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.nom}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-2 ">
                <MyButton
                  typeNm="submit"
                  titleNm="Ajouter un niveau"
                  classNm="p-2 float-end"
                  onClick={handleAdd}
                >
                  ➕
                </MyButton>
              </div>
            </div>
          </>
        }
      />
      {/* Mode Desktop : Table */}
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
              <th style={{ backgroundColor: "var(--marron)", color: "white" }}>
                ID
              </th>
              <th style={{ backgroundColor: "var(--marron)", color: "white" }}>
                Nom
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
            {niveaux.length > 0 ? (
              niveaux.map((niveau) => (
                <tr key={niveau.IdNiveau}>
                  <td>{niveau.IdNiveau}</td>
                  <td>{niveau.NomNiveau}</td>
                  <td>
                    <MyButton
                      titleNm="Modifier le niveau"
                      styleNm={{ backgroundColor: "var(--dore)" }}
                      classNm="p-1 me-3"
                      onClick={() =>
                        navigate(`/admin/mod-niveau/${niveau.IdNiveau}`)
                      }
                    >
                      <i
                        style={{ fontSize: "14px", margin: "auto 3px" }}
                        className="bi bi-pencil "
                      ></i>
                    </MyButton>
                    <MyButton
                      titleNm="Supprimer le niveau "
                      styleNm={{ backgroundColor: "var(--danger)" }}
                      classNm="p-1 float-end"
                      onClick={() => handleDelete(niveau.IdNiveau)}
                    >
                      🗑️
                    </MyButton>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center">
                  Aucun niveau disponible
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mode Mobile : Cards */}
      <div className="d-block d-md-none">
        <div className="row">
          {niveaux.length > 0 ? (
            niveaux.map((niveau) => (
              <div key={niveau.IdNiveau} className="col-12 mb-3">
                <div className="card shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">{niveau.NomNiveau}</h5>
                    <p className="card-text">
                      <strong>ID :</strong> {niveau.IdNiveau}
                    </p>
                    <div className="d-flex justify-content-between">
                      <MyButton
                        titleNm="Modifier le niveau"
                        styleNm={{ backgroundColor: "var(--dore)" }}
                        classNm="p-1 me-3"
                        onClick={() =>
                          navigate(`/admin/mod-niveau/${niveau.IdNiveau}`)
                        }
                      >
                        <i
                          style={{ fontSize: "14px", margin: "auto 3px" }}
                          className="bi bi-pencil "
                        ></i>
                      </MyButton>
                      <MyButton
                        titleNm="Supprimer le niveau "
                        styleNm={{ backgroundColor: "var(--danger)" }}
                        classNm="p-1 float-end"
                        onClick={() => handleDelete(niveau.IdNiveau)}
                      >
                        🗑️
                      </MyButton>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">Aucun niveau disponible</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GestionNiveau;
