// src/redux/profileSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async ({ identifier, isUUID }, { rejectWithValue }) => {
    try {
      const API_URL = isUUID
        ? `${import.meta.env.VITE_BASE_URL}/member/get-profile/${identifier}`
        : `${import.meta.env.VITE_BASE_URL}/member/get-slug/${identifier}`;
      const response = await axios.get(API_URL, { timeout: 5000 });
      return response.data.profile;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    profile: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearProfile: (state) => {
      state.profile = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = {
          ...action.payload,
          views: Number(action.payload.views) || 0,
        };
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch profile data.";
      });
  },
});

export const { clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
