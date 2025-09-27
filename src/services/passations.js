import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL; // défini dans ton .env

// 🔹 Récupérer toutes les passations
export async function getAllPassations() {
  try {
    const response = await axios.get(
      `${API_BASE}/passations/getAllPassations.php`
    );
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      "Erreur lors de la récupération des passations";
    throw new Error(message);
  }
}

// 🔹 Récupérer une passation par ID
export async function getPassationById(IdPassation) {
  try {
    const response = await axios.post(
      `${API_BASE}/passations/getPassation.php`,{ IdPassation }
    );
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      "Erreur lors de la récupération de la passation";
    throw new Error(message);
  }
}

// 🔹 Créer une passation
export async function addPassation(passation) {
  try {
    const response = await axios.post(
      `${API_BASE}/passations/addPassation.php`,
      passation
    );
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message || "Erreur lors de l'ajout de la passation";
    throw new Error(message);
  }
}

// 🔹 Mettre à jour une passation
export async function updatePassation(passation) {
  try {
    const response = await axios.post(
      `${API_BASE}/passations/updatePassation.php`,
      passation
    );
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      "Erreur lors de la mise à jour de la passation";
    throw new Error(message);
  }
}

// 🔹 Supprimer une passation
export async function supprimerPassation(IdPassation) {
  try {
    const response = await axios.post(
      `${API_BASE}/passations/deletePassation.php`,
      { IdPassation }
    );
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      "Erreur lors de la suppression de la passation";
    throw new Error(message);
  }
}


// 🔹 Supprimer une passation
export async function ouvrirPassation(IdExamen, CinMembre, Questions) {
  console.log('{ IdExamen, CinMembre, Questions } :', { IdExamen, CinMembre, Questions });
        console.log(' { IdExamen, CinMembre, Questions } :',  { IdExamen, CinMembre, Questions });
        console.log('{ IdExamen, CinMembre, Questions } :', { IdExamen, CinMembre, Questions });

  try {
    const response = await axios.post(
      `${API_BASE}/passations/ouvrirPassation.php`,
      { IdExamen, CinMembre, Questions }
    );
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      "Erreur lors de l'ouverture de la passation";
    throw new Error(message);
  }
}