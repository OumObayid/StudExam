import { createSlice } from "@reduxjs/toolkit";

// Charger les users depuis localStorage si existant
const loadUsers = () => {
  try {
    const serializedState = localStorage.getItem("users");
    if (serializedState === null) return [];
    return JSON.parse(serializedState);
  } catch (err) {
    return [];
  }
};

const userSlice = createSlice({
  name: "user",
  initialState: {
    users: loadUsers(),
  },
  reducers: {
    // Ajouter un user
    addUser: (state, action) => {
      state.users.push(action.payload);
      console.log('action.payload :', action.payload);
      localStorage.setItem("users", JSON.stringify(state.users));
    },

    // Supprimer un user par CinMembre
    deleteUser: (state, action) => {
      state.users = state.users.filter(
        (u) => u.CinMembre !== action.payload
      );
      localStorage.setItem("users", JSON.stringify(state.users));
    },

  // Approuver/Désapprouver un user par CinMembre
approveUser: (state, action) => {
  const { CinMembre, ApprouveM } = action.payload; // on récupère CIN + nouvelle valeur
  const index = state.users.findIndex((u) => u.CinMembre === CinMembre);
  if (index !== -1) {
    state.users[index].ApprouveM = ApprouveM; // maj avec oui ou non
    localStorage.setItem("users", JSON.stringify(state.users));
  }
},


    // Mettre à jour un user
    updateUser: (state, action) => {
      const index = state.users.findIndex(
        (u) => u.CinMembre === action.payload.CinMembre
      );
      if (index !== -1) {
        state.users[index] = { ...state.users[index], ...action.payload };
        localStorage.setItem("users", JSON.stringify(state.users));
      }
    },

    // Initialiser / remplacer la liste complète
    setUsers: (state, action) => {
      state.users = action.payload;
      localStorage.setItem("users", JSON.stringify(state.users));
    },
  },
});

export const {
  addUser,
  deleteUser,
  approveUser,
  updateUser,
  setUsers,
} = userSlice.actions;

export default userSlice.reducer;

// Selecteurs
export const selectUsers = (state) => state.user.users;
export const selectUserByCin = (cin) => (state) =>
  state.user.users.find((u) => u.CinMembre === cin);
