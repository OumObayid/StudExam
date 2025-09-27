import { createSlice } from "@reduxjs/toolkit";

const loadFromStorage = (key) => {
  try {
    const serializedState = localStorage.getItem(key);
    if (!serializedState) return [];
    return JSON.parse(serializedState);
  } catch {
    return [];
  }
};

const examenSlice = createSlice({
  name: "examen",
  initialState: {
    examens: loadFromStorage("examens") || [],
    userExamens: loadFromStorage("userExamens") || [],
  },
  reducers: {
    // Gestion des examens
    setExamens: (state, action) => {
      state.examens = action.payload;
      localStorage.setItem("examens", JSON.stringify(action.payload));
    },
    addExamen: (state, action) => {
      state.examens.push(action.payload);
      localStorage.setItem("examens", JSON.stringify(state.examens));
    },
    updateExamen: (state, action) => {
      const index = state.examens.findIndex(
        (ex) => String(ex.IdExamen) === String(action.payload.IdExamen)
      );

      if (index !== -1) {
        state.examens[index] = action.payload;
        localStorage.setItem("examens", JSON.stringify(state.examens));
      }
    },

    approveExamen: (state, action) => {
      const { IdExamen, ApprouveE } = action.payload; // on récupère l'id et la nouvelle valeur
      const index = state.examens.findIndex((e) => e.IdExamen === IdExamen);
      if (index !== -1) {
        state.examens[index].ApprouveE = ApprouveE; // maj avec "oui" ou "non"
        localStorage.setItem("examens", JSON.stringify(state.examens));
      }
    },

    publieExamen: (state, action) => {
      const { IdExamen, PublieE } = action.payload; // on récupère l'id et la nouvelle valeur
      console.log("action.payload publieExamen:", action.payload);
      const index = state.examens.findIndex((e) => e.IdExamen === IdExamen);
      if (index !== -1) {
        state.examens[index].PublieE = PublieE; // maj avec "oui" ou "non"
        localStorage.setItem("examens", JSON.stringify(state.examens));
      }
    },

    deleteExamen: (state, action) => {
      state.examens = state.examens.filter(
        (ex) => ex.IdExamen !== Number(action.payload)
      );
      localStorage.setItem("examens", JSON.stringify(state.examens));
    },
    ajouterQuestionsExamen: (state, action) => {
      const { IdExamen, questions } = action.payload;
      const examen = state.examens.find(
        (e) => Number(e.IdExamen) === Number(IdExamen)
      );
      if (examen) {
        examen.questions = questions; // Remplace ou ajoute les questions
      }
    },
    deleteQuestionsExamen: (state, action) => {
  // action.payload = IdExamen
  const IdExamen = action.payload;
  const examen = state.examens.find(
    (e) => Number(e.IdExamen) === Number(IdExamen)
  );

  if (examen) {
    examen.questions = []; // vide le tableau de questions
    localStorage.setItem("examens", JSON.stringify(state.examens));
  }
},

    // Gestion des examens utilisateur
    setUserExamens: (state, action) => {
      state.userExamens = action.payload;
      localStorage.setItem("userExamens", JSON.stringify(action.payload));
    },
    addUserExamen: (state, action) => {
      state.userExamens.push(action.payload);
      localStorage.setItem("userExamens", JSON.stringify(state.userExamens));
    },
    // Mise à jour d'un examen utilisateur
    updateUserExamen: (state, action) => {
      const index = state.userExamens.findIndex(
        (ex) => ex.IdExamen === action.payload.IdExamen
      );
      if (index !== -1) {
        state.userExamens[index] = action.payload;
        localStorage.setItem("userExamens", JSON.stringify(state.userExamens));
      }
    },
    // Mise à jour uniquement du score d'un examen utilisateur
    updateUserExamenScore: (state, action) => {
      const { IdExamen, ScoreR } = action.payload;
      const id = parseInt(IdExamen, 10);
      const index = state.userExamens.findIndex((ex) => ex.IdExamen === id);
      if (index !== -1) {
        state.userExamens[index] = {
          ...state.userExamens[index],
          ScoreR,
        };
        localStorage.setItem("userExamens", JSON.stringify(state.userExamens));
      }
    },

    deleteUserExamen: (state, action) => {
      state.userExamens = state.userExamens.filter(
        (ex) => ex.IdExamen !== action.payload
      );
      localStorage.setItem("userExamens", JSON.stringify(state.userExamens));
    },
    clearUserExamens: (state) => {
      state.userExamens = [];
      localStorage.removeItem("userExamens");
    },
  },
});

export const {
  setExamens,
  setUserExamens,
  addExamen,
  addUserExamen,
  updateExamen,
  approveExamen,
  publieExamen,
  ajouterQuestionsExamen,
  deleteQuestionsExamen,
  updateUserExamen,
  updateUserExamenScore,
  deleteExamen,
  deleteUserExamen,
  clearUserExamens,
} = examenSlice.actions;

export default examenSlice.reducer;

export const selectExamens = (state) => state.examen.examens;
export const selectUserExamens = (state) => state.examen.userExamens;
