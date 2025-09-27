import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL; // depuis .env

// ==========================
// Récupérer toutes les questions
// ==========================
export async function getAllQuestions() {
  try {
    const response = await axios.get(
      `${API_BASE}/questions/getAllQuestions.php`
    );
    return response.data;
  } catch (error) {
    console.error("Erreur récupération questions:", error);
    throw error;
  }
}

// ==========================
// Récupérer les questions d'un examen spécifique
// ==========================
export async function getQuestionsByExamen(IdExamen) {
  try {
    const response = await axios.post(
      `${API_BASE}/questions/getQuestionsByExamen.php`,
      { IdExamen }
    );
    return response.data;
  } catch (error) {
    console.error(`Erreur récupération questions examen ${IdExamen}:`, error);
    throw error;
  }
}

// ==========================
// Ajouter plusieurs questions
// ==========================
export async function ajouterQuestions(questions) {
  try {
    const response = await axios.post(
      `${API_BASE}/questions/ajouterQuestions.php`,
      { questions }
    );
    return response.data;
  } catch (error) {
    console.error("Erreur ajout questions:", error);
    throw error;
  }
}

// ==========================
// Modifier une question
// ==========================
export async function modifierQuestions(questions) {
  console.log("questions :", questions);
  try {
    const response = await axios.post(
      `${API_BASE}/questions/modifierQuestions.php`,
      { questions }
    );
    return response.data;
  } catch (error) {
    console.error("Erreur modification question:", error);
    throw error;
  }
}

// ==========================
// Supprimer une question
// ==========================
export async function supprimerQuestions(IdExamen) {
  try {
    const response = await axios.post(
      `${API_BASE}/questions/supprimerQuestions.php`,
      { IdExamen }
    );
    return response.data;
  } catch (error) {
    console.error(
      `Erreur suppression question pour examen ${IdExamen}:`,
      error
    );
    throw error;
  }
}
