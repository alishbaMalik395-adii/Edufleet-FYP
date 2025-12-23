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

  // ✅ ASK PERMISSION (HOOK ALWAYS TOP LEVEL)
  useEffect(() => {
    const requestPermission = async () => {
      if (Platform.OS === "android") {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setHasPermission(true);
        } else {
          Alert.alert("Permission denied", "Location permission required");
        }
      } else {
        setHasPermission(true);
      }
    };

    requestPermission();
  }, []);

  // ❌ Ride not started warning
  useEffect(() => {
    if (!rideStarted) {
      Alert.alert(
        "Ride not started",
        "Please start ride first to see live location"
      );
    }
  }, [rideStarted]);

  // 📍 GET LOCATION (NO CONDITIONAL HOOK)
  useEffect(() => {
    if (!rideStarted || !hasPermission) return;

    const watchId = Geolocation.watchPosition(
      (pos) => {
        setLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      },
      (error) => {
        console.log(error);
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 10,
      }
    );

    return () => Geolocation.clearWatch(watchId);
  }, [rideStarted, hasPermission]);

  return (
    <ImageBackground
      source={require("../assets/background.jpg")}
      style={{ flex: 1 }}
      blurRadius={1}
    >
      <View style={styles.overlay} />

      <View style={styles.header}>
        <Icon name="map-outline" size={26} color="#fff" />
        <Text style={styles.headerText}>
          Live Location {busNo ? `- ${busNo}` : ""}
        </Text>
      </View>

      <View style={styles.mapCard}>
        {location ? (
          <MapView
            style={{ flex: 1 }}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            showsUserLocation
          >
            <Marker coordinate={location} title="Bus Live Location" />
          </MapView>
        ) : (
          <Text style={styles.loadingText}>Fetching live location...</Text>
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
    color: "#fff",
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
});
