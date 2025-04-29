// src/redux/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialToken = localStorage.getItem("token") || null;

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: !!initialToken,
    token: initialToken,
    user: null,
    lastDashboard: null,
  },
  reducers: {
    login: (state, action) => {
      const { token, user } = action.payload;
      state.isAuthenticated = true;
      state.token = token || state.token;
      state.user = state.user ? { ...state.user, ...user } : user;
      // Fix: Use updated user for role check
      state.lastDashboard =
        user?.role === "admin" ? "/admin" : "/user-dashboard";
      console.log("Login action - Updated State:", { ...state });
      localStorage.setItem("token", state.token);
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
      console.log("setLastDashboard - New value:", state.lastDashboard);
    },
  },
});

export const { login, logout, setLastDashboard } = authSlice.actions;
export const selectAuth = (state) => state.auth;
export default authSlice.reducer;
