import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectUserInfos, updateUserInfos } from "../../redux/authSlice";
import { selectNiveaux } from "../../redux/niveauSlice";
import { selectFilieres } from "../../redux/filiereSlice";
import { updateProfile } from "../../services/auth";
import PageTitle from "../../components/PageTitle";
import MyButton from "../../components/button/MyButton";
import Card from "../../components/Card";
import { MyAlert } from "../../components/myconfirm/MyAlert";
const ProfilStudent = () => {
  const userInfos = useSelector(selectUserInfos);

  const niveaux = useSelector(selectNiveaux) || [];

  const filieres = useSelector(selectFilieres) || [];

  const dispatch = useDispatch();

  const [form, setForm] = useState({
    CinMembre: "",
    Nom: "",
    Prenom: "",
    DateNaissance: "",
    Adresse: "",
    Email: "",
    Tel: "",
    IdNiveau: "",
    IdFiliere: "",
  });

  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (userInfos) {
      setForm({
        CinMembre: userInfos.CinMembre || "",
        Nom: userInfos.Nom || "",
        Prenom: userInfos.Prenom || "",
        DateNaissance: userInfos.DateNaissance || "",
        Adresse: userInfos.Adresse || "",
        Email: userInfos.Email || "",
        Tel: userInfos.Tel || "",
        IdNiveau: userInfos.IdNiveau || "",
        IdFiliere: userInfos.IdFiliere || "",
      });
    }
  }, [userInfos, niveaux, filieres]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await updateProfile(form);
      if (response.success) {
        dispatch(updateUserInfos(response.user));
        console.log("response.user :", response.user);
        MyAlert({
            title: "Information",
            text:"Profil mis à jour avec succès !",
            icon: "info",
          });
        setEditMode(false);
      }
    } catch (err) {
      console.error("Update profile error:", err);
      MyAlert({
            title: "Information",
            text:"Erreur lors de la mise à jour du profil : " + err.message,
            icon: "info",
          });
    }
  };

  return (
    <div className=" py-3">
      <PageTitle>Mon Profil</PageTitle>

      <Card
        className="mb-4"
        title="Afficher ou Modifier le profil"
        icon={<i className="bi bi-person fs-4 me-3"></i>}
        content={
          <>
            <form onSubmit={handleSubmit}>
              <div className="row">
                {/* Nom */}
                <div className="col-12 col-md-6 mb-3">
                  <label className="form-label">Nom</label>
                  <input
                    type="text"
                    className="form-control"
                    name="Nom"
                    value={form.Nom}
                    onChange={handleChange}
                    disabled={!editMode}
                  />
                </div>

                {/* Prénom */}
                <div className="col-12 col-md-6 mb-3">
                  <label className="form-label">Prénom</label>
                  <input
                    type="text"
                    className="form-control"
                    name="Prenom"
                    value={form.Prenom}
                    onChange={handleChange}
                    disabled={!editMode}
                  />
                </div>
              </div>

              <div className="row">
                {/* Date Naissance */}
                <div className="col-12 col-md-6 mb-3">
                  <label className="form-label">Date de Naissance</label>
                  <input
                    type="date"
                    className="form-control"
                    name="DateNaissance"
                    value={form.DateNaissance}
                    onChange={handleChange}
                    disabled={!editMode}
                  />
                </div>

                {/* Adresse */}
                <div className="col-12 col-md-6 mb-3">
                  <label className="form-label">Adresse</label>
                  <input
                    type="text"
                    className="form-control"
                    name="Adresse"
                    value={form.Adresse}
                    onChange={handleChange}
                    disabled={!editMode}
                  />
                </div>
              </div>

              <div className="row">
                {/* Email */}
                <div className="col-12 col-md-6 mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="Email"
                    value={form.Email}
                    onChange={handleChange}
                    disabled={!editMode}
                  />
                </div>

                {/* Téléphone */}
                <div className="col-12 col-md-6 mb-3">
                  <label className="form-label">Téléphone</label>
                  <input
                    type="text"
                    className="form-control"
                    name="Tel"
                    value={form.Tel}
                    onChange={handleChange}
                    disabled={!editMode}
                  />
                </div>
              </div>

              <div className="row">
                {/* Niveau */}
                <div className="col-12 col-md-6 mb-3">
                  <label className="form-label">Niveau</label>
                  {!editMode ? (
                    <p
                      style={{
                        backgroundColor: "var(--gris-clear)",
                        borderRadius: "6px",
                        color: "var(--marron)",
                      }}
                      className="p-disaled form-control-plaintext px-3"
                    >
                      {niveaux.find(
                        (n) => String(n.IdNiveau) === String(form.IdNiveau)
                      )?.NomNiveau || "Non défini"}
                    </p>
                  ) : (
                    <select
                      className="form-select"
                      name="IdNiveau"
                      value={form.IdNiveau}
                      onChange={handleChange}
                    >
                      <option value="">-- Choisir un niveau --</option>
                      {niveaux.map((niv) => (
                        <option key={niv.IdNiveau} value={niv.IdNiveau}>
                          {niv.NomNiveau}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Filière */}
                <div className="col-12 col-md-6 mb-3">
                  <label className="form-label">Filière</label>
                  {!editMode ? (
                    <p
                      style={{
                        backgroundColor: "var(--gris-clear)",
                        borderRadius: "6px",
                        color: "var(--marron)",
                      }}
                      className="p-disaled form-control-plaintext px-3"
                    >
                      {filieres.find((f) => f.IdFiliere === form.IdFiliere)
                        ?.NomFiliere || "Non défini"}
                    </p>
                  ) : (
                    <select
                      className="form-select"
                      name="IdFiliere"
                      value={form.IdFiliere}
                      onChange={handleChange}
                    >
                      <option value="">-- Choisir une filière --</option>
                      {filieres.map((fil) => (
                        <option key={fil.IdFiliere} value={fil.IdFiliere}>
                          {fil.NomFiliere}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
              <div className="text-center">
                {/* Boutons */}
                {!editMode ? (
                  <MyButton typeNm="button" onClick={() => setEditMode(true)}>
                    Modifier
                  </MyButton>
                ) : (
                  <div>
                    <MyButton typeNm="submit" classNm="me-2">
                      Enregistrer
                    </MyButton>
                    <MyButton
                      styleNm={{ backgroundColor: "var(--gris)" }}
                      typeNm="button"
                      onClick={() => setEditMode(false)}
                    >
                      Annuler
                    </MyButton>
                  </div>
                )}
              </div>
            </form>
          </>
        }
      />
    </div>
  );
};

export default ProfilStudent;
