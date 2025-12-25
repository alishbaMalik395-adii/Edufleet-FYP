import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

const DriverProfileScreen = () => {
  // ✅ hooks always on top
  const navigation = useNavigation();
  const route = useRoute();

  // ✅ safe param access
  const driverEmail =
    route.params?.driverEmail ?? "Not Available";

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        onPress: () => navigation.replace("DriverLogin"),
      },
    ]);
  };

  return (
    <ImageBackground
      source={require("../assets/background.jpg")}
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Driver Profile</Text>
        <Text style={styles.subtitle}>Account Information</Text>

        <View style={styles.infoBox}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{driverEmail}</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.label}>Role</Text>
          <Text style={styles.value}>Driver</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.label}>Status</Text>
          <Text style={styles.value}>Active</Text>
        </View>

        {/* ✅ EDIT PROFILE — NOW WORKING */}
        <TouchableOpacity
          style={styles.editButton}
          onPress={() =>
            navigation.navigate("DriverEditProfile", {
              driverEmail: driverEmail,
            })
          }
        >
          <Text style={styles.editText}>Edit Profile</Text>
        </TouchableOpacity>

        {/* LOGOUT */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default DriverProfileScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  container: {
    backgroundColor: "rgba(255, 255, 255, 0.49)", // 🔒 SAME STYLE
    borderRadius: 25,
    padding: 25,
    width: "85%",
    alignItems: "center",
    elevation: 8,
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 25,
  },

  infoBox: {
    width: "100%",
    marginBottom: 15,
  },

  label: {
    fontSize: 14,
    color: "#777",
    marginBottom: 4,
  },

  value: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },

  editButton: {
    marginTop: 25,
    backgroundColor: "#2C3E50",
    width: "100%",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  editText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },

  logoutButton: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#2C3E50",
    width: "100%",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  logoutText: {
    color: "#2C3E50",
    fontSize: 17,
    fontWeight: "600",
  },
});
