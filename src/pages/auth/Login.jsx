import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setActiveUser, updateUserInfos } from "../../redux/authSlice";
import { login } from "../../services/auth";
import { getExamensByStudent } from "../../services/examens";
import { setUserExamens } from "../../redux/examenSlice";

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
                        dispatch(setActiveUser());
                        dispatch(updateUserInfos(response.user));
                        if (response.user.TypeMembre === "Etudiant") {
                            await getExamensByStudent(response.user.CinMembre)
                                .then((response) => {
                                    if (response.success) {
                                        dispatch(
                                            setUserExamens(response.examens,
                                            )
                                        );
                                     
                                    }
                                })
                                .catch((err) => {
                                    console.error(
                                        "Error fetching exams after login:",
                                        err
                                    );
                                });
                            navigate("/etudiant/dashboard");
                        } else if (response.user.TypeMembre === "Instructeur") {
                            navigate("/instructeur/dashboard");
                        } else if (response.user.TypeMembre === "Admin") {
                            navigate("/admin/dashboard");
                        } else {
                            navigate("/");
                        }
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
        <div className="container mt-5">
            <h2>Connexion</h2>
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
        </div>
    );
}
