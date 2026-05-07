import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";

import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";

export default function ProductListScreen() {

  const router = useRouter();

  // Get selected category from route parameters
  const { category } = useLocalSearchParams();

  // Store product data fetched from API
  const [products, setProducts] = useState<any[]>([]);

  // Manage loading state while fetching products
  const [loading, setLoading] = useState(true);

  // Fetch products whenever category changes
  useEffect(() => {
    if (!category) return;

    setLoading(true);

    fetch(`https://fakestoreapi.com/products/category/${category}`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, [category]);

  // Display loading screen while fetching products
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#111111" />
        <Text style={styles.loadingText}>
          Loading products...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>

      {/* Display selected category title */}
      <Text style={styles.header}>{category}</Text>

      {/* Back button to return to home screen */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push("/")}
      >
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      {/* Display product cards */}
      {products.map((item: any) => (
        <TouchableOpacity
          key={item.id}
          onPress={() =>
            router.push({
              pathname: "/productDetail",

              // Pass product id and category to detail screen
              params: {
                id: item.id,
                category: category,
              },
            })
          }
        >
          <View style={styles.card}>

            {/* Product image */}
            <Image
              source={{ uri: item.image }}
              style={styles.image}
            />

            <View style={{ flex: 1 }}>

              {/* Product title */}
              <Text style={styles.title}>
                {item.title}
              </Text>

              {/* Product price */}
              <Text style={styles.price}>
                ${item.price}
              </Text>

            </View>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#aaecf3",
    padding: 20,
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111111",
    marginBottom: 6,
  },

  price: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#f12c2c",
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },

  image: {
    width: 60,
    height: 60,
    marginRight: 10,
  },

  header: {
    fontSize: 28,
    fontWeight: "bold",
    textTransform: "capitalize",
    marginBottom: 12,
    color: "#111111",
  },

  backButton: {
    backgroundColor: "#eeeeee",
    padding: 10,
    borderRadius: 8,
    width: 100,
    marginBottom: 16,
  },

  backText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111111",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#aaecf3",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#111111",
  },
});