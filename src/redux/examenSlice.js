import { createSlice } from "@reduxjs/toolkit";

const loadFromStorage = (key) => {
    try {
        const serializedState = localStorage.getItem(key);
        if (!serializedState) return [];
        return JSON.parse(serializedState);
    } catch {
        return [];
    }
};

const examenSlice = createSlice({
    name: "examen",
    initialState: {
        examens: loadFromStorage("examens") || [],
        userExamens: loadFromStorage("userExamens") || [],
    },
    reducers: {
        // Gestion des examens
        setExamens: (state, action) => {
            state.examens = action.payload;
            localStorage.setItem("examens", JSON.stringify(action.payload));
        },
        addExamen: (state, action) => {
            state.examens.push(action.payload);
            localStorage.setItem("examens", JSON.stringify(state.examens));
        },
        updateExamen: (state, action) => {
            const index = state.examens.findIndex(
                (ex) => ex.IdExamen === action.payload.IdExamen
            );
            if (index !== -1) {
                state.examens[index] = action.payload;
                localStorage.setItem("examens", JSON.stringify(state.examens));
            }
        },
        deleteExamen: (state, action) => {
            state.examens = state.examens.filter(
                (ex) => ex.IdExamen !== action.payload
            );
            localStorage.setItem("examens", JSON.stringify(state.examens));
        },

        // Gestion des examens utilisateur
        setUserExamens: (state, action) => {
            state.userExamens = action.payload;
            localStorage.setItem("userExamens", JSON.stringify(action.payload));
        },
        addUserExamen: (state, action) => {
            state.userExamens.push(action.payload);
            localStorage.setItem(
                "userExamens",
                JSON.stringify(state.userExamens)
            );
        },
        // Mise à jour d'un examen utilisateur
        updateUserExamen: (state, action) => {
            const index = state.userExamens.findIndex(
                (ex) => ex.IdExamen === action.payload.IdExamen
            );
            if (index !== -1) {
                state.userExamens[index] = action.payload;
                localStorage.setItem(
                    "userExamens",
                    JSON.stringify(state.userExamens)
                );
            }
        },
        // Mise à jour uniquement du score d'un examen utilisateur
        updateUserExamenScore: (state, action) => {
            const { IdExamen, ScoreR } = action.payload;
            const id = parseInt(IdExamen, 10);
            const index = state.userExamens.findIndex(
                (ex) => ex.IdExamen === id
            );
            if (index !== -1) {
                state.userExamens[index] = {
                    ...state.userExamens[index],
                    ScoreR,
                };
                localStorage.setItem(
                    "userExamens",
                    JSON.stringify(state.userExamens)
                );
            }
        },

        deleteUserExamen: (state, action) => {
            state.userExamens = state.userExamens.filter(
                (ex) => ex.IdExamen !== action.payload
            );
            localStorage.setItem(
                "userExamens",
                JSON.stringify(state.userExamens)
            );
        },
        clearUserExamens: (state) => {
            state.userExamens = [];
            localStorage.removeItem("userExamens");
        },
    },
});

export const {
    setExamens,
    setUserExamens,
    addExamen,
    addUserExamen,
    updateExamen,
    updateUserExamen,
    updateUserExamenScore,
    deleteExamen,
    deleteUserExamen,
    clearUserExamens,
} = examenSlice.actions;

export default examenSlice.reducer;

export const selectExamens = (state) => state.examen.examens;
export const selectUserExamens = (state) => state.examen.userExamens;
