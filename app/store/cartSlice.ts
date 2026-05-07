import { createSlice } from "@reduxjs/toolkit";

// Initial Redux shopping cart state
const initialState: any = {
  items: [],
};

// Create Redux cart slice
const cartSlice = createSlice({
  name: "cart",
  initialState,

  reducers: {

    // Add product to shopping cart
    addToCart: (state, action) => {
      const item = state.items.find(
        (i: any) => i.id === action.payload.id
      );

      // Increase quantity if product already exists
      if (item) {
        item.quantity += 1;

      // Add new product if it does not exist
      } else {
        state.items.push({
          ...action.payload,
          quantity: 1,
        });
      }
    },

    // Increase product quantity
    increaseQty: (state, action) => {
      const item = state.items.find(
        (i: any) => i.id === action.payload
      );

      if (item) item.quantity += 1;
    },

    // Decrease product quantity
    decreaseQty: (state, action) => {
      const item = state.items.find(
        (i: any) => i.id === action.payload
      );

      if (item) {
        item.quantity -= 1;

        // Remove product if quantity becomes zero
        if (item.quantity === 0) {
          state.items = state.items.filter(
            (i: any) => i.id !== action.payload
          );
        }
      }
    },
  },
});

// Export Redux actions
export const {
  addToCart,
  increaseQty,
  decreaseQty,
} = cartSlice.actions;

// Export Redux reducer
export default cartSlice.reducer;