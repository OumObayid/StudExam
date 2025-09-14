import { createSlice } from "@reduxjs/toolkit";
const loadUserInfos = () => {
  try {
    const serializedState = localStorage.getItem("filieres");
    if (serializedState === null) return undefined;
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};
const filiereSlice = createSlice({
  name: "filiere",
  initialState: {
    filieres: loadUserInfos() || [],
  },
  reducers: {
    setFilieres: (state, action) => {
      state.filieres = action.payload;
    },
  },
});

export const { setFilieres } = filiereSlice.actions;
export default filiereSlice.reducer;
export const selectFilieres = (state) => state.filiere.filieres;