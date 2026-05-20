import { createSlice } from "@reduxjs/toolkit";

// Initial state for orders
const initialState = {
  orders: [],
};

// Create orders slice for managing order state
const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    // Set orders after fetching from API
    setOrders: (state, action) => {
      state.orders = action.payload;
    },

    // Clear orders on logout
    clearOrders: (state) => {
      state.orders = [];
    },
  },
});

// Export actions
export const { setOrders, clearOrders } = ordersSlice.actions;

// Export reducer
export default ordersSlice.reducer;