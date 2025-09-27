import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL; // depuis .env

// Login simple avec Axios
export async function getAllFilieres() {
    try {
        const response = await axios.get(`${API_BASE}/filieres/getAllFilieres.php`);
        // On renvoie directement response.data
        return response.data; // { success: true|false, user: {...}, message: "..." }
    } catch (error) {
        const message =
            error.response?.data?.message ||
            "Erreur lors de la récupération des filières";
        throw new Error(message);
    }
}

export async function ajouterFiliere(IdFiliere,NomFiliere) {
    try {
        const response = await axios.post(`${API_BASE}/filieres/ajouterFiliere.php`,{IdFiliere,NomFiliere});
        // On renvoie directement response.data
        return response.data; // { success: true|false, user: {...}, message: "..." }
    } catch (error) {
        const message =
            error.response?.data?.message ||
            "Erreur lors de l'ajout de la filière";
        throw new Error(message);
    }
}

export async function modifierFiliere( IdFiliere, NomFiliere) {
    try {
        const response = await axios.post(`${API_BASE}/filieres/modifierFiliere.php`,{IdFiliere, NomFiliere});
        // On renvoie directement response.data
        return response.data; 
    } catch (error) {
        const message =
            error.response?.data?.message ||
            "Erreur lors de la modification  du  niveau";
        throw new Error(message);
    }
}
export async function supprimerFiliere(IdFiliere) {
    try {
        const response = await axios.post(`${API_BASE}/filieres/supprimerFiliere.php`,{IdFiliere});
        // On renvoie directement response.data
        return response.data; // { success: true|false, user: {...}, message: "..." }
    } catch (error) {
        const message =
            error.response?.data?.message ||
            "Erreur lors de la suppression de la filière";
        throw new Error(message);
    }
}