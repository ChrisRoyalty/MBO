import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Check localStorage for persisted token and user
const token = localStorage.getItem("token");
const user = localStorage.getItem("user");
const initialUser = user ? JSON.parse(user) : null;

const initialState = {
  isAuthenticated: !!token && !!initialUser,
  token: token || null,
  user: initialUser,
  lastDashboard: localStorage.getItem("lastDashboard") || null,
  profileData: null, // Field to store logged-in user's profile data
  profileLoading: false, // To track loading state of profile data
  profileError: null, // To store any errors during profile fetch
};

// Async thunk to fetch the logged-in user's profile
export const fetchMyProfile = createAsyncThunk(
  "auth/fetchMyProfile",
  async (_, { getState, dispatch, rejectWithValue }) => {
    const { auth } = getState();
    const authToken = auth.token;
    if (!authToken) {
      return rejectWithValue("No authentication token found.");
    }
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/member/my-profile`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      } else {
        return rejectWithValue("Failed to fetch profile data.");
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch profile data."
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      const { token, user } = action.payload;
      state.isAuthenticated = true;
      state.token = token;
      state.user = user;
      state.lastDashboard =
        user?.role === "admin" ? "/admin" : "/user-dashboard";
      console.log("Login action - Updated State:", { ...state });
      // Persist to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("lastDashboard", state.lastDashboard);
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      state.lastDashboard = null;
      state.profileData = null; // Clear profileData on logout
      state.profileLoading = false;
      state.profileError = null;
      console.log("Logout action - Cleared State:", { ...state });
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("lastDashboard");
    },
    setLastDashboard: (state, action) => {
      state.lastDashboard = action.payload;
      console.log("setLastDashboard - New value:", state.lastDashboard);
      localStorage.setItem("lastDashboard", state.lastDashboard);
    },
    setProfileData: (state, action) => {
      state.profileData = action.payload;
      console.log("setProfileData - New profile data:", state.profileData);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyProfile.pending, (state) => {
        state.profileLoading = true;
        state.profileError = null;
      })
      .addCase(fetchMyProfile.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.profileData = action.payload;
      })
      .addCase(fetchMyProfile.rejected, (state, action) => {
        state.profileLoading = false;
        state.profileError = action.payload;
      });
  },
});

export const { login, logout, setLastDashboard, setProfileData } =
  authSlice.actions;
export const selectAuth = (state) => state.auth;
export default authSlice.reducer;
