import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = state.items.find((i: any) => i.id === action.payload.id);

      if (item) {
        item.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },

    increaseQty: (state, action) => {
      const item = state.items.find((i: any) => i.id === action.payload);
      if (item) item.quantity += 1;
    },

    decreaseQty: (state, action) => {
      const item = state.items.find((i: any) => i.id === action.payload);

      if (item) {
        item.quantity -= 1;

        if (item.quantity === 0) {
          state.items = state.items.filter((i: any) => i.id !== action.payload);
        }
      }
    },
  },
});

export const { addToCart, increaseQty, decreaseQty } = cartSlice.actions;
export default cartSlice.reducer;