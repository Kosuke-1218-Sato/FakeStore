import { Tabs } from "expo-router";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
    const items = useSelector((state: any) => state.cart.items);

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
      <Tabs.Screen name="product" options={{ href: null }} />
      <Tabs.Screen name="productDetail" options={{ href: null }} />
    </Tabs>
  );
}