// Screens/StartRideScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

export default function StartRideScreen({ route, navigation }) {

  // ✅ RECEIVE DATA
  const { busNo, routeName } = route.params || {};

  const [rideStarted, setRideStarted] = useState(false);

  // ✅ START RIDE
  const handleStartRide = () => {
    setRideStarted(true);

    Alert.alert(
      "✅ Ride Started",
      `${busNo} is now live on route`,
      [
        {
          text: "Open Live Map",
          onPress: () => {
            navigation.navigate("DriverLiveMap", {
              rideStarted: true,   // 🔥 VERY IMPORTANT
              busNo: busNo,
            });
          },
        },
      ]
    );
  };

  // 🛑 END RIDE
  const handleEndRide = () => {
    setRideStarted(false);

    Alert.alert(
      "🛑 Ride Ended",
      `${busNo} ride has ended`,
      [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  return (
    <ImageBackground
      source={require("../assets/background.jpg")}
      style={styles.bg}
      blurRadius={1}
    >
      <View style={styles.overlay} />

      <View style={styles.container}>
        <Text style={styles.title}>Start Ride 🚍</Text>
        <Text style={styles.subtitle}>Driver Control Panel</Text>

        <View style={styles.card}>
          <Icon name="bus-outline" size={80} color="#fff" />

          <Text style={styles.busNo}>{busNo || "BUS"}</Text>
          <Text style={styles.route}>{routeName || "Assigned Route"}</Text>

          <View style={styles.statusRow}>
            <Icon
              name={rideStarted ? "radio-button-on" : "radio-button-off"}
              size={20}
              color={rideStarted ? "#00ff99" : "#ff4d4d"}
            />
            <Text style={styles.statusText}>
              {rideStarted ? "Ride Active" : "Ride Not Started"}
            </Text>
          </View>

          {!rideStarted ? (
            <TouchableOpacity style={styles.startBtn} onPress={handleStartRide}>
              <Icon name="play" size={22} color="#000" />
              <Text style={styles.btnText}>Start Ride</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.endBtn} onPress={handleEndRide}>
              <Icon name="stop" size={22} color="#000" />
              <Text style={styles.btnText}>End Ride</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ImageBackground>
  );
}
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
    fontSize: 16,
    marginTop: 6,
    color: "#eaeaea",
  },
  card: {
    marginTop: 50,
    padding: 30,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.28)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.6)",
    alignItems: "center",
    elevation: 20,
  },
  busNo: {
    fontSize: 26,
    fontWeight: "800",
    color: "#fff",
    marginTop: 10,
  },
  route: {
    fontSize: 15,
    color: "#eee",
    marginBottom: 20,
    textAlign: "center",
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },
  statusText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
  startBtn: {
    width: "90%",
    backgroundColor: "#ffffff",
    paddingVertical: 14,
    borderRadius: 30,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  endBtn: {
    width: "90%",
    backgroundColor: "#ffdddd",
    paddingVertical: 14,
    borderRadius: 30,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    marginLeft: 8,
    fontSize: 17,
    fontWeight: "700",
    color: "#000",
  },
});
