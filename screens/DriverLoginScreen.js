// Screens/DriverLoginScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const DriverLoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const handleLogin = () => {
    // BASIC VALIDATION
    if (!email || !password) {
      Alert.alert("⚠️ Missing Fields", "Please enter email and password");
      return;
    }

    if (!email.includes("@gmail.com")) {
      Alert.alert("❌ Invalid Email", "Please use a valid Gmail address");
      return;
    }

    // ✅ FRONTEND LOGIN (Driver)
    navigation.navigate("DriverDashboard", {
      driverEmail: email, // 🔥 email pass ho rahi hai
    });
  };

  return (
    <ImageBackground
      source={require("../assets/background.jpg")}
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Driver Login</Text>
        <Text style={styles.subtitle}>
          Login using your Gmail
        </Text>

        {/* EMAIL */}
        <TextInput
          style={styles.input}
          placeholder="Enter Gmail"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* PASSWORD */}
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {/* LOGIN */}
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  container: {
    backgroundColor: "rgba(255, 255, 255, 0.49)",
    borderRadius: 25,
    padding: 25,
    width: "85%",
    alignItems: "center",
    elevation: 8,
  },

  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: '#2C3E50', // 🔥 Driver theme (green)
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 18,
    color: "#555",
    marginBottom: 30,
  },

  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "#fff",
  },

  button: {
    backgroundColor: '#2C3E50',
    paddingVertical: 14,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default DriverLoginScreen;
