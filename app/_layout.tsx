import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { store } from "../store/store";

export default function RootLayout() {
  return (
    // Provide global Redux store to the entire application
    <Provider store={store}>
      {/* Use Stack navigation and hide default header */}
      <Stack screenOptions={{ headerShown: false }} />
    </Provider>
  );
}