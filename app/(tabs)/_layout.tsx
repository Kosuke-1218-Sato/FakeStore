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

  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Products",

          // Home icon for Products tab
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="cart"
        options={{
          title: "Shopping Cart",

          // Shopping cart icon
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cart" size={size} color={color} />
          ),

          // Display cart quantity badge when items exist
          tabBarBadge: totalQty > 0 ? totalQty : undefined,
        }}
      />

      {/* Hidden screens used for navigation */}
      <Tabs.Screen name="product" options={{ href: null }} />
      <Tabs.Screen name="productDetail" options={{ href: null }} />
    </Tabs>
  );
}