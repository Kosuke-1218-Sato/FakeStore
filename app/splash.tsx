import { useEffect } from "react";
import { View, Image } from "react-native";
import { useRouter } from "expo-router";

export default function SplashScreen() {
  const router = useRouter();

  // Navigate to main app after delay
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/(tabs)/profile");
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {/* Display splash image */}
      <Image
        source={require("../assets/images/splash.png")}
        style={{ width: "100%", height: "100%" }}
        resizeMode="cover"
      />
    </View>
  );
}