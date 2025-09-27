import { createSlice } from "@reduxjs/toolkit";

// Charger depuis localStorage
const loadModules = () => {
  try {
    const serializedState = localStorage.getItem("modules");
    if (serializedState === null) return [];
    return JSON.parse(serializedState);
  } catch (err) {
    return [];
  }
};

// Sauvegarder dans localStorage
const saveModules = (modules) => {
  try {
    localStorage.setItem("modules", JSON.stringify(modules));
  } catch (err) {
    console.error("Erreur lors de la sauvegarde des modules", err);
  }
};

const moduleSlice = createSlice({
  name: "module",
  initialState: {
    modules: loadModules(),
  },
  reducers: {
    // CREATE
    addModule: (state, action) => {
      state.modules.push(action.payload);
      saveModules(state.modules);
    },

    // UPDATE
        updateModule: (state, action) => {
      const updated = action.payload; // c'est l'objet niveau complet
       const index = state.modules.findIndex((n) => String(n.IdModule) === String(updated.IdModule));
      if (index !== -1) {
        state.modules[index] = updated; 
        saveModules(state.modules);
      }
    },
    // DELETE
    deleteModule: (state, action) => {
      state.modules = state.modules.filter((m) => String(m.IdModule) !== String(action.payload));
      saveModules(state.modules);
    },

    // SET / RESET (remplace toute la liste)
    setModules: (state, action) => {
      state.modules = action.payload;
      saveModules(state.modules);
    },
  },
});

// Export des actions
export const { addModule, updateModule, deleteModule, setModules } =
  moduleSlice.actions;

// Export reducer
export default moduleSlice.reducer;

// Selector
export const selectModules = (state) => state.module.modules;
