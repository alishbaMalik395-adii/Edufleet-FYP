import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

const DriverEditProfileScreen = () => {
  // ✅ Hooks always at top
  const navigation = useNavigation();
  const route = useRoute();

  const driverEmail =
    route.params && route.params.driverEmail
      ? route.params.driverEmail
      : "";

  // ✅ editable fields
  const [name, setName] = useState("Driver");
  const [phone, setPhone] = useState("");

  const handleSave = () => {
    Alert.alert("✅ Profile Updated", "Your profile has been updated");

    navigation.navigate("DriverProfile", {
      driverEmail: driverEmail, // 🔒 SAME EMAIL BACK
    });
  };

  return (
    <ImageBackground
      source={require("../assets/background.jpg")}
      style={styles.background}
      blurRadius={1}
    >
      <View style={styles.overlay} />

      <View style={styles.container}>
        <Text style={styles.title}>Edit Profile</Text>
        <Text style={styles.subtitle}>Update your details</Text>

        {/* NAME */}
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#999"
          value={name}
          onChangeText={setName}
        />

        {/* EMAIL (READ ONLY) */}
        <TextInput
          style={[styles.input, styles.readOnlyInput]}
          value={driverEmail}
          editable={false}              // 🔒 LOCKED
          selectTextOnFocus={false}
        />

        {/* PHONE */}
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          placeholderTextColor="#999"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />

        {/* SAVE */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveText}>Save Changes</Text>
        </TouchableOpacity>

        {/* CANCEL */}
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default DriverEditProfileScreen;

const styles = StyleSheet.create({
  background: { flex: 1 },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },

  container: {
    marginTop: 80,
    marginHorizontal: 22,
    padding: 25,
    backgroundColor: "rgba(255,255,255,0.28)",
    borderRadius: 26,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.6)",
    elevation: 18,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
  },

  subtitle: {
    fontSize: 15,
    color: "#eaeaea",
    marginTop: 6,
    marginBottom: 25,
  },

  input: {
    width: "100%",
    height: 50,
    borderRadius: 14,
    paddingHorizontal: 15,
    marginBottom: 18,
    backgroundColor: "rgba(255,255,255,0.85)",
    fontSize: 15,
  },

  readOnlyInput: {
    backgroundColor: "#e6e6e6", // 🔒 subtle difference
    color: "#555",
  },

  saveButton: {
    backgroundColor: "#2C3E50",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 10,
  },

  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  cancelButton: {
    marginTop: 18,
    alignItems: "center",
  },

  cancelText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
});
