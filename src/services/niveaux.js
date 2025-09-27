import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL; // depuis .env

export async function getAllNiveaux() {
  try {
    const response = await axios.get(`${API_BASE}/niveaux/getAllNiveaux.php`);
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      "Erreur lors de la récupération des niveaux";
    throw new Error(message);
  }
}

export async function ajouterNiveau(IdNiveau,NomNiveau) {    

    try {
        const response = await axios.post(`${API_BASE}/niveaux/ajouterNiveau.php`,{IdNiveau,NomNiveau});
        // On renvoie directement response.data
        return response.data; // { success: true|false, user: {...}, message: "..." }
    } catch (error) {
        const message =
            error.response?.data?.message ||
            "Erreur lors de l'ajout du niveau";
        throw new Error(message);
    }
}

export async function modifierNiveau( IdNiveau, NomNiveau) {
    try {
        const response = await axios.post(`${API_BASE}/niveaux/modifierNiveau.php`,{IdNiveau, NomNiveau});
        // On renvoie directement response.data
        return response.data; 
    } catch (error) {
        const message =
            error.response?.data?.message ||
            "Erreur lors de la modification  du  niveau";
        throw new Error(message);
    }
}
export async function supprimerNiveau(IdNiveau) {
    try {
        const response = await axios.post(`${API_BASE}/niveaux/supprimerNiveau.php`,{IdNiveau});
        // On renvoie directement response.data
        return response.data; // { success: true|false, user: {...}, message: "..." }
    } catch (error) {
        const message =
            error.response?.data?.message ||
            "Erreur lors de la suppression du niveau";
        throw new Error(message);
    }
}