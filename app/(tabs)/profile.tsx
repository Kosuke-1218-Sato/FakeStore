import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Alert,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { apiRequest } from "../../API/api";
import { logout, setUser } from "../../store/authSlice";
import { clearCart, setCart } from "../../store/cartSlice";
import { clearOrders, setOrders } from "../../store/ordersSlice";

export default function ProfileScreen() {
  const dispatch = useDispatch();

  // Get current user
  const user = useSelector((state: any) => state.auth.user);

  // Form states
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Modal states
  const [modalVisible, setModalVisible] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Clear form
  const clearForm = () => {
    setName("");
    setEmail("");
    setPassword("");
  };

  // Handle login
  const handleLogin = async () => {
    try {
      const data: any = await apiRequest("/users/signin", "POST", {
        email,
        password,
      } as any);

      // Save user
      dispatch(setUser(data));

      // Restore cart
      const cartData: any = await apiRequest(
        "/cart",
        "GET",
        null,
        data.token
      );

      const restoredItems: any[] = await Promise.all(
        cartData.items.map(async (i: any) => {
          const res = await fetch(
            `https://fakestoreapi.com/products/${i.id}`
          );
          const product = await res.json();

          return {
            ...product,
            quantity: i.count,
          };
        })
      );

      dispatch(setCart(restoredItems));

      // Restore orders
      const ordersData: any = await apiRequest(
        "/orders/all",
        "GET",
        null,
        data.token
      );

      dispatch(setOrders(ordersData.orders || []));

      Alert.alert("Success", "Logged in!");
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
  };

  // Handle register
  const handleRegister = async () => {
    try {
      const data = await apiRequest("/users/signup", "POST", {
        name,
        email,
        password,
      } as any);

      dispatch(setUser(data));

      Alert.alert("Success", "User created and logged in!");
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
  };

  // Logged in UI
  if (user) {
    return (
      <View style={{ flex: 1, padding: 20, backgroundColor: "#422ec6" }}>
        <Text style={{ fontSize: 28, fontWeight: "bold", color: "#34e50c", marginBottom: 20 }}>
          User Profile
        </Text>

        <View style={{ backgroundColor: "white", borderRadius: 16, padding: 20 }}>
          <Text style={{ fontSize: 20, marginBottom: 10 }}>
            User Name: {user.name}
          </Text>

          <Text style={{ fontSize: 20 }}>
            Email: {user.email}
          </Text>

          {/* Update */}
          <TouchableOpacity
            style={{
              backgroundColor: "#ffffff",
              padding: 10,
              borderRadius: 10,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 10,
            }}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="create" size={20} color="#422ec6" />
            <Text style={{ marginLeft: 8, fontWeight: "bold" }}>
              Update
            </Text>
          </TouchableOpacity>

          {/* Logout */}
          <TouchableOpacity
            style={{
              backgroundColor: "#ffffff",
              padding: 10,
              borderRadius: 10,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 10,
            }}
            onPress={() => {
              dispatch(clearCart());
              dispatch(clearOrders());
              dispatch(logout());
            }}
          >
            <Ionicons name="log-out" size={20} color="#422ec6" />
            <Text style={{ marginLeft: 8, fontWeight: "bold" }}>
              Sign Out
            </Text>
          </TouchableOpacity>
        </View>

        {/* Modal */}
        <Modal visible={modalVisible} animationType="slide">
          <View style={{ flex: 1, backgroundColor: "#422ec6", padding: 20, justifyContent: "center" }}>
            <View style={{ backgroundColor: "white", borderRadius: 16, padding: 20 }}>
              <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
                Update User Profile
              </Text>

              <Text>Name</Text>
              <TextInput
                style={{ borderWidth: 1, marginBottom: 10, padding: 10, borderRadius: 8 }}
                value={newName}
                onChangeText={setNewName}
              />

              <Text>Password</Text>
              <TextInput
                style={{ borderWidth: 1, marginBottom: 20, padding: 10, borderRadius: 8 }}
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
              />

              {/* Confirm */}
              <TouchableOpacity
                style={{
                  backgroundColor: "#422ec6",
                  padding: 12,
                  borderRadius: 10,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={async () => {
                  if (!newName || !newPassword) {
                    Alert.alert("Error", "Please fill all fields");
                    return;
                  }

                  try {
                    const data: any = await apiRequest(
                      "/users/update",
                      "POST",
                      {
                        name: newName,
                        password: newPassword,
                      } as any,
                      user.token
                    );

                    // Keep token
                    dispatch(
                      setUser({
                        ...user,
                        ...data,
                        token: user.token,
                      })
                    );

                    setModalVisible(false);
                    Alert.alert("Success", "Profile updated!");
                  } catch (e: any) {
                    Alert.alert("Error", e.message);
                  }
                }}
              >
                <Ionicons name="checkmark-circle" size={20} color="white" />
                <Text style={{ marginLeft: 8, color: "white", fontWeight: "bold" }}>
                  Confirm
                </Text>
              </TouchableOpacity>

              {/* Cancel */}
              <TouchableOpacity
                style={{
                  backgroundColor: "#cccccc",
                  padding: 12,
                  borderRadius: 10,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 10,
                }}
                onPress={() => setModalVisible(false)}
              >
                <Ionicons name="close-circle" size={20} color="#333" />
                <Text style={{ marginLeft: 8, fontWeight: "bold" }}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  // Login UI
  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#422ec6" }}>
      <Text style={{ fontSize: 24, marginBottom: 20, color: "white" }}>
        {isSignUp
          ? "Sign up a new user"
          : "Sign in with your email and password"}
      </Text>

      <View style={{ backgroundColor: "white", borderRadius: 16, padding: 20 }}>
        {isSignUp && (
          <>
            <Text>Name</Text>
            <TextInput
              style={{ borderWidth: 1, marginBottom: 10, padding: 10, borderRadius: 8 }}
              value={name}
              onChangeText={setName}
            />
          </>
        )}

        <Text>Email</Text>
        <TextInput
          style={{ borderWidth: 1, marginBottom: 10, padding: 10, borderRadius: 8 }}
          value={email}
          onChangeText={setEmail}
        />

        <Text>Password</Text>
        <TextInput
          style={{ borderWidth: 1, marginBottom: 20, padding: 10, borderRadius: 8 }}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={{
            backgroundColor: "#cccccc",
            padding: 12,
            borderRadius: 10,
            flexDirection: "row",
            justifyContent: "center",
          }}
          onPress={clearForm}
        >
          <Text>Clear</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: "#422ec6",
            padding: 12,
            borderRadius: 10,
            marginTop: 10,
            alignItems: "center",
          }}
          onPress={isSignUp ? handleRegister : handleLogin}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>
            {isSignUp ? "Sign Up" : "Sign In"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ marginTop: 20 }}
          onPress={() => setIsSignUp(!isSignUp)}
        >
          <Text style={{ textAlign: "center", color: "#422ec6" }}>
            {isSignUp
              ? "Switch to sign in"
              : "Switch to sign up"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}