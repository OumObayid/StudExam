import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import niveauSlice from "./niveauSlice";
import filiereSlice from "./filiereSlice";
import moduleSlice from "./moduleSlice";
import examenSlice from "./examenSlice";
import userSlice from "./userSlice";
import passationSlice from "./passationSlice";
import questionSlice from "./questionSlice";
import instructorModuleSlice from "./instructorModuleSlice";

const store = configureStore({
  reducer: {
    auth: authSlice,
    niveau: niveauSlice,
    filiere: filiereSlice,
    module: moduleSlice,
    examen: examenSlice,
    user: userSlice,
    passation:passationSlice,
    question: questionSlice,
    instructorModule:instructorModuleSlice,
  },
 
});

export default store;

