import { Routes, Route } from "react-router-dom";

// Layouts
import PublicLayout from "../layouts/PublicLayout";
import AdminLayout from "../layouts/AdminLayout";
import InstructorLayout from "../layouts/InstructorLayout";
import StudentLayout from "../layouts/StudentLayout";

// Pages publiques
import Home from "../pages/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
// Admin pages
import AdminDashboard from "../pages/admin/Dashboard";
import AjoutMembre from "../pages/admin/AjoutMembre";
import AffModCompte from "../pages/admin/AffModCompte";
import Approuver from "../pages/admin/Approuver";
import Gerer from "../pages/admin/Gerer";
import GestionSite from "../pages/admin/GestionSite";
import ValiderModifierCompte from "../pages/admin/ValiderModifierCompte";
import ValiderModifierGestionSite from "../pages/admin/ValiderModifierGestionSite";

// Instructor pages
import InstructorDashboard from "../pages/instructor/Dashboard";
import CreerExamen from "../pages/instructor/CreerExamen";
import CreerQuestion from "../pages/instructor/CreerQuestion";
import ExamensCrees from "../pages/instructor/ExamensCrees";
import ActionModifierQuestion from "../pages/instructor/ActionModifierQuestion";
import AfficherModifierQuestionInstr from "../pages/instructor/AfficherModifierQuestionInstr";
import ModifierExamen from "../pages/instructor/ModifierExamen";

// Student pages
import StudentDashboard from "../pages/student/Dashboard";
import MesExamens from "../pages/student/MesExamens";
import Statistiques from "../pages/student/MesStatistiques";
import PasserExamen from "../pages/student/PasserExamen";
import Profil from "../pages/student/Profil";
import Contact from "../pages/Contact";




export default function AppRoutes() {
    return (
        <Routes>
            {/* Pages publiques */}
            <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/contact" element={<Contact />} />
            </Route>

            {/* Pages Admin */}
            <Route path="/admin/*" element={<AdminLayout />}>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="ajout-membre" element={<AjoutMembre />} />
                <Route path="aff-mod-compte" element={<AffModCompte />} />
                <Route path="approuver" element={<Approuver />} />
                <Route path="gerer" element={<Gerer />} />
                <Route path="gestion-site" element={<GestionSite />} />
                <Route
                    path="valider-mod-compte"
                    element={<ValiderModifierCompte />}
                />
                <Route
                    path="valider-mod-gestion-site"
                    element={<ValiderModifierGestionSite />}
                />
                <Route path="statistiques" element={<Statistiques />} />
            </Route>

            {/* Pages Instructor */}
            <Route path="/instructeur/*" element={<InstructorLayout />}>
                <Route path="dashboard" element={<InstructorDashboard />} />
                <Route path="creer-examen" element={<CreerExamen />} />
                <Route path="creer-question" element={<CreerQuestion />} />
                <Route path="examens-crees" element={<ExamensCrees />} />
                <Route
                    path="action-mod-question"
                    element={<ActionModifierQuestion />}
                />
                <Route
                    path="aff-mod-question-instr"
                    element={<AfficherModifierQuestionInstr />}
                />
                <Route path="modifier-examen" element={<ModifierExamen />} />
            </Route>

            {/* Pages Student */}
            <Route path="/etudiant/*" element={<StudentLayout />}>
                <Route path="dashboard" element={<StudentDashboard />} />
                <Route path="profil" element={<Profil />} />
                <Route path="mes-examens" element={<MesExamens />} />
                <Route path="statistiques" element={<Statistiques />} />
                <Route path="passer-examen/:idExamen" element={<PasserExamen />} />
                
            </Route>

        </Routes>
    );
}
