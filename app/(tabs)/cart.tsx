import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { increaseQty, decreaseQty, clearCart } from "../../store/cartSlice";
import { useEffect } from "react";
import { apiRequest } from "../../API/api";
import { useRouter } from "expo-router";

export default function CartScreen() {

  // Get logged-in user from Redux
  const user = useSelector((state: any) => state.auth.user);

  // Get cart items from Redux
  const items = useSelector((state: any) => state.cart.items);

  const dispatch = useDispatch();
  const router = useRouter();

  // Check if user is logged in
  useEffect(() => {
    if (!user) {
      Alert.alert("Login required", "Please sign in first.");
    }
  }, [user]);

  // If not logged in, block access
  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Login required</Text>
        <Text>Please sign in from the User Profile tab.</Text>
      </View>
    );
  }

  // Calculate total quantity of items
  const totalItems = items.reduce(
    (sum: number, item: any) => sum + item.quantity,
    0
  );

  // Calculate total price of cart
  const totalPrice = items.reduce(
    (sum: number, item: any) => sum + item.price * item.quantity,
    0
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shopping Cart</Text>

      {/* If cart is empty */}
      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Your shopping cart is empty!</Text>
        </View>
      ) : (
        <>
          {/* Cart summary section */}
          <View style={styles.summaryBox}>
            <View style={{ flex: 1 }}>
              <Text style={styles.summaryText}>
                Total items: {totalItems}
              </Text>

              <Text style={styles.summaryText}>
                Total price: ${totalPrice.toFixed(2)}
              </Text>
            </View>

            {/* Checkout button */}
            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={async () => {
                try {
                  // Send cart items to backend to create a new order
                  await apiRequest(
                    "/orders/neworder",
                    "POST",
                    {
                      items: items.map((item: any) => ({
                        prodID: item.id,      // Product ID required by API
                        price: item.price,   // Price required by API
                        quantity: item.quantity, // Quantity required by API
                      })),
                    } as any,
                    user.token // Authentication token
                  );

                  // Show success message
                  Alert.alert("Success", "Order created!");

                  dispatch(clearCart());

                  // Navigate to Orders screen to view new order
                  router.push("/orders");

                } catch (e: any) {
                  Alert.alert("Error", e.message);
                }
              }}
            >
              <View style={styles.checkoutContent}>
                <Ionicons name="wallet" size={18} color="#111111" />
                <Text style={styles.checkoutText}>Check Out</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Render cart items */}
          <FlatList
            data={items}
            keyExtractor={(item: any) => item.id.toString()}
            renderItem={({ item }: any) => (
              <View style={styles.item}>
                <Image source={{ uri: item.image }} style={styles.image} />

                <View style={{ flex: 1 }}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.itemPrice}>${item.price}</Text>

                  {/* Quantity control buttons */}
                  <View style={styles.buttonRow}>
                    <TouchableOpacity
                      style={styles.qtyButton}
                      onPress={() => dispatch(decreaseQty(item.id))}
                    >
                      <Text style={styles.qtyText}>-</Text>
                    </TouchableOpacity>

                    <Text style={styles.quantityText}>
                      {item.quantity}
                    </Text>

                    <TouchableOpacity
                      style={styles.qtyButton}
                      onPress={() => dispatch(increaseQty(item.id))}
                    >
                      <Text style={styles.qtyText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#aaecf3",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111111",
    marginBottom: 20,
  },
  image: {
    width: 60,
    height: 60,
    marginRight: 10,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    padding: 12,
    borderRadius: 10,
    marginTop: 12,
  },
  buttonRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  qtyButton: {
    backgroundColor: "#81de9a",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  qtyText: {
    color: "#111111",
    fontSize: 20,
    fontWeight: "bold",
  },
  quantityText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111111",
    marginHorizontal: 16,
    textAlign: "center",
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111111",
    marginBottom: 6,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#f12c2c",
    marginBottom: 10,
  },
  summaryBox: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  summaryText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111111",
    marginBottom: 6,
  },
  checkoutButton: {
    backgroundColor: "#f77c0a",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
    justifyContent: "center",
  },
  checkoutContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkoutText: {
    color: "#111111",
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 6,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -50,
  },
  emptyText: {
    fontSize: 30,
    fontWeight: "600",
    color: "#f12c2c",
  },
});