import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL; // depuis .env

// Login simple avec Axios
export async function login(CinMembre, Password) {
  try {
    const response = await axios.post(`${API_BASE}/auth/login.php`, { CinMembre, Password });
    // On renvoie directement response.data
    return response.data; // { success: true|false, user: {...}, message: "..." }
  } catch (error) {
    const message = error.response?.data?.message || "Erreur lors du login";
    throw new Error(message);
  }
}

// Register simple avec Axios
export async function register(user) {
  try {
    const response = await axios.post(`${API_BASE}/auth/register.php`, user);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "Erreur lors de l'enregistrement";
    throw new Error(message);
  }
}

// Mettre à jour le profil utilisateur
export async function updateProfile(user) {
console.log('user :', user);
  try {
    const response = await axios.post(`${API_BASE}/auth/updateProfile.php`, user);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "Erreur lors de la mise à jour du profil";
    throw new Error(message);
  }
}
