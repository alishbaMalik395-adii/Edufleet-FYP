import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Alert,
  PermissionsAndroid,
  Platform,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import Geolocation from "@react-native-community/geolocation";
import Icon from "react-native-vector-icons/Ionicons";

export default function DriverLiveMapScreen({ route }) {
  const { rideStarted, busNo } = route.params || {};

  const [location, setLocation] = useState(null);
  const [hasPermission, setHasPermission] = useState(false);

  // 🔐 REQUEST LOCATION PERMISSION
  useEffect(() => {
    const requestPermission = async () => {
      if (Platform.OS === "android") {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Permission",
            message:
              "App needs access to your location to show live bus tracking",
            buttonPositive: "OK",
          }
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setHasPermission(true);
        } else {
          Alert.alert(
            "Permission Required",
            "Please allow location permission to continue"
          );
        }
      } else {
        setHasPermission(true);
      }
    };

    requestPermission();
  }, []);

  // ⚠️ RIDE STATUS CHECK
  useEffect(() => {
    if (!rideStarted) {
      Alert.alert(
        "Ride not started",
        "Please start the ride first to see live location"
      );
    }
  }, [rideStarted]);

  // 📍 LIVE LOCATION TRACKING
  useEffect(() => {
    if (!rideStarted || !hasPermission) return;

    const watchId = Geolocation.watchPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.log("Location error:", error);
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 10,
      }
    );

    return () => {
      Geolocation.clearWatch(watchId);
    };
  }, [rideStarted, hasPermission]);

  return (
    <ImageBackground
      source={require("../assets/background.jpg")}
      style={{ flex: 1 }}
      blurRadius={1}
    >
      <View style={styles.overlay} />

      {/* HEADER */}
      <View style={styles.header}>
        <Icon name="map-outline" size={26} color="#fff" />
        <Text style={styles.headerText}>
          Live Location {busNo ? `- ${busNo}` : ""}
        </Text>
      </View>

      {/* MAP */}
      <View style={styles.mapCard}>
        <MapView
          style={{ flex: 1 }}
          showsUserLocation
          region={{
            latitude: location?.latitude || 33.6844,
            longitude: location?.longitude || 73.0479,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          {location && (
            <Marker
              coordinate={location}
              title="Bus Live Location"
            />
          )}
        </MapView>

        {!location && (
          <Text style={styles.loadingText}>
            Fetching live location...
          </Text>
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  header: {
    marginTop: 70,
    marginHorizontal: 22,
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
    marginLeft: 10,
  },
  mapCard: {
    margin: 22,
    flex: 1,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.28)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.6)",
    overflow: "hidden",
    elevation: 20,
  },
  loadingText: {
    position: "absolute",
    top: 20,
    alignSelf: "center",
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
