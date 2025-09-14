import { createSlice } from "@reduxjs/toolkit";

// Helper pour userInfos depuis localStorage
const loadUserInfos = () => {
  try {
    const serializedState = localStorage.getItem("userinfos");
    return serializedState
      ? JSON.parse(serializedState)
      : {
          id: "",
          firstname: "",
          lastname: "",
          email: "",
          tel: "",
          address: "",
          card_number: "",
          card_expiry_date: "",
          card_holder_name: "",
          card_cvv: "",
        };
  } catch (error) {
    console.error("Erreur récupération userInfos:", error);
    return {
      id: "",
      firstname: "",
      lastname: "",
      email: "",
      tel: "",
      address: "",
      card_number: "",
      card_expiry_date: "",
      card_holder_name: "",
      card_cvv: "",
    };
  }
};

const saveUserInfos = (userInfos) => {
  try {
    localStorage.setItem("userinfos", JSON.stringify(userInfos));
  } catch (error) {
    console.error("Erreur sauvegarde userInfos:", error);
  }
};

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: localStorage.getItem("isLoggedIn") === "true",
    userInfos: loadUserInfos(),
  },
  reducers: {
    // Auth
    setActiveUser: (state) => {
      state.isLoggedIn = true;
      localStorage.setItem("isLoggedIn", "true");
    },
    removeActiveUser: (state) => {
      state.isLoggedIn = false;
      localStorage.removeItem("isLoggedIn");
      state.userInfos = loadUserInfos(); // reset userInfos
    },
    // User Infos
    updateUserInfos: (state, action) => {
      state.userInfos = action.payload;
      saveUserInfos(state.userInfos);
    },
  },
});

// Export actions
export const { setActiveUser, removeActiveUser, updateUserInfos } = authSlice.actions;

// Export selectors
export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
export const selectUserInfos = (state) => state.auth.userInfos;

export default authSlice.reducer;
