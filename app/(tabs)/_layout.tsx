import { Tabs } from "expo-router";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { Alert } from "react-native";

export default function TabLayout() {
  // Get login state from Redux
  const user = useSelector((state: any) => state.auth.user);

  // Get cart items for cart badge
  const items = useSelector((state: any) => state.cart.items);

  // Calculate total cart quantity
  const totalQty = items.reduce(
    (sum: number, item: any) => sum + item.quantity,
    0
  );

  // Get orders for new order badge
  const orders = useSelector((state: any) => state.orders?.orders || []);

  // Count unpaid orders
  const newOrdersCount = orders.filter(
    (o: any) => o.is_paid === 0
  ).length;

  // Block protected tabs when user is not logged in
  const requireLogin = (e: any) => {
    if (!user) {
      e.preventDefault();
      Alert.alert("Login required", "Please sign in first");
    }
  };

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
        listeners={{
          tabPress: requireLogin,
        }}
      />

      <Tabs.Screen
        name="cart"
        options={{
          title: "Shopping Cart",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cart" size={size} color={color} />
          ),
          tabBarBadge: user && totalQty > 0 ? totalQty : undefined,
        }}
        listeners={{
          tabPress: requireLogin,
        }}
      />

      <Tabs.Screen
        name="orders"
        options={{
          title: "My Orders",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" size={size} color={color} />
          ),
          tabBarBadge:
            user && newOrdersCount > 0 ? newOrdersCount : undefined,
        }}
        listeners={{
          tabPress: requireLogin,
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

      {/* Hidden screens used for navigation */}
      <Tabs.Screen name="product" options={{ href: null }} />
      <Tabs.Screen name="productDetail" options={{ href: null }} />
    </Tabs>
  );
}