import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { increaseQty, decreaseQty } from "../store/cartSlice";

export default function CartScreen() {
  const items = useSelector((state: any) => state.cart.items);
  const dispatch = useDispatch();

  const totalItems = items.reduce((sum: number, item: any) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum: number, item: any) => sum + item.price * item.quantity,
    0
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shopping Cart</Text>

      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
  <Text style={styles.emptyText}>
    Your shopping cart is empty!
  </Text>
</View>
      ) : (
        <>
          <View style={styles.summaryBox}>
  <View style={{ flex: 1 }}>
    <Text style={styles.summaryText}>
      Total items: {totalItems}
    </Text>

    <Text style={styles.summaryText}>
      Total price: ${totalPrice.toFixed(2)}
    </Text>
  </View>

  <TouchableOpacity style={styles.checkoutButton}>
    <View style={styles.checkoutContent}>
  <Ionicons name="wallet" size={18} color="#black" />

  <Text style={styles.checkoutText}>
    Check Out
  </Text>
</View>
  </TouchableOpacity>
</View>

          <FlatList
  data={items}
  keyExtractor={(item: any) => item.id.toString()}
  renderItem={({ item }: any) => (
    <View style={styles.item}>
  <Image source={{ uri: item.image }} style={styles.image} />

  <View style={{ flex: 1 }}>
  <Text style={styles.itemTitle}>
    {item.title}
  </Text>

  <Text style={styles.itemPrice}>
    ${item.price}
  </Text>

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
checkoutButton: {
  backgroundColor: "#f77c0a",
  paddingVertical: 12,
  paddingHorizontal: 18,
  borderRadius: 10,
  justifyContent: "center",
},
checkoutText: {
  color: "#111111",
  fontSize: 14,
  fontWeight: "bold",
  marginLeft: 6,
},
checkoutContent: {
  flexDirection: "row",
  alignItems: "center",
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