import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL; // depuis .env

// Récupérer tous les examens
export async function getAllExamens() {
    try {
        const response = await axios.get(
            `${API_BASE}/examens/getAllExamens.php`
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching all exams:", error);
        throw error;
    }
}

// Récupérer les examens par étudiant
export async function getExamensByStudent(CinMembre) {
    try {
        const response = await axios.post(
            `${API_BASE}/examens/getExamensByStudent.php`,
            { CinMembre }
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching exams by student:", error);
        throw error;
    }
}

// Récupérer l'examen par ID
export async function getExamenById(idExamen, CinMembre) {
    try {
        const response = await axios.post(
            `${API_BASE}/examens/getExamenById.php`,
            { idExamen, CinMembre }
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching exam by ID:", error);
        throw error;
    }
}

// enregistrer le score d'un examen passé
export async function submitExamenResult(cinMembre, idExamen, score) {
    try {
        const response = await axios.post(
            `${API_BASE}/examens/submitExamenResult.php`,
            { cinMembre, idExamen, score }
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching exam by ID:", error);
        throw error;
    }
}


// Récupérer les examens par filière et niveau
export async function getExamensByFiliereAndNiveau(idFiliere, idNiveau) {
    try {
        const response = await axios.get(
            `${API_BASE}/examens/getExamensByFiliereAndNiveau.php`,
            { params: { idFiliere, idNiveau } }
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching exams by filière and niveau:", error);
        throw error;
    }
}

// Ajouter un nouvel examen
export async function addExamen(examen) {
    try {
        const response = await axios.post(
            `${API_BASE}/examens/addExamen.php`,
            examen
        );
        return response.data;
    } catch (error) {
        console.error("Error adding exam:", error);
        throw error;
    }
}

// Mettre à jour un examen
export async function updateExamen(examen) {
    try {
        const response = await axios.put(
            `${API_BASE}/examens/updateExamen.php`,
            examen
        );
        return response.data;
    } catch (error) {
        console.error("Error updating exam:", error);
        throw error;
    }
}
// Supprimer un examen
export async function deleteExamen(idExamen) {
    try {
        const response = await axios.delete(
            `${API_BASE}/examens/deleteExamen.php`,
            {
                params: { idExamen },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error deleting exam:", error);
        throw error;
    }
}
