import React, { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectModules } from "../../redux/moduleSlice";
import { selectUsers } from "../../redux/userSlice";
import {
  selectInstructorModules,
  setInstructorModules,
} from "../../redux/instructorModuleSlice";
import { assignerUserModule } from "../../services/users";
import MyButton from "../../components/button/MyButton";
import PageTitle from "../../components/PageTitle";
import Card from "../../components/Card";
import { MyAlert } from "../../components/myconfirm/MyAlert";

const GestionAffectation = () => {
  const dispatch = useDispatch();

  // Données du store
  const modules = useSelector(selectModules);
  const users = useSelector(selectUsers);
  const instructorModules = useSelector(selectInstructorModules);

  // Filtrer uniquement les instructeurs
  const instructors = users.filter((u) => u.TypeMembre === "Instructor");

  // Local state des affectations { [IdModule]: CinInstructor }
  const [affectations, setAffectations] = useState({});

  // Filtres
  const [filterNiveau, setFilterNiveau] = useState("");
  const [filterFiliere, setFilterFiliere] = useState("");
  const [filterInstructor, setFilterInstructor] = useState("");

  // Charger les affectations existantes au démarrage
  useEffect(() => {
    const initial = {};
    instructorModules.forEach((im) => {
      initial[im.IdModule] = im.CinInstructor;
    });
    setAffectations(initial);
  }, [instructorModules]);

  const handleChange = async (IdModule, CinMembre) => {
    try {
      setAffectations((prev) => ({
        ...prev,
        [IdModule]: CinMembre,
      }));

      const response = await assignerUserModule(IdModule, CinMembre);

      if (response.success) {
        const newInstructorModules = [
          ...instructorModules.filter((im) => im.IdModule !== IdModule),
          { IdModule, CinInstructor: CinMembre },
        ];
        dispatch(setInstructorModules(newInstructorModules));
      } else {
        MyAlert({
          title: "erreur",
          text: `${response.message || "Erreur d’affectation"}`,
          icon: "erreur",
        });
      }
    } catch (error) {
      console.error(error);
      MyAlert({
        title: "Erreur",
        text: "Erreur serveur : " + error.message,
        icon: "erreur",
      });
    }
  };

  // Modules filtrés
  const filteredModules = useMemo(() => {
    return modules.filter(
      (mod) =>
        (!filterNiveau || mod.IdNiveau === filterNiveau) &&
        (!filterFiliere || mod.IdFiliere === filterFiliere) &&
        (!filterInstructor || affectations[mod.IdModule] === filterInstructor)
    );
  }, [modules, filterNiveau, filterFiliere, filterInstructor, affectations]);

  // Valeurs uniques pour les filtres
  const niveaux = [...new Set(modules.map((m) => m.IdNiveau))];
  const filieres = [...new Set(modules.map((m) => m.IdFiliere))];

  return (
    <div className=" py-3">
      <PageTitle>Gestion des affectations</PageTitle>
      {/* Filtres */}

      <Card
        className="mb-4"
        title="Filtrer les affectations"
        icon={<i className="bi bi-grid-3x3-gap fs-4 me-3"></i>}
        content={
          <>
            <div className="row  g-2  d-flex align-items-center justify-content-center ">
              <div className="col-12 col-md-3 py-0">
                <select
                  className="form-select"
                  value={filterNiveau}
                  onChange={(e) => setFilterNiveau(e.target.value)}
                >
                  <option value="">-- Filtrer par Niveau --</option>
                  {niveaux.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-12 col-md-3 py-0">
                <select
                  className="form-select"
                  value={filterFiliere}
                  onChange={(e) => setFilterFiliere(e.target.value)}
                >
                  <option value="">-- Filtrer par Filière --</option>
                  {filieres.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-12 col-md-3 py-0">
                <select
                  className="form-select"
                  value={filterInstructor}
                  onChange={(e) => setFilterInstructor(e.target.value)}
                >
                  <option value="">-- Filtrer par Instructeur --</option>
                  {instructors.map((instr) => (
                    <option key={instr.CinMembre} value={instr.CinMembre}>
                      {instr.Nom} {instr.Prenom}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-12 col-md-3  mt-2 mt-md-0 ">
                <MyButton
                  titleNm="Réinitialiser les filtres"
                  classNm="p-2 float-end"
                  onClick={() => {
                    setFilterNiveau("");
                    setFilterFiliere("");
                    setFilterInstructor("");
                  }}
                >
                  🧹
                </MyButton>
              </div>
            </div>
          </>
        }
      />
      <h5 className="text-center">
            {filteredModules.length + " affectation(s)"}
          </h5>
      {/* Desktop Table */}
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
                Module
              </th>
              <th style={{ backgroundColor: "var(--marron)", color: "white" }}>
                Description
              </th>
              <th style={{ backgroundColor: "var(--marron)", color: "white" }}>
                Niveau
              </th>
              <th style={{ backgroundColor: "var(--marron)", color: "white" }}>
                Filière
              </th>
              <th style={{ backgroundColor: "var(--marron)", color: "white" }}>
                Instructeur assigné
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredModules
              .sort((a, b) => {
                if (a.IdFiliere === b.IdFiliere) {
                  return a.NomModule.localeCompare(b.NomModule);
                }
                return String(a.IdFiliere).localeCompare(String(b.IdFiliere));
              })
              .map((mod) => (
                <tr key={mod.IdModule}>
                  <td>{mod.NomModule}</td>
                  <td>{mod.DescriptionModule}</td>
                  <td>{mod.IdNiveau}</td>
                  <td>{mod.IdFiliere}</td>
                  <td>
                    <select
                      className="form-select"
                      value={affectations[mod.IdModule] || ""}
                      onChange={(e) =>
                        handleChange(mod.IdModule, e.target.value)
                      }
                    >
                      <option value="">-- Choisir un instructeur --</option>
                      {instructors.map((instr) => (
                        <option key={instr.CinMembre} value={instr.CinMembre}>
                          {instr.Nom} {instr.Prenom} ({instr.CinMembre})
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="d-md-none">
        {filteredModules.map((mod) => (
          <div key={mod.IdModule} className="card mb-3 shadow-sm">
            <div className="card-body">
              <p>
                <strong>Module:</strong> {mod.NomModule}
              </p>
              <p>
                <strong>Description:</strong> {mod.DescriptionModule}
              </p>
              <p>
                <strong>Niveau:</strong> {mod.IdNiveau}
              </p>
              <p>
                <strong>Filière:</strong> {mod.IdFiliere}
              </p>
              <p>
                <strong>Instructeur assigné:</strong>
                <select
                  className="form-select mt-1"
                  value={affectations[mod.IdModule] || ""}
                  onChange={(e) => handleChange(mod.IdModule, e.target.value)}
                >
                  <option value="">-- Choisir un instructeur --</option>
                  {instructors.map((instr) => (
                    <option key={instr.CinMembre} value={instr.CinMembre}>
                      {instr.Nom} {instr.Prenom} ({instr.CinMembre})
                    </option>
                  ))}
                </select>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GestionAffectation;
