import { Tabs } from "expo-router";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  // Get shopping cart items from Redux store
  const items = useSelector((state: any) => state.cart.items);

  // Calculate total quantity for cart badge notification
  const totalQty = items.reduce(
    (sum: number, item: any) => sum + item.quantity,
    0
  );
  const orders = useSelector((state: any) => state.orders?.orders || []);
  const newOrdersCount = orders.filter(
  (o: any) => o.is_paid === 0
).length;

  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Products",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="cart"
        options={{
          title: "Shopping Cart",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cart" size={size} color={color} />
          ),
          tabBarBadge: totalQty > 0 ? totalQty : undefined,
        }}
      />

      <Tabs.Screen
        name="orders"
        options={{
          title: "My Orders",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" size={size} color={color} />
          ),
          tabBarBadge: newOrdersCount > 0 ? newOrdersCount : undefined,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "User Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen name="product" options={{ href: null }} />
      <Tabs.Screen name="productDetail" options={{ href: null }} />
    </Tabs>
  );
}