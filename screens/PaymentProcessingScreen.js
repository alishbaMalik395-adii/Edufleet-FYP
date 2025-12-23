import React, { useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator, ImageBackground } from "react-native";

export default function PaymentProcessingScreen({ navigation, route }) {
  const { method } = route.params || { method: "Unknown" };

  useEffect(() => {
    setTimeout(() => {
      navigation.navigate("PaymentSuccess", { method });
    }, 2000);
  }, []);

  return (
    <ImageBackground
      source={require("../assets/background.jpg")}
      style={styles.bg}
      blurRadius={1}
    >
      <View style={styles.overlay} />

      <View style={styles.center}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.text}>Processing Payment...</Text>
        <Text style={styles.sub}>Method: {method}</Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, width: "100%", height: "100%" },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.35)" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  text: { color: "#fff", fontSize: 22, marginTop: 20 },
  sub: { color: "#ddd", fontSize: 16, marginTop: 5 }
});
