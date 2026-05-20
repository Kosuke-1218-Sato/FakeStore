import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";

export default function CategoryScreen() {
  // Get logged-in user from Redux
  const user = useSelector((state: any) => state.auth.user);

  // Store product categories fetched from API
  const [categories, setCategories] = useState<any[]>([]);

  // Manage loading state while fetching data
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  // Fetch product categories when the screen loads
  useEffect(() => {
    fetch("https://fakestoreapi.com/products/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  // Show login required message if user somehow reaches this screen directly
  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Login required</Text>
        <Text style={styles.subtitle}>
          Please sign in from the User Profile tab.
        </Text>
      </View>
    );
  }

  // Show loading indicator while fetching categories
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Display category buttons and navigate to product list
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
    backgroundColor: "#422ec6",
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 50,
    fontWeight: "900",
    color: "#34e50c",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 30,
    color: "#ffffff",
    marginBottom: 70,
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