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

const questionSlice = createSlice({
  name: "question",
  initialState: {
    questions: loadFromStorage("questions") || [],
    userQuestions: loadFromStorage("userQuestions") || [],
  },
  reducers: {
    // Gestion globale des questions
    setQuestions: (state, action) => {
      state.questions = action.payload;
      localStorage.setItem("questions", JSON.stringify(action.payload));
    },
    addQuestions: (state, action) => {
      console.log('action.payload :', action.payload);
      // action.payload est un tableau de questions
      state.questions.push(...action.payload);
      localStorage.setItem("questions", JSON.stringify(state.questions));
    },
    updateQuestions: (state, action) => {
      const index = state.questions.findIndex(
        (q) => String(q.IdQuestion) === String(action.payload.IdQuestion)
      );
      if (index !== -1) {
        state.questions[index] = action.payload;
        localStorage.setItem("questions", JSON.stringify(state.questions));
      }
    },
    //supprimer les question dont l'id examen est IdExamen reçu
    deleteQuestions: (state, action) => {
              console.log('action.payload :', action.payload);

      state.questions = state.questions.filter(
        (q) => String(q.IdExamenQ) !== String(action.payload)
      );
      localStorage.setItem("questions", JSON.stringify(state.questions));
    },

    // Gestion des questions côté utilisateur (ex. student)
    setUserQuestions: (state, action) => {
      state.userQuestions = action.payload;
      localStorage.setItem("userQuestions", JSON.stringify(action.payload));
    },
    addUserQuestions: (state, action) => {
      state.userQuestions.push(action.payload);
      localStorage.setItem(
        "userQuestions",
        JSON.stringify(state.userQuestions)
      );
    },
    updateUserQuestions: (state, action) => {
      const index = state.userQuestions.findIndex(
        (q) => String(q.IdQuestion) === String(action.payload.IdQuestion)
      );
      if (index !== -1) {
        state.userQuestions[index] = action.payload;
        localStorage.setItem(
          "userQuestions",
          JSON.stringify(state.userQuestions)
        );
      }
    },
    deleteUserQuestions: (state, action) => {
      state.userQuestions = state.userQuestions.filter(
        (q) => String(q.IdQuestion) !== String(action.payload)
      );
      localStorage.setItem(
        "userQuestions",
        JSON.stringify(state.userQuestions)
      );
    },
    clearUserQuestions: (state) => {
      state.userQuestions = [];
      localStorage.removeItem("userQuestions");
    },
  },
});

export const {
  setQuestions,
  addQuestions,
  updateQuestions,
  deleteQuestions,
  setUserQuestions,
  addUserQuestions,
  updateUserQuestions,
  deleteUserQuestions,
  clearUserQuestions,
} = questionSlice.actions;

export default questionSlice.reducer;

export const selectQuestions = (state) => state.question.questions;
export const selectUserQuestions = (state) => state.question.userQuestions;
