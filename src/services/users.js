import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL; // depuis .env

// Obtenir tous les utilisateurs
export async function getAllUsers() {
    try {
        const response = await axios.get(`${API_BASE}/users/getAllUsers.php`);
        // On renvoie directement response.data
        return response.data; // { success: true|false, user: {...}, message: "..." }
    } catch (error) {
        const message =
            error.response?.data?.message ||
            "Erreur lors de la récupération des utilisateurs";
        throw new Error(message);
    }
}

// approuver un utilisateur
export async function approuverUser(CinMembre,ApprouveM) {
    const dataUser={CinMembre,ApprouveM}
  try {
    const response = await axios.post(`${API_BASE}/users/approuverUser.php`, dataUser);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "Erreur lors de l'enregistrement";
    throw new Error(message);
  }
}

// ajouter un utilisateur
export async function ajouterInst(user) {
   
  try {
    const response = await axios.post(`${API_BASE}/users/ajouterUser.php`, user);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "Erreur lors de l'enregistrement";
    throw new Error(message);
  }
}

// supprimer un utilisateur
export async function supprimerUser(CinMembre) {
    const dataUser={CinMembre}
  try {
    const response = await axios.post(`${API_BASE}/users/supprimerUser.php`, dataUser);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "Erreur lors de l'enregistrement";
    throw new Error(message);
  }
}

// obtenir tous les assignements instructeurs modules
export async function getInstructorModules() {
  try {
    const response = await axios.get(`${API_BASE}/users/getInstructorModules.php`);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "Erreur de recuperation des assignement instructeur module";
    throw new Error(message);
  }
}
// assigner un module à l'instructeur
export async function assignerUserModule(IdModule, CinMembre) {

  try {
    const response = await axios.post(`${API_BASE}/users/assignerUserModule.php`, {IdModule, CinMembre});
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "Erreur de lors de l'assignement instructeur module";
    throw new Error(message);
  }
}