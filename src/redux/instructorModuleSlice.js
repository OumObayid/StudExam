import { createSlice } from "@reduxjs/toolkit";

// Charger depuis localStorage si tu veux persister
const loadInstructorModules = () => {
  try {
    const serializedState = localStorage.getItem("instructorModules");
    if (!serializedState) return [];
    return JSON.parse(serializedState);
  } catch (err) {
    return [];
  }
};

const saveInstructorModules = (modules) => {
  try {
    localStorage.setItem("instructorModules", JSON.stringify(modules));
  } catch (err) {
    console.error(err);
  }
};

const instructorModuleSlice = createSlice({
  name: "instructorModule",
  initialState: {
    instructorModules: loadInstructorModules(), // correspond au JSON que tu as reçu
  },
  reducers: {
    setInstructorModules: (state, action) => {
      
      state.instructorModules = action.payload;
      saveInstructorModules(state.instructorModules);
    },
    addInstructorModule: (state, action) => {
      state.instructorModules.push(action.payload);
      saveInstructorModules(state.instructorModules);
    },
    removeInstructorModule: (state, action) => {
      state.instructorModules = state.instructorModules.filter(
        (im) =>
          !(
            im.CinInstructor === action.payload.CinInstructor &&
            String(im.IdModule) === String(action.payload.IdModule)
          )
      );
      saveInstructorModules(state.instructorModules);
    },
  },
});

// Export des actions
export const {
  setInstructorModules,
  addInstructorModule,
  removeInstructorModule,
} = instructorModuleSlice.actions;

// Selector sûr
export const selectInstructorModules = (state) =>
  state.instructorModule?.instructorModules || [];

// Reducer
export default instructorModuleSlice.reducer;
