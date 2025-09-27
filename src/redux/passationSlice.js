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

const passationSlice = createSlice({
  name: "passation",
  initialState: {
    passations: loadFromStorage("passations") || [],
    userPassations: loadFromStorage("userPassations") || [],
  },
  reducers: {
    // Gestion des passations
    setPassations: (state, action) => {
      state.passations = action.payload;
      localStorage.setItem("passations", JSON.stringify(action.payload));
    },
    addPassation: (state, action) => {
      state.passations.push(action.payload);
      localStorage.setItem("passations", JSON.stringify(state.passations));
    },
    updatePassation: (state, action) => {
      const index = state.passations.findIndex(
        (p) => String(p.IdPassation) === String(action.payload.IdPassation)
      );
      if (index !== -1) {
        state.passations[index] = action.payload;
        localStorage.setItem("passations", JSON.stringify(state.passations));
      }
    },
    deletePassation: (state, action) => {
      state.passations = state.passations.filter(
        (p) => String(p.IdPassation) !== String(action.payload)
      );
      localStorage.setItem("passations", JSON.stringify(state.passations));
    },

    // Gestion des passations de l'utilisateur connecté
    setUserPassations: (state, action) => {
      state.userPassations = action.payload;
      localStorage.setItem("userPassations", JSON.stringify(action.payload));
    },
    addUserPassation: (state, action) => {
      state.userPassations.push(action.payload);
      localStorage.setItem("userPassations", JSON.stringify(state.userPassations));
    },
    updateUserPassation: (state, action) => {
      const index = state.userPassations.findIndex(
        (p) => String(p.IdPassation) === String(action.payload.IdPassation)
      );
      if (index !== -1) {
        state.userPassations[index] = action.payload;
        localStorage.setItem("userPassations", JSON.stringify(state.userPassations));
      }
    },
    updateUserPassationScore: (state, action) => {
      const { IdPassation, ScoreR } = action.payload;
      const index = state.userPassations.findIndex(
        (p) => String(p.IdPassation) === String(IdPassation)
      );
      if (index !== -1) {
        state.userPassations[index] = {
          ...state.userPassations[index],
          ScoreR,
        };
        localStorage.setItem("userPassations", JSON.stringify(state.userPassations));
      }
    },
    deleteUserPassation: (state, action) => {
      state.userPassations = state.userPassations.filter(
        (p) => String(p.IdPassation) !== String(action.payload)
      );
      localStorage.setItem("userPassations", JSON.stringify(state.userPassations));
    },
    clearUserPassations: (state) => {
      state.userPassations = [];
      localStorage.removeItem("userPassations");
    },
  },
});

export const {
  setPassations,
  setUserPassations,
  addPassation,
  addUserPassation,
  updatePassation,
  updateUserPassation,
  updateUserPassationScore,
  deletePassation,
  deleteUserPassation,
  clearUserPassations,
} = passationSlice.actions;

export default passationSlice.reducer;

export const selectPassations = (state) => state.passation.passations;
export const selectUserPassations = (state) => state.passation.userPassations;
