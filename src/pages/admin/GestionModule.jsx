import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectModules,
  deleteModule,
  addModule,
} from "../../redux/moduleSlice";
import { selectFilieres } from "../../redux/filiereSlice";
import { selectNiveaux } from "../../redux/niveauSlice";
import { Link, useNavigate } from "react-router-dom";
import { supprimerModule, ajouterModule } from "../../services/modules";
import MyButton from "../../components/button/MyButton";
import PageTitle from "../../components/PageTitle";
import Card from "../../components/Card";
import { MyConfirm } from "../../components/myconfirm/MyConfirm";
import { MyAlert } from "../../components/myconfirm/MyAlert";

const GestionModule = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const modules = useSelector(selectModules);
  const filieres = useSelector(selectFilieres);
  const niveaux = useSelector(selectNiveaux);

  // Formulaire d'ajout
  const [nomModule, setNomModule] = useState("");
  const [descriptionModule, setDescriptionModule] = useState("");
  const [idFiliere, setIdFiliere] = useState("");
  const [idNiveau, setIdNiveau] = useState("");

  // Supprimer module
  const handleDelete = (id) => {
      MyConfirm({}).then((result) => {
      if (result.isConfirmed) {
        supprimerModule(id)
        .then(() => dispatch(deleteModule(id)))
        .catch((error) =>
          console.error("Erreur lors de la suppression :", error)
        );
      }
    });
  };

  // Ajouter module
  const handleAdd = () => {
    if (
      !nomModule.trim() ||
      !descriptionModule.trim() ||
      !idFiliere ||
      !idNiveau
    ) {
       MyAlert({
        title:"Attention",
        text:"Tous les champs doivent être remplis !"
       })
    
      return;

    }
    ajouterModule(idFiliere, idNiveau, nomModule, descriptionModule)
      .then((response) => {
        dispatch(addModule(response.module));
        // reset form
        setNomModule("");
        setDescriptionModule("");
        setIdFiliere("");
        setIdNiveau("");
         MyAlert({
            title: "Success",
            text: "Votre module a été bien ajouté qvec success !",
            icon: "success",
          });

      })
      .catch((error) => console.error("Erreur lors de l'ajout :", error));
  };

  return (
    <div className=" py-3">
      <PageTitle>Gestion des Modules</PageTitle>

      <Card className="mb-4"
        title="Ajouter un module"
        icon={<i className="bi bi-book fs-4 me-3"></i>}
        content={
          <>
            {/* Formulaire d'ajout */}
            <div className="row g-2 align-items-end">
              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nom du module"
                  value={nomModule}
                  onChange={(e) => setNomModule(e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Description du module"
                  value={descriptionModule}
                  onChange={(e) => setDescriptionModule(e.target.value)}
                />
              </div>
              <div className="col-md-6">
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
              <div className="col-md-12 mt-2">
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
              <th style={{ backgroundColor: "var(--marron)", color: "white" }}>
                Description
              </th>
              <th style={{ backgroundColor: "var(--marron)", color: "white" }}>
                Filière
              </th>
              <th style={{ backgroundColor: "var(--marron)", color: "white" }}>
                Niveau
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
            {modules.length > 0 ? (
              modules.map((m) => (
                <tr key={m.IdModule}>
                  <td>{m.IdModule}</td>
                  <td>{m.NomModule}</td>
                  <td>{m.DescriptionModule}</td>
                  <td>
                    {
                      filieres.find((f) => f.IdFiliere === m.IdFiliere)
                        ?.NomFiliere
                    }
                  </td>
                  <td>
                    {
                      niveaux.find(
                        (n) => Number(n.IdNiveau) === Number(m.IdNiveau)
                      )?.NomNiveau
                    }
                  </td>
                  <td>
                    <MyButton
                      titleNm="Modifier la module"
                      styleNm={{ backgroundColor: "var(--dore)" }}
                      classNm="p-1 me-3"
                      onClick={() =>
                        navigate(`/admin/mod-module/${m.IdModule}`)
                      }
                    >
                      <i
                        style={{ fontSize: "14px", margin: "auto 3px" }}
                        className="bi bi-pencil "
                      ></i>
                    </MyButton>
                    <MyButton
                      titleNm="Supprimer la module "
                      styleNm={{ backgroundColor: "var(--danger)" }}
                      classNm="p-1  float-end"
                      onClick={() => handleDelete(m.IdModule)}
                    >
                      🗑️
                    </MyButton>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  Aucun module disponible
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mode Mobile : Cards */}
      <div className="d-block d-md-none">
        <div className="row">
          {modules.length > 0 ? (
            modules.map((m) => (
              <div key={m.IdModule} className="col-12 mb-3">
                <div className="card shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">{m.NomModule}</h5>
                    <p className="card-text">
                      <strong>Description :</strong> {m.DescriptionModule}
                    </p>
                    <p className="card-text">
                      <strong>Filière :</strong>{" "}
                      {
                        filieres.find((f) => f.IdFiliere === m.IdFiliere)
                          ?.NomFiliere
                      }
                    </p>
                    <p className="card-text">
                      <strong>Niveau :</strong>{" "}
                      {
                        niveaux.find((n) => n.IdNiveau === m.IdNiveau)
                          ?.NomNiveau
                      }
                    </p>
                    <div className="d-flex justify-content-between">
                      <MyButton
                        titleNm="Modifier la module"
                        styleNm={{ backgroundColor: "var(--dore)" }}
                        classNm="p-1 me-3"
                        onClick={() =>
                          navigate(`/admin/mod-module/${m.IdModule}`)
                        }
                      >
                        <i
                          style={{ fontSize: "14px", margin: "auto 3px" }}
                          className="bi bi-pencil "
                        ></i>
                      </MyButton>
                      <MyButton
                        titleNm="Supprimer la module "
                        styleNm={{ backgroundColor: "var(--danger)" }}
                        classNm="p-1 float-end"
                        onClick={() => handleDelete(m.IdModule)}
                      >
                        🗑️
                      </MyButton>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">Aucun module disponible</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GestionModule;
