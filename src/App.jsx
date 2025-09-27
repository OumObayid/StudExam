import { BrowserRouter, useLocation } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { useEffect } from "react";
import { getAllFilieres } from "./services/filieres";
import { getAllNiveaux } from "./services/niveaux";
import { setFilieres } from "./redux/filiereSlice";
import { setNiveaux } from "./redux/niveauSlice";
import { useDispatch } from "react-redux";
import { getAllModules } from "./services/modules";
import { setModules } from "./redux/moduleSlice";
import { getAllExamens } from "./services/examens";
import { setExamens } from "./redux/examenSlice";
import { getAllPassations } from "./services/passations";
import { setPassations } from "./redux/passationSlice";
import {  getAllUsers, getInstructorModules } from "./services/users";
import { setUsers } from "./redux/userSlice";
import { setInstructorModules } from "./redux/instructorModuleSlice";

function AppContent() {
  const dispatch = useDispatch();
  const location = useLocation();

  // Charger filières, niveaux et modules
  useEffect(() => {
    const fetchData = async () => {
      try {
        // filières
        const responseFilieres = await getAllFilieres();
        if (responseFilieres.success) {
          dispatch(setFilieres(responseFilieres.filieres));
        } else {
          console.error(
            responseFilieres.message || "Erreur lors du chargement des filières"
          );
        }
        //niveau
        const responseNiveaux = await getAllNiveaux();
        if (responseNiveaux.success) {
          dispatch(setNiveaux(responseNiveaux.niveaux));
        } else {
          console.error(
            responseNiveaux.message || "Erreur lors du chargement des niveaux"
          );
        }
        //modules
        const responseModules = await getAllModules();
        if (responseModules.success) {
          dispatch(setModules(responseModules.modules));
        } else {
          console.error(
            responseModules.message || "Erreur lors du chargement des niveaux"
          );
        }
        //users
        await getAllUsers()
          .then(async (response) => {
            if (response.success) {
              dispatch(setUsers(response.users));
            } else console.log(response.message);
          })
          .catch((err) => console.log(err));

        //examens
        await getAllExamens()
          .then((response) => {
            if (response.success) {
              dispatch(setExamens(response.examens));
            } else console.log(response.message);
          })
          .catch((err) => console.log(err));

        //passation
        const responsePassations = await getAllPassations();
        if (responsePassations.success) {
          dispatch(setPassations(responsePassations.passations));
        } else {
          console.error(
            responsePassations.message ||
              "Erreur lors du chargement des passations"
          );
        }

        // instructor_module
          const responseInstrMod = await getInstructorModules();
        if (responseInstrMod.success) {
          dispatch(setInstructorModules(responseInstrMod.instructorModules));
        } else {
          console.error(
            responseInstrMod.message ||
              "Erreur lors du chargement des instructeurs_modules"
          );
        }
      } catch (err) {
        console.error("Erreur lors du chargement des données :", err);
      }
    };

    fetchData();
  }, [dispatch]);

  // Scroll en haut à chaque changement de route
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return <AppRoutes />;
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
