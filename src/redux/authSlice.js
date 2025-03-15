// src/redux/authSlice.js
import { createSlice } from "@reduxjs/toolkit";




const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: false,
    token: null,
    user: null,
    lastDashboard: null,
  },
  reducers: {
    login: (state, action) => {
      const { token, user } = action.payload;
      state.isAuthenticated = true;
      state.token = token;
      state.user = user;
      state.lastDashboard =
        user.role === "admin" ? "/admin" : "/user-dashboard";
      console.log("Login action - State:", state); // Debug
      localStorage.setItem("token", token); // Sync with localStorage if needed
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      state.lastDashboard = null;
      localStorage.removeItem("token");
    },
    setLastDashboard: (state, action) => {
      state.lastDashboard = action.payload;
      console.log("setLastDashboard - New value:", state.lastDashboard); // Debug
    },
  },
});

export const { login, logout, setLastDashboard, setEmail } = authSlice.actions;
export const selectAuth = (state) => state.auth;
export default authSlice.reducer;
