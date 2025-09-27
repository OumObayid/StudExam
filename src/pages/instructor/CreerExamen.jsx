import { useDispatch, useSelector } from "react-redux";
import { addExamen } from "../../redux/examenSlice";
import { selectUserInfos } from "../../redux/authSlice";
import dayjs from "dayjs";
import { selectModules } from "../../redux/moduleSlice";
import { useState } from "react";
import { ajouterExamen } from "../../services/examens";
import { useNavigate } from "react-router-dom";
import MyButton from "../../components/button/MyButton";
import PageTitle from "../../components/PageTitle";
import Card from "../../components/Card";
import { MyAlert } from "../../components/myconfirm/MyAlert";
const CreerExamen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfos = useSelector(selectUserInfos) || null;
  const modules = useSelector(selectModules);

  const [form, setForm] = useState({
    IdModule: "",
    DescriptionE: "",
    NbrQuestionsE: 1,
    NotePourQuestion: 1,
    DurationE: 1,
    DateDebutE: dayjs().format("YYYY-MM-DD"),
    DateFinE: dayjs().format("YYYY-MM-DD"),
    PublieE: "non",
    CreeParCinMembre: userInfos?.CinMembre || "",
    ApprouveE: "non",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleAddExamen = async (e) => {
    e.preventDefault();
    try {
      // Appel API
      const response = await ajouterExamen(form);
      if (response.success) {
        const examen = response.examen; // API renvoie l'examen inséré
        console.log("examen :", examen);
        dispatch(addExamen(examen));
         MyAlert({
            title: "Success",
            text: "Examen ajouté avec succès !",
            icon: "success",
          });
        // reset form
        setForm({
          IdModule: "",
          DescriptionE: "",
          NbrQuestionsE: 1,
          NotePourQuestion: 1,
          DurationE: 1,
          DateDebutE: dayjs().format("YYYY-MM-DD"),
          DateFinE: dayjs().format("YYYY-MM-DD"),
          PublieE: "non",
          CreeParCinMembre: userInfos?.CinMembre || "",
          ApprouveE: "non",
        });
      } else {
         MyAlert({
            title: "Erreur",
            text: `${response.message || "Erreur lors de l'ajout de l'examen"}`,
            icon: "erreur",
          });
      }
    } catch (error) {
      console.error("Erreur ajout examen :", error);
       MyAlert({
            title: "Erreur",
            text: "Impossible d'ajouter l'examen !",
            icon: "erreur",
          });
    }
  };

  return (
    <div className=" py-3">
      <PageTitle>Gestion des examens</PageTitle>

      <Card
        className="mb-4"
        title="Ajouter un examen"
        icon={<i className="bi bi-journal-text fs-4 me-3"></i>}
        content={
          <>
            <form onSubmit={handleAddExamen}>
              <div className="row g-3">
                {/* Colonne gauche */}
                <div className="col-md-6">
                  <div className="mb-2">
                    <label className="form-label">Module</label>
                    <select
                      className="form-select form-select-sm mb-2"
                      name="IdModule"
                      value={form.IdModule}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Sélectionnez un module</option>
                      {modules.map((m) => (
                        <option key={m.IdModule} value={m.IdModule}>
                          {m.IdNiveau === "1" ? "1ère année" : "2ème année"}
                          {`  - ${m.IdFiliere} - ${m.NomModule} - ${m.DescriptionModule}`}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-2">
                    <label className="form-label">
                      Description de l'examen
                    </label>
                    <textarea
                      className="form-control form-control-sm mb-2"
                      name="DescriptionE"
                      value={form.DescriptionE}
                      onChange={handleChange}
                      rows={1}
                    />
                  </div>
                  <div className="mb-2 d-flex justify-content-between">
                    <div>
                      <label className="form-label">Nombre de questions</label>
                      <input
                        type="number"
                        className="form-control form-control-sm mb-2"
                        name="NbrQuestionsE"
                        value={form.NbrQuestionsE}
                        onChange={handleChange}
                        min={1}
                        required
                      />
                    </div>
                    <div>
                      <label className="form-label">Note par question</label>
                      <input
                        type="number"
                        className="form-control form-control-sm mb-2"
                        name="NotePourQuestion"
                        value={form.NotePourQuestion}
                        onChange={handleChange}
                        min={1}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-2">
                    <label className="form-label">Durée (min)</label>
                    <input
                      type="number"
                      className="form-control form-control-sm mb-2"
                      name="DurationE"
                      value={form.DurationE}
                      onChange={handleChange}
                      min={1}
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Date début</label>
                    <input
                      type="date"
                      className="form-control form-control-sm mb-2"
                      name="DateDebutE"
                      value={form.DateDebutE}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Date fin</label>
                    <input
                      type="date"
                      className="form-control form-control-sm mb-2"
                      name="DateFinE"
                      value={form.DateFinE}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="mt-3 d-flex justify-content-evenly">
                <MyButton
                  typeNm="button"
                  classNm="mb-3 px-4"
                  styleNm={{ backgroundColor: "var(--gris-fonce)" }}
                  onClick={() => navigate("/instructor/gest-examens")}
                >
                  Retour
                </MyButton>
                <MyButton type="submit" classNm="px-4 mb-3">
                  Ajouter
                </MyButton>
              </div>
            </form>
          </>
        }
      />
    </div>
  );
};

export default CreerExamen;
