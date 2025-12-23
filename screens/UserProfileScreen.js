import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

export default function UserProfileScreen({ navigation, route }) {

  // ✅ LOGIN SE AANE WALI EMAIL
  const userEmail = route?.params?.userEmail || "Not Available";

  return (
    <ImageBackground
      source={require("../assets/background.jpg")}
      style={styles.bg}
      blurRadius={1}
    >
      <View style={styles.overlay} />

      <View style={styles.container}>
        {/* HEADER */}
        <Text style={styles.title}>My Profile 👤</Text>
        <Text style={styles.subtitle}>Personal information</Text>

        {/* PROFILE CARD */}
        <View style={styles.card}>
          {/* Avatar */}
          <View style={styles.avatarWrapper}>
            <Icon name="person-circle-outline" size={120} color="#fff" />
          </View>

          {/* User Info */}
          <Text style={styles.name}>Alishba Malik</Text>
          <Text style={styles.role}>Student</Text>

          {/* Info Rows */}
          <View style={styles.infoRow}>
            <Icon name="id-card-outline" size={22} color="#000" />
            <Text style={styles.infoText}>Roll No: 21-CS-045</Text>
          </View>

          {/* ✅ EMAIL — DYNAMIC */}
          <View style={styles.infoRow}>
            <Icon name="mail-outline" size={22} color="#000" />
            <Text style={styles.infoText}>{userEmail}</Text>
          </View>

          

          {/* Buttons */}
          <TouchableOpacity style={styles.btn}
          onPress={() =>
    navigation.navigate("EditProfileScreen", {
      userEmail: userEmail,
    })
  }>
            <Icon name="create-outline" size={20} color="#000" />
            <Text style={styles.btnText}>Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, styles.logoutBtn]}
            onPress={() => navigation.navigate("Home")}
          >
            <Icon name="log-out-outline" size={20} color="#000" />
            <Text style={styles.btnText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  container: {
    paddingTop: 80,
    paddingHorizontal: 22,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#fff",
  },
  subtitle: {
    fontSize: 17,
    marginTop: 6,
    color: "#eaeaea",
  },
  card: {
    marginTop: 40,
    padding: 25,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.28)",
    borderColor: "rgba(255,255,255,0.66)",
    borderWidth: 1,
    elevation: 15,
    alignItems: "center",
  },
  avatarWrapper: {
    backgroundColor: "#ffffffcc",
    padding: 5,
    borderRadius: 80,
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: "800",
    color: "#fff",
    marginTop: 10,
  },
  role: {
    fontSize: 16,
    color: "#eee",
    marginBottom: 15,
  },
  infoRow: {
    width: "100%",
    backgroundColor: "#ffffffcc",
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 15,
    marginTop: 10,
  },
  infoText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  btn: {
    marginTop: 18,
    width: "90%",
    backgroundColor: "#ffffff",
    paddingVertical: 14,
    borderRadius: 30,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  logoutBtn: {
    backgroundColor: "#ffdddd",
  },
  btnText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#000",
    marginLeft: 8,
  },
});
