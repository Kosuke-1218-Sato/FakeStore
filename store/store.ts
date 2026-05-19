import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import authReducer from "./authSlice";
import ordersReducer from "./ordersSlice";

// Configure Redux store with multiple slices
export const store = configureStore({
  reducer: {
    cart: cartReducer, // Handles shopping cart state
    auth: authReducer, // Handles authentication state
    orders: ordersReducer, 
  },
});

// Infer RootState type from store
export type RootState = ReturnType<typeof store.getState>;

// Infer AppDispatch type from store
export type AppDispatch = typeof store.dispatch;