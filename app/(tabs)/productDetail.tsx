import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  ScrollView
} from "react-native"
import { Ionicons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { addToCart } from "../store/cartSlice";

export default function ProductDetailScreen() {
  const router = useRouter();
  const { id, category } = useLocalSearchParams();
  const dispatch = useDispatch();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    setLoading(true);

    fetch(`https://fakestoreapi.com/products/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading || !product) {
    return (
      <View　style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.backButton}onPress={() =>
  router.push({
    pathname: "/product",
    params: { category },
  })
}>
  <Text style={styles.backText}>← Back</Text>
</TouchableOpacity>
      <Image source={{ uri: product.image }} style={styles.image} />

      <Text style={styles.title}>{product.title}</Text>
      <Text style={styles.price}>${product.price}</Text>
      <View style={styles.descriptionBox}>
  <Text style={styles.description}>
    {product.description}
  </Text>
</View>

      <TouchableOpacity
  style={styles.cartButton}
  onPress={() => dispatch(addToCart(product))}
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
    backgroundColor: "#aaecf3",
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
    color: "#111111",
    marginBottom: 10,
  },
  price: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#f12c2c",
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: "#333333",
    lineHeight: 20,
    marginBottom: 24,
  },
  cartButton: {
    backgroundColor: "#81de9a",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  cartButtonText: {
  color: "black",
  fontSize: 16,
  fontWeight: "bold",
  marginLeft: 8,
},
  descriptionBox: {
  backgroundColor: "#ffffff",
  padding: 16,
  borderRadius: 12,
  marginBottom: 24,
},
cartButtonContent: {
  flexDirection: "row",
  alignItems: "center",
}
});