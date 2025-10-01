import React from "react";

import { Routes, Route } from "react-router-dom";

// Layouts
import PublicLayout from "../layouts/PublicLayout";
import AdminLayout from "../layouts/AdminLayout";
import InstructorLayout from "../layouts/InstructorLayout";
import StudentLayout from "../layouts/StudentLayout";

// Pages publiques
import Home from "../pages/public/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Contact from "../pages/public/Contact";
import About from "../pages/public/About";

// Admin pages
import DashboardAdmin from "../pages/admin/DashboardAdmin";
import GestionExamen from "../pages/admin/GestionExamen";
import GestionInstructor from "../pages/admin/GestionInstructor";
import GestionStudent from "../pages/admin/GestionStudent";
import ExamenDetailAdmin from "../pages/admin/ExamenDetailAdmin";
import GestionNote from "../pages/admin/GestionNote";
import GestionNiveau from "../pages/admin/GestionNiveau";
import GestionFiliere from "../pages/admin/GestionFiliere";
import GestionModule from "../pages/admin/GestionModule";
import ModifierNiveau from "../pages/admin/ModifierNiveau";
import ModifierFiliere from "../pages/admin/ModifierFiliere";
import ModifierModule from "../pages/admin/ModifierModule";
import AfficherStudent from "../pages/admin/AfficherStudent";

// Instructor pages
import DashboardInstructor from "../pages/instructor/DashboardInstructor";
import ProfilInstructor from "../pages/instructor/ProfilInstructor";
import GestionExamens from "../pages/instructor/GestionExamens";
import AffExamen from "../pages/instructor/AffExamen";
import ModifierExamen from "../pages/instructor/ModifierExamen";
import CreerExamen from "../pages/instructor/CreerExamen";
import CreerQuestions from "../pages/instructor/CreerQuestions";
import AfficherQuestions from "../pages/instructor/afficherQuestions";
import ModifierQuestion from "../pages/instructor/ModifierQuestion";
import AfficherInstructor from "../pages/admin/AfficherInstructor";
import GestionAffectation from "../pages/admin/GestionAffectation";
// Student pages
import DashboardStudent from "../pages/student/DashboardStudent";
import ProfilStudent from "../pages/student/ProfilStudent";
import MesExamens from "../pages/student/MesExamens";
import PasserExamen from "../pages/student/PasserExamen";
import ProtectedRoute from "./ProtectedRoute";
import MesResultats from "../pages/student/MesResultats";

//page non trouvée ou non autorisé
import NotFound from "../pages/public/notFound/NotFound";
import Unauthorized from "../pages/public/Unauthorized";
import MesClasses from "../pages/instructor/MesClasses";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Pages publiques */}
      <Route element={<PublicLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Route>
      <Route path="" element={<Home />} />
      <Route path="/about" element={<About />} />

      {/* Pages Admin */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute typesMembre={["Admin"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardAdmin />} />
        <Route path="dashboard" element={<DashboardAdmin />} />
        <Route path="gest-niveau" element={<GestionNiveau />} />
        <Route path="mod-niveau/:idParams" element={<ModifierNiveau />} />
        <Route path="gest-filiere" element={<GestionFiliere />} />
        <Route path="mod-filiere/:idParams" element={<ModifierFiliere />} />
        <Route path="gest-module" element={<GestionModule />} />
        <Route path="mod-module/:idParams" element={<ModifierModule />} />
        <Route path="gest-instructor" element={<GestionInstructor />} />
        <Route path="aff-instr/:idParams" element={<AfficherInstructor />} />
        <Route path="gest-affect" element={<GestionAffectation />} />
        <Route path="gest-student" element={<GestionStudent />} />
        <Route path="aff-stud/:idParams" element={<AfficherStudent />} />
        <Route path="gest-examen" element={<GestionExamen />} />
        <Route
          path="detail-examen-admin/:idParams"
          element={<ExamenDetailAdmin />}
        />
        <Route path="gest-note" element={<GestionNote />} />
      </Route>

      {/* Pages Instructor */}
      <Route
        path="/instructor"
        element={
          <ProtectedRoute typesMembre={["Instructor"]}>
            <InstructorLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardInstructor />} />
        <Route path="dashboard" element={<DashboardInstructor />} />
        <Route path="profil-instructor" element={<ProfilInstructor />} />
        <Route path="gest-examens" element={<GestionExamens />} />
        <Route path="creer-examen" element={<CreerExamen />} />
        <Route path="mes-classes" element={<MesClasses />} />
        <Route path="mod-examen/:IdExamen" element={<ModifierExamen />} />
        <Route path="aff-examen/:idParams" element={<AffExamen />} />

        <Route path="creer-questions/:IdExamen" element={<CreerQuestions />} />
        <Route path="aff-questions/:IdExamen" element={<AfficherQuestions />} />
        <Route path="mod-questions/:IdExamen" element={<ModifierQuestion />} />
      </Route>

      {/* Pages Student */}
      <Route
        path="/student"
        element={
          <ProtectedRoute typesMembre={["Student"]}>
            <StudentLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardStudent />} />
        <Route path="dashboard" element={<DashboardStudent />} />
        <Route path="profil-student" element={<ProfilStudent />} />
        <Route path="mes-examens" element={<MesExamens />} />
        <Route path="mes-resultats" element={<MesResultats />} />
        <Route path="passer-examen/:IdExamen" element={<PasserExamen />} />
      </Route>

      {/* Route NotFound */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
