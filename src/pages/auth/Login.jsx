import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setActiveUser, updateUserInfos } from "../../redux/authSlice";
import { login } from "../../services/auth";
import { getExamensByStudent } from "../../services/examens";
import { setUserExamens } from "../../redux/examenSlice";
import { getAllUsers } from "../../services/users";
import { setUsers } from "../../redux/userSlice";
import MyButton from "../../components/button/MyButton";
import "./Auth.css"; // Assure-toi de mettre ton CSS ici
import { MyAlert } from "../../components/myconfirm/MyAlert";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [cin, setCin] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cin || !password) {
       MyAlert({
              title: "Attention",
              text: "Veuillez remplir tous les champs !",
              icon: "warning",
            });
      return;
    }
    try {
       console.log('password :', password);
      await login(cin, password)     
        .then(async (response) => {
          if (response.success) {
            if (response.user.ApprouveM == "oui") {
              dispatch(setActiveUser());
              dispatch(updateUserInfos(response.user));
              if (response.user.TypeMembre === "Student") {
                await getExamensByStudent(response.user.CinMembre)
                  .then((response) => {
                    if (response.success) {
                      dispatch(setUserExamens(response.examens));
                      console.log("response.examens :", response.examens);
                    }
                  })
                  .catch((err) => {
                    console.error("Error fetching exams after login:", err);
                  });
                navigate("/student/dashboard");
              } else if (response.user.TypeMembre === "Instructor") {
                navigate("/instructor/dashboard");
              } else if (response.user.TypeMembre === "Admin") {
                await getAllUsers()
                  .then((response) => {
                    if (response.success) {
                      dispatch(setUsers(response.users));
                    } else console.log(response.message);
                  })
                  .catch((err) => console.log(err));

                navigate("/admin/dashboard");
              } else {
                navigate("/");
              }
            } else
            
            MyAlert({
              title: "Patience",
              text: "Votre inscription n'est pas encore approuvée par l'Admin",
              icon: "warning",
            });
          } else {
             MyAlert({
              title: "Erreur",
              text: `${response.message} || "Erreur de connexion"`,
              icon: "error",
            });
          }
        })
        .catch((err) => {
          console.error("Login error:", err);
          throw err;
        })
        .finally(() => {
          setCin("");
          setPassword("");
        });
    } catch (error) {
      console.error("Login failed:", error);
       MyAlert({
              title: "Erreur",
              text: error.message,
              icon: "error",
            });
    }
  };
  return (
    <section className="section-auth px-2">
      <div className="form-box-login">
        <div className="form-value ">
          <form onSubmit={handleSubmit} >
            <h2 className="h2-auth">Connexion</h2>
            <div className="inputbox">
              <i className="icone-i bi bi-envelope"></i>
              <input
                value={cin}
                onChange={(e) => setCin(e.target.value)}
                className="input-auth"
                type="text"
                required
              />
              <label>Cin Identité</label>
            </div>

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

            <div className="forget text-center">
              <a href="#">Mot de passe oublié?</a>
            </div>

            <MyButton
              styleNm={{ color: "var(--dore-clear" }}
              classNm="button-auth"
              typeNm="submit"
            >
              Se connecter
            </MyButton>

            <div className="register">
              <p>
                Vous n'avez de compte? <Link to="/register">S'inscrire</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;
