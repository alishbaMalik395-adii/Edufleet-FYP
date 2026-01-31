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
import { useNotifications } from "../context/NotificationContext";

const DriverDashboard = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { unreadCount, clearUnreadNotifications } = useNotifications();

  // 🔥 LOGIN SE AANE WALI ASSIGNED BUS ID
  const assignedBusId = route.params?.busId;
  const driverEmail = route.params?.driverEmail;

  // ✅ STATES (ride ke baad wali cheezen)
  const [rideStarted, setRideStarted] = useState(false);
  const [busNo, setBusNo] = useState(null);

  // ✅ RECEIVE DATA FROM StartRideScreen
  useEffect(() => {
    if (route.params?.rideStarted && route.params?.busNo) {
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
          {/* START RIDE */}
          <GlassCard
            title="Start Ride"
            icon="play-circle-outline"
            desc="Begin Trip"
            onPress={() => {
              if (!assignedBusId) {
                Alert.alert("Bus not assigned yet");
                return;
              }

              navigation.navigate("BusSelectionScreen", {
                assignedBusId: assignedBusId, 
                driverId: route.params?.driverId,// ✅ CORRECT
              });
            }}
          />

          {/* LIVE MAP */}
          <GlassCard
            title="Live Map"
            icon="map-outline"
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

          {/* MESSAGES */}
          <GlassCard
            title="Messages"
            icon="chatbubble-ellipses-outline"
            desc="Student Alerts"
            onPress={() =>
              navigation.navigate("MessagesScreen", {
                role: "driver",
                busId: assignedBusId,
              })
            }
          />

          {/* NOTIFICATIONS */}
          <GlassCard
            title="Notifications"
            icon="notifications-outline"
            desc="Manager Alerts"
            onPress={() => {
              clearUnreadNotifications();
              navigation.navigate("DriverNotifications");
            }}
            showBadge={unreadCount > 0}
            badgeCount={unreadCount}
          />

          {/* ROUTE */}
          <GlassCard
            title="Route"
            icon="navigate-outline"
            desc="Assigned Route"
            onPress={() => {
              Alert.alert(
                "Assigned Bus",
                `Aap BUS-${assignedBusId} ke route par hain`
              );
            }}
          />

          {/* PROFILE */}
          <GlassCard
            title="Profile"
            icon="person-outline"
            desc="View Details"
            onPress={() =>
              navigation.navigate("DriverProfile", {
                busId: assignedBusId,
                driverEmail: driverEmail,
              })
            }
          />
        </View>
      </View>
    </ImageBackground>
  );
};

const GlassCard = ({ title, desc, icon, onPress, showBadge, badgeCount }) => (
  <TouchableOpacity
    style={styles.card}
    activeOpacity={0.85}
    onPress={onPress}
  >
    <View style={styles.iconContainer}>
      <Icon name={icon} size={42} color="#fff" style={{ marginBottom: 10 }} />
      {showBadge && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {badgeCount > 9 ? '9+' : badgeCount}
          </Text>
        </View>
      )}
    </View>
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardDesc}>{desc}</Text>
  </TouchableOpacity>
);

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
  iconContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#4CAF50',
    borderRadius: 50,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
});

export default DriverDashboard;
