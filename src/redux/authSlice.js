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
      state.token = token || state.token; // Preserve token if not provided
      state.user = state.user
        ? { ...state.user, ...user } // Merge existing user with new data
        : user; // Set user if it was null
      state.lastDashboard =
        state.user?.role === "admin" ? "/admin" : "/user-dashboard";
      console.log("Login action - Updated State:", { ...state }); // Debug with spread to avoid mutation logging issues
      localStorage.setItem("token", token || state.token); // Sync with localStorage
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

export const { login, logout, setLastDashboard } = authSlice.actions; // Removed setEmail as it's not defined
export const selectAuth = (state) => state.auth;
export default authSlice.reducer;
