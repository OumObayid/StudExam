import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setActiveUser, updateUserInfos } from "../../redux/authSlice";
import { login } from "../../services/auth";
import { getExamensByStudent } from "../../services/examens";
import { setUserExamens } from "../../redux/examenSlice";
import { getAllUsers } from "../../services/users";
import { setUsers } from "../../redux/userSlice";
import Card from "../../components/Card";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [cin, setCin] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cin || !password) {
      setMessage("Veuillez remplir tous les champs !");
      return;
    }
    try {
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
              setMessage(
                "Votre inscription n'est pas encore approuvée par l'Admin"
              );
          } else {
            setMessage(response.message || "Erreur de connexion");
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
      setMessage(error.message);
    }
  };

  return (
    <div className="mt-5">
      <Card className="mb-4"
        title="Connexion"
  icon={<i className="bi bi-box-arrow-in-right fs-4 text-primary"></i>}
        content={
          <>
            {message && <div className="alert alert-danger">{message}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">CIN</label>
                <input
                  type="text"
                  className="form-control"
                  value={cin}
                  onChange={(e) => setCin(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Mot de passe</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Login
              </button>
            </form>
          </>
        }
        bgColor="#ece1be"
      />
      ;
    </div>
  );
}
