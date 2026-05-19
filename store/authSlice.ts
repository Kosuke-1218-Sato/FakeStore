import { createSlice } from "@reduxjs/toolkit";

// Initial authentication state
const initialState = {
  user: null, // Stores logged-in user data (including token)
};

// Create Redux slice for authentication
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {

    // Save user data after login or signup
    setUser: (state, action) => {
      state.user = action.payload;
    },

    // Clear user data when logging out
    logout: (state) => {
      state.user = null;
    },
  },
});

// Export actions for use in components
export const { setUser, logout } = authSlice.actions;

// Export reducer to configure store
export default authSlice.reducer;