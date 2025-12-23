import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

export default function ComplaintSuccessScreen({ route, navigation }) {

  const { rollNo, issueType, description } = route.params;

  return (
    <ImageBackground
      source={require("../assets/background.jpg")}
      style={styles.bg}
      blurRadius={1}
    >
      <View style={styles.overlay} />

      <View style={styles.container}>
        <Text style={styles.title}>Submitted Successfully 🎉</Text>
        <Text style={styles.subtitle}>Your complaint has been recorded</Text>

        <View style={styles.card}>
          <Icon name="checkmark-circle-outline" size={90} color="#4CAF50" />

          <Text style={styles.successText}>Complaint Registered</Text>

          <Text style={styles.detail}>Roll No: {rollNo}</Text>
          <Text style={styles.detail}>Issue: {issueType}</Text>
          <Text style={styles.detail}>Description: {description}</Text>

          <Text style={styles.detail}>
            Complaint ID: CMP-{Math.floor(Math.random() * 9000 + 1000)}
          </Text>

          <TouchableOpacity
            style={styles.btn}
            onPress={() => navigation.navigate("UserDashboard")}
          >
            <Text style={styles.btnText}>Go to Dashboard</Text>
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
    alignItems: "center",
  },
  successText: {
    marginTop: 15,
    fontSize: 26,
    fontWeight: "700",
    color: "#fff",
  },
  detail: {
    marginTop: 6,
    fontSize: 15,
    color: "#eee",
    textAlign: "center",
  },
  btn: {
    marginTop: 20,
    backgroundColor: "#ffffff",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  btnText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
  },
});
