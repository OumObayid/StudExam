import { createSlice } from "@reduxjs/toolkit";

// Charger depuis localStorage
const loadFilieres = () => {
  try {
    const serializedState = localStorage.getItem("filieres");
    if (serializedState === null) return [];
    return JSON.parse(serializedState);
  } catch (err) {
    return [];
  }
};

// Sauvegarder dans localStorage
const saveFilieres = (filieres) => {
  try {
    localStorage.setItem("filieres", JSON.stringify(filieres));
  } catch (err) {
    console.error("Erreur lors de la sauvegarde des filières", err);
  }
};

const filiereSlice = createSlice({
  name: "filiere",
  initialState: {
    filieres: loadFilieres(),
  },
  reducers: {
    // CREATE
    addFiliere: (state, action) => {
      state.filieres.push(action.payload);
      saveFilieres(state.filieres);
    },

    // READ (on a déjà selectFilieres comme selector)

    // UPDATE

   updateFiliere: (state, action) => {
  const updated = action.payload; // c'est l'objet niveau complet
   const index = state.filieres.findIndex((n) => String(n.IdFiliere) === String(updated.IdFiliere));
  if (index !== -1) {
    state.filieres[index] = updated; 
    saveFilieres(state.filieres);
  }
},
    // DELETE
    deleteFiliere: (state, action) => {
      state.filieres = state.filieres.filter((f) => String(f.IdFiliere) !== String(action.payload));
      saveFilieres(state.filieres);
    },

    // SET / RESET (remplacer toute la liste)
    setFilieres: (state, action) => {
      state.filieres = action.payload;
      saveFilieres(state.filieres);
    },
  },
});

// Export des actions
export const { addFiliere, updateFiliere, deleteFiliere, setFilieres } =
  filiereSlice.actions;

// Export reducer
export default filiereSlice.reducer;

// Selector
export const selectFilieres = (state) => state.filiere.filieres;
