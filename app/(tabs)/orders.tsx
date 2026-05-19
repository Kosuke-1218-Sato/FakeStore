import { useState, useCallback } from "react";
import { View, Text, Alert, Button, ScrollView } from "react-native";
import { apiRequest } from "../../API/api";
import { useFocusEffect } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { setOrders, clearOrders } from "../../store/ordersSlice";

export default function OrdersScreen() {
  const user = useSelector((state: any) => state.auth.user);
  const orders = useSelector((state: any) => state.orders.orders);
  const dispatch = useDispatch();

  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggle = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  useFocusEffect(
    useCallback(() => {
      if (!user) {
        dispatch(clearOrders());
        return;
      }
      fetchOrders();
    }, [user])
  );

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

  // 🔥 分類
  const newOrders = orders.filter((o: any) => o.is_paid === 0);
  const paidOrders = orders.filter(
    (o: any) => o.is_paid === 1 && o.is_delivered === 0
  );
  const deliveredOrders = orders.filter(
    (o: any) => o.is_delivered === 1
  );

  if (!user) {
    return (
      <View style={{ padding: 20 }}>
        <Text>Login required</Text>
      </View>
    );
  }

  // 🔧 共通描画関数（超重要）
  const renderOrder = ({ item }: any) => (
    <View style={{ marginBottom: 15 }}>
      <Text>Order ID: {item.id}</Text>
      <Text>Total: ${item.total_price}</Text>

      <Button title="Details" onPress={() => toggle(item.id)} />

      {/* 展開 */}
      {expandedId === item.id && (
        <View style={{ marginTop: 10 }}>
          {JSON.parse(item.order_items).map(
            (p: any, index: number) => (
              <View key={index}>
                <Text>Product ID: {p.prodID}</Text>
                <Text>Quantity: {p.quantity}</Text>
              </View>
            )
          )}
        </View>
      )}

      {/* Pay */}
      {item.is_paid === 0 && (
        <Button
          title="Pay"
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
            fetchOrders();
          }}
        />
      )}

      {/* Receive */}
      {item.is_paid === 1 && item.is_delivered === 0 && (
        <Button
          title="Receive"
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
            fetchOrders();
          }}
        />
      )}
    </View>
  );

  return (
  <ScrollView style={{ flex: 1, padding: 20 }}>
    <Text style={{ fontSize: 24, marginBottom: 20 }}>My Orders</Text>

    <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 10 }}>
      New Orders
    </Text>
    {newOrders.map((item: any) => (
      <View key={item.id}>{renderOrder({ item })}</View>
    ))}

    <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 20 }}>
      Paid Orders
    </Text>
    {paidOrders.map((item: any) => (
      <View key={item.id}>{renderOrder({ item })}</View>
    ))}

    <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 20 }}>
      Delivered Orders
    </Text>
    {deliveredOrders.map((item: any) => (
      <View key={item.id}>{renderOrder({ item })}</View>
    ))}

    <View style={{ height: 80 }} />
  </ScrollView>
);
}