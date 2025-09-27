import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL; // depuis .env

export async function getAllModules() {
  try {
    const response = await axios.get(`${API_BASE}/modules/getAllModules.php`);
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      "Erreur lors de la récupération des modules";
    throw new Error(message);
  }
}

export async function ajouterModule(IdFiliere, IdNiveau, NomModule, DescriptionModule) {
     try {
        const response = await axios.post(`${API_BASE}/modules/ajouterModule.php`,{IdFiliere, IdNiveau, NomModule, DescriptionModule});
       
        // On renvoie directement response.data
        return response.data; 
    } catch (error) {
        const message =
            error.response?.data?.message ||
            "Erreur lors de l'ajout  du  module";
        throw new Error(message);
    }
}
export async function modifierModule(IdModule,IdFiliere, IdNiveau, NomModule, DescriptionModule) {
    try {
        const response = await axios.post(`${API_BASE}/modules/modifierModule.php`,{IdModule,IdFiliere, IdNiveau, NomModule, DescriptionModule});
        // On renvoie directement response.data
        return response.data; 
    } catch (error) {
        const message =
            error.response?.data?.message ||
            "Erreur lors de la modification  du  module";
        throw new Error(message);
    }
}


export async function supprimerModule(IdModule) {
    try {
        const response = await axios.post(`${API_BASE}/modules/supprimerModule.php`,{IdModule});
        // On renvoie directement response.data
        return response.data; 
    } catch (error) {
        const message =
            error.response?.data?.message ||
            "Erreur lors de la suppression du module";
        throw new Error(message);
    }
}
