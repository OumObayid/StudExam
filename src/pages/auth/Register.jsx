import { useState } from "react";
import { useSelector } from "react-redux";
import { selectFilieres } from "../../redux/filiereSlice";
import { selectNiveaux } from "../../redux/niveauSlice";
import { register } from "../../services/auth";
import MyButton from "../../components/button/MyButton";
import { Link, useNavigate } from "react-router-dom";
import { MyAlert } from "../../components/myconfirm/MyAlert";

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

  const navigate = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== passwordConf) {
      MyAlert({
        title: "Erreur",
        text: "Les mots de passe ne correspondent pas.",
        icon: "error",
      });
      return;
    }
    if (
      !cin ||
      !password ||
      !passwordConf ||
      !nom ||
      !prenom ||
      !dateNaissance ||
      !adresse ||
      !email ||
      !tel ||
      !typeMembre ||
      !idNiveau ||
      !idFiliere
    ) {
      MyAlert({
        title: "Attention",
        text: "Veuillez remplir tous les champs !",
        icon: "warning",
      });
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
        MyAlert({
          title: "Success",
          text: "Inscription réussie ! Vous pouvez vous connecter.",
          icon: "success",
        });
         navigate("/login");
      } else {
              MyAlert({
          title: "Success",
          text: `${data.message} || "Erreur lors de l'inscription."`,
          icon: "success",
        });
      }
    } catch (error) {
          MyAlert({
          title: "Success",
          text: error.message,
          icon: "success",
        });
    }
  };

  return (
    <section className="section-auth px-2 row">
      <div className="form-box-register col-12 col-md-6">
        <form onSubmit={handleSubmit} autoComplete="off">
          <h2 className="h2-auth mt-4">Inscription</h2>

          {/* type membre */}
          <div className="row g-3 mb-md-3">
            <div className="col-12">
              <select
                id="typeMembre"
                className="select-auth form-select form-select-sm"
                value={typeMembre}
                onChange={(e) => setTypeMembre(e.target.value)}
                required
              >
                <option value="">Etudiant ou Instructeur?</option>
                <option value="Student">Etudiant</option>
                <option value="Instructor">Instructeur</option>
              </select>
            </div>
          </div>

          {/* Filière et Niveau */}
          {typeMembre === "Student" && (
            <div className="row g-3 mb-2 mt-0">
              <div className="col-12 col-md-6">
                <select
                  id="filiere"
                  className="select-auth form-select form-select-sm"
                  value={idFiliere}
                  onChange={(e) => setIdFiliere(e.target.value)}
                  required
                >
                  <option value="">-- Filière --</option>
                  {filieres.map((filiere) => (
                    <option key={filiere.IdFiliere} value={filiere.IdFiliere}>
                      {filiere.NomFiliere || filiere.IdFiliere}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-12 col-md-6">
                <select
                  id="niveau"
                  className="select-auth form-select form-select-sm"
                  value={idNiveau}
                  onChange={(e) => setIdNiveau(e.target.value)}
                  required
                >
                  <option value="">-- Niveau --</option>
                  {niveaux.map((niveau) => (
                    <option key={niveau.IdNiveau} value={niveau.IdNiveau}>
                      {niveau.NomNiveau || niveau.IdNiveau}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* nom et prénom */}
          <div className=" d-md-flex justify-content-md-center gap-md-3 mx-0">
            <div className="inputbox">
              <i className="icone-i bi bi-person"></i>
              <input
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                className="input-auth"
                type="text"
                required
                autoComplete="off"
              />
              <label>Nom</label>
            </div>
            <div className="inputbox">
              <i className="icone-i bi bi-person"></i>
              <input
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                className="input-auth"
                type="text"
                required
              />
              <label>Prénom</label>
            </div>
          </div>

          {/* cin et date de naissance  */}
          <div className=" d-md-flex justify-content-md-center gap-md-3 mx-0">
            <div className="inputbox">
              <i className="icone-i bi bi-credit-card"></i>
              <input
                value={cin}
                onChange={(e) => setCin(e.target.value)}
                className="input-auth"
                type="text"
                required
              />
              <label>Cin d'identité</label>
            </div>
            <div className=" inputbox">
              <i className="icone-i bi bi-calendar"></i>
              <input
                value={dateNaissance}
                onChange={(e) => setDateNaissance(e.target.value)}
                className="input-auth"
                type="date"
                required
              />
              <label>Date de naissance</label>
            </div>
          </div>

          {/* email et téléphone */}
          <div className=" d-md-flex justify-content-md-center gap-md-3 mx-0">
            <div className=" inputbox">
              <i className="icone-i bi bi-envelope"></i>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-auth"
                type="text"
                required
              />
              <label>Email</label>
            </div>
            <div className="inputbox">
              <i className="icone-i bi bi-telephone"></i>
              <input
                value={tel}
                onChange={(e) => setTel(e.target.value)}
                className="input-auth"
                type="text"
                required
              />
              <label>Téléphone</label>
            </div>
          </div>

          {/* adresse */}
          <div className=" d-md-flex justify-content-md-center gap-md-3 mx-0">
            <div className="inputbox">
              <i className="icone-i bi bi-house"></i>
              <input
                value={adresse}
                onChange={(e) => setAdresse(e.target.value)}
                className="input-auth"
                type="text"
                required
              />
              <label>Adresse</label>
            </div>
          </div>

          {/* confirmation mot de passe */}
          <div className=" d-md-flex justify-content-md-center gap-md-3 mx-0">
            <div className="inputbox">
              <i className="icone-i bi bi-lock"></i>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-auth"
                type="password"
                required
              />
              <label>Mot de passe</label>
            </div>
            <div className="inputbox">
              <i className="icone-i bi bi-lock"></i>
              <input
                value={passwordConf}
                onChange={(e) => setPasswordConf(e.target.value)}
                className="input-auth"
                type="password"
                required
              />
              <label>Confirmer Mot de passe</label>
            </div>
          </div>

          <MyButton
            styleNm={{ color: "var(--dore-clear" }}
            classNm="button-auth mt-3"
            typeNm="submit"
          >
            S'inscrire
          </MyButton>

          <div className="register mt-3">
            <p>
              Vous avez un compte? <Link to="/login">Se connecter</Link>
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}

export default Register;
