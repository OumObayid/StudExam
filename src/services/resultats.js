import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL; // depuis .env

// ==========================
// Récupérer toutes les questions
// ==========================
export async function getMoyenneClasse(IdExamen) {
  try {
    const response = await axios.post(`${API_BASE}/resultats/moyenneClasse.php`,{IdExamen});
    return response.data;
  } catch (error) {
    console.error("Erreur récupération questions:", error);
    throw error;
  }
}

export async function getResultats() {
  try {
    const response = await axios.get(`${API_BASE}/resultats/getResultats.php`);
    return response.data;
  } catch (error) {
    console.error("Erreur récupération questions:", error);
    throw error;
  }
}