import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orders: [],
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setOrders: (state, action) => {
      state.orders = action.payload;
    },
    clearOrders: (state) => {
      state.orders = [];
    },
  },
});

export const { setOrders, clearOrders } = ordersSlice.actions;
export default ordersSlice.reducer;