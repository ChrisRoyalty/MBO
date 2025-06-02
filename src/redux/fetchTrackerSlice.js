import { createSlice } from "@reduxjs/toolkit";

const fetchTrackerSlice = createSlice({
  name: "fetchTracker",
  initialState: {
    profile: { hasFetched: false, lastFetched: 0 },
    analytics: { hasFetched: false, lastFetched: 0 },
  },
  reducers: {
    setProfileFetched: (state, action) => {
      state.profile = { hasFetched: true, lastFetched: action.payload };
    },
    setAnalyticsFetched: (state, action) => {
      state.analytics = { hasFetched: true, lastFetched: action.payload }; // Fixed typo
    },
    resetFetchTracker: (state) => {
      state.profile = { hasFetched: false, lastFetched: 0 };
      state.analytics = { hasFetched: false, lastFetched: 0 };
    },
  },
});

// Export actions
export const { setProfileFetched, setAnalyticsFetched, resetFetchTracker } =
  fetchTrackerSlice.actions;

// Export reducer
export default fetchTrackerSlice.reducer;
