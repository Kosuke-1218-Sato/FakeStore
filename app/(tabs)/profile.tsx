import { useState } from "react";
import { View, Text, TextInput, Button, Alert, TouchableOpacity } from "react-native";
import { apiRequest } from "../../API/api";
import { useDispatch, useSelector } from "react-redux";
import { setUser, logout } from "../../store/authSlice";
import { Modal } from "react-native";
import { clearCart } from "../../store/cartSlice";
import { clearOrders } from "../../store/ordersSlice";

export default function ProfileScreen() {
  const dispatch = useDispatch();

  // Get current logged-in user from Redux
  const user = useSelector((state: any) => state.auth.user);

  // Form states for login / signup
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Modal state for updating profile
  const [modalVisible, setModalVisible] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Clear form inputs
  const clearForm = () => {
    setName("");
    setEmail("");
    setPassword("");
  };

  // Handle user login
  const handleLogin = async () => {
    try {
      const data = await apiRequest("/users/signin", "POST", {
        email,
        password,
      } as any);

      console.log("LOGIN DATA:", data);

      // Save user data (including token) into Redux
      dispatch(setUser(data));

      Alert.alert("Success", "Logged in!");
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
  };

  // Handle new user registration
  const handleRegister = async () => {
    try {
      const data = await apiRequest("/users/signup", "POST", {
        name,
        email,
        password,
      } as any);

      // Automatically log in after registration
      dispatch(setUser(data));

      Alert.alert("Success", "User created and logged in!");
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
  };

  // If user is logged in → show profile screen
  if (user) {
    return (
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 24, marginBottom: 20 }}>
          User Profile
        </Text>

        {/* Display user information */}
        <Text>User Name: {user.name}</Text>
        <Text>Email: {user.email}</Text>

        {/* Open update modal */}
        <View style={{ marginTop: 20 }}>
          <Button title="Update" onPress={() => setModalVisible(true)} />
        </View>

        {/* Logout user */}
        <View style={{ marginTop: 10 }}>
          <Button
            title="Sign Out"
            onPress={() => {
              dispatch(clearCart());
              dispatch(clearOrders());
              dispatch(logout());
          }}
        />
        </View>

        {/* Modal for updating user profile */}
        <Modal visible={modalVisible} animationType="slide">
          <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 24, marginBottom: 20 }}>
              Update Profile
            </Text>

            <Text>Name</Text>
            <TextInput
              style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
              value={newName}
              onChangeText={setNewName}
            />

            <Text>Password</Text>
            <TextInput
              style={{ borderWidth: 1, marginBottom: 20, padding: 8 }}
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />

            {/* Save updated user data */}
            <Button
              title="Save"
              onPress={async () => {
                try {
                  const data = await apiRequest(
                    "/users/update",
                    "POST",
                    {
                      name: newName,
                      password: newPassword,
                    } as any,
                    user.token
                  );

                  // Update Redux state with new user info
                  dispatch(setUser(data));

                  setModalVisible(false);
                  Alert.alert("Updated!");
                } catch (e: any) {
                  Alert.alert("Error", e.message);
                }
              }}
            />

            {/* Close modal */}
            <Button
              title="Cancel"
              onPress={() => setModalVisible(false)}
            />
          </View>
        </Modal>
      </View>
    );
  }

  // If user is NOT logged in → show login/signup form
  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>
        {isSignUp
          ? "Sign up a new user"
          : "Sign in with your email and password"}
      </Text>

      {/* Name input only for Sign Up */}
      {isSignUp && (
        <>
          <Text>Name</Text>
          <TextInput
            style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
            value={name}
            onChangeText={setName}
          />
        </>
      )}

      <Text>Email</Text>
      <TextInput
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <Text>Password</Text>
      <TextInput
        style={{ borderWidth: 1, marginBottom: 20, padding: 8 }}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* Clear all inputs */}
      <Button title="Clear" onPress={clearForm} />

      {/* Submit button */}
      <View style={{ marginTop: 10 }}>
        <Button
          title={isSignUp ? "Sign Up" : "Sign In"}
          onPress={isSignUp ? handleRegister : handleLogin}
        />
      </View>

      {/* Toggle between Sign In and Sign Up */}
      <TouchableOpacity
        style={{ marginTop: 20 }}
        onPress={() => setIsSignUp(!isSignUp)}
      >
        <Text>
          {isSignUp
            ? "Switch to: sign in with an existing user"
            : "Switch to: sign up a new user"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}