// DriverDashboard.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation, useRoute } from "@react-navigation/native";

const DriverDashboard = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const [rideStarted, setRideStarted] = useState(false);
  const [busNo, setBusNo] = useState(null);

  // Receive data after ride start
  useEffect(() => {
    if (route.params?.rideStarted) {
      setRideStarted(true);
      setBusNo(route.params.busNo);
    }
  }, [route.params]);

  return (
    <ImageBackground
      source={require("../assets/background.jpg")}
      style={styles.bg}
      blurRadius={1}
    >
      <View style={styles.overlay} />

      <View style={styles.container}>
        <Text style={styles.title}>Welcome Driver 👋</Text>
        <Text style={styles.subtitle}>Your smart transport dashboard</Text>

        <View style={styles.grid}>
          <GlassCard
            title="Start Ride"
            icon="play"
            desc="Begin Trip"
            onPress={() => navigation.navigate("BusSelectionScreen")}
          />

          <GlassCard
            title="Live Map"
            icon="map"
            desc="Real-time Location"
            onPress={() => {
              if (!rideStarted) {
                Alert.alert(
                  "⚠ Ride Not Started",
                  "Please start ride first"
                );
                return;
              }

              navigation.navigate("DriverLiveMap", {
                busNo: busNo,
              });
            }}
          />

          <GlassCard
            title="Messages"
            icon="chatbubble"
            desc="Student Alerts"
          />

          <GlassCard
            title="Notifications"
            icon="notifications"
            desc="Manager Alerts"
          />

          <GlassCard
            title="Route"
            icon="navigate"
            desc="Assigned Route"
          />

          <GlassCard
            title="Profile"
            icon="person"
            desc="View Details"
          />
        </View>
      </View>
    </ImageBackground>
  );
};

const GlassCard = ({ title, desc, icon, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <Icon name={icon} size={42} color="#fff" style={{ marginBottom: 10 }} />
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardDesc}>{desc}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
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
    color: "#e8e8e8",
  },
  grid: {
    marginTop: 35,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "47%",
    height: 160,
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
    backgroundColor: "rgba(255,255,255,0.28)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.66)",
    elevation: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },
  cardDesc: {
    marginTop: 4,
    fontSize: 13,
    color: "#ddd",
  },
});

export default DriverDashboard;
