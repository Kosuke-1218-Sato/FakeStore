import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../store/cartSlice";
import { apiRequest } from "../../API/api";

export default function ProductDetailScreen() {
  const router = useRouter();

  // Get product id and category from route parameters
  const { id, category } = useLocalSearchParams();

  // Redux dispatch
  const dispatch = useDispatch();

  // Get user and cart items from Redux
  const user = useSelector((state: any) => state.auth.user);
  const items = useSelector((state: any) => state.cart.items);

  // Store selected product
  const [product, setProduct] = useState<any>(null);

  // Loading state
  const [loading, setLoading] = useState(true);

  // Fetch product detail
  useEffect(() => {
    if (!id) return;

    setLoading(true);

    fetch(`https://fakestoreapi.com/products/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, [id]);

  // Loading UI
  if (loading || !product) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Back button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() =>
          router.push({
            pathname: "/product",
            params: { category },
          })
        }
      >
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      {/* Product image */}
      <Image source={{ uri: product.image }} style={styles.image} />

      {/* Product info */}
      <Text style={styles.title}>{product.title}</Text>
      <Text style={styles.price}>${product.price}</Text>

      {/* Description */}
      <View style={styles.descriptionBox}>
        <Text style={styles.description}>
          {product.description}
        </Text>
      </View>

      {/* Add to cart button */}
      <TouchableOpacity
        style={styles.cartButton}
        onPress={async () => {
          // Check if product already exists in cart
          const existingItem = items.find(
            (i: any) => i.id === product.id
          );

          // Prepare updated cart data
          const nextItems = existingItem
            ? items.map((i: any) =>
                i.id === product.id
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              )
            : [...items, { ...product, quantity: 1 }];

          // Update Redux cart
          dispatch(addToCart(product));

          try {
            // Save cart to backend
            await apiRequest(
              "/cart",
              "PUT",
              {
                items: nextItems.map((item: any) => ({
                  id: item.id,
                  price: item.price,
                  count: item.quantity,
                })),
              } as any,
              user.token
            );
          } catch (e: any) {
            console.log(e.message);
          }
        }}
      >
        <View style={styles.cartButtonContent}>
          <Ionicons name="cart" size={20} color="black" />
          <Text style={styles.cartButtonText}>
            Add to Shopping Cart
          </Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#422ec6",
    padding: 20,
  },
  backButton: {
    backgroundColor: "#eeeeee",
    padding: 10,
    borderRadius: 8,
    width: 90,
    marginBottom: 16,
  },
  backText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111111",
  },
  image: {
    width: 220,
    height: 220,
    alignSelf: "center",
    marginBottom: 20,
    resizeMode: "contain",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#34e50c",
    marginBottom: 10,
  },
  price: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#f12c2c",
    marginBottom: 12,
  },
  descriptionBox: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  description: {
    fontSize: 14,
    color: "#333333",
    lineHeight: 20,
  },
  cartButton: {
    backgroundColor: "#81de9a",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  cartButtonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  cartButtonText: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
});