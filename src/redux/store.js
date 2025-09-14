import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import niveauSlice from "./niveauSlice";
import filiereSlice from "./filiereSlice";
import examenSlice from "./examenSlice";

const store = configureStore({
  reducer: {
    auth: authSlice,
    niveau: niveauSlice,
    filiere: filiereSlice,
    examen: examenSlice,
  },
 
});

export default store;

