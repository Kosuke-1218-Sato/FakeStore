import { useState, useCallback } from "react";
import {
  View,
  Text,
  Alert,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { apiRequest } from "../../API/api";
import { useFocusEffect } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { setOrders, clearOrders } from "../../store/ordersSlice";
import { Ionicons } from "@expo/vector-icons";

export default function OrdersScreen() {
  // Get logged-in user
  const user = useSelector((state: any) => state.auth.user);

  // Get orders from Redux
  const orders = useSelector((state: any) => state.orders.orders);

  const dispatch = useDispatch();

  // Track expanded order
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // Track expanded section (new / paid / delivered)
  const [expandedSection, setExpandedSection] = useState<string | null>("new");

  // Cache product data
  const [productMap, setProductMap] = useState<any>({});

  // Toggle order expansion
  const toggleOrder = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Toggle section expansion
  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  // Return color based on order status
  const getStatusColor = (item: any) => {
    if (item.is_delivered === 1) return "#27ae60";
    if (item.is_paid === 1) return "#2f80ed";
    return "#f77c0a";
  };

  // Return color based on section
  const getSectionColor = (sectionKey: string) => {
    if (sectionKey === "new") return "#f77c0a";
    if (sectionKey === "paid") return "#2f80ed";
    return "#27ae60";
  };

  // Fetch product details (only once per product)
  const fetchProduct = async (id: number) => {
    if (productMap[id]) return;

    try {
      const res = await fetch(`https://fakestoreapi.com/products/${id}`);
      const data = await res.json();

      setProductMap((prev: any) => ({
        ...prev,
        [id]: data,
      }));
    } catch (e) {
      console.log(e);
    }
  };

  // Fetch orders when screen is focused
  useFocusEffect(
    useCallback(() => {
      if (!user) {
        dispatch(clearOrders());
        return;
      }

      fetchOrders();
    }, [user])
  );

  // API call to get all orders
  const fetchOrders = async () => {
    try {
      const data: any = await apiRequest(
        "/orders/all",
        "GET",
        null,
        user.token
      );

      dispatch(setOrders(data.orders || []));
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
  };

  // Filter orders by status
  const newOrders = orders.filter((o: any) => o.is_paid === 0);
  const paidOrders = orders.filter(
    (o: any) => o.is_paid === 1 && o.is_delivered === 0
  );
  const deliveredOrders = orders.filter((o: any) => o.is_delivered === 1);

  // Block screen if user is not logged in
  if (!user) {
    return (
      <View
        style={{
          flex: 1,
          padding: 20,
          backgroundColor: "#422ec6",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 25, color: "white", fontWeight: "bold" }}>
          Login required
        </Text>
        <Text style={{ fontSize: 18, color: "white", marginTop: 10 }}>
          Please sign in from the User Profile tab.
        </Text>
      </View>
    );
  }

  // Render each order card
  const renderOrder = (item: any) => {
    const statusColor = getStatusColor(item);

    return (
      <View style={{ marginTop: 10 }}>
        {/* Order summary */}
        <TouchableOpacity onPress={() => toggleOrder(item.id)}>
          <View
            style={{
              backgroundColor: "white",
              padding: 12,
              borderRadius: 10,
              borderLeftWidth: 5,
              borderLeftColor: statusColor,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text>Order ID: {item.id}</Text>
            <Text>Items: {item.item_numbers}</Text>
            <Text>Total: ${(item.total_price / 100).toFixed(2)}</Text>

            <Ionicons
              name={expandedId === item.id ? "chevron-up" : "chevron-down"}
              size={20}
              color={statusColor}
            />
          </View>
        </TouchableOpacity>

        {/* Expanded product details */}
        {expandedId === item.id && (
          <View style={{ marginTop: 8 }}>
            {JSON.parse(item.order_items).map((p: any, index: number) => {
              fetchProduct(p.prodID);
              const product = productMap[p.prodID];

              return (
                <View
                  key={index}
                  style={{
                    flexDirection: "row",
                    backgroundColor: "white",
                    padding: 10,
                    borderRadius: 10,
                    marginBottom: 8,
                  }}
                >
                  {product && (
                    <Image
                      source={{ uri: product.image }}
                      style={{
                        width: 70,
                        height: 70,
                        marginRight: 10,
                        resizeMode: "contain",
                      }}
                    />
                  )}

                  <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: "bold" }}>
                      {product?.title || "Loading..."}
                    </Text>
                    <Text>Price: ${p.price}</Text>
                    <Text>Quantity: {p.quantity}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Pay button */}
        {item.is_paid === 0 && (
          <TouchableOpacity
            style={{
              backgroundColor: "#f77c0a",
              padding: 10,
              borderRadius: 10,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 8,
            }}
            onPress={async () => {
              await apiRequest(
                "/orders/updateorder",
                "POST",
                {
                  orderID: item.id,
                  isPaid: 1,
                  isDelivered: 0,
                } as any,
                user.token
              );

              Alert.alert("Paid!");
              fetchOrders();
            }}
          >
            <Ionicons name="card" size={20} color="white" />
            <Text style={{ marginLeft: 8, color: "white", fontWeight: "bold" }}>
              Pay
            </Text>
          </TouchableOpacity>
        )}

        {/* Receive button */}
        {item.is_paid === 1 && item.is_delivered === 0 && (
          <TouchableOpacity
            style={{
              backgroundColor: "#27ae60",
              padding: 10,
              borderRadius: 10,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 8,
            }}
            onPress={async () => {
              await apiRequest(
                "/orders/updateorder",
                "POST",
                {
                  orderID: item.id,
                  isPaid: 1,
                  isDelivered: 1,
                } as any,
                user.token
              );

              Alert.alert("Received!");
              fetchOrders();
            }}
          >
            <Ionicons name="cube" size={20} color="white" />
            <Text style={{ marginLeft: 8, color: "white", fontWeight: "bold" }}>
              Receive
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  // Render section (New / Paid / Delivered)
  const renderSection = (title: string, data: any[], sectionKey: string) => {
    const sectionColor = getSectionColor(sectionKey);

    return (
      <View style={{ marginTop: 16 }}>
        <TouchableOpacity onPress={() => toggleSection(sectionKey)}>
          <View
            style={{
              backgroundColor: "white",
              padding: 14,
              borderRadius: 12,
              borderLeftWidth: 8,
              borderLeftColor: sectionColor,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              {title}: {data.length}
            </Text>

            <Ionicons
              name={
                expandedSection === sectionKey
                  ? "chevron-up"
                  : "chevron-down"
              }
              size={20}
              color={sectionColor}
            />
          </View>
        </TouchableOpacity>

        {expandedSection === sectionKey &&
          data.map((item: any) => (
            <View key={item.id}>{renderOrder(item)}</View>
          ))}
      </View>
    );
  };

  return (
    <ScrollView
      style={{
        flex: 1,
        padding: 20,
        backgroundColor: "#422ec6",
      }}
    >
      <Text
        style={{
          fontSize: 28,
          fontWeight: "bold",
          color: "#34e50c",
          marginBottom: 20,
        }}
      >
        My Orders
      </Text>

      {renderSection("New Orders", newOrders, "new")}
      {renderSection("Paid Orders", paidOrders, "paid")}
      {renderSection("Delivered Orders", deliveredOrders, "delivered")}

      <View style={{ height: 80 }} />
    </ScrollView>
  );
}