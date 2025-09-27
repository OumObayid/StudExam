import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectFilieres,
  deleteFiliere,
  addFiliere,
} from "../../redux/filiereSlice";
import { useNavigate } from "react-router-dom";
import { supprimerFiliere, ajouterFiliere } from "../../services/filieres";
import MyButton from "../../components/button/MyButton";
import PageTitle from "../../components/PageTitle";
import Card from "../../components/Card";
import { MyConfirm } from "../../components/myconfirm/MyConfirm";

const GestionFiliere = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const filieres = useSelector(selectFilieres);

  const [newFiliere, setNewFiliere] = useState({
    IdFiliere: "",
    NomFiliere: "",
  });

  // Supprimer filière
  const handleDelete = (id) => {
    MyConfirm({}).then(async(result) => {
      if (result.isConfirmed) {
       await supprimerFiliere(id)
          .then(() => dispatch(deleteFiliere(id)))
          .catch((error) =>
            console.error("Erreur lors de la suppression :", error)
          );
      }
    });
  };

  // Ajouter filière
  const handleAddFiliere = (e) => {
    e.preventDefault();
    if (!newFiliere.IdFiliere.trim() || !newFiliere.NomFiliere.trim()) return;

    ajouterFiliere(newFiliere.IdFiliere, newFiliere.NomFiliere)
      .then((response) => {
        if (response.success) {
          dispatch(addFiliere(response.filiere));
          setNewFiliere({ IdFiliere: "", NomFiliere: "" });
        } else console.log(response.message);
      })
      .catch((error) =>
        console.error("Erreur lors de l'ajout de la filière :", error)
      );
  };

  return (
    <div className=" py-3">
      <PageTitle>Gestion des Filières</PageTitle>

      <Card
        className="mb-4"
        title="Ajouter un filière"
        icon={<i className="bi bi-diagram-3 fs-4 me-3"></i>}
        content={
          <>
            {/* Formulaire d'ajout */}
            <form onSubmit={handleAddFiliere}>
              <div className="row d-md-flex align-items-center">
                <div className="col-12 col-md-5 mb-3 m-md-auto">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="ID de la filière"
                    value={newFiliere.IdFiliere}
                    onChange={(e) =>
                      setNewFiliere({
                        ...newFiliere,
                        IdFiliere: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="col-12 col-md-5 mb-3 m-md-auto">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nom de la filière"
                    value={newFiliere.NomFiliere}
                    onChange={(e) =>
                      setNewFiliere({
                        ...newFiliere,
                        NomFiliere: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="col-12 col-md-2 mb-3 m-md-auto">
                  <MyButton
                    typeNm="submit"
                    titleNm="Ajouter une filière"
                    classNm="p-2 float-end"
                  >
                    ➕
                  </MyButton>
                </div>
              </div>
            </form>
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
                Nom de la filière
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
            {filieres.length > 0 ? (
              filieres.map((filiere) => (
                <tr key={filiere.IdFiliere}>
                  <td>{filiere.IdFiliere}</td>
                  <td>{filiere.NomFiliere}</td>
                  <td>
                    <MyButton
                      titleNm="Modifier la filière"
                      styleNm={{ backgroundColor: "var(--dore)" }}
                      classNm="p-1 me-3"
                      onClick={() =>
                        navigate(`/admin/mod-filiere/${filiere.IdFiliere}`)
                      }
                    >
                      <i
                        style={{ fontSize: "14px", margin: "auto 3px" }}
                        className="bi bi-pencil "
                      ></i>
                    </MyButton>
                    <MyButton
                      titleNm="Supprimer la filière "
                      styleNm={{ backgroundColor: "var(--danger)" }}
                      classNm="p-1 float-end"
                      onClick={() => handleDelete(filiere.IdFiliere)}
                    >
                      🗑️
                    </MyButton>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center">
                  Aucune filière disponible
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mode Mobile : Cards */}
      <div className="d-block d-md-none">
        <div className="row">
          {filieres.length > 0 ? (
            filieres.map((filiere) => (
              <div key={filiere.IdFiliere} className="col-12 mb-3">
                <div className="card shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">{filiere.NomFiliere}</h5>
                    <p className="card-text">
                      <strong>ID :</strong> {filiere.IdFiliere}
                    </p>
                    <div className="d-flex justify-content-between">
                      <MyButton
                        titleNm="Modifier la filière"
                        styleNm={{ backgroundColor: "var(--dore)" }}
                        classNm="p-1 me-3"
                        onClick={() =>
                          navigate(`/admin/mod-filiere/${filiere.IdFiliere}`)
                        }
                      >
                        <i
                          style={{ fontSize: "14px", margin: "auto 3px" }}
                          className="bi bi-pencil "
                        ></i>
                      </MyButton>
                      <MyButton
                        titleNm="Supprimer la filière "
                        styleNm={{ backgroundColor: "var(--danger)" }}
                        classNm="p-1 float-end"
                        onClick={() => handleDelete(filiere.IdFiliere)}
                      >
                        🗑️
                      </MyButton>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">Aucune filière disponible</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GestionFiliere;
