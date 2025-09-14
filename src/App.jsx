import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { useEffect } from "react";
import { getAllFilieres } from "./services/filiere";
import { getAllNiveaux } from "./services/niveau";
import { setFilieres } from "./redux/filiereSlice";
import { setNiveaux } from "./redux/niveauSlice";
import { useDispatch } from "react-redux";
function App() {
    const dispatch = useDispatch();
  useEffect(() => {
  const fetchData = async () => {
    try {
      // Charger les filières depuis l'API
      const dataFilieres = await getAllFilieres();
      if (dataFilieres.success) {
        dispatch(setFilieres(dataFilieres.filieres));
      } else {
        console.error(
          dataFilieres.message || "Erreur lors du chargement des filières"
        );
      }

      // Charger les niveaux depuis l'API
      const dataNiveaux = await getAllNiveaux();
      if (dataNiveaux.success) {
        dispatch(setNiveaux(dataNiveaux.niveaux));
      } else {
        console.error(
          dataNiveaux.message || "Erreur lors du chargement des niveaux"
        );
      }
    } catch (err) {
      console.error("Erreur lors de la récupération :", err);
    }
  };

  fetchData();
}, [dispatch]);


    return (
        <BrowserRouter>
            <AppRoutes />
        </BrowserRouter>
    );
}

export default App;
