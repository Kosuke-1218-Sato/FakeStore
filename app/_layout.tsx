import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { store } from "../store/store";
import { useEffect, useState } from "react";
import { View, Text } from "react-native";

export default function RootLayout() {

  // Control splash visibility
  const [loading, setLoading] = useState(true);

  // Show splash for a few seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // 2 seconds

    return () => clearTimeout(timer);
  }, []);

  // Splash Screen UI
  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#aaecf3",
        }}
      >
        <Text style={{ fontSize: 40, fontWeight: "bold" }}>
          Fake Store
        </Text>
      </View>
    );
  }

  // Normal app
  return (
    <Provider store={store}>
      <Stack />
    </Provider>
  );
}