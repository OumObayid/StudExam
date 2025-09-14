import { createSlice } from "@reduxjs/toolkit";
const loadUserInfos = () => {
  try {
    const serializedState = localStorage.getItem("niveaux");
    if (serializedState === null) return undefined;
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};
const niveauSlice = createSlice({
  name: "niveau",
  initialState: {
    niveaux: loadUserInfos() || [],
  },
  reducers: {
    setNiveaux: (state, action) => {
      state.niveaux = action.payload;
    },
  },
});

export const { setNiveaux } = niveauSlice.actions;
export default niveauSlice.reducer;
export const selectNiveaux = (state) => state.niveau.niveaux;