import { createSlice } from "@reduxjs/toolkit";

// Charger depuis localStorage
const loadNiveaux = () => {
  try {
    const serializedState = localStorage.getItem("niveaux");
    if (serializedState === null) return [];
    return JSON.parse(serializedState);
  } catch (err) {
    return [];
  }
};

// Sauvegarder dans localStorage
const saveNiveaux = (niveaux) => {
  try {
    localStorage.setItem("niveaux", JSON.stringify(niveaux));
  } catch (err) {
    console.error("Erreur lors de la sauvegarde des niveaux", err);
  }
};

const niveauSlice = createSlice({
  name: "niveau",
  initialState: {
    niveaux: loadNiveaux(),
  },
  reducers: {
    // CREATE
    addNiveau: (state, action) => {
      state.niveaux.push(action.payload);
      saveNiveaux(state.niveaux);
    },

    // UPDATE
   updateNiveau: (state, action) => {
  const updated = action.payload; // c'est l'objet niveau complet

  const index = state.niveaux.findIndex((n) => String(n.IdNiveau) === String(updated.IdNiveau));
  if (index !== -1) {
    state.niveaux[index] = updated; 
    saveNiveaux(state.niveaux);


  }
},


    // DELETE
    deleteNiveau: (state, action) => {
            console.log('action.payload :', action.payload);

      state.niveaux = state.niveaux.filter((n) => n.IdNiveau !== action.payload);
      saveNiveaux(state.niveaux);
    },

    // SET / RESET (remplace toute la liste)
    setNiveaux: (state, action) => {
      state.niveaux = action.payload;
      saveNiveaux(state.niveaux);
    },
  },
});

// Export des actions
export const { addNiveau, updateNiveau, deleteNiveau, setNiveaux } =
  niveauSlice.actions;

// Export reducer
export default niveauSlice.reducer;

// Selector
export const selectNiveaux = (state) => state.niveau.niveaux;
