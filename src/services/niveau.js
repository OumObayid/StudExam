import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL; // depuis .env

// Login simple avec Axios
export async function getAllNiveaux() {
    try {
        const response = await axios.get(`${API_BASE}/niveaux/getAllNiveaux.php`);
        // On renvoie directement response.data
        return response.data; // { success: true|false, user: {...}, message: "..." }
    } catch (error) {
        const message =
            error.response?.data?.message ||
            "Erreur lors de la récupération des filières";
        throw new Error(message);
    }
}
