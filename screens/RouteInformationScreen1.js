import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { routeDetails } from "../data/routeDetails"; // ✅ NEW DATA FILE

export default function RouteInformationScreen({ route }) {
  const { routeId } = route.params;

  // ✅ selected route full information
  const data = routeDetails[routeId];

  if (!data) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "#fff" }}>No Route Data Found</Text>
      </View>
    );
  }

  return (
    <ImageBackground
      source={require("../assets/background.jpg")}
      style={styles.bg}
      blurRadius={1}
    >
      {/* 🔹 overlay – SAME */}
      <View style={styles.overlay} />

      <ScrollView contentContainerStyle={styles.container}>
        {/* 🔹 HEADER – SAME */}
        <Text style={styles.title}>Route Information</Text>
        <Text style={styles.subtitle}>
          Assigned route details for driver
        </Text>

        {/* 🔹 CARDS – SAME STYLE */}
        <GlassCard
          icon="bus-outline"
          label="Route"
          value={data.route}
        />

        <GlassCard
          icon="play-circle-outline"
          label="Start Point"
          value={data.start}
        />

        <GlassCard
          icon="flag-outline"
          label="End Point"
          value={data.end}
        />

        <GlassCard
          icon="location-outline"
          label="Important Stops"
          value={data.stops}
        />

        <GlassCard
          icon="speedometer-outline"
          label="Distance"
          value={data.distance}
        />

        <GlassCard
          icon="time-outline"
          label="Estimated Time"
          value={data.time}
        />

        <GlassCard
          icon="alert-circle-outline"
          label="Instructions"
          value={data.instructions}
        />
      </ScrollView>
    </ImageBackground>
  );
}

/* 🔹 SAME CARD COMPONENT – NO DESIGN CHANGE */
const GlassCard = ({ icon, label, value }) => (
  <View style={styles.card}>
    <Icon name={icon} size={26} color="#fff" />
    <View style={styles.textArea}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  </View>
);

/* 🔹 SAME STYLES – UNTOUCHED */
const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#ccc",
    marginBottom: 20,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.15)",
    marginBottom: 14,
  },
  textArea: {
    marginLeft: 14,
    flex: 1,
  },
  label: {
    color: "#ddd",
    fontSize: 12,
  },
  value: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
    marginTop: 2,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
});
