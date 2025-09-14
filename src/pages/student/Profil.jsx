import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectUserInfos, updateUserInfos } from "../../redux/authSlice";
import { selectNiveaux } from "../../redux/niveauSlice";
import { selectFilieres } from "../../redux/filiereSlice";
import { updateProfile } from "../../services/auth";

const Profil = () => {
    const userInfos = useSelector(selectUserInfos);

    const niveaux =
        useSelector(selectNiveaux).filter((niv) => niv.IdNiveau !== "0") || [];
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
    }, [userInfos]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(updateUserInfos(form));
        updateProfile(form)
            .then((response) => {
                if (response.success) {
                    alert("Profil mis à jour avec succès !");

                    setEditMode(false);
                }
            })
            .catch((err) => {
                console.error("Update profile error:", err);
                alert(
                    "Erreur lors de la mise à jour du profil : " + err.message
                );
            });
    };

    return (
        <div className="container mt-5" style={{ maxWidth: 500 }}>
            <h2 className="mb-4">Profil Étudiant</h2>

            <form onSubmit={handleSubmit}>
                {/* Nom */}
                <div className="mb-3">
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
                <div className="mb-3">
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

                {/* Date Naissance */}
                <div className="mb-3">
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
                <div className="mb-3">
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

                {/* Email */}
                <div className="mb-3">
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
                <div className="mb-3">
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

                {/* Niveau */}
                <div className="mb-3">
                    <label className="form-label">Niveau</label>
                    {!editMode ? (
                        <p className="form-control-plaintext">
                            {niveaux.find((n) => n.IdNiveau === form.IdNiveau)
                                ?.NomNiveau || "Non défini"}
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
                <div className="mb-3">
                    <label className="form-label">Filière</label>
                    {!editMode ? (
                        <p className="form-control-plaintext">
                            {filieres.find(
                                (f) => f.IdFiliere === form.IdFiliere
                            )?.NomFiliere || "Non défini"}
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
                                <option
                                    key={fil.IdFiliere}
                                    value={fil.IdFiliere}
                                >
                                    {fil.NomFiliere}
                                </option>
                            ))}
                        </select>
                    )}
                </div>

                {/* Boutons */}
                {!editMode ? (
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => setEditMode(true)}
                    >
                        Modifier
                    </button>
                ) : (
                    <div>
                        <button type="submit" className="btn btn-success me-2">
                            Enregistrer
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => setEditMode(false)}
                        >
                            Annuler
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
};

export default Profil;
