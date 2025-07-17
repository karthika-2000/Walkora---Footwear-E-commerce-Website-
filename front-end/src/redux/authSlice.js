import { createSlice } from "@reduxjs/toolkit";

const token = localStorage.getItem('token');

const authSlice = createSlice({
    name : 'auth',
    initialState : {
        isAuthenticated : !! token,
        token : token || null
    },

    reducers : {
        login(state, action){
            state.token = action.payload;
            state.isAuthenticated = true;
        },
        logout(state){
            state.token = null;
            state.isAuthenticated = false;
        }
    }
});

export const {login, logout} = authSlice.actions;
export default authSlice.reducer;