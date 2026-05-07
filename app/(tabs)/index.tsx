import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function CategoryScreen() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("https://fakestoreapi.com/products/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fake Store</Text>
      <Text style={styles.subtitle}>Choose a category</Text>

      {categories.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.button}
          onPress={() =>
            router.push({
              pathname: "/product",
              params: { category: item },
            })
          }
        >
          <Text style={styles.category}>{item}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#aaecf3",
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
  fontSize: 40,
  fontWeight: "900",
  color: "#f42525",
  letterSpacing: 2,
  textTransform: "uppercase",
  marginBottom: 8,
},
  subtitle: {
    fontSize: 25,
    color: "#f42525",
    marginBottom: 32,
  },
  button: {
    backgroundColor: "#f2f2f2",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    width: "90%",
    alignItems: "center",
  },
  category: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
    textTransform: "capitalize",
  },
});