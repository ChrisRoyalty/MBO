import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: JSON.parse(sessionStorage.getItem("user")) || null,
  token: sessionStorage.getItem("authToken") || null,
  isAuthenticated: !!sessionStorage.getItem("authToken"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;

      // Persist authentication data in sessionStorage
      sessionStorage.setItem("authToken", action.payload.token);
      sessionStorage.setItem("user", JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      // Remove authentication data from sessionStorage
      sessionStorage.removeItem("authToken");
      sessionStorage.removeItem("user");
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export const selectAuth = (state) => state.auth;

export default authSlice.reducer;
