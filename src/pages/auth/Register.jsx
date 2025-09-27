import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectFilieres } from "../../redux/filiereSlice";
import { selectNiveaux } from "../../redux/niveauSlice";
import { register } from "../../services/auth";
import { Link } from "react-router-dom";

function Register() {
  const filieres = useSelector(selectFilieres);
  const niveaux = useSelector(selectNiveaux);

  const [cin, setCin] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConf, setPasswordConf] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [dateNaissance, setDateNaissance] = useState("");
  const [adresse, setAdresse] = useState("");
  const [email, setEmail] = useState("");
  const [tel, setTel] = useState("");
  const [typeMembre, setTypeMembre] = useState("");
  const [idNiveau, setIdNiveau] = useState("");
  const [idFiliere, setIdFiliere] = useState("");
  const [message, setMessage] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== passwordConf) {
      setMessage("Les mots de passe ne correspondent pas.");
      setSuccess(false);
      return;
    }

    try {
      const user = {
        CinMembre: cin,
        Password: password,
        Nom: nom,
        Prenom: prenom,
        DateNaissance: dateNaissance,
        Adresse: adresse,
        Email: email,
        Tel: tel,
        TypeMembre: typeMembre,
        IdNiveau: typeMembre === "Student" ? idNiveau : null,
        IdFiliere: typeMembre === "Student" ? idFiliere : null,
      };

      const data = await register(user);

      if (data.success) {
        setMessage("Inscription réussie ! Vous pouvez vous connecter.");
        setSuccess(true);

        setCin("");
        setPassword("");
        setPasswordConf("");
        setNom("");
        setPrenom("");
        setDateNaissance("");
        setAdresse("");
        setEmail("");
        setTel("");
        setTypeMembre("");
        setIdNiveau("");
        setIdFiliere("");
      } else {
        setMessage(data.message || "Erreur lors de l'inscription.");
        setSuccess(false);
      }
    } catch (error) {
      setMessage(error.message);
      setSuccess(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Inscription</h2>

      <form onSubmit={handleSubmit}>
        {/* Type de membre */}
        <div className="mb-3">
          <label htmlFor="typeMembre" className="form-label">Type de membre</label>
          <select
            id="typeMembre"
            className="form-select form-select-sm"
            value={typeMembre}
            onChange={(e) => setTypeMembre(e.target.value)}
            required
          >
            <option value="">Etudiant ou Instructeur?</option>
            <option value="Student">Etudiant</option>
            <option value="Instructor">Instructeur</option>
          </select>
        </div>

        {/* Nom */}
        <div className="mb-3">
          <label htmlFor="nom" className="form-label">Nom</label>
          <input
            id="nom"
            type="text"
            className="form-control form-control-sm"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
          />
        </div>

        {/* Prénom */}
        <div className="mb-3">
          <label htmlFor="prenom" className="form-label">Prénom</label>
          <input
            id="prenom"
            type="text"
            className="form-control form-control-sm"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            required
          />
        </div>

        {/* Date de naissance */}
        <div className="mb-3">
          <label htmlFor="dateNaissance" className="form-label">Date de naissance</label>
          <input
            id="dateNaissance"
            type="date"
            className="form-control form-control-sm"
            value={dateNaissance}
            onChange={(e) => setDateNaissance(e.target.value)}
            required
          />
        </div>

        {/* Adresse */}
        <div className="mb-3">
          <label htmlFor="adresse" className="form-label">Adresse</label>
          <input
            id="adresse"
            type="text"
            className="form-control form-control-sm"
            value={adresse}
            onChange={(e) => setAdresse(e.target.value)}
            required
          />
        </div>

        {/* Email */}
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            id="email"
            type="email"
            className="form-control form-control-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Téléphone */}
        <div className="mb-3">
          <label htmlFor="tel" className="form-label">Téléphone</label>
          <input
            id="tel"
            type="text"
            className="form-control form-control-sm"
            value={tel}
            onChange={(e) => setTel(e.target.value)}
            required
          />
        </div>

        {/* CIN */}
        <div className="mb-3">
          <label htmlFor="cin" className="form-label">CIN</label>
          <input
            id="cin"
            type="text"
            className="form-control form-control-sm"
            value={cin}
            onChange={(e) => setCin(e.target.value)}
            required
          />
        </div>

        {/* Filière et Niveau */}
        {typeMembre === "Student" && (
          <>
            <div className="mb-3">
              <label htmlFor="filiere" className="form-label">Filière</label>
              <select
                id="filiere"
                className="form-select form-select-sm"
                value={idFiliere}
                onChange={(e) => setIdFiliere(e.target.value)}
                required
              >
                <option value="">-- Choisir --</option>
                {filieres.map((filiere) => (
                  <option key={filiere.IdFiliere} value={filiere.IdFiliere}>
                    {filiere.NomFiliere || filiere.IdFiliere}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="niveau" className="form-label">Niveau</label>
              <select
                id="niveau"
                className="form-select form-select-sm"
                value={idNiveau}
                onChange={(e) => setIdNiveau(e.target.value)}
                required
              >
                <option value="">-- Choisir --</option>
                {niveaux.map((niveau) => (
                  <option key={niveau.IdNiveau} value={niveau.IdNiveau}>
                    {niveau.NomNiveau || niveau.IdNiveau}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        {/* Mot de passe */}
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Mot de passe</label>
          <input
            id="password"
            type="password"
            className="form-control form-control-sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Confirmation mot de passe */}
        <div className="mb-3">
          <label htmlFor="passwordConf" className="form-label">Confirmer le mot de passe</label>
          <input
            id="passwordConf"
            type="password"
            className="form-control form-control-sm"
            value={passwordConf}
            onChange={(e) => setPasswordConf(e.target.value)}
            required
          />
        </div>

        {message && (
          <div className={`alert ${success ? "alert-success" : "alert-danger"}`}>
            {message}{" "}
            {success && (
              <Link to="/login" className="alert-link">
                Se connecter
              </Link>
            )}
          </div>
        )}

        <button type="submit" className="btn btn-primary">
          S'inscrire
        </button>
      </form>
    </div>
  );
}

export default Register;
