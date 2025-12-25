import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ImageBackground,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const notifications = [
  {
    id: "1",
    title: "Route Update",
    message: "Today's route has been updated by admin",
    time: "2 min ago",
  },
  {
    id: "2",
    title: "Delay Alert",
    message: "Bus will arrive 10 minutes late",
    time: "10 min ago",
  },
  {
    id: "3",
    title: "Ride Reminder",
    message: "Please start your ride on time",
    time: "1 hour ago",
  },
];

export default function DriverNotificationsScreen() {
  return (
    <ImageBackground
      source={require("../assets/background.jpg")}
      style={styles.bg}
      blurRadius={1}   // 🔥 same as dashboard
    >
      {/* ✅ DARK OVERLAY (VERY IMPORTANT) */}
      <View style={styles.overlay} />

      <View style={styles.container}>
        <Text style={styles.title}>Notifications</Text>
        <Text style={styles.subtitle}>Admin & system alerts</Text>

        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 30 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Icon
                name="notifications-outline"
                size={26}
                color="#ffd6d6"
                style={{ marginRight: 12 }}
              />

              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardMsg}>{item.message}</Text>
                <Text style={styles.time}>{item.time}</Text>
              </View>
            </View>
          )}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },

  // 🔥 SAME OVERLAY AS DASHBOARD
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },

  container: {
    paddingTop: 80,
    paddingHorizontal: 22,
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#fff",
  },

  subtitle: {
    fontSize: 15,
    color: "#eaeaea",
    marginBottom: 25,
    marginTop: 6,
  },

  // 🔥 GLASS CARD (same feel as dashboard cards)
  card: {
    flexDirection: "row",
    padding: 18,
    marginBottom: 16,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.28)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.66)",
    elevation: 15,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },

  cardMsg: {
    fontSize: 13,
    color: "#eee",
    marginTop: 4,
  },

  time: {
    fontSize: 11,
    color: "#ddd",
    marginTop: 6,
  },
});
