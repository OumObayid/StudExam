import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { updateExamen } from "../../redux/examenSlice";
import { selectExamens } from "../../redux/examenSlice";
import { selectModules } from "../../redux/moduleSlice";
import { modifierExamen } from "../../services/examens";
import { selectUserInfos } from "../../redux/authSlice";
import dayjs from "dayjs";
import MyButton from "../../components/button/MyButton";
import PageTitle from "../../components/PageTitle";
import Card from "../../components/Card";
import { MyAlert } from "../../components/myconfirm/MyAlert";

const ModifierExamen = () => {
  const { IdExamen } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const examens = useSelector(selectExamens);
  const modules = useSelector(selectModules);
  const userInfos = useSelector(selectUserInfos) || null;

  const examen = examens.find((e) => String(e.IdExamen) === String(IdExamen));

  const [form, setForm] = useState(null);

  useEffect(() => {
    if (examen) {
      // Ne garder que les champs nécessaires
      setForm({
        IdExamen: IdExamen,
        IdModule: examen.IdModule || "",
        DescriptionE: examen.DescriptionE || "",
        NbrQuestionsE: examen.NbrQuestionsE || 1,
        NotePourQuestion: examen.NotePourQuestion || 1,
        DurationE: examen.DurationE || 1,
        DateDebutE: examen.DateDebutE || dayjs().format("YYYY-MM-DD"),
        DateFinE: examen.DateFinE || dayjs().format("YYYY-MM-DD"),
        PublieE: examen.PublieE || "non",
        CreeParCinMembre: userInfos?.CinMembre || "",
        ApprouveE: examen.ApprouveE || "non",
      });
    }
  }, [examen, userInfos]);

  if (!form) {
    return <div className="container mt-4">Chargement de l'examen...</div>;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleUpdateExamen = async (e) => {
    e.preventDefault();

    try {
      // n’envoyer que les champs limités
      const dataToSend = { ...form };
      const response = await modifierExamen(dataToSend);
      if (response.success) {
        const updatedExamen = response.examen;
        dispatch(updateExamen(updatedExamen));
        MyAlert({
            title: "Success",
            text: "Examen modifié avec succès !",
            icon: "success",
          });
        navigate("/instructor/gest-examens");
      } else {
         MyAlert({
            title: "Erreur",
            text: `${response.message || "Erreur lors de la modification"}`,
            icon: "erreur",
          });
      }
    } catch (error) {
      console.error("Erreur modification examen :", error);      
      MyAlert({
            title: "Erreur",
            text:"Impossible de modifier l'examen !",
            icon: "erreur",
          });
    }
  };

  return (
    <div className=" py-3">
      <PageTitle>Gestion des examens</PageTitle>
      <div className=" d-md-flex justify-content-between align-items-center">
        <h5 className="mb-3">{form.DescriptionE}</h5>
        <div className="text-end">
        <MyButton
          classNm="py-2 mb-3"
          onClick={() => navigate("/instructor/gest-examens")}
        >
          Retour
        </MyButton>
        </div>
      </div>

      <Card
        className="mb-4"
        title="Modifier examen"
        icon={<i className="bi bi-journal-text fs-4 me-3"></i>}
        content={
          <>
            <form onSubmit={handleUpdateExamen}>
              <div className="row g-3">
                {/* Colonne gauche */}
                <div className="col-md-6">
                  <div className="mb-3">
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
                          {`${m.NomModule} - ${m.DescriptionModule} - ${m.IdFiliere}`}{" "}
                          - {m.IdNiveaux === 1 ? "1ère année" : "2ème année"}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
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
                  <div className="d-md-flex  justify-content-between">
                    <div className="mb-3">
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
                    <div className="mb-3">
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

                {/* Colonne droite */}
                <div className="col-md-6">
                  <div className="mb-3">
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
                  <div className="mb-3">
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
                  <div className="mb-3">
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

              <div className="mt-3 d-flex justify-content-center">
                <MyButton typeNm="submit" classNm="px-4 mb-3">
                  Enregistrer
                </MyButton>
              </div>
            </form>
          </>
        }
      />
    </div>
  );
};

export default ModifierExamen;
